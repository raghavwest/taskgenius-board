
import { useState } from "react";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { TaskManagementProvider } from "@/components/TaskManagementProvider";
import { GroupedTickets } from "@/components/GroupedTickets";
import { ReusableComponents } from "@/components/ReusableComponents";
import { GeminiKeyInput } from "@/components/GeminiKeyInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, LayoutGrid, Cog, RefreshCw } from "lucide-react";

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  
  return (
    <TaskManagementProvider>
      <div className="min-h-screen bg-background">
        <Header openCreateTaskModal={() => setIsCreateModalOpen(true)} />
        
        <main className="pt-24 px-4 pb-8">
          <div className="w-full max-w-7xl mx-auto">
            <GeminiKeyInput onApiKeySet={(key) => setGeminiApiKey(key)} />
            
            <Tabs defaultValue="kanban" className="w-full">
              <div className="glass rounded-full p-1 mb-6 max-w-fit mx-auto">
                <TabsList className="bg-transparent">
                  <TabsTrigger 
                    value="kanban" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2"
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Kanban Board
                  </TabsTrigger>
                  <TabsTrigger 
                    value="grouped" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grouped Tickets
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reusable" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Find Reusable Work
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="kanban" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <KanbanBoard />
              </TabsContent>
              
              <TabsContent value="grouped" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <GroupedTickets />
              </TabsContent>
              
              <TabsContent value="reusable" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <ReusableComponents />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <footer className="py-4 px-6 border-t border-muted/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              TaskGenius - AI-Powered Task Management
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cog className="h-4 w-4" />
              Powered by Gemini
            </div>
          </div>
        </footer>
        
        <CreateTaskModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </div>
    </TaskManagementProvider>
  );
};

export default Index;
