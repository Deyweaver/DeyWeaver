'use client';

import { useState, useEffect } from 'react';
import { ThemeToggleSwitch } from '@/components/settings/theme-toggle-switch';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import {
  getDefaultQuickLinks,
  getQuickLinksPreference,
  getWeatherLocationPreference,
  getWeatherModePreference,
  setQuickLinksPreference,
  setWeatherLocationPreference,
  setWeatherModePreference,
  type QuickLinkItem,
  type WeatherMode,
} from '@/lib/user-preferences';
import {
  getDefaultDashboardWidgetPreferences,
  loadDashboardWidgetPreferences,
  saveDashboardWidgetPreferences,
  type DashboardWidgetKey,
  type DashboardWidgetPreferences,
} from '@/lib/dashboard-preferences';
import { loadUserSettingsFromDb, saveUserSettingsToDb } from '@/lib/user-settings-db';
import { Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('device');
  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherSavedMessage, setWeatherSavedMessage] = useState('');
  const [quickLinks, setQuickLinks] = useState<QuickLinkItem[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [quickLinkMessage, setQuickLinkMessage] = useState('');
  const [widgetPreferences, setWidgetPreferences] = useState<DashboardWidgetPreferences>(getDefaultDashboardWidgetPreferences());
  const [widgetPreferencesMessage, setWidgetPreferencesMessage] = useState('');
  const [gmailMessage, setGmailMessage] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setWeatherMode(getWeatherModePreference());
    setWeatherLocation(getWeatherLocationPreference());
    setQuickLinks(getQuickLinksPreference());
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

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
  }, [isMounted, user?.uid]);

  useEffect(() => {
    const userId = user?.uid;

    if (!isMounted || !userId) {
      return;
    }

    let isActive = true;

    async function loadGeneralSettings() {
      const settings = await loadUserSettingsFromDb(userId);

      if (!isActive) {
        return;
      }

      if (settings.weatherMode) {
        setWeatherMode(settings.weatherMode);
        setWeatherModePreference(settings.weatherMode);
      }

      if (typeof settings.weatherLocation === 'string') {
        setWeatherLocation(settings.weatherLocation);
        setWeatherLocationPreference(settings.weatherLocation);
      }

      if (settings.quickLinks && settings.quickLinks.length > 0) {
        setQuickLinks(settings.quickLinks);
        setQuickLinksPreference(settings.quickLinks);
      }
    }

    loadGeneralSettings();

    return () => {
      isActive = false;
    };
  }, [isMounted, user?.uid]);

  const handleDashboardWidgetToggle = async (key: DashboardWidgetKey, checked: boolean) => {
    const nextPreferences = {
      ...widgetPreferences,
      [key]: checked,
    };

    setWidgetPreferences(nextPreferences);
    await saveDashboardWidgetPreferences(user?.uid, nextPreferences);
    setWidgetPreferencesMessage('Dashboard widget choices saved.');
  };

  const handleSaveWeatherLocation = () => {
    setWeatherModePreference(weatherMode);
    setWeatherLocationPreference(weatherLocation);
    saveUserSettingsToDb(user?.uid, {
      weatherMode,
      weatherLocation: weatherLocation.trim(),
    });

    if (weatherMode === 'device') {
      setWeatherSavedMessage('Saved: weather will use your device location.');
      return;
    }

    setWeatherSavedMessage(
      weatherLocation.trim().length > 0
        ? `Saved manual weather location: ${weatherLocation.trim()}`
        : 'Manual mode selected. Please add a location name.'
    );
  };

  const handleAddQuickLink = () => {
    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();

    if (!label || !url) {
      setQuickLinkMessage('Please provide both a label and a URL.');
      return;
    }

    if (!/^https?:\/\//.test(url)) {
      setQuickLinkMessage('URL must start with http:// or https://');
      return;
    }

    const nextLinks = [
      ...quickLinks,
      {
        id: `${Date.now()}`,
        label,
        url,
      },
    ];

    setQuickLinks(nextLinks);
    setQuickLinksPreference(nextLinks);
    saveUserSettingsToDb(user?.uid, {
      quickLinks: nextLinks,
    });
    setNewLinkLabel('');
    setNewLinkUrl('');
    setQuickLinkMessage('Quick link added.');
  };

  const handleRemoveQuickLink = (id: string) => {
    const nextLinks = quickLinks.filter((link) => link.id !== id);
    setQuickLinks(nextLinks);
    setQuickLinksPreference(nextLinks);
    saveUserSettingsToDb(user?.uid, {
      quickLinks: nextLinks,
    });
    setQuickLinkMessage('Quick link removed.');
  };

  const handleResetQuickLinks = () => {
    const defaults = getDefaultQuickLinks();
    setQuickLinks(defaults);
    setQuickLinksPreference(defaults);
    saveUserSettingsToDb(user?.uid, {
      quickLinks: defaults,
    });
    setQuickLinkMessage('Quick links reset to default.');
  };

  const handleDisconnectGmail = () => {
    sessionStorage.removeItem('deyweaverGmailAccessToken');
    sessionStorage.removeItem('deyweaverGmailAccount');
    localStorage.removeItem('deyweaverGmailEmailCache');
    setGmailMessage('Gmail disconnected.');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences."
      />

      {/* idk this whole part works lol */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground mt-2">Adjust the look and feel of the application.</p>
          </div>
          <ThemeToggleSwitch />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Weather Location</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose one: use your device location, or set a manual location.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center">
            <p className="text-sm font-medium text-foreground">Weather Source</p>
            <Select value={weatherMode} onValueChange={(value) => setWeatherMode(value as WeatherMode)}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Select weather source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="device">Use device location</SelectItem>
                <SelectItem value="manual">Enter location manually</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              value={weatherLocation}
              onChange={(e) => setWeatherLocation(e.target.value)}
              placeholder="Example: Berlin, London, New York"
              disabled={weatherMode !== 'manual'}
            />
            <Button onClick={handleSaveWeatherLocation}>Save Location</Button>
          </div>
          {weatherSavedMessage && <p className="text-sm text-muted-foreground">{weatherSavedMessage}</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Quick Links</h2>
            <p className="mt-2 text-sm text-muted-foreground">Add or remove your custom links for the dashboard quick-launch card.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              placeholder="Link label (Example: Gmail)"
            />
            <Input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAddQuickLink} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Quick Link
            </Button>
            <Button variant="outline" onClick={handleResetQuickLinks}>
              Reset Defaults
            </Button>
          </div>

          <div className="space-y-3">
            {quickLinks.length > 0 ? (
              quickLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{link.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveQuickLink(link.id)} aria-label={`Remove ${link.label}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No quick links yet. Add one above.</p>
            )}
          </div>

          {quickLinkMessage && <p className="text-sm text-muted-foreground">{quickLinkMessage}</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Inbox</h2>
            <p className="mt-2 text-sm text-muted-foreground">Manage your Gmail connection.</p>
          </div>
          <Button variant="outline" onClick={handleDisconnectGmail}>
            Disconnect Gmail
          </Button>
          {gmailMessage && <p className="text-sm text-muted-foreground">{gmailMessage}</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Dashboard Widgets</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose what appears on your dashboard. These choices are saved to your account in the database.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium text-foreground">Direct Search</span>
              <Checkbox
                checked={widgetPreferences.directSearch}
                onCheckedChange={(checked) => handleDashboardWidgetToggle('directSearch', checked === true)}
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium text-foreground">Weather</span>
              <Checkbox
                checked={widgetPreferences.weather}
                onCheckedChange={(checked) => handleDashboardWidgetToggle('weather', checked === true)}
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium text-foreground">Quote Of The Day</span>
              <Checkbox
                checked={widgetPreferences.quote}
                onCheckedChange={(checked) => handleDashboardWidgetToggle('quote', checked === true)}
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium text-foreground">Top News</span>
              <Checkbox
                checked={widgetPreferences.news}
                onCheckedChange={(checked) => handleDashboardWidgetToggle('news', checked === true)}
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium text-foreground">Quick Links</span>
              <Checkbox
                checked={widgetPreferences.quickLinks}
                onCheckedChange={(checked) => handleDashboardWidgetToggle('quickLinks', checked === true)}
              />
            </label>
          </div>

          {widgetPreferencesMessage && <p className="text-sm text-muted-foreground">{widgetPreferencesMessage}</p>}
        </div>
      </div>
    </div>
  );
}
