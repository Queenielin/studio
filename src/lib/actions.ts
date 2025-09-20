"use server";

import { categorizeTask as categorizeTaskFlow } from "@/ai/flows/categorize-task";
import { classifyTaskType as classifyTaskTypeFlow } from "@/ai/flows/classify-task-type";
import { decomposeLargeTask as decomposeLargeTaskFlow } from "@/ai/flows/decompose-large-task";
import { personalizeTaskPredictions as personalizeTaskPredictionsFlow } from "@/ai/flows/personalize-task-predictions";
import { groupSimilarTasks as groupSimilarTasksFlow } from "@/ai/flows/group-similar-tasks";

import type { CategorizeTaskInput, CategorizeTaskOutput } from "@/ai/flows/categorize-task";
import type { ClassifyTaskTypeInput, ClassifyTaskTypeOutput } from "@/ai/flows/classify-task-type";
import type { DecomposeLargeTaskInput, DecomposeLargeTaskOutput } from "@/ai/flows/decompose-large-task";
import type { PersonalizeTaskPredictionsInput, PersonalizeTaskPredictionsOutput } from "@/ai/flows/personalize-task-predictions";
import type { GroupSimilarTasksInput, GroupSimilarTasksOutput } from "@/ai/flows/group-similar-tasks";


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

export async function groupSimilarTasks(input: GroupSimilarTasksInput): Promise<GroupSimilarTasksOutput> {
  return await groupSimilarTasksFlow(input);
}
