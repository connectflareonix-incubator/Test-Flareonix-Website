import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhoenixDivider from '@/components/decor/PhoenixDivider';
import ConsultationHero from '@/components/consultation/ConsultationHero';
import ConsultationAudience from '@/components/consultation/ConsultationAudience';
import ConsultationServices from '@/components/consultation/ConsultationServices';
import ConsultationPricing from '@/components/consultation/ConsultationPricing';
import ConsultationCTA from '@/components/consultation/ConsultationCTA';
import ConsultationProof from '@/components/consultation/ConsultationProof';
import { trackPageView } from '@/utils/analytics';
import { API } from '@/config/constants';

const GrowthConsultationPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    trackPageView('/consultation');
    axios.get(`${API}/testimonials`).then((r) => setTestimonials(r.data || [])).catch(() => {});
    axios.get(`${API}/case-studies`).then((r) => setCaseStudies(r.data || [])).catch(() => {});
  }, []);

  const scrollToServices = () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <ConsultationHero onScrollServices={scrollToServices} />
      <ConsultationAudience />
      <ConsultationServices />
      <PhoenixDivider />
      <ConsultationPricing />
      <ConsultationCTA />
      <ConsultationProof caseStudies={caseStudies} testimonials={testimonials} />
      <Footer />
    </main>
  );
};

export default GrowthConsultationPage;
