"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { groupSimilarTasks } from "@/lib/actions";
import type { Task } from "@/lib/types";
import type { GroupSimilarTasksOutput } from "@/ai/flows/group-similar-tasks";
import { Badge } from "../ui/badge";
import { TaskIcon } from "../icons";

type GroupTasksDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GroupTasksDialog({ open, onOpenChange }: GroupTasksDialogProps) {
  const { state } = useTasks();
  const [groupedResult, setGroupedResult] = useState<GroupSimilarTasksOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTaskById = (id: string): Task | undefined => {
    return state.tasks.find(task => task.id === id);
  }

  useEffect(() => {
    if (open) {
      const runGrouping = async () => {
        setIsLoading(true);
        setError(null);
        setGroupedResult(null);

        const tasksToGroup = state.tasks
          .filter(t => !t.isCompleted)
          .map(({ id, description, duration }) => ({ id, description, duration }));
        
        if (tasksToGroup.length === 0) {
            setError("You have no tasks to group.");
            setIsLoading(false);
            return;
        }

        try {
          const result = await groupSimilarTasks({ tasks: tasksToGroup });
          setGroupedResult(result);
        } catch (e) {
          console.error("Failed to group tasks:", e);
          setError("An error occurred while grouping tasks. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      runGrouping();
    }
  }, [open, state.tasks]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Suggested Task Groups</DialogTitle>
          <DialogDescription>
            AI has grouped your tasks into focused work blocks to boost your productivity.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive text-center">{error}</p>}

          {groupedResult && groupedResult.groupedTasks.map((group, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <h3 className="font-semibold text-lg flex justify-between">
                {group.groupName}
                <Badge variant="secondary">{group.totalDuration} min</Badge>
              </h3>
              <ul className="mt-3 space-y-2">
                {group.taskIds.map(taskId => {
                    const task = getTaskById(taskId);
                    if (!task) return null;
                    return (
                        <li key={taskId} className="text-sm p-2 rounded-md bg-muted/50 flex items-start gap-3">
                           <TaskIcon category={task.category} className="h-4 w-4 mt-0.5 shrink-0" />
                           <span>{task.description}</span>
                        </li>
                    )
                })}
              </ul>
            </div>
          ))}
          {groupedResult && groupedResult.groupedTasks.length === 0 && !error && (
            <p className="text-muted-foreground text-center">No task groups could be created.</p>
          )}

        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
