"use client";

import { Task } from "@/lib/types";
import TaskCard from "./task-card";
import { motion, AnimatePresence } from "framer-motion";

type TaskListProps = {
  tasks: Task[];
};

const sortedTasks = (tasks: Task[]) => {
    const typeOrder: Record<string, number> = { 'deep': 1, 'light': 2, 'admin': 3 };
    return tasks.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
}


export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-60">
        <h3 className="text-xl font-semibold tracking-tight">No tasks here</h3>
        <p className="text-sm text-muted-foreground">Add a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence>
        {sortedTasks(tasks).map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
