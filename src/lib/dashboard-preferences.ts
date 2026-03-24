import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type DashboardWidgetKey = 'directSearch' | 'weather' | 'quote' | 'news' | 'quickLinks';

export interface DashboardWidgetPreferences {
  directSearch: boolean;
  weather: boolean;
  quote: boolean;
  news: boolean;
  quickLinks: boolean;
}

const PREFS_COLLECTION = 'userPreferences';
const DASHBOARD_WIDGETS_KEY = 'dashboardWidgets';
const LOCAL_CACHE_KEY = 'deyweaver.dashboardWidgetPrefs';

const DEFAULT_DASHBOARD_WIDGET_PREFERENCES: DashboardWidgetPreferences = {
  directSearch: true,
  weather: true,
  quote: true,
  news: true,
  quickLinks: true,
};

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

function sanitizeDashboardWidgetPreferences(
  input: Partial<DashboardWidgetPreferences> | null | undefined
): DashboardWidgetPreferences {
  return {
    directSearch: typeof input?.directSearch === 'boolean' ? input.directSearch : true,
    weather: typeof input?.weather === 'boolean' ? input.weather : true,
    quote: typeof input?.quote === 'boolean' ? input.quote : true,
    news: typeof input?.news === 'boolean' ? input.news : true,
    quickLinks: typeof input?.quickLinks === 'boolean' ? input.quickLinks : true,
  };
}

function getLocalDashboardWidgetPreferences(): DashboardWidgetPreferences {
  if (!hasWindow()) {
    return DEFAULT_DASHBOARD_WIDGET_PREFERENCES;
  }

  const raw = localStorage.getItem(LOCAL_CACHE_KEY);
  if (!raw) {
    return DEFAULT_DASHBOARD_WIDGET_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DashboardWidgetPreferences>;
    return sanitizeDashboardWidgetPreferences(parsed);
  } catch {
    return DEFAULT_DASHBOARD_WIDGET_PREFERENCES;
  }
}

function setLocalDashboardWidgetPreferences(preferences: DashboardWidgetPreferences): void {
  if (!hasWindow()) {
    return;
  }
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(preferences));
}

export function getDefaultDashboardWidgetPreferences(): DashboardWidgetPreferences {
  return DEFAULT_DASHBOARD_WIDGET_PREFERENCES;
}

export async function loadDashboardWidgetPreferences(userId: string | null | undefined): Promise<DashboardWidgetPreferences> {
  const localPreferences = getLocalDashboardWidgetPreferences();

  if (!userId) {
    return localPreferences;
  }

  try {
    const ref = doc(db, PREFS_COLLECTION, userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      await setDoc(
        ref,
        {
          [DASHBOARD_WIDGETS_KEY]: localPreferences,
        },
        { merge: true }
      );
      return localPreferences;
    }

    const data = snapshot.data();
    const dbPreferences = sanitizeDashboardWidgetPreferences(
      data?.[DASHBOARD_WIDGETS_KEY] as Partial<DashboardWidgetPreferences> | undefined
    );
    setLocalDashboardWidgetPreferences(dbPreferences);
    return dbPreferences;
  } catch (error) {
    console.error('Error loading dashboard widget preferences:', error);
    return localPreferences;
  }
}

export async function saveDashboardWidgetPreferences(
  userId: string | null | undefined,
  preferences: DashboardWidgetPreferences
): Promise<void> {
  const sanitized = sanitizeDashboardWidgetPreferences(preferences);
  setLocalDashboardWidgetPreferences(sanitized);

  if (!userId) {
    return;
  }

  try {
    const ref = doc(db, PREFS_COLLECTION, userId);
    await setDoc(
      ref,
      {
        [DASHBOARD_WIDGETS_KEY]: sanitized,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving dashboard widget preferences:', error);
  }
}
