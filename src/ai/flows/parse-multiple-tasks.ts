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
  prompt: `You are an expert at parsing user input into a list of tasks. The user might provide a single task or multiple tasks in one sentence, separated by commas, newlines, or conjunctions. Each line MUST be treated as a separate task. Identify each distinct task and return it as an item in an array.

For example, if the input is "Buy milk, walk the dog, and write the report", the output should be ["Buy milk", "walk the dog", "write the report"].
If the input is "Prepare presentation", the output should be ["Prepare presentation"].
If the input is "Order groceries\nPlan weekend trip", the output should be ["Order groceries", "Plan weekend trip"].
If the input is "1. First task\n2. Second task", the output should be ["First task", "Second task"].

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
    try {
      const {output} = await prompt(input);
      
      // If the model returns no tasks, use the manual split as a fallback.
      if (!output || !output.tasks || output.tasks.length === 0) {
        throw new Error("AI returned no tasks, using fallback.");
      }

      // **CRITICAL FIX**: If the AI returns a single task that contains newlines, it has failed.
      // Override it and split manually. This is a bulletproof guard against model misinterpretation.
      if (output.tasks.length === 1 && output.tasks[0].includes('\n')) {
        const tasks = output.tasks[0].split('\n').map(t => t.trim()).filter(t => t !== '');
        return { tasks };
      }
      
      return output;
    } catch (e) {
      // Fallback: manually split by newlines. This is a robust failsafe.
      const tasks = input.text.split('\n').map(t => t.trim()).filter(t => t !== '');
      return { tasks };
    }
  }
);
