
"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useAuth } from '@/hooks/use-auth';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { QuoteWidget } from '@/components/dashboard/quote-widget';
import { NewsWidget } from '@/components/dashboard/news-widget';
import { QuickLinksWidget } from '@/components/dashboard/quick-links-widget';
import { DirectSearchWidget } from '@/components/dashboard/direct-search-widget';
import {
  getDefaultDashboardWidgetPreferences,
  loadDashboardWidgetPreferences,
  type DashboardWidgetPreferences,
} from '@/lib/dashboard-preferences';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.trim().split(/\s+/)[0];
  const greetingName = firstName || 'there';
  const [widgetPreferences, setWidgetPreferences] = useState<DashboardWidgetPreferences>(
    getDefaultDashboardWidgetPreferences()
  );

  useEffect(() => {
    let isActive = true;

    async function loadPreferences() {
      const preferences = await loadDashboardWidgetPreferences(user?.uid);
      if (isActive) {
        setWidgetPreferences(preferences);
      }
    }

    loadPreferences();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  const hasTopRow = widgetPreferences.weather || widgetPreferences.quote;
  const hasBottomRow = widgetPreferences.directSearch || widgetPreferences.news || widgetPreferences.quickLinks;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back ${greetingName}`}
        description="Live updates and quick actions for your day."
      />

      {hasTopRow && (
        <div className="grid gap-6 md:grid-cols-2">
          {widgetPreferences.weather && <WeatherWidget />}
          {widgetPreferences.quote && <QuoteWidget />}
        </div>
      )}

      {hasBottomRow && (
        <div className="grid gap-6 md:grid-cols-2">
          {widgetPreferences.directSearch && <DirectSearchWidget />}
          {widgetPreferences.news && <NewsWidget />}
          {widgetPreferences.quickLinks && <QuickLinksWidget />}
        </div>
      )}
    </div>
  );
}
