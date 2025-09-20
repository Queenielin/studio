'use server';

/**
 * @fileOverview An AI agent for estimating the duration of tasks.
 *
 * - estimateTaskDuration - A function that estimates the duration of a task.
 * - EstimateTaskDurationInput - The input type for the estimateTaskDuration function.
 * - EstimateTaskDurationOutput - The return type for the estimateTaskDuration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateTaskDurationInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which to estimate the duration.'),
});
export type EstimateTaskDurationInput = z.infer<typeof EstimateTaskDurationInputSchema>;

const EstimateTaskDurationOutputSchema = z.object({
  estimatedDuration: z
    .enum(['15-minute', '30-minute', '1-hour'])
    .describe('The estimated duration of the task in blocks of 15 minutes, 30 minutes, or 1 hour.'),
});
export type EstimateTaskDurationOutput = z.infer<typeof EstimateTaskDurationOutputSchema>;

export async function estimateTaskDuration(input: EstimateTaskDurationInput): Promise<EstimateTaskDurationOutput> {
  return estimateTaskDurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateTaskDurationPrompt',
  input: {schema: EstimateTaskDurationInputSchema},
  output: {schema: EstimateTaskDurationOutputSchema},
  prompt: `You are an expert in time management and task planning.

You will estimate the duration of a given task based on its description. You will categorize the duration into one of the following blocks: 15-minute, 30-minute, or 1-hour.

Task Description: {{{taskDescription}}}

Estimated Duration:`,
});

const estimateTaskDurationFlow = ai.defineFlow(
  {
    name: 'estimateTaskDurationFlow',
    inputSchema: EstimateTaskDurationInputSchema,
    outputSchema: EstimateTaskDurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
