import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Users, Brain, Rocket, Trophy, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { LOGO_URL } from '@/config/constants';
import { trackPageView, trackClick } from '@/utils/analytics';

const HomePage = () => {
  const { login } = useAuth();

  useEffect(() => {
    trackPageView('/');
  }, []);

  const features = [
    { icon: <Users className="h-8 w-8" />, title: "Community", desc: "Join 1000+ ambitious creators & founders" },
    { icon: <Brain className="h-8 w-8" />, title: "AI Tools", desc: "Leverage AI to scale your business" },
    { icon: <Rocket className="h-8 w-8" />, title: "Incubator", desc: "Turn ideas into funded startups" },
    { icon: <Trophy className="h-8 w-8" />, title: "Earn", desc: "Monetize your skills from day one" },
  ];

  const stats = [
    { value: "1000+", label: "Community Members" },
    { value: "50+", label: "Projects Launched" },
    { value: "₹10L+", label: "Earnings Generated" },
    { value: "24/7", label: "Support & Mentorship" },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Phoenix Logo with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <img 
                src={LOGO_URL} 
                alt="Flareonix Phoenix" 
                className="relative h-40 md:h-52 w-auto mx-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <span className="text-primary text-sm md:text-base font-semibold tracking-[0.3em] uppercase">
              Rise. Ignite. Conquer.
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            This is not a platform.
            <br />
            <span className="text-primary">This is where creators are reborn.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Join the movement. Build your identity. Earn. Grow. Dominate.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => {
                trackClick('hero-enter-fire', 'Enter the Fire', '/');
                login();
              }}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow group"
              data-testid="hero-cta-primary"
            >
              <Flame className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Enter the Fire
            </Button>
            <Link to="/about">
              <Button
                onClick={() => trackClick('hero-explore', 'Explore Flareonix', '/')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                data-testid="hero-cta-secondary"
              >
                Explore Flareonix
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* What is Flareonix */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              What is Flareonix?
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              A Movement for the <span className="text-primary">Unstoppable</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Flareonix is where ambitious youth transform their dreams into reality. 
              We combine community, AI tools, mentorship, and real earning opportunities 
              to create the ultimate ecosystem for creators and founders.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-2xl border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-heading font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Your Journey Starts Here
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              What Can You <span className="text-primary">Achieve</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 glass rounded-2xl border border-white/10"
            >
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Learn & Grow</h3>
              <p className="text-muted-foreground mb-4">
                Access exclusive courses, workshops, and mentorship from industry experts.
              </p>
              <Link to="/community" className="text-primary font-semibold hover:underline">
                Join Community →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 glass rounded-2xl border border-primary/30"
            >
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Earn & Scale</h3>
              <p className="text-muted-foreground mb-4">
                Get real freelance opportunities and scale your income with our agency support.
              </p>
              <Link to="/freelancer-hub" className="text-primary font-semibold hover:underline">
                Explore Freelancer Hub →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 glass rounded-2xl border border-white/10"
            >
              <Rocket className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Build & Launch</h3>
              <p className="text-muted-foreground mb-4">
                Turn your ideas into real startups with our incubator program and funding support.
              </p>
              <Link to="/incubator" className="text-primary font-semibold hover:underline">
                Apply to Incubator →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-primary">Transform</span> Your Life?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Stop dreaming. Start building. Join thousands of ambitious creators who chose to rise.
            </p>
            <Button
              onClick={() => {
                trackClick('cta-join-now', 'Join Now CTA', '/');
                login();
              }}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow"
              data-testid="cta-join"
            >
              <Flame className="mr-2 h-5 w-5" />
              Join Flareonix Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
