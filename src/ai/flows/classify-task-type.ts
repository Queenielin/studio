'use server';

/**
 * @fileOverview Classifies tasks into 'deep', 'light', and 'admin' work categories using AI.
 *
 * - classifyTaskType - A function that classifies the task type.
 * - ClassifyTaskTypeInput - The input type for the classifyTaskType function.
 * - ClassifyTaskTypeOutput - The return type for the classifyTaskType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyTaskTypeInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to classify.'),
});
export type ClassifyTaskTypeInput = z.infer<typeof ClassifyTaskTypeInputSchema>;

const ClassifyTaskTypeOutputSchema = z.object({
  taskType: z
    .enum(['deep', 'light', 'admin'])
    .describe('The classified type of the task (deep, light, or admin).'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the classification, including details incorporated or not.'
    ),
});
export type ClassifyTaskTypeOutput = z.infer<typeof ClassifyTaskTypeOutputSchema>;

export async function classifyTaskType(input: ClassifyTaskTypeInput): Promise<ClassifyTaskTypeOutput> {
  return classifyTaskTypeFlow(input);
}

const classifyTaskTypePrompt = ai.definePrompt({
  name: 'classifyTaskTypePrompt',
  input: {schema: ClassifyTaskTypeInputSchema},
  output: {schema: ClassifyTaskTypeOutputSchema},
  prompt: `You are an AI task classifier. You will classify the given task description into one of the following categories: deep, light, or admin.

Task Description: {{{taskDescription}}}

Provide a reasoning for your classification, including details incorporated or not.`,
});

const classifyTaskTypeFlow = ai.defineFlow(
  {
    name: 'classifyTaskTypeFlow',
    inputSchema: ClassifyTaskTypeInputSchema,
    outputSchema: ClassifyTaskTypeOutputSchema,
  },
  async input => {
    const {output} = await classifyTaskTypePrompt(input);
    return output!;
  }
);
