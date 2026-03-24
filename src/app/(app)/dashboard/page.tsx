
"use client";

import { PageHeader } from '@/components/layout/page-header';
import { useAuth } from '@/hooks/use-auth';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { QuoteWidget } from '@/components/dashboard/quote-widget';
import { NewsWidget } from '@/components/dashboard/news-widget';
import { QuickLinksWidget } from '@/components/dashboard/quick-links-widget';
import { DirectSearchWidget } from '@/components/dashboard/direct-search-widget';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.trim().split(/\s+/)[0];
  const greetingName = firstName || 'there';

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back ${greetingName}`}
        description="Live updates and quick actions for your day."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <WeatherWidget />
        <QuoteWidget />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DirectSearchWidget />
        <NewsWidget />
        <QuickLinksWidget />
      </div>
    </div>
  );
}
