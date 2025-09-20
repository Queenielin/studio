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
  prompt: `You are an AI task classifier. Your goal is to classify a task into one of three categories: Deep Work, Light Work, or Admin Work.

Here are the definitions:

1.  **Deep Work | Focused × High-Value × Cognitively Demanding**
    *   **Definition**: Work that requires full concentration, no distractions, and produces high-value output through problem-solving, creativity, or analysis. Interruptions reduce quality significantly.
    *   **Examples**: Writing code for a feature or algorithm, designing a product roadmap, preparing a research report or client strategy deck, studying for an exam or learning a new technical concept, writing a long-form article, story, or proposal.
    *   **Rule**: If the task needs uninterrupted focus + creates high-value output → **deep**.

2.  **Light Work | Execution × Low-Depth × Medium Value**
    *   **Definition**: Work that requires some focus, but not deep concentration; tasks are less cognitively intense, more routine, or involve applying existing knowledge rather than creating new insights. Can usually be paused/resumed easily.
    *   **Examples**: Replying to simple emails or Slack messages, formatting slides or documents, scheduling posts or updating dashboards, reviewing work for typos or clarity, testing software features with a checklist.
    *   **Rule**: If it’s routine execution + some focus → **light**.

3.  **Admin Work | Maintenance × Low Cognitive Demand × Organizational**
    *   **Definition**: Necessary support and maintenance tasks that keep systems, teams, or logistics running, but don’t directly produce high-value creative/strategic output. Usually repetitive, low-focus, or operational.
    *   **Examples**: Filling expense reports or timesheets, calendar scheduling, booking meetings, uploading files, renaming, organizing folders, updating CRM or task trackers, routine data entry or form filling.
    *   **Rule**: If it’s supportive, repetitive, logistical → **admin**.

Based on these definitions, classify the following task.

Task Description: {{{taskDescription}}}

Provide your reasoning for the classification.`,
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
