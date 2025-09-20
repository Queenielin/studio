
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

  const processSingleTask = async (taskDesc: string): Promise<Omit<Task, 'id'>> => {
    const historicalData = state.tasks.map((t) => ({
      taskDescription: t.description,
      taskType: t.type,
      duration: t.duration,
    }));

    const [predictionResult, categoryResult] = await Promise.all([
      personalizeTaskPredictions({ newTaskDescription: taskDesc, historicalData }),
      categorizeTask({ description: taskDesc }),
    ]);

    return {
      description: taskDesc,
      category: categoryResult?.category || 'Personal',
      type: predictionResult?.predictedTaskType || 'light',
      duration: predictionResult?.predictedDuration || '30-minute',
      isCompleted: false,
    };
  };

  const handleAddTask = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    setIsAdding(true);
    
    try {
      // Step 1: Always parse the input to get a list of task descriptions.
      const { tasks: taskDescriptions } = await parseMultipleTasks({ text: trimmedInput });

      // Step 2: Process each task description individually using AI.
      const newTasksPromises = taskDescriptions.map(desc => processSingleTask(desc));
      const newTasks = await Promise.all(newTasksPromises);

      // Step 3: Add all newly created tasks to the state.
      if (newTasks.length > 0) {
        dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: newTasks });
      }

      setInputValue("");
    } catch (error) {
      console.error("Failed to process and add tasks:", error);
      // Fallback: Even if AI fails, try to add the tasks by splitting lines.
      const tasks = trimmedInput.split('\n').map(desc => ({
          description: desc,
          category: 'Personal',
          type: 'light',
          duration: '30-minute',
          isCompleted: false,
      } as Omit<Task, 'id'>));
      dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: tasks });
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
          className="pl-10 pr-24"
        />
        <Button onClick={handleAddTask} disabled={isAdding || !inputValue.trim()} className="absolute right-1.5 top-1.5 h-auto py-1.5 px-3 text-xs">
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add Task(s)</span>}
        </Button>
      </div>
    </div>
  );
}
