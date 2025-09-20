// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview Decomposes a large task into smaller sub-tasks using AI.
 *
 * - decomposeLargeTask - A function that decomposes a large task into smaller sub-tasks.
 * - DecomposeLargeTaskInput - The input type for the decomposeLargeTask function.
 * - DecomposeLargeTaskOutput - The return type for the decomposeLargeTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecomposeLargeTaskInputSchema = z.object({
  task: z.string().describe('The large task to decompose.'),
});
export type DecomposeLargeTaskInput = z.infer<typeof DecomposeLargeTaskInputSchema>;

const DecomposeLargeTaskOutputSchema = z.object({
  subTasks: z.array(z.string()).describe('An array of sub-tasks.'),
});
export type DecomposeLargeTaskOutput = z.infer<typeof DecomposeLargeTaskOutputSchema>;

export async function decomposeLargeTask(input: DecomposeLargeTaskInput): Promise<DecomposeLargeTaskOutput> {
  return decomposeLargeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'decomposeLargeTaskPrompt',
  input: {schema: DecomposeLargeTaskInputSchema},
  output: {schema: DecomposeLargeTaskOutputSchema},
  prompt: `You are a task management expert. Your job is to decompose large tasks into smaller, manageable sub-tasks.

Follow these rules:
1. Each sub-task MUST be designed to be completed in a 15-minute, 30-minute, or 1-hour block.
2. If a task naturally takes more than 1 hour, split it into sequential 1-hour sessions (e.g., "Block 1: Outline", "Block 2: Draft Intro").
3. Be specific and give detailed instructions for each subtask.

Task: {{{task}}}

Decompose the task into a list of sub-tasks.
`,
});

const decomposeLargeTaskFlow = ai.defineFlow(
  {
    name: 'decomposeLargeTaskFlow',
    inputSchema: DecomposeLargeTaskInputSchema,
    outputSchema: DecomposeLargeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
