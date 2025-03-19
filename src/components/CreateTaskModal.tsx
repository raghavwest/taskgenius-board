
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, CheckCircle } from "lucide-react";
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
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);
  const [step, setStep] = useState<"create" | "breakdown">("create");
  
  const { createTask, generateTickets, isGeneratingTickets, geminiApiKey } = useTaskManagement();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newTask = await createTask(title, description);
      setCreatedTaskId(newTask.id);
      
      // Only show breakdown step if API key is available
      if (geminiApiKey) {
        setStep("breakdown");
        toast({
          title: "Task created",
          description: "Now let's break it down into smaller tickets",
        });
      } else {
        // If no API key, just close the modal and show success message
        toast({
          title: "Task created successfully",
          description: "Your task has been added to the board",
        });
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateTickets = async () => {
    if (!createdTaskId) return;
    
    try {
      await generateTickets(createdTaskId);
      // Reset the form and close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error generating tickets:", error);
      toast({
        title: "Error breaking down task",
        description: "There was an error generating tickets. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Task added",
      description: "Your task has been added without AI breakdown",
    });
    handleCloseModal();
  };
  
  const handleCloseModal = () => {
    // Reset state and close modal
    setTitle("");
    setDescription("");
    setCreatedTaskId(null);
    setStep("create");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="glass-darker sm:max-w-[500px] border border-white/10">
        {step === "create" ? (
          <>
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
                  onClick={handleCloseModal}
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Break Down Task</DialogTitle>
              <DialogDescription>
                Let AI break down your task into smaller, manageable tickets.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg border border-muted/50">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">AI Task Breakdown</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {!geminiApiKey ? (
                        "You need to set your Gemini API key to enable AI-powered task breakdown."
                      ) : (
                        "AI will analyze your task and break it down into smaller, manageable tickets. This helps organize work and track progress."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="border-muted bg-transparent hover:bg-muted/20"
              >
                Skip
              </Button>
              <Button 
                onClick={handleGenerateTickets}
                disabled={isGeneratingTickets || !geminiApiKey} 
                className="bg-primary hover:bg-primary/90"
              >
                {isGeneratingTickets ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Breaking down task...
                  </>
                ) : (
                  "Break Down Task"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
