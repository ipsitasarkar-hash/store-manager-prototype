import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import JoulePage from "./pages/JoulePage.tsx";
import Index from "./pages/Index.tsx";
import DuplicateInvoicePage from "./pages/DuplicateInvoicePage.tsx";
import JobsDiscoverPage from "./pages/JobsDiscoverPage.tsx";
import DuplicateJobDetailPage from "./pages/DuplicateJobDetailPage.tsx";
import DuplicateInvoiceSpacePage from "./pages/DuplicateInvoiceSpacePage.tsx";
import StoreManagerSpacePage from "./pages/StoreManagerSpacePage.tsx";
import DesignSystemShowcase from "./pages/DesignSystemShowcase.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<JoulePage />} />
            <Route path="/home" element={<JoulePage />} />
            <Route path="/invoice" element={<Index />} />
            <Route path="/invoice/job-detail" element={<Index openJobDetail />} />
            <Route path="/duplicate" element={<DuplicateInvoicePage />} />
            <Route path="/jobs" element={<JobsDiscoverPage />} />
            <Route path="/jobs/duplicate-detail" element={<DuplicateJobDetailPage />} />
            <Route path="/spaces/duplicate-review" element={<DuplicateInvoiceSpacePage />} />
            <Route path="/spaces/store-manager" element={<StoreManagerSpacePage />} />
            <Route path="/spaces" element={<StoreManagerSpacePage />} />
          </Route>
          <Route path="/design-system" element={<DesignSystemShowcase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
