import { config } from 'dotenv';
config();

import '@/ai/flows/classify-task-type.ts';
import '@/ai/flows/categorize-task.ts';
import '@/ai/flows/decompose-large-task.ts';
import '@/ai/flows/estimate-task-duration.ts';
import '@/ai/flows/personalize-task-predictions.ts';