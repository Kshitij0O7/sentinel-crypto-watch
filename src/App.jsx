import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./app/page";
import NotFound from "./app/not-found";
import WalletDetails from "./app/wallet/[walletId]/page";
import NewCase from "./app/new-case/page";
import ManageCases from "./app/cases/page";
import CaseDetail from "./app/case/[caseId]/page";
import AssetsUnderSeizure from "./app/assets/page";
import MonitoredWallets from "./app/wallets/page";
import RecentActivity from "./app/activity/page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;