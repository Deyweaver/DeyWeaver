'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing pull request content.
 *
 * - summarizePr - A function that takes PR details and returns an AI-generated summary.
 * - SummarizePrInput - The input type for the summarizePr function.
 * - SummarizePrOutput - The return type for the summarizePr function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePrInputSchema = z.object({
  prTitle: z.string().describe('The title of the pull request.'),
  prDescription: z.string().describe('The description or body of the pull request.'),
  prDiff: z.string().optional().describe('The code diff or list of changed files (optional).'),
});
export type SummarizePrInput = z.infer<typeof SummarizePrInputSchema>;

const SummarizePrOutputSchema = z.object({
  summary: z.string().describe('A concise summary of what this pull request does.'),
  keyChanges: z.array(z.string()).describe('A list of the key changes introduced by this PR.'),
  impact: z.string().describe('The potential impact or purpose of this pull request.'),
  reviewSuggestions: z.string().optional().describe('Any suggestions for reviewers to focus on.'),
});
export type SummarizePrOutput = z.infer<typeof SummarizePrOutputSchema>;

export async function summarizePr(input: SummarizePrInput): Promise<SummarizePrOutput> {
  return summarizePrFlow(input);
}

const summarizePrPrompt = ai.definePrompt({
  name: 'summarizePrPrompt',
  input: {schema: SummarizePrInputSchema},
  output: {schema: SummarizePrOutputSchema},
  prompt: `You are an expert software engineer and code reviewer. Your task is to read a pull request and provide a clear, concise summary that helps reviewers quickly understand what the PR does.

Pull Request Title: {{{prTitle}}}

Pull Request Description:
{{{prDescription}}}

{{#if prDiff}}
Code Changes / Diff:
{{{prDiff}}}
{{/if}}

Instructions:
1. Write a clear, 2-3 sentence **summary** of what this PR does and why.
2. List the **keyChanges** as specific, actionable bullet points (e.g., "Added PR summary AI flow", "Updated sidebar navigation with new route").
3. Describe the **impact** — what problem does this solve, what value does it add, or what risk does it mitigate?
4. Optionally provide **reviewSuggestions** — specific areas or files that reviewers should pay close attention to.

Be concise, technical, and helpful. Focus on clarity for reviewers who may not have full context.
`,
});

const summarizePrFlow = ai.defineFlow(
  {
    name: 'summarizePrFlow',
    inputSchema: SummarizePrInputSchema,
    outputSchema: SummarizePrOutputSchema,
  },
  async input => {
    const {output} = await summarizePrPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a PR summary. Please try again.');
    }
    return output;
  }
);
