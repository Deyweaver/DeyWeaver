'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Globe2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSpinner } from '@/components/icons';
import { handleFetchTopNews, type TopNewsResult } from '@/lib/actions';

const NEWS_CACHE_KEY = 'deyweaver.topNews';
const NEWS_CACHE_TTL_MS = 3 * 60 * 1000;

type CachedNews = {
  data: TopNewsResult;
  fetchedAt: number;
};

export function NewsWidget() {
  const [data, setData] = useState<TopNewsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const cachedRaw = localStorage.getItem(NEWS_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as CachedNews;
          const isFresh = Date.now() - cached.fetchedAt < NEWS_CACHE_TTL_MS;
          if (isFresh && cached.data?.items?.length > 0) {
            setData(cached.data);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Could not read cached news:', error);
      }

      const result = await handleFetchTopNews();
      setData(result);
      try {
        const payload: CachedNews = {
          data: result,
          fetchedAt: Date.now(),
        };
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Could not cache news:', error);
      }
      setIsLoading(false);
    }

    loadNews();
  }, []);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Globe2 className="h-5 w-5 text-primary" />
          Top News
        </CardTitle>
        <CardDescription>Global English headlines</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <IconSpinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {data?.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <span className="line-clamp-2 text-sm text-foreground group-hover:text-primary">{item.title}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  Open story <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">Source: {data?.source}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
