
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/hooks/use-tasks";
import {
  TaskCategory,
  TaskDuration,
  TaskType,
  Task,
  allTaskCategories,
  deepWorkCategories,
  lightWorkCategories,
  adminWorkCategories,
} from "@/lib/types";
import { categorizeTask, personalizeTaskPredictions } from "@/lib/actions";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters."),
  category: z.enum(allTaskCategories),
  type: z.enum(['deep', 'light', 'admin']),
  duration: z.enum(['15-minute', '30-minute', '1-hour']),
});

type AddTaskFormProps = {
  setDialogOpen: (open: boolean) => void;
};

export function AddTaskForm({ setDialogOpen }: AddTaskFormProps) {
  const { state, dispatch } = useTasks();
  const [isPredicting, setIsPredicting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const handlePredict = async () => {
    const description = form.getValues("description");
    if (!description || description.length < 3) {
      form.setError("description", {
        type: "manual",
        message: "Please enter a description first.",
      });
      return;
    }

    setIsPredicting(true);
    form.clearErrors();

    try {
      const historicalData = state.tasks.map(t => ({
        taskDescription: t.description,
        taskType: t.type,
        duration: t.duration,
      }));

      const [predictionResult, categoryResult] = await Promise.all([
        personalizeTaskPredictions({ newTaskDescription: description, historicalData }),
        categorizeTask({ description }),
      ]);
      
      if (predictionResult) {
        form.setValue("type", predictionResult.predictedTaskType);
        form.setValue("duration", predictionResult.predictedDuration);
      }

      if (categoryResult) {
        form.setValue("category", categoryResult.category);
        if (deepWorkCategories.includes(categoryResult.category)) {
          form.setValue("type", "deep");
        } else if (lightWorkCategories.includes(categoryResult.category)) {
          form.setValue("type", "light");
        } else {
          form.setValue("type", "admin");
        }
      }

    } catch (error) {
      console.error("AI prediction failed:", error);
      // Fallback to some defaults if AI fails
      form.setValue("category", "Communication");
      form.setValue("type", "light");
      form.setValue("duration", "30-minute");
    } finally {
      setIsPredicting(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTask: Omit<Task, 'id'> = {
      ...values,
      isCompleted: false,
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
    setDialogOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Description</FormLabel>
                <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="e.g., 'Draft the quarterly report'" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handlePredict} disabled={isPredicting} className="shrink-0">
                  {isPredicting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  <span className="sr-only">Predict</span>
                </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          { (form.watch("category") || isPredicting) &&
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <FormLabel className="px-3 py-2 text-xs font-semibold">Deep Work</FormLabel>
                      {deepWorkCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      <FormLabel className="px-3 py-2 text-xs font-semibold">Light Work</FormLabel>
                      {lightWorkCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      <FormLabel className="px-3 py-2 text-xs font-semibold">Admin Work</FormLabel>
                      {adminWorkCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['15-minute', '30-minute', '1-hour'] as TaskDuration[]).map(dur => 
                        <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>}
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit">Save Task</Button>
        </div>
      </form>
    </Form>
  );
}
