"use client";

import React, { createContext, useContext, useReducer, ReactNode, useRef } from 'react';
import type { Task, TaskCategory, TaskType, TaskDuration } from '@/lib/types';

type State = {
  tasks: Task[];
};

type Action =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id'> }
  | { type: 'ADD_MULTIPLE_TASKS'; payload: Omit<Task, 'id'>[] }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_COMPLETED'; payload: { id: string; isCompleted: boolean } };

const initialState: State = {
  tasks: [],
};

const TasksContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  generateId: () => string;
} | undefined>(undefined);

function tasksReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK':
      // ID is now generated in the provider, not here directly
      return {
        ...state,
        tasks: [action.payload as Task, ...state.tasks],
      };
    case 'ADD_MULTIPLE_TASKS':
      // IDs are now generated in the provider
      return {
        ...state,
        tasks: [...(action.payload as Task[]), ...state.tasks],
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
  const idCounter = useRef(0);

  const generateId = () => {
    const newId = `task-${idCounter.current++}`;
    return newId;
  };
  
  const enhancedDispatch = (action: Action) => {
    if (action.type === 'ADD_TASK') {
        const newTask = { ...action.payload, id: generateId() };
        dispatch({ type: 'ADD_TASK', payload: newTask });
    } else if (action.type === 'ADD_MULTIPLE_TASKS') {
        const newTasks = action.payload.map(task => ({ ...task, id: generateId() }));
        dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: newTasks });
    }
    else {
        dispatch(action);
    }
  };


  return (
    <TasksContext.Provider value={{ state, dispatch: enhancedDispatch }}>
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
