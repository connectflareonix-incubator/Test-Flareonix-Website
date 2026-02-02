import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Brain, Lightbulb, Coins, Rocket, Target } from 'lucide-react';

const EcosystemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bentoItems = [
    {
      title: "Community",
      description: "Connect with like-minded ambitious youth. Builders, thinkers, doers — all united by the hunger to create.",
      icon: <Users className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1558023608-bbcc13ffdc24?w=800&q=80",
      size: "lg",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "AI-Powered Tools",
      description: "Leverage AI for ideation, validation, content, and MVP thinking. AI as a tool, not a shortcut.",
      icon: <Brain className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      size: "tall",
      gradient: "from-accent/20 to-transparent"
    },
    {
      title: "Mentorship",
      description: "Learn from founders who've walked the path. Real guidance, not theoretical advice.",
      icon: <Lightbulb className="h-8 w-8" />,
      size: "sm",
      gradient: "from-white/10 to-transparent"
    },
    {
      title: "Resources & Support",
      description: "Access tools, templates, and resources designed for early-stage founders.",
      icon: <Coins className="h-8 w-8" />,
      size: "wide",
      gradient: "from-primary/10 to-transparent"
    },
    {
      title: "Startup Incubation",
      description: "From idea to validation to execution. The complete journey of building real startups.",
      icon: <Rocket className="h-8 w-8" />,
      size: "sm",
      gradient: "from-accent/15 to-transparent"
    },
    {
      title: "Execution Culture",
      description: "Move beyond ideas. Build, ship, iterate, and scale with a community that does.",
      icon: <Target className="h-8 w-8" />,
      size: "sm",
      gradient: "from-white/5 to-transparent"
    }
  ];

  return (
    <section 
      id="ecosystem" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0a0a0a]"
      data-testid="ecosystem-section"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            The Ecosystem
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="text-primary">Build</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem designed for first-generation founders. 
            From zero to builder. From builder to founder.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Large Card - Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-2xl border border-white/10 bento-item group"
            data-testid="ecosystem-community"
          >
            <div className="absolute inset-0">
              <img 
                src={bentoItems[0].image} 
                alt={bentoItems[0].title}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${bentoItems[0].gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>
            <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
              <div className="text-primary mb-4">{bentoItems[0].icon}</div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                {bentoItems[0].title}
              </h3>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                {bentoItems[0].description}
              </p>
            </div>
          </motion.div>

          {/* Tall Card - AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:row-span-2 relative overflow-hidden rounded-2xl border border-white/10 bento-item group"
            data-testid="ecosystem-ai"
          >
            <div className="absolute inset-0">
              <img 
                src={bentoItems[1].image} 
                alt={bentoItems[1].title}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${bentoItems[1].gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            </div>
            <div className="relative p-6 h-full flex flex-col justify-end min-h-[300px] lg:min-h-[400px]">
              <div className="text-accent mb-4">{bentoItems[1].icon}</div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">
                {bentoItems[1].title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                {bentoItems[1].description}
              </p>
            </div>
          </motion.div>

          {/* Mentorship Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bento-item glass"
            data-testid="ecosystem-mentorship"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bentoItems[2].gradient}`} />
            <div className="relative p-6 h-full flex flex-col justify-between min-h-[200px]">
              <div className="text-white/80 mb-4">{bentoItems[2].icon}</div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {bentoItems[2].title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bentoItems[2].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Resources Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/10 bento-item glass"
            data-testid="ecosystem-resources"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bentoItems[3].gradient}`} />
            <div className="relative p-6 h-full flex flex-col justify-between min-h-[180px]">
              <div className="text-primary/80 mb-4">{bentoItems[3].icon}</div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  {bentoItems[3].title}
                </h3>
                <p className="text-muted-foreground">
                  {bentoItems[3].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Incubation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bento-item glass"
            data-testid="ecosystem-incubation"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bentoItems[4].gradient}`} />
            <div className="relative p-6 h-full flex flex-col justify-between min-h-[200px]">
              <div className="text-accent/80 mb-4">{bentoItems[4].icon}</div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {bentoItems[4].title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bentoItems[4].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Execution Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bento-item glass"
            data-testid="ecosystem-execution"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bentoItems[5].gradient}`} />
            <div className="relative p-6 h-full flex flex-col justify-between min-h-[200px]">
              <div className="text-white/70 mb-4">{bentoItems[5].icon}</div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {bentoItems[5].title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bentoItems[5].description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
