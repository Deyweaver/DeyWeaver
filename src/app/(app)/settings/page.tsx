'use client';

import { useState, useEffect } from 'react';
import { ThemeToggleSwitch } from '@/components/settings/theme-toggle-switch';
import { PageHeader } from '@/components/layout/page-header';

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account and preferences."
      />

      {/* Appearance Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground mt-2">Adjust the look and feel of the application.</p>
          </div>
          <ThemeToggleSwitch />
        </div>
      </div>
    </div>
  );
}
