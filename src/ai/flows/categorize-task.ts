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

const CategorizeTaskInputSchema = z.object({
  description: z.string().describe('The description of the task to categorize.'),
});
export type CategorizeTaskInput = z.infer<typeof CategorizeTaskInputSchema>;

const TaskCategorySchema = z.enum([
  'Work', 'Personal', 'Household', 'Errand', 'Other'
]);

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
  prompt: `You are a task categorization expert. Please categorize the following task into one of these categories: Work, Personal, Household, Errand, Other.

Task Description: {{{description}}}`,
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
