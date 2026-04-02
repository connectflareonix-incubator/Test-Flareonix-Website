import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, PenTool, Lightbulb, FileText, Image, Sparkles, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { trackPageView } from '@/utils/analytics';

const AIToolsPage = () => {
  const { user, login } = useAuth();

  useEffect(() => {
    trackPageView('/ai-tools');
  }, []);

  const tools = [
    {
      icon: <PenTool className="h-8 w-8" />,
      name: "Caption Generator",
      desc: "Generate viral social media captions in seconds",
      status: "coming_soon"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      name: "Ad Copy Writer",
      desc: "Create high-converting ad copy for Meta & Google",
      status: "coming_soon"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      name: "Business Idea Generator",
      desc: "Get validated business ideas based on your skills",
      status: "coming_soon"
    },
    {
      icon: <Image className="h-8 w-8" />,
      name: "Content Calendar",
      desc: "Plan a month of content in minutes",
      status: "coming_soon"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      name: "Email Writer",
      desc: "Cold emails that actually get responses",
      status: "coming_soon"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      name: "Pitch Deck Assistant",
      desc: "Build investor-ready pitch decks with AI guidance",
      status: "coming_soon"
    }
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
              Flareonix <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Supercharge your productivity with AI tools built specifically for creators, 
              freelancers, and founders. Work smarter, not harder.
            </p>
            {!user && (
              <Button
                onClick={login}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow"
              >
                <Lock className="mr-2 h-5 w-5" />
                Login to Access
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              AI-Powered Tools
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Tools We're <span className="text-primary">Building</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all relative overflow-hidden group"
              >
                {tool.status === 'coming_soon' && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-muted-foreground">{tool.desc}</p>
                
                {tool.status === 'coming_soon' && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-white font-semibold">Coming Soon</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              What to <span className="text-primary">Expect</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Free Tier", desc: "Basic access to all tools with limited usage" },
              { title: "Pro Features", desc: "Unlimited usage for community members" },
              { title: "Custom Training", desc: "AI models trained on your specific needs" },
              { title: "API Access", desc: "Integrate our tools into your workflow" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-xl border border-white/10"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
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
              Be the First to <span className="text-primary">Access</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join Flareonix today to get early access when our AI tools launch.
            </p>
            <Button
              onClick={login}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow"
            >
              <Brain className="mr-2 h-5 w-5" />
              Join to Get Early Access
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AIToolsPage;
