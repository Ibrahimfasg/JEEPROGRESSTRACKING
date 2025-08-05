import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { firebaseApi } from "./lib/api-client";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import type { User } from "@shared/schema";

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogin = async (userType: 'boy' | 'girl', password: string) => {
    try {
      const username = userType === 'boy' ? 'him' : 'her';
      const data = await firebaseApi.login(username, password);
      
      setCurrentUser(data.user as User);
      toast({
        title: "Login successful!",
        description: `Welcome back, ${data.user.displayName}!`
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "See you soon!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <Landing onLogin={handleLogin} />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
