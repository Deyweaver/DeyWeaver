import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { QuickLinkItem, WeatherMode } from '@/lib/user-preferences';

const PREFS_COLLECTION = 'userPreferences';

export interface UserSettingsRecord {
  weatherMode?: WeatherMode;
  weatherLocation?: string;
  quickLinks?: QuickLinkItem[];
  theme?: 'light' | 'dark' | 'system';
}

function sanitizeQuickLinks(input: unknown): QuickLinkItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => ({
      id: String((item as QuickLinkItem)?.id || ''),
      label: String((item as QuickLinkItem)?.label || '').trim(),
      url: String((item as QuickLinkItem)?.url || '').trim(),
    }))
    .filter((item) => item.id && item.label && /^https?:\/\//.test(item.url));
}

export async function loadUserSettingsFromDb(userId: string | null | undefined): Promise<UserSettingsRecord> {
  if (!userId) {
    return {};
  }

  try {
    const ref = doc(db, PREFS_COLLECTION, userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return {};
    }

    const data = snapshot.data() as UserSettingsRecord;
    return {
      weatherMode: data.weatherMode === 'manual' ? 'manual' : data.weatherMode === 'device' ? 'device' : undefined,
      weatherLocation: typeof data.weatherLocation === 'string' ? data.weatherLocation : undefined,
      quickLinks: sanitizeQuickLinks(data.quickLinks),
      theme: data.theme === 'light' || data.theme === 'dark' || data.theme === 'system' ? data.theme : undefined,
    };
  } catch (error) {
    console.error('Error loading user settings from database:', error);
    return {};
  }
}

export async function saveUserSettingsToDb(
  userId: string | null | undefined,
  settings: Partial<UserSettingsRecord>
): Promise<void> {
  if (!userId) {
    return;
  }

  try {
    const payload: Partial<UserSettingsRecord> = {};

    if (settings.weatherMode === 'device' || settings.weatherMode === 'manual') {
      payload.weatherMode = settings.weatherMode;
    }

    if (typeof settings.weatherLocation === 'string') {
      payload.weatherLocation = settings.weatherLocation;
    }

    if (settings.quickLinks) {
      payload.quickLinks = sanitizeQuickLinks(settings.quickLinks);
    }

    if (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system') {
      payload.theme = settings.theme;
    }

    const ref = doc(db, PREFS_COLLECTION, userId);
    await setDoc(ref, payload, { merge: true });
  } catch (error) {
    console.error('Error saving user settings to database:', error);
  }
}
