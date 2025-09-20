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
  prompt: `You are an expert in time management and task planning. Your job is to estimate the duration of a task based on the provided framework.

AI Duration Categorization Framework:
Principle: Duration depends on complexity, preparation, and cognitive load.

1.  **15-Minute Tasks | Quick × Low Complexity × High Context-Switch Tolerance**
    *   **Definition**: Small, atomic tasks that can be completed in one go with little prep. Usually administrative or simple execution.
    *   **Examples**:
        *   Replying to 3–5 emails
        *   Quick calendar reschedule
        *   Sending a reminder or follow-up message
        *   Reviewing a short document for typos
        *   Entering data into a tracker

2.  **30-Minute Tasks | Medium Depth × Moderate Focus × Self-Contained**
    *   **Definition**: Work that requires moderate focus, can be finished in one sitting, but is too big for 15 minutes. Often involves a small deliverable.
    *   **Examples**:
        *   Drafting a LinkedIn post or short update
        *   Creating 2–3 presentation slides
        *   Reviewing and commenting on a short proposal
        *   Testing a software feature
        *   Writing meeting notes into a clean summary

3.  **1-Hour Tasks | Deep × High Focus × Complex Output**
    *   **Definition**: Requires sustained deep focus, usually produces a tangible output or handles multiple connected subtasks. Often creative, strategic, or analytical.
    *   **Examples**:
        *   Writing a 2–3 page report section
        *   Coding a feature or debugging a workflow
        *   Designing a product flow in Figma
        *   Conducting research and synthesizing notes
        *   Preparing a client strategy presentation

Based on this framework, estimate the duration for the following task. Fit it into a 15, 30, or 60 minute bucket.

Task Description: {{{taskDescription}}}`,
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
