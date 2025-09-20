"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskCategory, TaskType } from "@/lib/types";
import TaskColumn from "./task-column";
import QuickAddTask from "./quick-add-task";
import { BrainCircuit, Feather, FileText, Users } from "lucide-react";
import TaskList from "./task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { GroupTasksDialog } from "./group-tasks-dialog";

const taskTypes: TaskType[] = ['deep', 'light', 'admin'];

const typeDisplay: Record<TaskType, { title: string; icon: React.ReactNode }> = {
  deep: { title: "Deep Work", icon: <BrainCircuit className="h-5 w-5" /> },
  light: { title: "Light Work", icon: <Feather className="h-5 w-5" /> },
  admin: { title: "Admin", icon: <FileText className="h-5 w-5" /> },
};


export default function TaskDashboard() {
  const { state } = useTasks();
  const { tasks } = state;
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);

  const todoTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const getTasksByType = (type: TaskType) => todoTasks.filter(task => task.type === type);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {taskTypes.map(type => (
              <TaskColumn
                key={type}
                title={typeDisplay[type].title}
                icon={typeDisplay[type].icon}
                tasks={getTasksByType(type)}
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
