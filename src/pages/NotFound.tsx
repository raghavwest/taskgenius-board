
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full glass p-8 rounded-xl animate-fade-in">
        <div className="mb-6">
          <div className="text-6xl font-bold text-primary mb-2">404</div>
          <h1 className="text-2xl font-medium mb-4">Page not found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button 
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full inline-flex items-center gap-2 transition-all duration-300"
        >
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
