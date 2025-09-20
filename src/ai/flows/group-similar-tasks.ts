'use server';

/**
 * @fileOverview Groups similar tasks into focused work blocks.
 *
 * - groupSimilarTasks - A function that groups tasks.
 * - GroupSimilarTasksInput - The input type for the groupSimilarTasks function.
 * - GroupSimilarTasksOutput - The return type for the groupSimilarTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Helper to convert duration string to minutes
const durationToMinutes = (duration: '15-minute' | '30-minute' | '1-hour') => {
  switch (duration) {
    case '15-minute': return 15;
    case '30-minute': return 30;
    case '1-hour': return 60;
  }
};

const TaskInputSchema = z.object({
    id: z.string(),
    description: z.string(),
    duration: z.enum(['15-minute', '30-minute', '1-hour']),
});

const GroupSimilarTasksInputSchema = z.object({
  tasks: z.array(TaskInputSchema).describe('The list of tasks to group.'),
});
export type GroupSimilarTasksInput = z.infer<typeof GroupSimilarTasksInputSchema>;


const TaskGroupSchema = z.object({
    groupName: z.string().describe('A descriptive name for the group of tasks (e.g., "Communication Block", "Creative Writing Session").'),
    taskIds: z.array(z.string()).describe('An array of task IDs that belong to this group.'),
    totalDuration: z.number().describe('The total duration of the tasks in this group in minutes.'),
});

const GroupSimilarTasksOutputSchema = z.object({
  groupedTasks: z.array(TaskGroupSchema).describe('An array of task groups.'),
});
export type GroupSimilarTasksOutput = z.infer<typeof GroupSimilarTasksOutputSchema>;

export async function groupSimilarTasks(input: GroupSimilarTasksInput): Promise<GroupSimilarTasksOutput> {
  return groupSimilarTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'groupSimilarTasksPrompt',
  input: {schema: GroupSimilarTasksInputSchema},
  output: {schema: GroupSimilarTasksOutputSchema},
  prompt: `You are an expert productivity coach. Your goal is to group tasks into focused work blocks based on their cognitive type.

Analyze the following list of tasks:
{{#each tasks}}
- Task (ID: {{{id}}}): {{{description}}} (Duration: {{{duration}}})
{{/each}}

Group these tasks based on similar mental modes (e.g., all communication-related tasks like emails and messages together, all writing tasks together, all planning tasks together).

Follow these strict rules:
1.  The total duration of all tasks in a single group **MUST NOT** exceed 60 minutes.
2.  If tasks of the same type exceed 60 minutes, create multiple groups (e.g., "Communications Block 1", "Communications Block 2").
3.  Each group must have a descriptive name and a list of the task IDs that belong to it.
4.  Calculate and include the total duration for each group in minutes.
5.  Every task should be assigned to a group. Do not leave any tasks out.
`,
});

const groupSimilarTasksFlow = ai.defineFlow(
  {
    name: 'groupSimilarTasksFlow',
    inputSchema: GroupSimilarTasksInputSchema,
    outputSchema: GroupSimilarTasksOutputSchema,
  },
  async input => {
    if (input.tasks.length === 0) {
      return { groupedTasks: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
