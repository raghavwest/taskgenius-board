
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTaskManagement } from "./TaskManagementProvider";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export function ReusableComponents() {
  const [taskDescription, setTaskDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { findReusableComponents } = useTaskManagement();
  const [results, setResults] = useState<Array<{
    ticket_id: string;
    relevance_score: number;
    adaptation_notes: string;
    ticket_details?: any;
  }>>([]);
  const { toast } = useToast();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;
    
    setIsSearching(true);
    try {
      const reusableComponents = await findReusableComponents(taskDescription);
      setResults(reusableComponents);
      
      if (reusableComponents.length === 0) {
        toast({
          title: "No reusable components found",
          description: "Try a different description or create more tasks",
        });
      }
    } catch (error) {
      console.error("Error finding reusable components:", error);
      toast({
        title: "Error searching",
        description: "There was an error searching for reusable components. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="glass p-6 rounded-lg mb-6 animate-fade-in">
        <h2 className="text-xl font-medium mb-3">Find Reusable Work</h2>
        <p className="text-muted-foreground mb-6">
          Enter a description of your new task to find similar past work that could be reused.
        </p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe your new task here..."
            className="min-h-[100px] bg-background/50 border-muted"
          />
          
          <Button 
            type="submit"
            disabled={isSearching || !taskDescription.trim()}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Reusable Components
              </>
            )}
          </Button>
        </form>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-medium px-2">Search Results</h3>
          
          {results.map((result, index) => (
            <div 
              key={index}
              className="glass p-4 rounded-lg animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  {result.ticket_details?.title || `Ticket ${result.ticket_id}`}
                </h4>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  result.relevance_score >= 8 ? "bg-green-500/20 text-green-400" :
                  result.relevance_score >= 6 ? "bg-blue-500/20 text-blue-400" :
                  "bg-yellow-500/20 text-yellow-400"
                )}>
                  Relevance: {result.relevance_score}/10
                </div>
              </div>
              
              <Separator className="my-3 bg-muted/50" />
              
              <div className="text-sm text-muted-foreground">
                <h5 className="font-medium text-foreground mb-1">Adaptation Notes:</h5>
                <p>{result.adaptation_notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {taskDescription && results.length === 0 && !isSearching && (
        <div className="glass-lighter p-6 rounded-lg text-center animate-fade-in">
          <div className="text-lg mb-2">No reusable components found</div>
          <p className="text-muted-foreground mb-4">
            Try a different description or create more tasks first
          </p>
          <Button
            variant="outline"
            onClick={() => setTaskDescription("")}
            className="border-muted bg-background/50 hover:bg-muted/20"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
