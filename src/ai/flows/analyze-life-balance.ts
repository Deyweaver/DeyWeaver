'use server';
/* idk this whole part works lol */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Simplified Task structure for AI input
const AITaskSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'inprogress', 'done', 'blocked']),
  category: z.string().optional(),
});

const AnalyzeLifeBalanceInputSchema = z.object({
  tasks: z.array(AITaskSchema).describe('A list of tasks for analysis.'),
  timeframe: z.string().optional().describe('Timeframe for analysis, e.g., "this week"'),
});
export type AnalyzeLifeBalanceInput = z.infer<typeof AnalyzeLifeBalanceInputSchema>;

const LifeCategorySchema = z.object({
  name: z.string().describe('Life category name (e.g., Work, Health, Relationships, Personal Growth, Fun, Finance)'),
  count: z.number().describe('Number of tasks in this category'),
  percentage: z.number().describe('Percentage of total tasks (0-100)'),
  description: z.string().describe('Brief description of what this category includes'),
  color: z.string().optional().describe('Suggested color for visualization'),
  tasks: z.array(z.string()).describe('Examples of task names in this category'),
});

const AnalyzeLifeBalanceOutputSchema = z.object({
  categories: z.array(LifeCategorySchema).describe('Array of life balance categories with task distribution'),
  totalTasks: z.number().describe('Total number of tasks analyzed'),
  balanceInsight: z.string().describe('AI-generated insight about the user\'s life balance'),
  recommendation: z.string().describe('Personalized recommendation to improve balance'),
});
export type AnalyzeLifeBalanceOutput = z.infer<typeof AnalyzeLifeBalanceOutputSchema>;

export async function analyzeLifeBalance(input: AnalyzeLifeBalanceInput): Promise<AnalyzeLifeBalanceOutput> {
  return analyzeLifeBalanceFlow(input);
}

const analyzeLifeBalancePrompt = ai.definePrompt({
  name: 'analyzeLifeBalancePrompt',
  input: {schema: AnalyzeLifeBalanceInputSchema},
  output: {schema: AnalyzeLifeBalanceOutputSchema},
  prompt: `You are a Life Balance AI Assistant. Your job is to analyze a user's tasks and categorize them into life areas to help them understand and improve their life balance.

Tasks:
{{#each tasks}}
- Name: {{name}}
  {{#if description}}Description: {{description}}{{/if}}
  {{#if category}}Category: {{category}}{{/if}}
  Status: {{status}}
  {{#if priority}}Priority: {{priority}}{{/if}}
{{else}}
No tasks provided.
{{/each}}

Instructions:
1. Analyze the provided tasks and categorize them into these life areas:
   - Work/Career: Professional tasks, projects, meetings, career development
   - Health & Wellness: Fitness, meditation, nutrition, doctor appointments, mental health
   - Relationships: Time with family, friends, social events, communication
   - Personal Growth: Learning, courses, reading, skill development, hobbies
   - Fun & Entertainment: Entertainment, gaming, movies, travel, leisure
   - Finance: Budgeting, bills, investments, financial planning
   - Home & Environment: Cleaning, organizing, home maintenance, errands

2. For each category:
   - Count how many tasks fall into it
   - Calculate the percentage of total tasks
   - Provide a brief description of what the category includes
   - List 2-3 example tasks from this category
   - Suggest a color for visualization (hex or named color)

3. Generate insights about life balance:
   - Identify if any area is over-represented or under-represented
   - Highlight surprising patterns or imbalances
   - Consider task priorities when forming the insight

4. Provide a personalized recommendation to improve balance

Return data in the exact format specified. Only include categories that have at least one task.
`,
});

const analyzeLifeBalanceFlow = ai.defineFlow(
  {
    name: 'analyzeLifeBalanceFlow',
    inputSchema: AnalyzeLifeBalanceInputSchema,
    outputSchema: AnalyzeLifeBalanceOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeLifeBalancePrompt(input);

    if (!output) {
      return {
        categories: [],
        totalTasks: input.tasks.length,
        balanceInsight: 'Could not analyze life balance at this time.',
        recommendation: 'Try again in a moment after reviewing your tasks.',
      };
    }

    return output;
  }
);
