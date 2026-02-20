import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import TopNav from "@/components/TopNav";
import AppSidebar from "@/components/AppSidebar";
import AIChatbot from "@/components/AIChatbot";
import Index from "./pages/Index";
import GeneInsights from "./pages/GeneInsights";
import DrugSearch from "./pages/DrugSearch";
import Reports from "./pages/Reports";
import PatientList from "./pages/PatientList";
import Admin from "./pages/Admin";
import VcfAnalysis from "./pages/VcfAnalysis";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppLayout = () => (
  <ProtectedRoute>
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gene-insights" element={<GeneInsights />} />
            <Route path="/drug-search" element={<DrugSearch />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/vcf-analysis" element={<VcfAnalysis />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <AIChatbot />
    </div>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
