
"use client";

import { Task, TaskCategory, TaskType } from "@/lib/types";
import TaskCategoryBox from "./task-category-box";

type TaskCategoryColumnProps = {
  taskType: TaskType;
  title: string;
  icon: React.ReactNode;
  categories: TaskCategory[];
  tasks: Task[];
  colorClass: string;
};

export default function TaskCategoryColumn({ title, icon, categories, tasks, colorClass }: TaskCategoryColumnProps) {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 px-2">
        <div className="text-primary">{icon}</div>
        <h2 className="text-lg font-semibold font-headline">{title}</h2>
        <span className="ml-auto text-sm font-medium text-muted-foreground bg-background rounded-full px-2.5 py-0.5">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map(category => (
            <TaskCategoryBox 
                key={category} 
                category={category} 
                tasks={tasks.filter(t => t.category === category)} 
                colorClass={colorClass}
            />
        ))}
      </div>
    </div>
  );
}
