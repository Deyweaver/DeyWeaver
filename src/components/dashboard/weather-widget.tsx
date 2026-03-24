'use client';

import { useEffect, useState } from 'react';
import { CloudSun, MapPin, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSpinner } from '@/components/icons';
import { handleFetchWeather, handleFetchWeatherByLocationName, type WeatherResult } from '@/lib/actions';
import { getWeatherLocationPreference, getWeatherModePreference } from '@/lib/user-preferences';
import { useAuth } from '@/hooks/use-auth';
import { loadUserSettingsFromDb } from '@/lib/user-settings-db';

const WEATHER_CACHE_KEY = 'deyweaver.weather';
const WEATHER_CACHE_TTL_MS = 3 * 60 * 1000;

type CachedWeather = {
  cacheKey: string;
  data: WeatherResult;
  fetchedAt: number;
};

export function WeatherWidget() {
  const { user } = useAuth();
  const [data, setData] = useState<WeatherResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('Fetching your local weather...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    function buildWeatherCacheKey(mode: string, location: string): string {
      if (mode === 'manual') {
        return `manual:${location.trim().toLowerCase()}`;
      }
      return 'device';
    }

    function tryReadCachedWeather(cacheKey: string): WeatherResult | null {
      try {
        const cachedRaw = localStorage.getItem(WEATHER_CACHE_KEY);
        if (!cachedRaw) {
          return null;
        }

        const cached = JSON.parse(cachedRaw) as CachedWeather;
        const isFresh = Date.now() - cached.fetchedAt < WEATHER_CACHE_TTL_MS;
        if (isFresh && cached.cacheKey === cacheKey && cached.data) {
          return cached.data;
        }
      } catch (error) {
        console.warn('Could not read cached weather:', error);
      }

      return null;
    }

    function writeCachedWeather(cacheKey: string, result: WeatherResult): void {
      try {
        const payload: CachedWeather = {
          cacheKey,
          data: result,
          fetchedAt: Date.now(),
        };
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Could not cache weather:', error);
      }
    }

    async function run() {
      let weatherMode = getWeatherModePreference();
      let savedLocation = getWeatherLocationPreference();

      if (user?.uid) {
        const dbSettings = await loadUserSettingsFromDb(user.uid);
        if (dbSettings.weatherMode) {
          weatherMode = dbSettings.weatherMode;
        }
        if (typeof dbSettings.weatherLocation === 'string') {
          savedLocation = dbSettings.weatherLocation;
        }
      }

      if (!isActive) {
        return;
      }

      const cacheKey = buildWeatherCacheKey(weatherMode, savedLocation);
      const cachedWeather = tryReadCachedWeather(cacheKey);
      if (cachedWeather) {
        setData(cachedWeather);
        if (!cachedWeather.ok && cachedWeather.error) {
          setStatusMessage(cachedWeather.error);
        }
        setIsLoading(false);
        return;
      }

      if (weatherMode === 'manual') {
        if (!savedLocation) {
          setStatusMessage('Manual weather mode is enabled. Set a location in Settings.');
          setIsLoading(false);
          return;
        }

        const result = await handleFetchWeatherByLocationName({ location: savedLocation });
        if (!isActive) {
          return;
        }
        setData(result);
        writeCachedWeather(cacheKey, result);
        if (!result.ok && result.error) {
          setStatusMessage(result.error);
        }
        setIsLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setStatusMessage('Geolocation is not supported in this browser.');
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result = await handleFetchWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if (!isActive) {
            return;
          }
          setData(result);
          writeCachedWeather(cacheKey, result);
          if (!result.ok && result.error) {
            setStatusMessage(result.error);
          }
          setIsLoading(false);
        },
        (error) => {
          if (!isActive) {
            return;
          }
          if (error.code === error.PERMISSION_DENIED) {
            setStatusMessage('Location permission denied. Enable it to see local weather.');
          } else {
            setStatusMessage('Could not detect your location right now.');
          }
          setIsLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 300000,
        }
      );
    }

    run();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CloudSun className="h-5 w-5 text-primary" />
          Weather
        </CardTitle>
        <CardDescription>Live conditions from your selected weather source</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <IconSpinner className="h-8 w-8 text-primary" />
          </div>
        ) : data?.ok ? (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold leading-none">{data.temperatureC} C</span>
              <span className="text-sm text-muted-foreground">{data.condition}</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {data.locationLabel}
              </p>
              <p className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Wind {data.windKmh} km/h
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-[120px] rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            {statusMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
