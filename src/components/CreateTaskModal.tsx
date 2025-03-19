
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useTaskManagement } from "./TaskManagementProvider";
import { useToast } from "@/components/ui/use-toast";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTask, generateTickets } = useTaskManagement();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newTask = await createTask(title, description);
      await generateTickets(newTask.id);
      
      toast({
        title: "Task created",
        description: "Your task has been created and broken down into tickets",
      });
      
      // Reset form and close
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-darker sm:max-w-[500px] border border-white/10">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>
            Add a new task to be broken down into smaller tickets by AI.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Build a company website"
              className="bg-background/50 border-muted"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Create a modern website for our startup with about, services, and contact pages."
              className="min-h-[100px] bg-background/50 border-muted"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-muted bg-transparent hover:bg-muted/20"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title.trim()} 
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
