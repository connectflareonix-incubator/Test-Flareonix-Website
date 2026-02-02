import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Lightbulb, Users, Rocket } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "From Zero to Founder",
      description: "We don't expect prior experience. We build founders from scratch."
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Ideas to Execution",
      description: "Move beyond thinking. Start building, validating, and scaling."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Over Competition",
      description: "Collaborate with like-minded builders who push each other forward."
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Real-World Thinking",
      description: "Not theoretical. Practical startup wisdom that actually works."
    }
  ];

  return (
    <section 
      id="about" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#050505]"
      data-testid="about-section"
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
            Our Story
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why <span className="text-primary">Flareonix</span>?
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Most Indian youth have <span className="text-white font-semibold">ideas, energy, and ambition</span> — 
              but no roadmap, no ecosystem, no guidance, and no execution culture.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              The startup world feels distant. The path seems unclear. 
              Traditional systems weren't built for first-generation founders.
            </p>
            <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
              Flareonix changes that.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're building a movement where <span className="text-primary">community meets execution</span>, 
              where AI amplifies human ambition, and where every hungry individual 
              gets a fair shot at building something real.
            </p>

            {/* Phoenix Metaphor */}
            <div className="mt-8 p-6 glass rounded-xl border border-white/10">
              <p className="text-white italic font-accent text-lg">
                "Like the Phoenix, we rise from the ordinary. We ignite with purpose. 
                We conquer through action."
              </p>
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="p-6 glass rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-300 group"
                data-testid={`about-feature-${index}`}
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To build <span className="text-primary font-semibold">founders, not followers</span>. 
              To create an ecosystem where every ambitious Indian youth can transform 
              their hunger into something extraordinary.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
