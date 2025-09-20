"use client";

import { useState } from "react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BrainCircuit, Home, Cog, Scissors, Lightbulb, FolderKanban } from "lucide-react";
import { AIToolsDialog } from "@/components/tools/ai-tools-dialog";

export default function AppSidebar() {
  const [activeTool, setActiveTool] = useState<"classifier" | "decomposer" | null>(null);

  const openTool = (tool: "classifier" | "decomposer") => {
    setActiveTool(tool);
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-primary-dark">
            TaskWise
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => openTool("classifier")}>
                <Lightbulb />
                <span>Task Classifier</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => openTool("decomposer")}>
                <Scissors />
                <span>Task Decomposer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <AIToolsDialog activeTool={activeTool} setActiveTool={setActiveTool} />
    </>
  );
}
