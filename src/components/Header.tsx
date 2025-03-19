
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface HeaderProps {
  openCreateTaskModal: () => void;
}

export function Header({ openCreateTaskModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 py-4 px-6 transition-all duration-300 ease-in-out",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-primary/20 w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-primary text-lg font-bold">TG</span>
          </span>
          <h1 className="text-xl font-semibold text-foreground">TaskGenius</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={openCreateTaskModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-full px-4 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
