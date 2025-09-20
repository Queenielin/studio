
"use client";

import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import { TaskIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const { dispatch } = useTasks();

  const handleDelete = () => {
    dispatch({ type: "DELETE_TASK", payload: task.id });
  };
  
  const handleCheckedChange = (checked: boolean) => {
    dispatch({ type: "SET_COMPLETED", payload: { id: task.id, isCompleted: checked } });
  };


  return (
    <Card className={cn("flex flex-col h-full transition-all hover:shadow-md", task.isCompleted && "bg-muted/50")}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2 pt-4 px-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`task-${task.id}`} 
            checked={task.isCompleted}
            onCheckedChange={handleCheckedChange}
            className="mt-1"
          />
          <label htmlFor={`task-${task.id}`} className={cn("font-semibold leading-snug text-sm", task.isCompleted && "line-through text-muted-foreground")}>
            {task.description}
          </label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end px-4 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1.5 font-normal">
                    <TaskIcon duration={task.duration} className="h-3 w-3" />
                    {task.duration}
                </Badge>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
