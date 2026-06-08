import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Target, Users, Lightbulb, ArrowRight, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { trackPageView } from '@/utils/analytics';
import AboutSections from '@/components/about/AboutSections';

const AboutPage = () => {
  const { login } = useAuth();

  useEffect(() => {
    trackPageView('/about');
  }, []);

  const values = [
    { icon: <Flame className="h-6 w-6" />, title: "Ambition", desc: "We fuel the fire within every creator" },
    { icon: <Target className="h-6 w-6" />, title: "Execution", desc: "Ideas are nothing without action" },
    { icon: <Users className="h-6 w-6" />, title: "Community", desc: "Together we rise higher" },
    { icon: <Heart className="h-6 w-6" />, title: "Impact", desc: "Creating real change in lives" },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Why <span className="text-primary">Flareonix</span> Exists
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We exist because millions of ambitious young Indians have dreams, 
              but no roadmap to achieve them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
                The Problem
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Lost in the <span className="text-primary">Noise</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Every day, thousands of young Indians wake up feeling stuck. They have ideas, 
                  energy, and dreams — but no clear path forward.
                </p>
                <p>
                  The internet is full of "gurus" selling courses. Social media shows overnight success stories. 
                  But the reality? Most people remain confused, overwhelmed, and unable to take action.
                </p>
                <p className="text-white font-semibold">
                  They don't need more information. They need an ecosystem that actually works.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <div className="relative p-8 glass rounded-2xl border border-white/10">
                <h3 className="font-heading text-2xl font-bold text-white mb-6">
                  The Struggles We Solve
                </h3>
                <ul className="space-y-4">
                  {[
                    "No clear roadmap to success",
                    "Lack of real mentorship",
                    "No community of like-minded people",
                    "Unable to monetize skills",
                    "Fear of taking the first step",
                    "Overwhelmed by choices"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-primary mt-1">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="p-8 glass rounded-2xl border border-primary/30">
                <h3 className="font-heading text-2xl font-bold text-white mb-6">
                  What Flareonix Provides
                </h3>
                <ul className="space-y-4">
                  {[
                    "A community of builders, not just dreamers",
                    "Real mentorship from people who've done it",
                    "AI tools to amplify your productivity",
                    "Freelance opportunities to start earning",
                    "Incubator support for startup founders",
                    "A culture of execution, not excuses"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white">
                      <span className="text-primary mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
                The Solution
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                An Ecosystem for <span className="text-primary">Transformation</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Flareonix is not another course. It's not a get-rich-quick scheme. 
                  It's a complete ecosystem designed to transform ambitious individuals into successful creators and founders.
                </p>
                <p>
                  We combine the power of community, technology, and mentorship to create 
                  an environment where taking action becomes inevitable.
                </p>
                <p className="text-white font-semibold">
                  Here, you don't just learn — you build, earn, and grow.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              What We Stand For
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Our <span className="text-primary">Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-2xl border border-white/10 text-center hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {value.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Our Vision
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Building India's <span className="text-primary">Largest</span> Creator Economy
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We envision a future where every ambitious Indian has access to the resources, 
              community, and opportunities they need to build a life of freedom and impact.
            </p>
            <blockquote className="p-6 glass rounded-xl border border-primary/30 text-white italic text-xl">
              "Like the Phoenix, we rise from the ordinary. We ignite with purpose. We conquer through action."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Begin Your <span className="text-primary">Transformation</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              This is your starting point. This is where you become unstoppable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={login}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow"
              >
                <Flame className="mr-2 h-5 w-5" />
                Enter the Fire
              </Button>
              <Link to="/community">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                  Explore Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <AboutSections />

      <Footer />
    </main>
  );
};

export default AboutPage;
