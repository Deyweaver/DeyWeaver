'use client';

import { useState } from 'react';
import { Loader2, MailCheck, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { GmailInboxAssistant } from '@/components/gmail/gmail-inbox-assistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type InboxHeaderState = {
  connected: boolean;
  unreadCount: number;
  isRefreshing: boolean;
  isConnecting: boolean;
  refreshInbox: () => void;
  connectGmail: () => void;
};

export default function InboxPage() {
  const [headerState, setHeaderState] = useState<InboxHeaderState | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inbox"
        description="Unread emails, task-ready."
        actions={
          headerState?.connected ? (
            <>
              <Badge variant="secondary">{headerState.unreadCount} unread emails</Badge>
              <Button variant="outline" onClick={headerState.refreshInbox} disabled={headerState.isRefreshing}>
                {headerState.isRefreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4" />
                )}
                Refresh Inbox
              </Button>
            </>
          ) : (
            <Button onClick={headerState?.connectGmail} disabled={!headerState || headerState.isConnecting || headerState.isRefreshing}>
              {headerState?.isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MailCheck className="mr-2 h-4 w-4" />
              )}
              Connect Gmail
            </Button>
          )
        }
      />

      <GmailInboxAssistant onHeaderStateChange={setHeaderState} />
    </div>
  );
}
