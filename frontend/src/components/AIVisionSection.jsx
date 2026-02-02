import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Cpu, Sparkles, TrendingUp, Shield, Rocket } from 'lucide-react';

const AIVisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const aiFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Ideation",
      description: "Use AI to brainstorm, validate, and refine your startup ideas faster than ever."
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Automated Research",
      description: "Let AI handle market research, competitor analysis, and trend identification."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Content Generation",
      description: "Create compelling pitches, marketing copy, and product descriptions effortlessly."
    }
  ];

  const visionPoints = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Scalable Startups",
      description: "Build ventures designed to scale from day one."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Sustainable Growth",
      description: "Focus on real business fundamentals, not hype."
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "National Impact",
      description: "Create solutions that matter to India and beyond."
    }
  ];

  return (
    <section 
      id="vision" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden"
      data-testid="vision-section"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            AI & Incubation
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI as <span className="text-primary">Leverage</span>,<br className="hidden md:block" />
            Not Replacement
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in using AI as a powerful tool to amplify human creativity and ambition — 
            not as a shortcut to skip the hard work.
          </p>
        </motion.div>

        {/* AI Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-8 glass rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 group"
              data-testid={`ai-feature-${index}`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Incubator Vision */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
              The Future: A Full-Scale Incubator
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Flareonix isn't just a community — it's the foundation of a future incubator. 
              We're building the infrastructure to take promising founders from idea to funded startup.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our vision is to become India's most accessible startup launchpad, 
              where talent and hunger matter more than privilege and connections.
            </p>

            <div className="space-y-4 pt-4">
              {visionPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4"
                  data-testid={`vision-point-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{point.title}</h4>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-white/5 animate-pulse" />
                <div className="absolute w-3/4 h-3/4 rounded-full border border-white/10" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-primary/30 animate-border-glow" />
              </div>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Rocket className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-white font-heading font-bold text-lg">Future Incubator</p>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIVisionSection;
