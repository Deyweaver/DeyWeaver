'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSpinner } from '@/components/icons';
import { handleFetchQuote, type QuoteResult } from '@/lib/actions';

const QUOTE_CACHE_KEY = 'deyweaver.quoteOfTheDay';
const QUOTE_CACHE_TTL_MS = 3 * 60 * 1000;

type CachedQuote = {
  data: QuoteResult;
  fetchedAt: number;
};

export function QuoteWidget() {
  const [data, setData] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuote() {
      try {
        const cachedRaw = localStorage.getItem(QUOTE_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as CachedQuote;
          const isFresh = Date.now() - cached.fetchedAt < QUOTE_CACHE_TTL_MS;
          if (isFresh && cached.data?.quote) {
            setData(cached.data);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Could not read cached quote:', error);
      }

      const result = await handleFetchQuote();
      setData(result);
      try {
        const payload: CachedQuote = {
          data: result,
          fetchedAt: Date.now(),
        };
        localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Could not cache quote:', error);
      }
      setIsLoading(false);
    }

    loadQuote();
  }, []);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Quote className="h-5 w-5 text-primary" />
          Quote Of The Day
        </CardTitle>
        <CardDescription>A short thought to sharpen focus</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <IconSpinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <blockquote
              className="border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-foreground"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 4,
                overflow: 'hidden',
              }}
            >
              "{data?.quote}"
            </blockquote>
            <p className="text-sm font-medium text-muted-foreground">- {data?.author}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
