
"use client";

import { Task, TaskCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import TaskCard from "./task-card";

type TaskCategoryBoxProps = {
  category: TaskCategory;
  tasks: Task[];
  colorClass: string;
};

export default function TaskCategoryBox({ category, tasks, colorClass }: TaskCategoryBoxProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg p-3 min-h-[150px] border", colorClass)}>
      <h3 className="font-semibold text-sm text-muted-foreground px-1">{category}</h3>
      
      {tasks.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center text-xs text-muted-foreground/70 p-4">
            <p>No tasks</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
