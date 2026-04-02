import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, TrendingUp, DollarSign, Award, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trackPageView } from '@/utils/analytics';
import { GOOGLE_FORM_URL } from '@/config/constants';

const IncubatorPage = () => {
  useEffect(() => {
    trackPageView('/incubator');
  }, []);

  const stages = [
    { icon: <Lightbulb className="h-6 w-6" />, title: "Ideation", desc: "Validate your idea with market research and expert feedback" },
    { icon: <Users className="h-6 w-6" />, title: "Team Building", desc: "Find co-founders and build your core team" },
    { icon: <Rocket className="h-6 w-6" />, title: "MVP Development", desc: "Build and launch your minimum viable product" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Growth", desc: "Scale your startup with proven strategies" },
    { icon: <DollarSign className="h-6 w-6" />, title: "Fundraising", desc: "Get connected with investors and raise capital" },
  ];

  const benefits = [
    "1-on-1 mentorship with successful founders",
    "Access to investor network",
    "Co-founder matching",
    "Legal and accounting support",
    "Office space and resources",
    "Media and PR support"
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Clock className="h-4 w-4" />
              Coming Soon
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Flareonix <span className="text-primary">Incubator</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              From idea to funded startup. We're building India's most accessible startup launchpad 
              for first-generation founders with hunger and hustle.
            </p>
            <Button
              onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow"
            >
              Join the Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              The Program
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Your Startup <span className="text-primary">Journey</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-xl border border-white/10 text-center hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {stage.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{stage.title}</h3>
                <p className="text-sm text-muted-foreground">{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
                What You Get
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Everything to <span className="text-primary">Launch</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We provide comprehensive support at every stage of your startup journey. 
                No more figuring things out alone.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <Award className="h-5 w-5 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <div className="relative p-8 glass rounded-2xl border border-primary/30 text-center">
                <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-bold text-white mb-4">
                  Launching Q2 2026
                </h3>
                <p className="text-muted-foreground mb-6">
                  Be among the first founders to join our incubator program. 
                  Limited spots available in the first cohort.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-heading font-bold text-primary">10</div>
                    <div className="text-xs text-muted-foreground">Startups</div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-primary">6</div>
                    <div className="text-xs text-muted-foreground">Months</div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-primary">₹10L</div>
                    <div className="text-xs text-muted-foreground">In Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Should Apply */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Who Should <span className="text-primary">Apply</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 glass rounded-xl border border-primary/30"
            >
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Ideal Candidates</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Have a validated problem to solve</li>
                <li>✓ Willing to commit full-time</li>
                <li>✓ Coachable and open to feedback</li>
                <li>✓ Previous execution experience (any field)</li>
                <li>✓ Strong work ethic and resilience</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 glass rounded-xl border border-white/10"
            >
              <h3 className="font-heading text-xl font-bold text-muted-foreground mb-4">Not a Good Fit</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>✗ Looking for a "get rich quick" scheme</li>
                <li>✗ Not willing to put in the work</li>
                <li>✗ Only interested in the title "founder"</li>
                <li>✗ Can't handle feedback or failure</li>
                <li>✗ No clarity on what you want to build</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build <span className="text-primary">Something Big</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join the waitlist to be notified when applications open for the first cohort.
            </p>
            <Button
              onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Join the Waitlist
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default IncubatorPage;
