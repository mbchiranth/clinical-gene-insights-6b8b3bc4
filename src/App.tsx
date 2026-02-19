import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "@/components/TopNav";
import AppSidebar from "@/components/AppSidebar";
import Index from "./pages/Index";
import GeneInsights from "./pages/GeneInsights";
import DrugSearch from "./pages/DrugSearch";
import Reports from "./pages/Reports";
import PatientList from "./pages/PatientList";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
