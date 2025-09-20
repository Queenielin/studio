"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppHeader() {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold font-headline md:text-xl">Dashboard</h1>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setAddTaskOpen(true)} size={isMobile ? "icon" : "default"}>
            <PlusCircle className="h-4 w-4" />
            {isMobile ? null : <span className="ml-2">Add Task</span>}
          </Button>
        </div>
      </header>
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setAddTaskOpen} />
    </>
  );
}
