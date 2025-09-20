
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { categorizeTask, personalizeTaskPredictions, parseMultipleTasks } from "@/lib/actions";
import { Task } from "@/lib/types";

export default function QuickAddTask() {
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { state, dispatch } = useTasks();

  const handleAddTask = async () => {
    if (!inputValue.trim()) return;

    setIsAdding(true);
    try {
      const { tasks: parsedTasks } = await parseMultipleTasks({ text: inputValue });

      if (parsedTasks && parsedTasks.length > 0) {
        const newTasks = await Promise.all(
          parsedTasks.map(async (taskDesc, index) => {
            const historicalData = state.tasks.map((t) => ({
              taskDescription: t.description,
              taskType: t.type,
              duration: t.duration,
            }));
    
            const [predictionResult, categoryResult] = await Promise.all([
              personalizeTaskPredictions({ newTaskDescription: taskDesc, historicalData }),
              categorizeTask({ description: taskDesc }),
            ]);
    
            const newTask: Omit<Task, 'id'> = {
              description: taskDesc,
              category: categoryResult?.category || 'Personal',
              type: predictionResult?.predictedTaskType || 'light',
              duration: predictionResult?.predictedDuration || '30-minute',
              isCompleted: false,
            };
            return newTask;
          })
        );
        dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: newTasks });
      } else {
        // Fallback for single task if parsing fails
        const taskDesc = inputValue;
        const historicalData = state.tasks.map((t) => ({
          taskDescription: t.description,
          taskType: t.type,
          duration: t.duration,
        }));
        const [predictionResult, categoryResult] = await Promise.all([
          personalizeTaskPredictions({ newTaskDescription: taskDesc, historicalData }),
          categorizeTask({ description: taskDesc }),
        ]);
        const newTask: Omit<Task, 'id'> = {
          description: taskDesc,
          category: categoryResult?.category || 'Personal',
          type: predictionResult?.predictedTaskType || 'light',
          duration: predictionResult?.predictedDuration || '30-minute',
          isCompleted: false,
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
      }

      setInputValue("");
    } catch (error) {
      console.error("Failed to add task(s):", error);
      // Basic fallback: add the raw input as a single task
      dispatch({
        type: 'ADD_TASK',
        payload: {
          description: inputValue,
          category: 'Personal',
          type: 'light',
          duration: '30-minute',
          isCompleted: false,
        }
      });
      setInputValue("");
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="relative">
      <div className="flex w-full items-center space-x-2">
        <Sparkles className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Textarea
          placeholder="Type one or more tasks (one per line)... then press Ctrl+Enter to add."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAdding}
          className="pl-10 pr-24 resize-none"
          rows={1}
        />
        <Button onClick={handleAddTask} disabled={isAdding || !inputValue.trim()} className="absolute right-1 top-1.5 h-8">
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add</span>}
        </Button>
      </div>
    </div>
  );
}
