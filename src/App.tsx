import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import Services from "./pages/admin/Services";
import Gallery from "./pages/admin/Gallery";
import Customers from "./pages/admin/Customers";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/admin/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
    <Route path="/admin/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
    <Route path="/admin/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
    <Route path="/admin/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
    <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
