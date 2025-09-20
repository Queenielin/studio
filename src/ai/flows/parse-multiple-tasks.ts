'use server';

/**
 * @fileOverview Parses a single string containing multiple tasks into a list of individual task descriptions.
 *
 * - parseMultipleTasks - A function that handles parsing the tasks.
 * - ParseMultipleTasksInput - The input type for the parseMultipleTasks function.
 * - ParseMultipleTasksOutput - The return type for the parseMultipleTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseMultipleTasksInputSchema = z.object({
  text: z.string().describe('The text input which may contain one or more tasks.'),
});
export type ParseMultipleTasksInput = z.infer<typeof ParseMultipleTasksInputSchema>;

const ParseMultipleTasksOutputSchema = z.object({
  tasks: z.array(z.string()).describe('An array of individual task descriptions.'),
});
export type ParseMultipleTasksOutput = z.infer<typeof ParseMultipleTasksOutputSchema>;

export async function parseMultipleTasks(input: ParseMultipleTasksInput): Promise<ParseMultipleTasksOutput> {
  return parseMultipleTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseMultipleTasksPrompt',
  input: {schema: ParseMultipleTasksInputSchema},
  output: {schema: ParseMultipleTasksOutputSchema},
  prompt: `You are an expert at parsing user input into a list of tasks. The user might provide a single task or multiple tasks in one sentence, separated by commas, newlines, or conjunctions. Identify each distinct task and return it as an item in an array.

For example, if the input is "Buy milk, walk the dog, and write the report", the output should be ["Buy milk", "walk the dog", "write the report"].
If the input is "Prepare presentation", the output should be ["Prepare presentation"].

User input: {{{text}}}
`,
});

const parseMultipleTasksFlow = ai.defineFlow(
  {
    name: 'parseMultipleTasksFlow',
    inputSchema: ParseMultipleTasksInputSchema,
    outputSchema: ParseMultipleTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // If only one task is identified, the model might not return it as an array.
    // Also if the model returns an empty list for some reason, just assume the input was the task.
    if (!output || !output.tasks || output.tasks.length === 0) {
      return { tasks: [input.text] };
    }
    return output;
  }
);
