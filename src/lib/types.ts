export type TaskCategory = 'Work' | 'Personal' | 'Household' | 'Errand' | 'Other';
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
