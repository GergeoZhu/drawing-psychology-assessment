import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages (Lazy loading not strictly necessary for this size, but good practice. 
// For now, standard imports are fine for simplicity and speed)
import WelcomePage from "@/pages/WelcomePage";
import GuidePage from "@/pages/GuidePage";
import DrawingPage from "@/pages/DrawingPage";
import AnalysisPage from "@/pages/AnalysisPage";
import ResultPage from "@/pages/ResultPage";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Layout>
        <Switch>
          <Route path="/" component={WelcomePage} />
          <Route path="/guide" component={GuidePage} />
          <Route path="/draw" component={DrawingPage} />
          <Route path="/analyze" component={AnalysisPage} />
          <Route path="/result" component={ResultPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
