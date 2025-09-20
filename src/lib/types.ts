
export type TaskCategory =
  | 'Strategy & Problem-Solving'
  | 'Creative Production'
  | 'Research & Learning'
  | 'Building & Designing'
  | 'Communication'
  | 'Review & Feedback'
  | 'Organizing & Planning'
  | 'Follow-Ups & Coordination'
  | 'Documentation & Data Entry'
  | 'Scheduling & Calendar'
  | 'File & Tool Maintenance'
  | 'Routine Operations';

export const deepWorkCategories: TaskCategory[] = [
  'Strategy & Problem-Solving',
  'Creative Production',
  'Research & Learning',
  'Building & Designing',
];
export const lightWorkCategories: TaskCategory[] = [
  'Communication',
  'Review & Feedback',
  'Organizing & Planning',
  'Follow-Ups & Coordination',
];
export const adminWorkCategories: TaskCategory[] = [
  'Documentation & Data Entry',
  'Scheduling & Calendar',
  'File & Tool Maintenance',
  'Routine Operations',
];

export const allTaskCategories: TaskCategory[] = [
  ...deepWorkCategories,
  ...lightWorkCategories,
  ...adminWorkCategories,
];


export type TaskType = 'deep' | 'light' | 'admin';
export type TaskDuration = '15-minute' | '30-minute' | '1-hour';

export type Task = {
  id: string;
  description: string;
  category: TaskCategory;
  type: TaskType;
  duration: TaskDuration;
  subTasks?: string[];
  isCompleted: boolean;
};

// For form handling
export type TaskPrediction = {
  category: TaskCategory;
  type: TaskType;
  duration: TaskDuration;
};
