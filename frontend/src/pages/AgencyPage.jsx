import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Megaphone, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API, GOOGLE_FORM_URL } from '@/config/constants';
import { trackPageView, trackClick } from '@/utils/analytics';
import axios from 'axios';

const AgencyPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    trackPageView('/agency');
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await axios.get(`${API}/case-studies`);
      setCaseStudies(response.data);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  const handleBookCall = () => {
    trackClick('book-strategy-call', 'Book Strategy Call', '/agency');
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Digital Marketing Agency
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Marketing That <span className="text-primary">Actually Works</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              We don't do vanity metrics. We do revenue. Our team of specialists 
              helps brands cut through the noise and achieve real business results.
            </p>
            <Button onClick={handleBookCall} className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow" data-testid="book-call-hero">
              Book a Strategy Call <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">What We Do</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">Our <span className="text-primary">Services</span></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
              <Megaphone className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Social Media Growth</h3>
              <p className="text-muted-foreground mb-4">Organic and paid strategies to grow your presence on Instagram, LinkedIn, Twitter, and YouTube</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Content Strategy</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Community Management</li>
              </ul>
            </div>

            <div className="p-8 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Paid Advertising</h3>
              <p className="text-muted-foreground mb-4">ROI-focused campaigns on Meta, Google, and YouTube that convert browsers into buyers</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Meta Ads</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Google Ads</li>
              </ul>
            </div>

            <div className="p-8 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Performance Marketing</h3>
              <p className="text-muted-foreground mb-4">Data-driven campaigns focused on measurable outcomes and continuous optimization</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Conversion Tracking</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />A/B Testing</li>
              </ul>
            </div>

            <div className="p-8 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Branding</h3>
              <p className="text-muted-foreground mb-4">Build a brand that stands out in crowded markets and commands premium pricing</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Brand Strategy</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />Visual Identity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Proof of Work</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">Case <span className="text-primary">Studies</span></h2>
          </div>

          {caseStudies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <div key={study.id} className="p-6 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${study.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                      {study.status === 'completed' ? 'Completed' : 'Ongoing'}
                    </span>
                    <span className="text-sm text-muted-foreground">{study.industry}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{study.client_name}</p>
                  <p className="text-sm"><span className="text-primary font-semibold">Results:</span> {study.results}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Case studies coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Ready to <span className="text-primary">Scale</span>?</h2>
          <p className="text-lg text-muted-foreground mb-10">Let's discuss how we can help you achieve your marketing goals.</p>
          <Button onClick={handleBookCall} className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow" data-testid="book-call-cta">
            Book Your Free Strategy Call <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AgencyPage;
