import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EcosystemSection from '@/components/EcosystemSection';
import CommunitySection from '@/components/CommunitySection';
import AIVisionSection from '@/components/AIVisionSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EcosystemSection />
      <CommunitySection />
      <AIVisionSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
