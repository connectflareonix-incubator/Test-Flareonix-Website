import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_67b702d1-b010-4e85-8987-3c95d6ed01fa/artifacts/ko2oskb5_Flareonix.png";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501";

const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1635194981985-2566733d119a?w=1920&q=80)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/80 to-[#050505]" />
        <div className="absolute inset-0 hero-glow" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center pt-20">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src={LOGO_URL} 
            alt="Flareonix Phoenix" 
            className="h-32 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-2xl"
            data-testid="hero-logo"
          />
        </motion.div>

        {/* Motto - Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 uppercase"
          data-testid="hero-motto"
        >
          <span className="text-primary glow-text">Rise.</span>{' '}
          <span className="text-white">Ignite.</span>{' '}
          <span className="text-accent">Conquer.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          data-testid="hero-subtitle"
        >
          The youth-powered, AI-driven startup ecosystem for ambitious{' '}
          <span className="text-white font-semibold">Indian founders</span>.
          <br className="hidden md:block" />
          From zero to builder. From builder to founder.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => scrollToSection('#community')}
            className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold tracking-wide transition-all hover:scale-105 hover-glow group"
            data-testid="hero-join-btn"
          >
            <Flame className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Join The Movement
          </Button>
          <Button
            onClick={() => scrollToSection('#ecosystem')}
            variant="outline"
            className="bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-medium transition-all"
            data-testid="hero-ecosystem-btn"
          >
            Enter The Ecosystem
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Quick Stats or Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Community-First</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium">Youth-Led</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
