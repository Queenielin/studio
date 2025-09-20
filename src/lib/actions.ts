"use server";

import { categorizeTask as categorizeTaskFlow } from "@/ai/flows/categorize-task";
import { classifyTaskType as classifyTaskTypeFlow } from "@/ai/flows/classify-task-type";
import { decomposeLargeTask as decomposeLargeTaskFlow } from "@/ai/flows/decompose-large-task";
import { personalizeTaskPredictions as personalizeTaskPredictionsFlow } from "@/ai/flows/personalize-task-predictions";
// The parseMultipleTasks flow is no longer needed as parsing is handled manually.

import type { CategorizeTaskInput, CategorizeTaskOutput } from "@/ai/flows/categorize-task";
import type { ClassifyTaskTypeInput, ClassifyTaskTypeOutput } from "@/ai/flows/classify-task-type";
import type { DecomposeLargeTaskInput, DecomposeLargeTaskOutput } from "@/ai/flows/decompose-large-task";
import type { PersonalizeTaskPredictionsInput, PersonalizeTaskPredictionsOutput } from "@/ai/flows/personalize-task-predictions";


export async function categorizeTask(input: CategorizeTaskInput): Promise<CategorizeTaskOutput> {
  return await categorizeTaskFlow(input);
}

export async function classifyTaskType(input: ClassifyTaskTypeInput): Promise<ClassifyTaskTypeOutput> {
  return await classifyTaskTypeFlow(input);
}

export async function decomposeLargeTask(input: DecomposeLargeTaskInput): Promise<DecomposeLargeTaskOutput> {
  return await decomposeLargeTaskFlow(input);
}

export async function personalizeTaskPredictions(input: PersonalizeTaskPredictionsInput): Promise<PersonalizeTaskPredictionsOutput> {
  return await personalizeTaskPredictionsFlow(input);
}
