import { MonitorPlay, Slack, Youtube } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QUICK_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    icon: Youtube,
  },
  {
    label: 'Microsoft Teams',
    href: 'https://teams.microsoft.com/',
    icon: MonitorPlay,
  },
  {
    label: 'Slack',
    href: 'https://slack.com/signin',
    icon: Slack,
  },
];

export function QuickLinksWidget() {
  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Quick Launch</CardTitle>
        <CardDescription>Open your most-used tools in a new tab</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
