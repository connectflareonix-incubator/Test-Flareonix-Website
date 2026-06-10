import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { startSparkEngine } from "@/lib/sparkEngine";
import { startAnimationEngine } from "@/lib/animationEngine";

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
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import GrowthConsultationPage from "@/pages/GrowthConsultationPage";

function AppRouter() {
  const location = useLocation();
  
  if (location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/agency" element={<GrowthConsultationPage />} />
      <Route path="/consultation" element={<GrowthConsultationPage />} />
      <Route path="/growth-consultation" element={<GrowthConsultationPage />} />
      <Route path="/freelancer-hub" element={<FreelancerHubPage />} />
      <Route path="/incubator" element={<IncubatorPage />} />
      <Route path="/ai-tools" element={<AIToolsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
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
    startAnimationEngine();
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
