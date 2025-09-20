"use client";

import { Task, TaskCategory } from "@/lib/types";
import { TaskIcon } from "../icons";
import TaskCard from "./task-card";

type TaskColumnProps = {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
};

const categories: TaskCategory[] = ['Work', 'Personal', 'Household', 'Errand', 'Other'];

export default function TaskColumn({ title, icon, tasks }: TaskColumnProps) {

  const tasksByCategory: { [key in TaskCategory]?: Task[] } = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category]!.push(task);
    return acc;
  }, {} as { [key in TaskCategory]?: Task[] });

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-muted/30 p-4 min-h-[300px]">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <h2 className="text-lg font-semibold font-headline">{title}</h2>
        <span className="ml-auto text-sm font-medium text-muted-foreground bg-background rounded-full px-2.5 py-0.5">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center text-sm text-muted-foreground p-8">
            <p>No {title.toLowerCase()} tasks yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
        {categories.map(category => {
          const categoryTasks = tasksByCategory[category];
          if (!categoryTasks || categoryTasks.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground ml-1">
                <TaskIcon category={category} className="h-3.5 w-3.5" />
                <span>{category.toUpperCase()}</span>
              </div>
              <div className="flex flex-col gap-4">
                {categoryTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  );
}
