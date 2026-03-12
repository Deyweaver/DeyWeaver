'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { handleSummarizePr } from '@/lib/actions';
import type { SummarizePrOutput } from '@/ai/flows/summarize-pr';
import { IconSpinner } from '@/components/icons';
import { GitPullRequest, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  prTitle: z.string().min(3, 'PR title must be at least 3 characters.'),
  prDescription: z.string().min(10, 'PR description must be at least 10 characters.'),
  prDiff: z.string().optional(),
});

export function PrSummaryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryOutput, setSummaryOutput] = useState<SummarizePrOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prTitle: '',
      prDescription: '',
      prDiff: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummaryOutput(null);
    try {
      const result = await handleSummarizePr({
        prTitle: values.prTitle,
        prDescription: values.prDescription,
        prDiff: values.prDiff || undefined,
      });
      setSummaryOutput(result);
      toast({
        title: 'PR Summary Ready!',
        description: 'AI has generated a summary for your pull request.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Summarizing PR',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GitPullRequest className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">AI Pull Request Summarizer</CardTitle>
          </div>
          <CardDescription>
            Paste your PR title, description, and optionally a diff or list of changes. AI will generate a concise summary to help reviewers quickly understand the PR.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prTitle" className="text-base font-semibold">PR Title</FormLabel>
                    <FormControl>
                      <Input
                        id="prTitle"
                        placeholder="e.g., feat: add user authentication with OAuth"
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prDescription" className="text-base font-semibold">PR Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="prDescription"
                        placeholder="Paste the pull request description here..."
                        className="min-h-[120px] resize-none text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prDiff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prDiff" className="text-base font-semibold">
                      Code Diff / Changed Files <span className="text-muted-foreground font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="prDiff"
                        placeholder="Paste a code diff or list of changed files here (optional)..."
                        className="min-h-[100px] resize-none text-sm font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <IconSpinner className="mr-2 h-5 w-5" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <GitPullRequest className="mr-2 h-5 w-5" />
                    Summarize PR
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {summaryOutput && (
        <Card className="w-full max-w-2xl mx-auto mt-6 bg-accent/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">PR Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Overview</h4>
              <p className="text-sm p-3 bg-background rounded-md leading-relaxed">{summaryOutput.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Key Changes</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {summaryOutput.keyChanges.map((change, index) => (
                  <li key={index} className="leading-relaxed">{change}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Impact</h4>
              <p className="text-sm p-3 bg-background rounded-md leading-relaxed">{summaryOutput.impact}</p>
            </div>

            {summaryOutput.reviewSuggestions && (
              <div>
                <h4 className="font-semibold mb-2 text-primary">Review Suggestions</h4>
                <p className="text-sm p-3 bg-background rounded-md leading-relaxed">{summaryOutput.reviewSuggestions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
