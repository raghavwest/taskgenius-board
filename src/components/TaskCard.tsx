
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  AlignLeft, 
  Tag, 
  MoreVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority: number;
  task: string;
  tags: string[];
  group?: string;
  onStatusChange: (id: string, status: string) => void;
  currentStatus: string;
}

export function TaskCard({
  id,
  title,
  description,
  priority,
  task,
  tags,
  group,
  onStatusChange,
  currentStatus
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const priorityColors = {
    1: "bg-red-500/20 text-red-400",
    2: "bg-orange-500/20 text-orange-400",
    3: "bg-yellow-500/20 text-yellow-400",
    4: "bg-green-500/20 text-green-400",
    5: "bg-blue-500/20 text-blue-400"
  };
  
  const priorityLabels = {
    1: "Highest",
    2: "High",
    3: "Medium",
    4: "Low",
    5: "Lowest"
  };
  
  const getRandomTagColor = (tag: string) => {
    const colors = [
      "bg-blue-500/20 text-blue-400",
      "bg-purple-500/20 text-purple-400",
      "bg-pink-500/20 text-pink-400",
      "bg-indigo-500/20 text-indigo-400",
      "bg-teal-500/20 text-teal-400"
    ];
    
    // Use the tag string to deterministically pick a color
    const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={cn(
        "glass rounded-lg p-4 transition-all duration-300",
        expanded ? "my-3" : "mb-3",
        isHovering ? "translate-y-[-2px] shadow-lg" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">{task}</div>
          <h3 className="font-medium text-md mb-1">{title}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("tag", priorityColors[priority as keyof typeof priorityColors])}>
              P{priority}: {priorityLabels[priority as keyof typeof priorityLabels]}
            </span>
            
            {group && (
              <span className="tag bg-secondary text-secondary-foreground">
                {group}
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-darker">
            <DropdownMenuItem 
              onClick={() => onStatusChange(id, "To Do")}
              disabled={currentStatus === "To Do"}
            >
              Move to To Do
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(id, "In Progress")}
              disabled={currentStatus === "In Progress"}
            >
              Move to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(id, "Done")}
              disabled={currentStatus === "Done"}
            >
              Move to Done
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-[500px] mt-3" : "max-h-0"
        )}
      >
        <div className="border-t border-border pt-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2 mb-2">
            <AlignLeft className="h-4 w-4 text-muted-foreground mt-1" />
            <p>{description}</p>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex items-start gap-2 mb-1">
              <Tag className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={cn("tag", getRandomTagColor(tag))}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-2 flex items-center justify-center"
      >
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:bg-muted/80">
          {expanded ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>
    </div>
  );
}
