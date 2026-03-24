'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSpinner } from '@/components/icons';
import { handleFetchQuote, type QuoteResult } from '@/lib/actions';

export function QuoteWidget() {
  const [data, setData] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuote() {
      const result = await handleFetchQuote();
      setData(result);
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
