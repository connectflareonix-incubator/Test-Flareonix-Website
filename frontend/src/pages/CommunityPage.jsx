import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Users, Code, Briefcase, Trophy, Zap, MessageSquare, Crown, Target, Rocket, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trackPageView } from '@/utils/analytics';
import { WHATSAPP_FOUNDERS, WHATSAPP_FREELANCERS } from '@/config/constants';

const CommunityPage = () => {
  useEffect(() => {
    trackPageView('/community');
  }, []);

  const founderBenefits = [
    { icon: <Rocket className="h-5 w-5" />, title: "Startup Mentorship", desc: "Direct access to successful founders and investors" },
    { icon: <Users className="h-5 w-5" />, title: "Founder Network", desc: "Connect with co-founders and early team members" },
    { icon: <Target className="h-5 w-5" />, title: "Pitch Practice", desc: "Weekly pitch sessions with real feedback" },
    { icon: <Briefcase className="h-5 w-5" />, title: "Investor Intros", desc: "Get introduced to angel investors and VCs" },
    { icon: <Zap className="h-5 w-5" />, title: "Growth Resources", desc: "Templates, tools, and playbooks for scaling" },
    { icon: <Trophy className="h-5 w-5" />, title: "Funding Support", desc: "Guidance on raising seed and pre-seed rounds" },
  ];

  const freelancerBenefits = [
    { icon: <Code className="h-5 w-5" />, title: "Skill Development", desc: "Learn in-demand skills from industry experts" },
    { icon: <Briefcase className="h-5 w-5" />, title: "Client Projects", desc: "Access to real freelance opportunities" },
    { icon: <Crown className="h-5 w-5" />, title: "Portfolio Building", desc: "Build a standout portfolio with guidance" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Peer Support", desc: "Get help and feedback from fellow freelancers" },
    { icon: <Zap className="h-5 w-5" />, title: "Productivity Tools", desc: "AI tools to 10x your output" },
    { icon: <Trophy className="h-5 w-5" />, title: "Earning Potential", desc: "Go from ₹0 to ₹1L+ monthly" },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Join the Movement
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Two Communities. <span className="text-primary">One Mission.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're building the next big startup or mastering freelancing, Flareonix has a home for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Community */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Why <span className="text-primary">Community</span> Matters
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Success is rarely a solo journey. The people around you determine how fast and how far you go. 
              At Flareonix, we've built communities where ambition meets action, 
              where accountability replaces procrastination, and where your network becomes your net worth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Accountability", desc: "Surround yourself with people who push you to show up daily" },
              { title: "Opportunities", desc: "Access jobs, clients, and partnerships you won't find elsewhere" },
              { title: "Growth", desc: "Learn from others' mistakes and successes to accelerate your journey" },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 glass rounded-xl border border-white/10 text-center">
                <h3 className="font-heading text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Community */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Rocket className="h-4 w-4" />
                For Startup Founders
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Founders <span className="text-primary">Community</span>
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Why We're Building This</h3>
                  <p className="text-muted-foreground">
                    India needs more first-generation founders. Not people chasing trends, but builders solving real problems. 
                    The Founders Community exists to provide the mentorship, network, and resources that privileged founders take for granted — 
                    now accessible to everyone with hunger and hustle.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">What You'll Get</h3>
                  <p className="text-muted-foreground">
                    Direct access to successful founders, weekly pitch practice, investor introductions, 
                    co-founder matching, and a tribe that understands the lonely journey of building a startup.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Our Aim</h3>
                  <p className="text-muted-foreground">
                    To produce 100 funded startups from our community in the next 3 years. 
                    We're not just building a network — we're building the next generation of Indian entrepreneurs.
                  </p>
                </div>
              </div>
              <a href={WHATSAPP_FOUNDERS} target="_blank" rel="noreferrer">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow">
                  <Flame className="mr-2 h-5 w-5" />
                  Join Founders Community
                </Button>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid sm:grid-cols-2 gap-4">
              {founderBenefits.map((benefit) => (
                <div key={benefit.title} className="p-4 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all">
                  <div className="text-primary mb-2">{benefit.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Freelancers Community */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 grid sm:grid-cols-2 gap-4">
              {freelancerBenefits.map((benefit) => (
                <div key={benefit.title} className="p-4 glass rounded-xl border border-white/10 hover:border-accent/30 transition-all">
                  <div className="text-accent mb-2">{benefit.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Code className="h-4 w-4" />
                For Freelancers
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Freelancers <span className="text-accent">Community</span>
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Why We're Building This</h3>
                  <p className="text-muted-foreground">
                    Millions of Indians have skills but no idea how to monetize them. They're stuck in the tutorial loop, 
                    afraid to take on real clients, or undercharging for their work. 
                    The Freelancers Community exists to turn skill into income — systematically.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">What You'll Get</h3>
                  <p className="text-muted-foreground">
                    Skill-building roadmaps, portfolio reviews, client acquisition strategies, 
                    pricing guidance, and access to real freelance projects through our agency partnerships.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Our Aim</h3>
                  <p className="text-muted-foreground">
                    To help 1000 freelancers hit their first ₹1 Lakh month within the next year. 
                    We're creating a pipeline from "I have no experience" to "I'm fully booked."
                  </p>
                </div>
              </div>
              <a href={WHATSAPP_FREELANCERS} target="_blank" rel="noreferrer">
                <Button className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-6 text-lg font-bold">
                  <Zap className="mr-2 h-5 w-5" />
                  Join Freelancers Community
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Which Community is <span className="text-primary">Right for You</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 glass rounded-2xl border border-primary/30">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Founders Community</h3>
              <ul className="space-y-3">
                {["You have a startup idea", "You want to build a product/company", "You're looking for co-founders", "You want to raise funding", "You think long-term wealth building"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 glass rounded-2xl border border-accent/30">
              <h3 className="font-heading text-xl font-bold text-accent mb-4">Freelancers Community</h3>
              <ul className="space-y-3">
                {["You have a skill to offer", "You want to earn while learning", "You prefer flexibility over equity", "You want quick income results", "You're building towards agency/consulting"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Your Tribe is <span className="text-primary">Waiting</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Stop building alone. Join a community that celebrates your wins and pushes you through the lows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATSAPP_FOUNDERS} target="_blank" rel="noreferrer">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow">
                  <Flame className="mr-2 h-5 w-5" />
                  Join as Founder
                </Button>
              </a>
              <a href={WHATSAPP_FREELANCERS} target="_blank" rel="noreferrer">
                <Button className="bg-accent text-black hover:bg-accent/90 rounded-full px-10 py-6 text-lg font-bold">
                  <Zap className="mr-2 h-5 w-5" />
                  Join as Freelancer
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CommunityPage;
