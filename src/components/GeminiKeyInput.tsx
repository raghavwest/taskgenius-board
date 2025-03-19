
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GeminiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export function GeminiKeyInput({ onApiKeySet }: GeminiKeyInputProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [isStored, setIsStored] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if API key exists in localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    // Save the API key to localStorage
    localStorage.setItem("gemini_api_key", apiKey);
    setIsStored(true);
    onApiKeySet(apiKey);

    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved. Tasks will now be broken down using AI.",
    });
  };

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsStored(false);
    setIsVisible(false);
    onApiKeySet("");
    
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed",
    });
  };

  return (
    <div className="glass-darker rounded-lg p-4 mb-6">
      <div className="flex items-center mb-2">
        <Key className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-sm font-medium">Gemini API Key</h3>
      </div>
      <div className="text-xs text-muted-foreground mb-3">
        {isStored ? (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
            <span>API key is set. Tasks will use Gemini for breakdown.</span>
          </div>
        ) : (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
            <span>API key is optional. Without it, tasks will be added without AI breakdown.</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="pr-24 bg-background/50 border-muted"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
        {isStored ? (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClearKey}
            className="shrink-0"
          >
            Clear
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveKey}
            className="shrink-0 bg-primary hover:bg-primary/90"
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
