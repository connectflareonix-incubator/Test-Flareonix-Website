import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, PenTool, Video, BarChart, Megaphone, CheckCircle, ArrowRight, Zap, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { trackPageView } from '@/utils/analytics';
import { GOOGLE_FORM_URL } from '@/config/constants';

const FreelancerHubPage = () => {
  const { login } = useAuth();

  useEffect(() => {
    trackPageView('/freelancer-hub');
  }, []);

  const skills = [
    { icon: <Code className="h-6 w-6" />, name: "Web Development", demand: "High" },
    { icon: <Palette className="h-6 w-6" />, name: "UI/UX Design", demand: "High" },
    { icon: <PenTool className="h-6 w-6" />, name: "Graphic Design", demand: "Medium" },
    { icon: <Video className="h-6 w-6" />, name: "Video Editing", demand: "High" },
    { icon: <Megaphone className="h-6 w-6" />, name: "Social Media Marketing", demand: "High" },
    { icon: <BarChart className="h-6 w-6" />, name: "Data Analytics", demand: "Medium" },
  ];

  const journey = [
    { step: "01", title: "Apply", desc: "Submit your application with portfolio" },
    { step: "02", title: "Assessment", desc: "Complete a skill-based test" },
    { step: "03", title: "Onboarding", desc: "Join the community and training" },
    { step: "04", title: "Match", desc: "Get matched with real projects" },
    { step: "05", title: "Earn", desc: "Complete projects and get paid" },
    { step: "06", title: "Grow", desc: "Level up your rates and skills" },
  ];

  const handleApply = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  };

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
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
              Freelancer Hub
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              From Zero to <span className="text-accent">₹1 Lakh/Month</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              We don't just teach freelancing — we give you real clients, real projects, and real income. 
              Join India's most action-oriented freelancer community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleApply}
                className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-6 text-lg font-bold"
                data-testid="apply-freelancer"
              >
                <Zap className="mr-2 h-5 w-5" />
                Apply to Join
              </Button>
              <Button
                onClick={login}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                Already a member? Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
              Why Join
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              What Makes Us <span className="text-accent">Different</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="h-10 w-10" />, title: "Real Projects", desc: "No fake gigs. We connect you with actual clients from our agency and partner network." },
              { icon: <Trophy className="h-10 w-10" />, title: "Skill-Based Growth", desc: "Level up through our structured program. Higher skills = higher rates." },
              { icon: <Zap className="h-10 w-10" />, title: "AI-Powered Tools", desc: "Access AI tools that help you deliver 3x faster than competitors." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 glass rounded-2xl border border-white/10 text-center hover:border-accent/30 transition-all"
              >
                <div className="text-accent mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills We Accept */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
              In-Demand Skills
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Skills We're <span className="text-accent">Looking For</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 glass rounded-xl border border-white/10 hover:border-accent/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-accent">{skill.icon}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    skill.demand === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {skill.demand} Demand
                  </span>
                </div>
                <h3 className="font-semibold text-white">{skill.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
              Your Journey
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              From Application to <span className="text-accent">Earning</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {journey.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-4 text-center"
              >
                <div className="text-4xl font-heading font-black text-accent/30 mb-2">{item.step}</div>
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                {index < journey.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-2 h-4 w-4 text-accent/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Potential */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
                Earning Potential
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Real Numbers, <span className="text-accent">Real Results</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Our freelancers have gone from ₹0 to consistent 5-figure months. Here's what's possible 
                when you combine skills, support, and real opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { level: "Beginner", range: "₹10K - ₹30K/month", time: "Month 1-3" },
                { level: "Intermediate", range: "₹30K - ₹60K/month", time: "Month 3-6" },
                { level: "Advanced", range: "₹60K - ₹1L+/month", time: "Month 6+" },
              ].map((tier, index) => (
                <div key={tier.level} className="p-6 glass rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{tier.level}</h4>
                      <p className="text-sm text-muted-foreground">{tier.time}</p>
                    </div>
                    <div className="text-2xl font-heading font-bold text-accent">{tier.range}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
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
              Ready to Start <span className="text-accent">Earning</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Applications are reviewed weekly. The sooner you apply, the sooner you start earning.
            </p>
            <Button
              onClick={handleApply}
              className="bg-accent text-black hover:bg-accent/90 rounded-full px-10 py-6 text-lg font-bold"
            >
              <Zap className="mr-2 h-5 w-5" />
              Apply Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FreelancerHubPage;
