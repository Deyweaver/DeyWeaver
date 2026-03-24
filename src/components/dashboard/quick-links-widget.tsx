"use client";

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuickLinksPreference, type QuickLinkItem } from '@/lib/user-preferences';
import { useAuth } from '@/hooks/use-auth';
import { loadUserSettingsFromDb } from '@/lib/user-settings-db';

export function QuickLinksWidget() {
  const { user } = useAuth();
  const [links, setLinks] = useState<QuickLinkItem[]>([]);

  useEffect(() => {
    let isActive = true;

    async function loadLinks() {
      const localLinks = getQuickLinksPreference();
      if (isActive) {
        setLinks(localLinks);
      }

      if (!user?.uid) {
        return;
      }

      const dbSettings = await loadUserSettingsFromDb(user.uid);
      if (!isActive) {
        return;
      }

      if (dbSettings.quickLinks && dbSettings.quickLinks.length >= 0) {
        setLinks(dbSettings.quickLinks);
      }
    }

    loadLinks();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Quick Launch</CardTitle>
        <CardDescription>Open your most-used tools in a new tab</CardDescription>
      </CardHeader>
      <CardContent>
        {links.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <span className="truncate">{link.label}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No quick links configured. Add some in Settings.</p>
        )}
      </CardContent>
    </Card>
  );
}
