import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import Index from "./app/page";
import NotFound from "./app/not-found";
import NotificationContainer from "./components/ui/notification-container";

// Lazy load components for better performance
const WalletDetails = lazy(() => import("./app/wallet/[walletId]/page"));
const NewCase = lazy(() => import("./app/new-case/page"));
const ManageCases = lazy(() => import("./app/cases/page"));
const CaseDetail = lazy(() => import("./app/case/[caseId]/page"));
const AssetsUnderSeizure = lazy(() => import("./app/assets/page"));
const MonitoredWallets = lazy(() => import("./app/wallets/page"));
const RecentActivity = lazy(() => import("./app/activity/page"));

const queryClient = new QueryClient();

const App = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type,
      duration
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Make notification functions available globally
  window.showNotification = {
    success: (message, duration) => addNotification(message, 'success', duration),
    error: (message, duration) => addNotification(message, 'error', duration),
    warning: (message, duration) => addNotification(message, 'warning', duration),
    info: (message, duration) => addNotification(message, 'info', duration)
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationContainer 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/new-case" element={<NewCase />} />
              <Route path="/cases" element={<ManageCases />} />
              <Route path="/case/:caseId" element={<CaseDetail />} />
              <Route path="/assets" element={<AssetsUnderSeizure />} />
              <Route path="/wallets" element={<MonitoredWallets />} />
              <Route path="/activity" element={<RecentActivity />} />
              <Route path="/wallet/:walletId" element={<WalletDetails />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;