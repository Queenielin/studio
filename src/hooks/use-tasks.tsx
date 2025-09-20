"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task, TaskCategory, TaskType, TaskDuration } from '@/lib/types';

type State = {
  tasks: Task[];
};

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_COMPLETED'; payload: { id: string; isCompleted: boolean } };

const initialState: State = {
  tasks: [
    { id: '1', description: 'Plan Q3 marketing campaign', category: 'Work', type: 'deep', duration: '1-hour', isCompleted: false },
    { id: '2', description: 'Review and approve team expenses', category: 'Work', type: 'admin', duration: '30-minute', isCompleted: false },
    { id: '3', description: 'Book dentist appointment', category: 'Personal', type: 'admin', duration: '15-minute', isCompleted: true },
    { id: '4', description: 'Brainstorm ideas for new blog post', category: 'Personal', type: 'light', duration: '30-minute', isCompleted: false },
    { id: '5', description: 'Buy groceries for the week', category: 'Household', type: 'light', duration: '1-hour', isCompleted: false },
    { id: '6', description: 'Pick up dry cleaning', category: 'Errand', type: 'admin', duration: '15-minute', isCompleted: false },
  ],
};

const TasksContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function tasksReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'SET_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, isCompleted: action.payload.isCompleted }
            : task
        ),
      };
    default:
      return state;
  }
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
