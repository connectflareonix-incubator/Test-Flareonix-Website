import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { startSparkEngine } from "@/lib/sparkEngine";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CommunityPage from "@/pages/CommunityPage";
import AgencyPage from "@/pages/AgencyPage";
import FreelancerHubPage from "@/pages/FreelancerHubPage";
import IncubatorPage from "@/pages/IncubatorPage";
import AIToolsPage from "@/pages/AIToolsPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPanel from "@/pages/AdminPanel";
import TestimonialsPage from "@/pages/TestimonialsPage";

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id - must be synchronous
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/agency" element={<AgencyPage />} />
      <Route path="/freelancer-hub" element={<FreelancerHubPage />} />
      <Route path="/incubator" element={<IncubatorPage />} />
      <Route path="/ai-tools" element={<AIToolsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/*" element={<AdminPanel />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    startSparkEngine();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AnnouncementBanner />
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
