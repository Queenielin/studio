"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { AddTaskForm } from "./add-task-form";

type AddTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add New Task</DialogTitle>
          <DialogDescription>
            Describe your task, and let our AI help you categorize and plan it.
          </DialogDescription>
        </DialogHeader>
        <AddTaskForm setDialogOpen={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
