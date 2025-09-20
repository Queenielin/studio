"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { classifyTaskType, decomposeLargeTask } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

type AIToolsDialogProps = {
  activeTool: 'classifier' | 'decomposer' | null;
  setActiveTool: (tool: 'classifier' | 'decomposer' | null) => void;
};

export function AIToolsDialog({ activeTool, setActiveTool }: AIToolsDialogProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTool = async () => {
    if (!input) return;
    setIsLoading(true);
    setResult(null);
    try {
      if (activeTool === 'classifier') {
        const res = await classifyTaskType({ taskDescription: input });
        setResult(res);
      } else if (activeTool === 'decomposer') {
        const res = await decomposeLargeTask({ task: input });
        setResult(res);
      }
    } catch (error) {
      console.error('AI tool failed:', error);
      setResult({ error: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTool(null);
    setInput('');
    setResult(null);
  }

  const isClassifier = activeTool === 'classifier';
  const title = isClassifier ? 'AI Task Classifier' : 'AI Task Decomposer';
  const description = isClassifier
    ? "Classify tasks into 'deep', 'light', and 'admin' work categories."
    : 'Decompose a large task into smaller, manageable sub-tasks.';

  return (
    <Dialog open={!!activeTool} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter a task description here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
        </div>

        {result && (
          <Card>
            <CardContent className="p-4">
              {result.error && <p className="text-destructive">{result.error}</p>}
              {isClassifier && result.taskType && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Classification Result:</h4>
                  <p><strong>Type:</strong> <Badge variant="secondary">{result.taskType}</Badge></p>
                  <p className="text-sm"><strong>Reasoning:</strong> {result.reasoning}</p>
                </div>
              )}
              {!isClassifier && result.subTasks && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Sub-tasks:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.subTasks.map((subtask: string, index: number) => (
                      <li key={index}>{subtask}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Close</Button>
          <Button onClick={handleRunTool} disabled={isLoading || !input}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isClassifier ? 'Classify Task' : 'Decompose Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
