
"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { categorizeTask, personalizeTaskPredictions } from "@/lib/actions";
import { Task, deepWorkCategories, lightWorkCategories } from "@/lib/types";

export default function QuickAddTask() {
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { state, dispatch } = useTasks();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processSingleTask = async (taskDesc: string): Promise<Omit<Task, 'id'>> => {
    const historicalData = state.tasks.map((t) => ({
      taskDescription: t.description,
      taskType: t.type,
      duration: t.duration,
    }));

    // Use AI to enrich each individual task description
    const [predictionResult, categoryResult] = await Promise.all([
      personalizeTaskPredictions({ newTaskDescription: taskDesc, historicalData }),
      categorizeTask({ description: taskDesc }),
    ]);
    
    let taskType: 'deep' | 'light' | 'admin' = predictionResult?.predictedTaskType || 'light';
    if(categoryResult?.category) {
        if(deepWorkCategories.includes(categoryResult.category)) taskType = 'deep';
        else if (lightWorkCategories.includes(categoryResult.category)) taskType = 'light';
        else taskType = 'admin';
    }


    return {
      description: taskDesc,
      category: categoryResult?.category || 'Communication',
      type: taskType,
      duration: predictionResult?.predictedDuration || '30-minute',
      isCompleted: false,
    };
  };

  const handleAddTask = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    setIsAdding(true);
    
    try {
      const taskDescriptions = trimmedInput.split('\n').filter(line => line.trim() !== '');

      // Process each description individually.
      const newTasksPromises = taskDescriptions.map(desc => processSingleTask(desc));
      const newTasks = await Promise.all(newTasksPromises);

      if (newTasks.length > 0) {
        dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: newTasks });
      }
      
      setInputValue(""); // Clear the input after adding

    } catch (error) {
      console.error("Failed to process and add tasks:", error);
      // Fallback: Add tasks without AI enrichment if processing fails.
      const tasks = trimmedInput.split('\n').filter(line => line.trim() !== '').map(desc => ({
          description: desc,
          category: 'Communication',
          type: 'light',
          duration: '30-minute',
          isCompleted: false,
      } as Omit<Task, 'id'>));
      dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: tasks });
      setInputValue(""); // Also clear on error
    } finally {
      setIsAdding(false);
      // Refocus the textarea
      textareaRef.current?.focus();
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
          ref={textareaRef}
          placeholder="Type one or more tasks (one per line)... then press Ctrl+Enter to add."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAdding}
          className="pl-10 pr-24"
        />
        <Button onClick={handleAddTask} disabled={isAdding || !inputValue.trim()} className="absolute right-1.5 top-1.5 h-auto py-1.5 px-3 text-xs">
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add Task(s)</span>}
        </Button>
      </div>
    </div>
  );
}
