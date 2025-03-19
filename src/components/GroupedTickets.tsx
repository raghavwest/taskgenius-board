
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskManagement } from "./TaskManagementProvider";
import { TaskCard } from "./TaskCard";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, HelpCircle, RefreshCw } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export function GroupedTickets() {
  const { groupedTickets, groupTickets, getCompletionStrategy, updateTicketStatus } = useTaskManagement();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [completionStrategy, setCompletionStrategy] = useState<string | null>(null);
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (Object.keys(groupedTickets).length === 0) {
      handleGroupTickets();
    }
  }, []);
  
  const handleGroupTickets = async () => {
    setIsLoadingGroups(true);
    try {
      await groupTickets();
    } catch (error) {
      console.error("Error grouping tickets:", error);
      toast({
        title: "Error grouping tickets",
        description: "There was an error grouping your tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };
  
  const handleGetCompletionStrategy = async (group: string) => {
    setIsLoadingStrategy(true);
    try {
      const strategy = await getCompletionStrategy(group);
      setCompletionStrategy(strategy);
    } catch (error) {
      console.error("Error getting completion strategy:", error);
      toast({
        title: "Error getting strategy",
        description: "There was an error getting the completion strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStrategy(false);
    }
  };
  
  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketStatus(ticketId, newStatus);
  };

  if (Object.keys(groupedTickets).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] mt-4">
        <div className="glass rounded-xl p-8 max-w-md text-center">
          <h3 className="text-xl font-medium mb-3">No grouped tickets yet</h3>
          <p className="text-muted-foreground mb-6">
            Create tasks and generate tickets to see them grouped by similarity.
          </p>
          <Button 
            onClick={handleGroupTickets}
            disabled={isLoadingGroups}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoadingGroups ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Grouping tickets...
              </>
            ) : (
              "Refresh Groups"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (selectedGroup) {
    const groupTickets = groupedTickets[selectedGroup] || [];
    
    return (
      <div className="w-full max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center mb-6 gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedGroup(null);
              setCompletionStrategy(null);
            }}
            className="border-muted bg-background/50 hover:bg-muted/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          
          <h2 className="text-xl font-medium">Group: {selectedGroup}</h2>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleGetCompletionStrategy(selectedGroup)}
                  disabled={isLoadingStrategy}
                  className="ml-auto border-muted bg-background/50 hover:bg-muted/20"
                >
                  {isLoadingStrategy ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get AI suggestions on how to complete these tickets efficiently</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {completionStrategy && (
          <div className="glass mb-6 p-4 rounded-lg animate-scale-in">
            <h3 className="font-medium mb-2">Completion Strategy</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {completionStrategy}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {groupTickets.map((ticket, index) => (
            <div key={ticket.id} className="animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
              <TaskCard 
                {...ticket} 
                onStatusChange={handleStatusChange}
                currentStatus={ticket.status}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full max-w-7xl mx-auto">
      {Object.entries(groupedTickets).map(([group, tickets], index) => (
        <div 
          key={group}
          className="glass rounded-lg p-5 cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in opacity-0 hover:translate-y-[-2px]"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => setSelectedGroup(group)}
        >
          <h3 className="font-medium text-lg mb-2">{group}</h3>
          <Separator className="bg-muted/50 my-2" />
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(tickets.length, 3) }).map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i === 0 ? "bg-primary" : i === 1 ? "bg-primary/80" : "bg-primary/60"
                  )}
                />
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground line-clamp-3">
            {tickets.map(t => t.title).join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
