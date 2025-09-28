import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { TableManagement } from "@/components/TableManagement";
import { Dashboard } from "@/components/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            {/* Global Header with Sidebar Trigger */}
            <header className="fixed top-0 left-0 right-0 h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
              <SidebarTrigger className="ml-4" />
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-lg font-bold text-primary">🎱 Rolling Stones</h1>
              </div>
            </header>

            <AppSidebar />

            <main className="flex-1 pt-12 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/table/1" replace />} />
                <Route path="/table/:tableId" element={<TableRoute />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<div className="text-center py-20"><h2 className="text-2xl">Customers Page - Coming Soon!</h2></div>} />
                <Route path="/settings" element={<div className="text-center py-20"><h2 className="text-2xl">Settings Page - Coming Soon!</h2></div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const TableRoute = () => {
  const { tableId } = useParams();
  const tableNumber = parseInt(tableId || '1');
  
  if (isNaN(tableNumber) || tableNumber < 1 || tableNumber > 4) {
    return <Navigate to="/table/1" replace />;
  }
  
  return <TableManagement tableNumber={tableNumber} />;
};

export default App;
