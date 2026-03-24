'use client';

import { useEffect, useState } from 'react';
import { CloudSun, MapPin, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSpinner } from '@/components/icons';
import { handleFetchWeather, handleFetchWeatherByLocationName, type WeatherResult } from '@/lib/actions';
import { getWeatherLocationPreference } from '@/lib/user-preferences';

export function WeatherWidget() {
  const [data, setData] = useState<WeatherResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('Fetching your local weather...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLocation = getWeatherLocationPreference();

    if (savedLocation) {
      async function loadSavedLocationWeather() {
        const result = await handleFetchWeatherByLocationName({ location: savedLocation });
        setData(result);
        if (!result.ok && result.error) {
          setStatusMessage(result.error);
        }
        setIsLoading(false);
      }

      loadSavedLocationWeather();
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
        setData(result);
        if (!result.ok && result.error) {
          setStatusMessage(result.error);
        }
        setIsLoading(false);
      },
      (error) => {
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
  }, []);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CloudSun className="h-5 w-5 text-primary" />
          Weather
        </CardTitle>
        <CardDescription>Live conditions from your current location</CardDescription>
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
