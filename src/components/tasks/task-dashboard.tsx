"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskType, deepWorkCategories, lightWorkCategories, adminWorkCategories, TaskCategory } from "@/lib/types";
import QuickAddTask from "./quick-add-task";
import { BrainCircuit, Feather, FileText, Users } from "lucide-react";
import TaskList from "./task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { GroupTasksDialog } from "./group-tasks-dialog";
import TaskCategoryColumn from "./task-category-column";

const typeDisplay: Record<TaskType, { title: string; icon: React.ReactNode, categories: TaskCategory[], colorClasses: string[] }> = {
  deep: { 
    title: "Deep Work", 
    icon: <BrainCircuit className="h-5 w-5" />, 
    categories: deepWorkCategories,
    colorClasses: [
      "bg-blue-100/60 border-blue-200/80",
      "bg-sky-100/60 border-sky-200/80",
      "bg-indigo-100/60 border-indigo-200/80",
      "bg-violet-100/60 border-violet-200/80",
    ]
  },
  light: { 
    title: "Light Work", 
    icon: <Feather className="h-5 w-5" />,
    categories: lightWorkCategories,
    colorClasses: [
        "bg-orange-100/60 border-orange-200/80",
        "bg-amber-100/60 border-amber-200/80",
        "bg-lime-100/60 border-lime-200/80",
        "bg-yellow-100/60 border-yellow-200/80",
    ]
  },
  admin: { 
    title: "Admin", 
    icon: <FileText className="h-5 w-5" />,
    categories: adminWorkCategories,
    colorClasses: [
        "bg-green-100/60 border-green-200/80",
        "bg-teal-100/60 border-teal-200/80",
        "bg-emerald-100/60 border-emerald-200/80",
        "bg-cyan-100/60 border-cyan-200/80",
    ]
  },
};


export default function TaskDashboard() {
  const { state } = useTasks();
  const { tasks } = state;
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);

  const todoTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="flex flex-col gap-8">
      <QuickAddTask />

      <Tabs defaultValue="board">
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="board">Kanban Board</TabsTrigger>
                <TabsTrigger value="completed">Completed <Badge variant="secondary" className="ml-2">{completedTasks.length}</Badge></TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => setGroupDialogOpen(true)} disabled={todoTasks.length === 0}>
                <Users className="h-4 w-4 mr-2" />
                Group Tasks
            </Button>
        </div>
        <TabsContent value="board">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {(Object.keys(typeDisplay) as TaskType[]).map(type => (
              <TaskCategoryColumn
                key={type}
                taskType={type}
                title={typeDisplay[type].title}
                icon={typeDisplay[type].icon}
                categories={typeDisplay[type].categories}
                tasks={todoTasks.filter(task => task.type === type)}
                colorClasses={typeDisplay[type].colorClasses}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
           <TaskList tasks={completedTasks} />
        </TabsContent>
      </Tabs>
      <GroupTasksDialog open={isGroupDialogOpen} onOpenChange={setGroupDialogOpen} />
    </div>
  );
}
