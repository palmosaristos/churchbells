import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useExactAlarmPermission } from "@/hooks/useExactAlarmPermission";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import PrayerTimes from "./pages/PrayerTimes";
import Premium from "./pages/Premium";
import More from "./pages/More";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RGPDCompliance from "./pages/RGPDCompliance";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showPermissionDialog, requestPermission, dismissDialog } = useExactAlarmPermission();

  return (
    <>
      <AlertDialog open={showPermissionDialog} onOpenChange={(open) => !open && dismissDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🔔 Permission requise</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Pour que les cloches sonnent à l'heure exacte, même lorsque l'application est fermée, 
                vous devez activer les <strong>alarmes et rappels</strong>.
              </p>
              <p className="text-xs text-muted-foreground">
                Sans cette permission, les notifications pourraient être retardées de plusieurs minutes.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={dismissDialog}>Plus tard</AlertDialogCancel>
            <AlertDialogAction onClick={requestPermission}>
              Activer maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/more" element={<More />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/rgpd-compliance" element={<RGPDCompliance />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
