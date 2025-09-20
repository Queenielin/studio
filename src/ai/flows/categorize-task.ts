
// src/ai/flows/categorize-task.ts
'use server';

/**
 * @fileOverview Categorizes tasks based on their description using AI.
 *
 * - categorizeTask - A function that categorizes a task.
 * - CategorizeTaskInput - The input type for the categorizeTask function.
 * - CategorizeTaskOutput - The return type for the categorizeTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { allTaskCategories } from '@/lib/types';

const CategorizeTaskInputSchema = z.object({
  description: z.string().describe('The description of the task to categorize.'),
});
export type CategorizeTaskInput = z.infer<typeof CategorizeTaskInputSchema>;

const TaskCategorySchema = z.enum(allTaskCategories);

const CategorizeTaskOutputSchema = z.object({
  category: TaskCategorySchema.describe('The category of the task.'),
});
export type CategorizeTaskOutput = z.infer<typeof CategorizeTaskOutputSchema>;

export async function categorizeTask(input: CategorizeTaskInput): Promise<CategorizeTaskOutput> {
  return categorizeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTaskPrompt',
  input: {schema: CategorizeTaskInputSchema},
  output: {schema: CategorizeTaskOutputSchema},
  prompt: `You are a task categorization expert. Please categorize the following task into one of the categories provided.

Here is the framework for categorization:

🔵 Deep Work Categories (High Focus × Creative/Analytical)
- Strategy & Problem-Solving: Business strategy, analysis, financial modeling, decision frameworks
- Creative Production: Writing, design, coding, music, content creation
- Research & Learning: Reading, studying, synthesizing knowledge, data exploration
- Building & Designing: Product design, system architecture, prototyping, solution mapping

🟢 Light Work Categories (Medium Focus × Execution/Processing)
- Communication: Emails, chat replies, drafting short updates, responding to inquiries
- Review & Feedback: Reviewing documents, slide decks, pull requests, proofreading
- Organizing & Planning: Updating task boards, making short plans, simple scheduling
- Follow-Ups & Coordination: Chasing deliverables, aligning with colleagues, preparing reminders

🟡 Admin Work Categories (Low Focus × Maintenance/Logistics)
- Documentation & Data Entry: Logging notes, updating CRM, form filling, timesheets
- Scheduling & Calendar: Booking/rescheduling meetings, time-blocking
- File & Tool Maintenance: Uploading files, renaming, organizing folders, backups
- Routine Operations: Expense reports, invoice processing, compliance checklists

Task Description: {{{description}}}

Choose the best category from this list:
${allTaskCategories.join(', ')}
`,
});

const categorizeTaskFlow = ai.defineFlow(
  {
    name: 'categorizeTaskFlow',
    inputSchema: CategorizeTaskInputSchema,
    outputSchema: CategorizeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
