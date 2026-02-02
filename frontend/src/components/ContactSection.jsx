import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf5EK_CDUtKwZFo1s9z6MeM-XIoeNfegqdODcNbCGSlRa4Lcw/viewform";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501";
const INSTAGRAM_URL = "https://instagram.com/flare.onix";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactLinks = [
    {
      title: "Instagram",
      description: "Follow us for daily insights and updates",
      icon: <Instagram className="h-6 w-6" />,
      href: INSTAGRAM_URL,
      label: "@flare.onix",
      color: "from-pink-500/20 to-purple-500/20"
    },
    {
      title: "WhatsApp",
      description: "Join our community channel",
      icon: <MessageCircle className="h-6 w-6" />,
      href: WHATSAPP_URL,
      label: "Join Channel",
      color: "from-green-500/20 to-emerald-500/20"
    }
  ];

  return (
    <section 
      id="contact" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#050505]"
      data-testid="contact-section"
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
            Connect With Us
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's Build <span className="text-primary">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to start your journey? We're here to help you ignite your potential.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative p-6 glass rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden"
              data-testid={`contact-${link.title.toLowerCase()}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {link.description}
                  </p>
                  <span className="text-primary font-medium">{link.label}</span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="max-w-xl mx-auto p-8 glass rounded-2xl border border-primary/30">
            <h3 className="font-heading text-2xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Fill out our quick form and take the first step towards building something that actually matters.
            </p>
            <Button
              onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold transition-all hover:scale-105 hover-glow"
              data-testid="contact-form-btn"
            >
              Start Your Journey
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground mt-12 italic"
        >
          "Let's build something that actually matters."
        </motion.p>
      </div>
    </section>
  );
};

export default ContactSection;
