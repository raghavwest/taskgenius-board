
import { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { useTaskManagement } from "./TaskManagementProvider";

const columnTitles = {
  "To Do": "To Do",
  "In Progress": "In Progress",
  "Done": "Done"
};

export function KanbanBoard() {
  const { kanbanData, updateTicketStatus } = useTaskManagement();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketStatus(ticketId, newStatus);
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pb-8 w-full max-w-7xl mx-auto">
      {Object.entries(columnTitles).map(([status, title], index) => (
        <div 
          key={status}
          className={cn(
            "animate-fade-in opacity-0",
            { "animation-delay-100": index === 0 },
            { "animation-delay-200": index === 1 },
            { "animation-delay-300": index === 2 }
          )}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards" 
          }}
        >
          <div className="glass rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-lg">{title}</h2>
              <div className="bg-muted text-muted-foreground text-xs py-1 px-2 rounded-full">
                {kanbanData[status as keyof typeof kanbanData]?.length || 0}
              </div>
            </div>
          </div>
          
          <div 
            className="max-h-[calc(100vh-250px)] overflow-y-auto pr-1 scrollbar-thin" 
          >
            {kanbanData[status as keyof typeof kanbanData]?.map((ticket, ticketIndex) => (
              <div
                key={ticket.id}
                className="animate-slide-in opacity-0"
                style={{ 
                  animationDelay: `${(index * 100) + (ticketIndex * 50)}ms`,
                  animationFillMode: "forwards" 
                }}
              >
                <TaskCard 
                  {...ticket} 
                  onStatusChange={handleStatusChange}
                  currentStatus={status}
                />
              </div>
            ))}
            
            {kanbanData[status as keyof typeof kanbanData]?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground animate-fade-in opacity-0">
                No tickets in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
