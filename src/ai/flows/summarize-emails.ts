'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EmailForSummarySchema = z.object({
  id: z.string(),
  from: z.string(),
  subject: z.string(),
  snippet: z.string(),
  body: z.string(),
});

const SummarizeEmailsInputSchema = z.object({
  emails: z.array(EmailForSummarySchema).max(10),
});

export type SummarizeEmailsInput = z.infer<typeof SummarizeEmailsInputSchema>;

const EmailSummarySchema = z.object({
  emailId: z.string(),
  bullets: z.array(z.string()).min(2).max(4),
  suggestedTaskTitle: z.string(),
  suggestedTaskDescription: z.string(),
  suggestedCategory: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
});

const SummarizeEmailsOutputSchema = z.object({
  summaries: z.array(EmailSummarySchema),
});

export type SummarizeEmailsOutput = z.infer<typeof SummarizeEmailsOutputSchema>;

export async function summarizeEmails(input: SummarizeEmailsInput): Promise<SummarizeEmailsOutput> {
  return summarizeEmailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailsPrompt',
  input: { schema: SummarizeEmailsInputSchema },
  output: { schema: SummarizeEmailsOutputSchema },
  prompt: `You are a productivity assistant. For each email, write a concise bullet summary and draft a likely follow-up task.

Rules:
- Focus on action items, deadlines, asks, and important context.
- Each bullet should be short and readable in a task dashboard.
- If an email is mostly informational, still suggest a light task like "Review update from ..."
- Keep task titles under 70 characters.
- Keep task descriptions under 180 characters.
- Choose the most fitting priority based on urgency in the email.

Emails:
{{#each emails}}
Email ID: {{{id}}}
From: {{{from}}}
Subject: {{{subject}}}
Snippet: {{{snippet}}}
Body:
{{{body}}}

{{/each}}
`,
});

const summarizeEmailsFlow = ai.defineFlow(
  {
    name: 'summarizeEmailsFlow',
    inputSchema: SummarizeEmailsInputSchema,
    outputSchema: SummarizeEmailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output ?? { summaries: [] };
  }
);
