// src/ai/flows/personalize-task-predictions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for personalizing task predictions based on user history.
 *
 * - personalizeTaskPredictions - The main function to personalize task predictions.
 * - PersonalizeTaskPredictionsInput - The input type for the personalizeTaskPredictions function.
 * - PersonalizeTaskPredictionsOutput - The output type for the personalizeTaskPredictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const PersonalizeTaskPredictionsInputSchema = z.object({
  historicalData: z.array(
    z.object({
      taskDescription: z.string(),
      taskType: z.enum(['deep', 'light', 'admin']),
      duration: z.enum(['15-minute', '30-minute', '1-hour']),
    })
  ).describe('Historical task data for the user.'),
  newTaskDescription: z.string().describe('Description of the new task to predict.'),
});
export type PersonalizeTaskPredictionsInput = z.infer<typeof PersonalizeTaskPredictionsInputSchema>;

// Define the output schema
const PersonalizeTaskPredictionsOutputSchema = z.object({
  predictedTaskType: z.enum(['deep', 'light', 'admin']).describe('Predicted task type.'),
  predictedDuration: z.enum(['15-minute', '30-minute', '1-hour']).describe('Predicted task duration.'),
});
export type PersonalizeTaskPredictionsOutput = z.infer<typeof PersonalizeTaskPredictionsOutputSchema>;

// Exported function to call the flow
export async function personalizeTaskPredictions(input: PersonalizeTaskPredictionsInput): Promise<PersonalizeTaskPredictionsOutput> {
  return personalizeTaskPredictionsFlow(input);
}

// Define the prompt
const personalizeTaskPredictionsPrompt = ai.definePrompt({
  name: 'personalizeTaskPredictionsPrompt',
  input: {
    schema: PersonalizeTaskPredictionsInputSchema,
  },
  output: {
    schema: PersonalizeTaskPredictionsOutputSchema,
  },
  prompt: `Based on the following historical task data from the user:

  {{#each historicalData}}
  - Task: {{{taskDescription}}}, Type: {{{taskType}}}, Duration: {{{duration}}}
  {{/each}}

  Predict the task type (deep, light, or admin) and duration (15-minute, 30-minute, or 1-hour) for the new task: {{{newTaskDescription}}}.

  Consider the patterns in the user's task history to provide the most accurate prediction.
  Ensure that the outputted predictedTaskType and predictedDuration is one of the enum values.
  `,
});

// Define the flow
const personalizeTaskPredictionsFlow = ai.defineFlow(
  {
    name: 'personalizeTaskPredictionsFlow',
    inputSchema: PersonalizeTaskPredictionsInputSchema,
    outputSchema: PersonalizeTaskPredictionsOutputSchema,
  },
  async input => {
    const {output} = await personalizeTaskPredictionsPrompt(input);
    return output!;
  }
);
