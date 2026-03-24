export interface QuickLinkItem {
  id: string;
  label: string;
  url: string;
}

export type WeatherMode = 'device' | 'manual';

const WEATHER_LOCATION_KEY = 'deyweaver.weatherLocation';
const WEATHER_MODE_KEY = 'deyweaver.weatherMode';
const QUICK_LINKS_KEY = 'deyweaver.quickLinks';

const DEFAULT_QUICK_LINKS: QuickLinkItem[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/',
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    url: 'https://teams.microsoft.com/',
  },
  {
    id: 'slack',
    label: 'Slack',
    url: 'https://slack.com/signin',
  },
];

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

export function getWeatherLocationPreference(): string {
  if (!hasWindow()) {
    return '';
  }
  return localStorage.getItem(WEATHER_LOCATION_KEY)?.trim() || '';
}

export function getWeatherModePreference(): WeatherMode {
  if (!hasWindow()) {
    return 'device';
  }

  const raw = localStorage.getItem(WEATHER_MODE_KEY);
  return raw === 'manual' ? 'manual' : 'device';
}

export function setWeatherModePreference(mode: WeatherMode): void {
  if (!hasWindow()) {
    return;
  }

  localStorage.setItem(WEATHER_MODE_KEY, mode);
}

export function setWeatherLocationPreference(location: string): void {
  if (!hasWindow()) {
    return;
  }

  const normalized = location.trim();
  if (normalized.length === 0) {
    localStorage.removeItem(WEATHER_LOCATION_KEY);
    return;
  }

  localStorage.setItem(WEATHER_LOCATION_KEY, normalized);
}

export function getQuickLinksPreference(): QuickLinkItem[] {
  if (!hasWindow()) {
    return DEFAULT_QUICK_LINKS;
  }

  const raw = localStorage.getItem(QUICK_LINKS_KEY);
  if (!raw) {
    return DEFAULT_QUICK_LINKS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_QUICK_LINKS;
    }

    const normalized = parsed
      .map((item) => ({
        id: String(item?.id || ''),
        label: String(item?.label || '').trim(),
        url: String(item?.url || '').trim(),
      }))
      .filter((item) => item.id && item.label && /^https?:\/\//.test(item.url));

    return normalized;
  } catch {
    return DEFAULT_QUICK_LINKS;
  }
}

export function setQuickLinksPreference(links: QuickLinkItem[]): void {
  if (!hasWindow()) {
    return;
  }

  const normalized = links
    .map((item) => ({
      id: item.id,
      label: item.label.trim(),
      url: item.url.trim(),
    }))
    .filter((item) => item.id && item.label && /^https?:\/\//.test(item.url));

  localStorage.setItem(QUICK_LINKS_KEY, JSON.stringify(normalized));
}

export function getDefaultQuickLinks(): QuickLinkItem[] {
  return DEFAULT_QUICK_LINKS;
}
