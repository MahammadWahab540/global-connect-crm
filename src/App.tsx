
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import ImportLeads from "./pages/ImportLeads";
import ManageUsers from "./pages/ManageUsers";
import ViewReports from "./pages/ViewReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/auth" replace />;
  }
  
  const user = JSON.parse(userStr);
  if (requiredRole && user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/import-leads" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ImportLeads />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manage-users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/view-reports" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/counselor" 
            element={
              <ProtectedRoute requiredRole="counselor">
                <CounselorDashboard />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
