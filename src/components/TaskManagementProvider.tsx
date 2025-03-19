
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

// Mock of Python API types
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  created_at: string;
  tags: string[];
  similarity_group?: string;
  estimated_time?: number;
  task?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  created_at: string;
  tickets: Ticket[];
}

interface KanbanData {
  "To Do": any[];
  "In Progress": any[];
  "Done": any[];
}

interface GroupedTickets {
  [key: string]: any[];
}

interface TaskManagementContextProps {
  tasks: Task[];
  kanbanData: KanbanData;
  groupedTickets: GroupedTickets;
  createTask: (title: string, description: string) => Promise<Task>;
  generateTickets: (taskId: string) => Promise<Ticket[]>;
  updateTicketStatus: (ticketId: string, newStatus: string) => void;
  groupTickets: () => Promise<GroupedTickets>;
  getCompletionStrategy: (groupName: string) => Promise<string>;
  findReusableComponents: (taskDescription: string) => Promise<any[]>;
}

// Create context
const TaskManagementContext = createContext<TaskManagementContextProps | undefined>(undefined);

// Mock data
const mockTasks: Task[] = [
  {
    id: "task_1",
    title: "Build a company website",
    description: "Create a modern website for our startup with about, services, and contact pages.",
    created_at: new Date().toISOString(),
    tickets: [
      {
        id: "ticket_1",
        title: "Design homepage layout",
        description: "Create a clean, modern layout for the homepage featuring our brand colors, logo, and a compelling hero section.",
        status: "To Do",
        priority: 1,
        created_at: new Date().toISOString(),
        tags: ["design", "frontend", "ui/ux"],
        estimated_time: 120
      },
      {
        id: "ticket_2",
        title: "Build about page",
        description: "Develop the about page with company history, mission statement, and team member profiles.",
        status: "To Do",
        priority: 2,
        created_at: new Date().toISOString(),
        tags: ["frontend", "content"],
        estimated_time: 90
      },
      {
        id: "ticket_3",
        title: "Implement contact form",
        description: "Create a contact form with validation that sends emails to the company inbox.",
        status: "In Progress",
        priority: 2,
        created_at: new Date().toISOString(),
        tags: ["frontend", "backend", "forms"],
        estimated_time: 120
      },
      {
        id: "ticket_4",
        title: "Optimize for mobile devices",
        description: "Ensure the website is fully responsive and works well on all mobile devices and screen sizes.",
        status: "To Do",
        priority: 3,
        created_at: new Date().toISOString(),
        tags: ["frontend", "responsive", "testing"],
        estimated_time: 180
      },
      {
        id: "ticket_5",
        title: "Add SEO metadata",
        description: "Implement proper SEO metadata, sitemap, and optimize for search engines.",
        status: "Done",
        priority: 4,
        created_at: new Date().toISOString(),
        tags: ["seo", "metadata"],
        estimated_time: 60
      }
    ]
  },
  {
    id: "task_2",
    title: "Develop user authentication system",
    description: "Create a secure authentication system with login, registration, password reset, and social auth options.",
    created_at: new Date().toISOString(),
    tickets: [
      {
        id: "ticket_6",
        title: "Design auth UI screens",
        description: "Create login, registration, and password reset screen designs with consistent branding.",
        status: "Done",
        priority: 1,
        created_at: new Date().toISOString(),
        tags: ["design", "ui/ux", "auth"],
        estimated_time: 120
      },
      {
        id: "ticket_7",
        title: "Implement JWT authentication",
        description: "Set up JWT-based authentication with proper token refresh and storage.",
        status: "In Progress",
        priority: 1,
        created_at: new Date().toISOString(),
        tags: ["backend", "security", "auth"],
        estimated_time: 240
      },
      {
        id: "ticket_8",
        title: "Add social login options",
        description: "Integrate Google, Facebook, and Apple login options into the authentication flow.",
        status: "To Do",
        priority: 3,
        created_at: new Date().toISOString(),
        tags: ["frontend", "backend", "auth", "oauth"],
        estimated_time: 180
      }
    ]
  }
];

const mockGroupedTickets: GroupedTickets = {
  "UI Design Tasks": [
    {
      id: "ticket_1",
      title: "Design homepage layout",
      description: "Create a clean, modern layout for the homepage featuring our brand colors, logo, and a compelling hero section.",
      status: "To Do",
      priority: 1,
      created_at: new Date().toISOString(),
      tags: ["design", "frontend", "ui/ux"],
      estimated_time: 120,
      task: "Build a company website"
    },
    {
      id: "ticket_6",
      title: "Design auth UI screens",
      description: "Create login, registration, and password reset screen designs with consistent branding.",
      status: "Done",
      priority: 1,
      created_at: new Date().toISOString(),
      tags: ["design", "ui/ux", "auth"],
      estimated_time: 120,
      task: "Develop user authentication system"
    }
  ],
  "Authentication Implementation": [
    {
      id: "ticket_7",
      title: "Implement JWT authentication",
      description: "Set up JWT-based authentication with proper token refresh and storage.",
      status: "In Progress",
      priority: 1,
      created_at: new Date().toISOString(),
      tags: ["backend", "security", "auth"],
      estimated_time: 240,
      task: "Develop user authentication system"
    },
    {
      id: "ticket_8",
      title: "Add social login options",
      description: "Integrate Google, Facebook, and Apple login options into the authentication flow.",
      status: "To Do",
      priority: 3,
      created_at: new Date().toISOString(),
      tags: ["frontend", "backend", "auth", "oauth"],
      estimated_time: 180,
      task: "Develop user authentication system"
    }
  ],
  "Website Content Development": [
    {
      id: "ticket_2",
      title: "Build about page",
      description: "Develop the about page with company history, mission statement, and team member profiles.",
      status: "To Do",
      priority: 2,
      created_at: new Date().toISOString(),
      tags: ["frontend", "content"],
      estimated_time: 90,
      task: "Build a company website"
    },
    {
      id: "ticket_5",
      title: "Add SEO metadata",
      description: "Implement proper SEO metadata, sitemap, and optimize for search engines.",
      status: "Done",
      priority: 4,
      created_at: new Date().toISOString(),
      tags: ["seo", "metadata"],
      estimated_time: 60,
      task: "Build a company website"
    }
  ],
  "Technical Implementation": [
    {
      id: "ticket_3",
      title: "Implement contact form",
      description: "Create a contact form with validation that sends emails to the company inbox.",
      status: "In Progress",
      priority: 2,
      created_at: new Date().toISOString(),
      tags: ["frontend", "backend", "forms"],
      estimated_time: 120,
      task: "Build a company website"
    },
    {
      id: "ticket_4",
      title: "Optimize for mobile devices",
      description: "Ensure the website is fully responsive and works well on all mobile devices and screen sizes.",
      status: "To Do",
      priority: 3,
      created_at: new Date().toISOString(),
      tags: ["frontend", "responsive", "testing"],
      estimated_time: 180,
      task: "Build a company website"
    }
  ]
};

export function TaskManagementProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    "To Do": [],
    "In Progress": [],
    "Done": []
  });
  const [groupedTickets, setGroupedTickets] = useState<GroupedTickets>(mockGroupedTickets);
  const { toast } = useToast();
  
  // Generate Kanban data on tasks change
  useEffect(() => {
    const newKanbanData: KanbanData = {
      "To Do": [],
      "In Progress": [],
      "Done": []
    };
    
    tasks.forEach(task => {
      task.tickets?.forEach(ticket => {
        const ticketForKanban = {
          ...ticket,
          task: task.title
        };
        
        if (ticket.status in newKanbanData) {
          newKanbanData[ticket.status as keyof KanbanData].push(ticketForKanban);
        }
      });
    });
    
    setKanbanData(newKanbanData);
  }, [tasks]);
  
  // Create a new task
  const createTask = async (title: string, description: string): Promise<Task> => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          id: `task_${tasks.length + 1}`,
          title,
          description,
          created_at: new Date().toISOString(),
          tickets: []
        };
        
        setTasks(prev => [...prev, newTask]);
        resolve(newTask);
      }, 1000); // Simulate API delay
    });
  };
  
  // Generate tickets for a task
  const generateTickets = async (taskId: string): Promise<Ticket[]> => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
          resolve([]);
          return;
        }
        
        // Example generated tickets
        const newTickets: Ticket[] = [
          {
            id: `ticket_${Math.random().toString(36).substring(7)}`,
            title: `Research for ${tasks[taskIndex].title}`,
            description: "Conduct initial research to gather requirements and references.",
            status: "To Do",
            priority: 1,
            created_at: new Date().toISOString(),
            tags: ["research", "planning"],
            estimated_time: 90
          },
          {
            id: `ticket_${Math.random().toString(36).substring(7)}`,
            title: `Design UI for ${tasks[taskIndex].title}`,
            description: "Create mockups and design specifications.",
            status: "To Do",
            priority: 2,
            created_at: new Date().toISOString(),
            tags: ["design", "ui/ux"],
            estimated_time: 180
          },
          {
            id: `ticket_${Math.random().toString(36).substring(7)}`,
            title: `Implement ${tasks[taskIndex].title}`,
            description: "Code the main functionality based on the design specs.",
            status: "To Do",
            priority: 2,
            created_at: new Date().toISOString(),
            tags: ["development", "implementation"],
            estimated_time: 240
          },
          {
            id: `ticket_${Math.random().toString(36).substring(7)}`,
            title: `Test ${tasks[taskIndex].title}`,
            description: "Conduct thorough testing to ensure quality and functionality.",
            status: "To Do",
            priority: 3,
            created_at: new Date().toISOString(),
            tags: ["testing", "qa"],
            estimated_time: 120
          }
        ];
        
        setTasks(prev => {
          const newTasks = [...prev];
          newTasks[taskIndex] = {
            ...newTasks[taskIndex],
            tickets: newTickets
          };
          return newTasks;
        });
        
        resolve(newTickets);
      }, 2000); // Simulate API delay
    });
  };
  
  // Update ticket status
  const updateTicketStatus = (ticketId: string, newStatus: string) => {
    setTasks(prev => {
      return prev.map(task => {
        if (!task.tickets) return task;
        
        const ticketIndex = task.tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return task;
        
        const newTickets = [...task.tickets];
        newTickets[ticketIndex] = {
          ...newTickets[ticketIndex],
          status: newStatus
        };
        
        return {
          ...task,
          tickets: newTickets
        };
      });
    });
    
    toast({
      title: "Status updated",
      description: `Ticket moved to ${newStatus}`,
    });
  };
  
  // Group similar tickets
  const groupTickets = async (): Promise<GroupedTickets> => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, we're using the mockGroupedTickets
        setGroupedTickets(mockGroupedTickets);
        resolve(mockGroupedTickets);
      }, 1500); // Simulate API delay
    });
  };
  
  // Get completion strategy for a group
  const getCompletionStrategy = async (groupName: string): Promise<string> => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        const strategies: {[key: string]: string} = {
          "UI Design Tasks": 
            "1. Recommended order: Start with the homepage layout first, then move to the auth UI screens.\n\n" +
            "2. Parallel work: These tasks can be worked on in parallel if different designers are available.\n\n" +
            "3. Efficiency tips: Create a shared design system first to ensure consistency across both tasks. Use the same color scheme, typography, and component styles.\n\n" +
            "4. Estimated time: About 4-5 hours total for both tasks.\n\n" +
            "5. Recommended tools: Figma for design collaboration, Unsplash for stock imagery, and Material Design or Apple's Human Interface Guidelines for reference.",
          
          "Authentication Implementation":
            "1. Recommended order: Implement the JWT authentication first, then add social login options.\n\n" +
            "2. Dependencies: Social login requires the base authentication system to be in place first.\n\n" +
            "3. Efficiency tips: Use an authentication library rather than building from scratch. Consider Auth0 or Firebase Authentication.\n\n" +
            "4. Estimated time: 7-8 hours total for both tasks.\n\n" +
            "5. Security considerations: Implement proper token storage, CSRF protection, and secure password handling.",
          
          "Website Content Development":
            "1. Recommended order: Build the about page first, then add SEO metadata once content is finalized.\n\n" +
            "2. Parallel work: These tasks can be handled simultaneously if resources allow.\n\n" +
            "3. Efficiency tips: Prepare all content in advance before implementation. Use a CMS if frequent content updates are expected.\n\n" +
            "4. Estimated time: 2.5 hours total for both tasks.\n\n" +
            "5. Content strategy: Focus on clear, concise messaging that aligns with brand voice and SEO goals.",
          
          "Technical Implementation":
            "1. Recommended order: First implement the contact form, then optimize for mobile devices.\n\n" +
            "2. Parallel work: These could be done in parallel by different team members.\n\n" +
            "3. Efficiency tips: Build the contact form with responsive design in mind from the start. Use a CSS framework like Tailwind for responsive utilities.\n\n" +
            "4. Estimated time: About 5 hours total for both tasks.\n\n" +
            "5. Testing approach: Test the contact form on multiple browsers and devices. Use tools like BrowserStack for device testing."
        };
        
        resolve(strategies[groupName] || "No specific strategy available for this group.");
      }, 1000); // Simulate API delay
    });
  };
  
  // Find reusable components
  const findReusableComponents = async (taskDescription: string): Promise<any[]> => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Example results based on the description
        const reusableResults = [
          {
            ticket_id: "ticket_1",
            relevance_score: 8,
            adaptation_notes: "The homepage layout design can be repurposed by adapting the color scheme and hero section while maintaining the overall structure.",
            ticket_details: {
              title: "Design homepage layout",
              task: "Build a company website"
            }
          },
          {
            ticket_id: "ticket_3",
            relevance_score: 7,
            adaptation_notes: "The contact form implementation can be reused with minimal modifications to field validation and submission handling.",
            ticket_details: {
              title: "Implement contact form",
              task: "Build a company website"
            }
          }
        ];
        
        resolve(reusableResults);
      }, 1500); // Simulate API delay
    });
  };

  return (
    <TaskManagementContext.Provider
      value={{
        tasks,
        kanbanData,
        groupedTickets,
        createTask,
        generateTickets,
        updateTicketStatus,
        groupTickets,
        getCompletionStrategy,
        findReusableComponents
      }}
    >
      {children}
    </TaskManagementContext.Provider>
  );
}

export function useTaskManagement() {
  const context = useContext(TaskManagementContext);
  if (context === undefined) {
    throw new Error("useTaskManagement must be used within a TaskManagementProvider");
  }
  return context;
}
