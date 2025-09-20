
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { categorizeTask, personalizeTaskPredictions, parseMultipleTasks } from "@/lib/actions";

export default function QuickAddTask() {
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { state, dispatch } = useTasks();

  const handleAddTask = async () => {
    if (!inputValue.trim()) return;

    setIsAdding(true);
    try {
      const { tasks: parsedTasks } = await parseMultipleTasks({ text: inputValue });
      
      const newTasks = await Promise.all(parsedTasks.map(async (taskDesc) => {
        const historicalData = state.tasks.map(t => ({
          taskDescription: t.description,
          taskType: t.type,
          duration: t.duration,
        }));

        const [predictionResult, categoryResult] = await Promise.all([
          personalizeTaskPredictions({ newTaskDescription: taskDesc, historicalData }),
          categorizeTask({ description: taskDesc }),
        ]);

        return {
          id: new Date().getTime().toString() + Math.random(),
          description: taskDesc,
          category: categoryResult?.category || 'Personal',
          type: predictionResult?.predictedTaskType || 'light',
          duration: predictionResult?.predictedDuration || '30-minute',
          isCompleted: false,
        };
      }));

      dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: newTasks });
      setInputValue("");
    } catch (error) {
      console.error("Failed to add task(s):", error);
      // Basic fallback: add the raw input as a single task
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: new Date().getTime().toString(),
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="relative">
      <div className="flex w-full items-center space-x-2">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Type a new task... or multiple. AI will handle it."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAdding}
          className="pl-10 pr-24"
        />
        <Button onClick={handleAddTask} disabled={isAdding || !inputValue.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add Task</span>}
        </Button>
      </div>
    </div>
  );
}
