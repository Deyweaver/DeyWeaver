'use client';

import { useEffect, useState, useTransition } from 'react';
import { GoogleAuthProvider, linkWithPopup, reauthenticateWithPopup, signInWithPopup } from 'firebase/auth';
import { AlertCircle, Loader2, MailCheck, MailOpen, PlusCircle, RefreshCcw } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { handleSummarizeEmails } from '@/lib/actions';
import { getTasksFromLocalStorage, saveTasksToLocalStorage } from '@/lib/task-storage';
import { loadUserSettingsFromDb, saveUserSettingsToDb } from '@/lib/user-settings-db';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Task } from '@/types';

const GMAIL_TOKEN_STORAGE_KEY = 'deyweaverGmailAccessToken';
const GMAIL_ACCOUNT_STORAGE_KEY = 'deyweaverGmailAccount';
const GMAIL_EMAIL_CACHE_STORAGE_KEY = 'deyweaverGmailEmailCache';
const MAX_EMAILS = 6;

function getInboxIntroSeenStorageKey(userId: string) {
  return `deyweaverGmailInboxIntroSeen:${userId}`;
}

type GmailListResponse = {
  messages?: Array<{ id: string }>;
};

type GmailErrorResponse = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

type GmailMessageResponse = {
  id: string;
  snippet?: string;
  payload?: GmailMessagePart;
};

type GmailMessagePart = {
  mimeType?: string;
  filename?: string;
  body?: {
    data?: string;
  };
  headers?: Array<{
    name?: string;
    value?: string;
  }>;
  parts?: GmailMessagePart[];
};

type EmailDigestInput = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body: string;
};

type EmailDigestSummary = {
  emailId: string;
  bullets: string[];
  suggestedTaskTitle: string;
  suggestedTaskDescription: string;
  suggestedCategory: string;
  priority: 'low' | 'medium' | 'high';
};

type EmailDigest = EmailDigestInput & {
  summary?: EmailDigestSummary;
};

type GmailInboxAssistantProps = {
  onHeaderStateChange?: (state: {
    connected: boolean;
    unreadCount: number;
    isRefreshing: boolean;
    isConnecting: boolean;
    refreshInbox: () => void;
    connectGmail: () => void;
  }) => void;
};

function isEmailDigestArray(value: unknown): value is EmailDigest[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const email = item as Partial<EmailDigest>;
    return (
      typeof email.id === 'string' &&
      typeof email.from === 'string' &&
      typeof email.subject === 'string' &&
      typeof email.snippet === 'string' &&
      typeof email.body === 'string'
    );
  });
}

function decodeBase64Url(value: string): string {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch {
    return '';
  }
}

function findHeader(message: GmailMessageResponse, headerName: string): string {
  const target = headerName.toLowerCase();
  const headers = message.payload?.headers || [];
  return headers.find((header) => header.name?.toLowerCase() === target)?.value?.trim() || '';
}

function extractPlainText(part?: GmailMessagePart): string {
  if (!part) {
    return '';
  }

  if (part.mimeType === 'text/plain' && part.body?.data) {
    return decodeBase64Url(part.body.data).trim();
  }

  if (part.parts?.length) {
    for (const child of part.parts) {
      const extracted = extractPlainText(child);
      if (extracted) {
        return extracted;
      }
    }
  }

  if (part.mimeType === 'text/html' && part.body?.data) {
    const html = decodeBase64Url(part.body.data);
    return html.replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return '';
}

function compactEmailBody(body: string, fallbackSnippet: string): string {
  const normalized = body.replace(/\s+/g, ' ').trim();
  if (normalized.length > 0) {
    return normalized.slice(0, 2500);
  }

  return fallbackSnippet.trim().slice(0, 500);
}

async function fetchUnreadEmails(accessToken: string): Promise<EmailDigestInput[]> {
  const listResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=${MAX_EMAILS}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!listResponse.ok) {
    let apiMessage = '';

    try {
      const errorPayload = (await listResponse.json()) as GmailErrorResponse;
      apiMessage = errorPayload.error?.message?.trim() || '';
    } catch {
      apiMessage = '';
    }

    if (listResponse.status === 401) {
      throw new Error('Your Gmail session expired. Please reconnect.');
    }

    if (listResponse.status === 403) {
      throw new Error(
        apiMessage ||
          'Gmail access was denied. Make sure the Gmail API is enabled in Google Cloud and that this app is allowed to request Gmail read access.'
      );
    }

    throw new Error(apiMessage || 'Unable to load unread emails.');
  }

  const listData = (await listResponse.json()) as GmailListResponse;
  const ids = listData.messages?.map((message) => message.id).filter(Boolean) || [];

  if (ids.length === 0) {
    return [];
  }

  const messages = await Promise.all(
    ids.map(async (id) => {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Unable to load a Gmail message.');
      }

      return (await response.json()) as GmailMessageResponse;
    })
  );

  return messages.map((message) => {
    const snippet = message.snippet?.trim() || '';
    const body = compactEmailBody(extractPlainText(message.payload), snippet);

    return {
      id: message.id,
      from: findHeader(message, 'From') || 'Unknown sender',
      subject: findHeader(message, 'Subject') || '(No subject)',
      snippet,
      body,
    };
  });
}

async function markEmailAsRead(accessToken: string, emailId: string): Promise<void> {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: ['UNREAD'],
    }),
  });

  if (!response.ok) {
    let apiMessage = '';

    try {
      const errorPayload = (await response.json()) as GmailErrorResponse;
      apiMessage = errorPayload.error?.message?.trim() || '';
    } catch {
      apiMessage = '';
    }

    if (response.status === 401) {
      throw new Error('Your Gmail session expired. Please reconnect.');
    }

    if (response.status === 403) {
      throw new Error(
        apiMessage ||
          'Gmail could not mark this email as read. Reconnect Gmail and approve modify access.'
      );
    }

    throw new Error(apiMessage || 'Unable to mark this email as read.');
  }
}

function buildTaskFromSummary(email: EmailDigest): Task {
  const summary = email.summary;

  return {
    id: `gmail-${email.id}-${Date.now()}`,
    name: summary?.suggestedTaskTitle || `Review email: ${email.subject}`,
    description: summary?.suggestedTaskDescription || email.snippet || email.body,
    dueDate: new Date().toISOString(),
    priority: summary?.priority || 'medium',
    status: 'todo',
    category: summary?.suggestedCategory || 'Email',
  };
}

function mergeEmailsWithCachedSummaries(
  unreadEmails: EmailDigestInput[],
  cachedEmails: EmailDigest[]
): {
  emailsWithCachedSummaries: EmailDigest[];
  emailsNeedingSummary: EmailDigestInput[];
} {
  const cachedSummaryById = new Map(
    cachedEmails
      .filter((email) => email.summary)
      .map((email) => [email.id, email.summary] as const)
  );

  const emailsWithCachedSummaries = unreadEmails.map((email) => ({
    ...email,
    summary: cachedSummaryById.get(email.id),
  }));

  const emailsNeedingSummary = emailsWithCachedSummaries
    .filter((email) => !email.summary)
    .map(({ id, from, subject, snippet, body }) => ({
      id,
      from,
      subject,
      snippet,
      body,
    }));

  return {
    emailsWithCachedSummaries,
    emailsNeedingSummary,
  };
}

export function GmailInboxAssistant({ onHeaderStateChange }: GmailInboxAssistantProps) {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<EmailDigest[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [markingEmailId, setMarkingEmailId] = useState<string | null>(null);
  const [showIntroDialog, setShowIntroDialog] = useState(false);
  const [isIntroPreferenceLoaded, setIsIntroPreferenceLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = sessionStorage.getItem(GMAIL_TOKEN_STORAGE_KEY);
    const storedCache = localStorage.getItem(GMAIL_EMAIL_CACHE_STORAGE_KEY);

    if (storedToken) {
      setAccessToken(storedToken);
    }

    if (storedCache) {
      try {
        const parsedCache = JSON.parse(storedCache) as unknown;
        if (isEmailDigestArray(parsedCache)) {
          setEmails(parsedCache);
        }
      } catch (error) {
        console.error('Error reading cached Gmail emails:', error);
      }
    }
  }, []);

  useEffect(() => {
    const userId = user?.uid;
    if (!userId) {
      setIsIntroPreferenceLoaded(false);
      return;
    }

    let isActive = true;

    async function loadIntroPreference() {
      const localSeen = localStorage.getItem(getInboxIntroSeenStorageKey(userId)) === 'true';
      if (localSeen) {
        if (isActive) {
          setShowIntroDialog(false);
          setIsIntroPreferenceLoaded(true);
        }
        return;
      }

      const settings = await loadUserSettingsFromDb(userId);
      if (!isActive) {
        return;
      }

      const hasSeenIntro = settings.gmailInboxIntroSeen === true;
      setShowIntroDialog(!hasSeenIntro);
      setIsIntroPreferenceLoaded(true);

      if (hasSeenIntro) {
        localStorage.setItem(getInboxIntroSeenStorageKey(userId), 'true');
      }
    }

    void loadIntroPreference();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (emails.length === 0) {
      localStorage.removeItem(GMAIL_EMAIL_CACHE_STORAGE_KEY);
      return;
    }

    localStorage.setItem(GMAIL_EMAIL_CACHE_STORAGE_KEY, JSON.stringify(emails));
  }, [emails]);

  const unreadCount = emails.length;
  const connected = Boolean(accessToken);

  const loadInbox = async (token: string) => {
    setErrorMessage('');

    try {
      const unreadEmails = await fetchUnreadEmails(token);

      if (unreadEmails.length === 0) {
        setEmails([]);
        return;
      }

      const { emailsWithCachedSummaries, emailsNeedingSummary } = mergeEmailsWithCachedSummaries(unreadEmails, emails);

      if (emailsNeedingSummary.length === 0) {
        setEmails(emailsWithCachedSummaries);
        return;
      }

      const summaryResult = await handleSummarizeEmails({
        emails: emailsNeedingSummary,
      });

      const summariesById = new Map(summaryResult.summaries.map((summary) => [summary.emailId, summary]));
      setEmails(
        emailsWithCachedSummaries.map((email) => ({
          ...email,
          summary: email.summary || summariesById.get(email.id),
        }))
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh Gmail.';
      setErrorMessage(message);
      if (/expired|reconnect/i.test(message)) {
        sessionStorage.removeItem(GMAIL_TOKEN_STORAGE_KEY);
        localStorage.removeItem(GMAIL_EMAIL_CACHE_STORAGE_KEY);
        setAccessToken(null);
      }
    }
  };

  const refreshInbox = () => {
    if (!accessToken) {
      return;
    }

    startRefreshTransition(() => {
      void loadInbox(accessToken);
    });
  };

  const connectGmail = async () => {
    setIsConnecting(true);
    setErrorMessage('');

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      provider.setCustomParameters({
        prompt: 'consent',
      });

      const currentUser = auth.currentUser;
      const hasLinkedGoogleProvider = currentUser?.providerData.some((providerData) => providerData.providerId === 'google.com');
      const result = currentUser
        ? hasLinkedGoogleProvider
          ? await reauthenticateWithPopup(currentUser, provider)
          : await linkWithPopup(currentUser, provider)
        : await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        throw new Error('Google did not return a Gmail access token.');
      }

      sessionStorage.setItem(GMAIL_TOKEN_STORAGE_KEY, token);
      sessionStorage.setItem(GMAIL_ACCOUNT_STORAGE_KEY, result.user.email || result.user.displayName || 'Connected Google account');
      setAccessToken(token);

      toast({
        title: 'Gmail connected',
        description: 'Unread emails are ready to summarize and update.',
      });

      startRefreshTransition(() => {
        void loadInbox(token);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to connect Gmail.';
      setErrorMessage(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const convertToTask = (email: EmailDigest) => {
    const nextTask = buildTaskFromSummary(email);
    const existingTasks = getTasksFromLocalStorage().filter((task) => task.id !== 'fallback-1');
    saveTasksToLocalStorage([nextTask, ...existingTasks]);

    toast({
      title: 'Task created',
      description: `"${nextTask.name}" was added to My Tasks.`,
    });
  };

  const handleMarkAsRead = async (emailId: string) => {
    if (!accessToken) {
      setErrorMessage('Reconnect Gmail to update message state.');
      return;
    }

    setMarkingEmailId(emailId);
    setErrorMessage('');

    try {
      await markEmailAsRead(accessToken, emailId);
      setEmails((currentEmails) => currentEmails.filter((email) => email.id !== emailId));
      toast({
        title: 'Marked as read',
        description: 'The email was updated in Gmail and removed from this unread list.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to mark this email as read.';
      setErrorMessage(message);
      if (/expired|reconnect/i.test(message)) {
        sessionStorage.removeItem(GMAIL_TOKEN_STORAGE_KEY);
        setAccessToken(null);
      }
    } finally {
      setMarkingEmailId(null);
    }
  };

  const handleDismissIntro = async () => {
    setShowIntroDialog(false);
    setIsIntroPreferenceLoaded(true);

    if (user?.uid) {
      localStorage.setItem(getInboxIntroSeenStorageKey(user.uid), 'true');
    }

    await saveUserSettingsToDb(user?.uid, {
      gmailInboxIntroSeen: true,
    });
  };

  useEffect(() => {
    if (!onHeaderStateChange) {
      return;
    }

    onHeaderStateChange({
      connected,
      unreadCount,
      isRefreshing,
      isConnecting,
      refreshInbox,
      connectGmail: () => {
        void connectGmail();
      },
    });
  }, [connected, unreadCount, isRefreshing, isConnecting, onHeaderStateChange]);

  return (
    <div className="space-y-6">
      <Dialog
        open={isIntroPreferenceLoaded && showIntroDialog}
        onOpenChange={(open) => {
          if (!open && showIntroDialog) {
            void handleDismissIntro();
            return;
          }

          setShowIntroDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl">Introducing Inbox</DialogTitle>
            <DialogDescription className="pt-2 text-base leading-7 sm:text-lg">
              now summerises your inbox into bullet points using ai and convert the importand one into tasks
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button onClick={() => void handleDismissIntro()}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
      )}

      {connected && unreadCount === 0 && !isRefreshing && !errorMessage && (
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="py-12 text-center">
            <MailCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">No unread emails right now</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your inbox is clear, or Gmail has not returned any unread messages for this account.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5">
        {emails.map((email) => (
          <Card key={email.id} className="rounded-2xl border-border shadow-sm">
            <CardHeader className="space-y-3">
              <p className="text-sm text-muted-foreground">{email.from}</p>
              <div>
                <CardTitle className="text-xl">{email.subject}</CardTitle>
                <CardDescription className="mt-2">
                  {email.snippet || 'No snippet available for this message.'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Bullet summary</p>
                {email.summary ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {email.summary.bullets.map((bullet, index) => (
                      <li key={`${email.id}-${index}`} className="rounded-lg bg-muted/40 px-3 py-2">
                        - {bullet}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Summary pending.</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {email.summary?.suggestedCategory && <Badge variant="secondary">{email.summary.suggestedCategory}</Badge>}
                {email.summary?.priority && <Badge variant="secondary">Priority: {email.summary.priority}</Badge>}
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground">Suggested task</p>
                <p className="mt-2 text-sm text-foreground">
                  {email.summary?.suggestedTaskTitle || `Review email: ${email.subject}`}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {email.summary?.suggestedTaskDescription || email.snippet || 'Review the email and capture follow-up.'}
                </p>
              </div>

              <Button onClick={() => convertToTask(email)} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Convert To Task
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleMarkAsRead(email.id)}
                className="w-full sm:w-auto"
                disabled={markingEmailId === email.id}
              >
                {markingEmailId === email.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MailOpen className="mr-2 h-4 w-4" />
                )}
                Mark As Read
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
