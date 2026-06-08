import React from 'react';
import FlameIcon from '@/components/decor/FlameIcon';

const SERVICES = [
  'Startup Strategy & Launch Planning',
  'Brand Building & Digital Presence',
  'Pitch Preparation & Investor Readiness',
  'Social Media & Content Growth Systems',
  'Lead Generation & Funnel Building',
  'Paid Ads Management (Meta/Google)',
  'WhatsApp / CRM Automation',
  'Business Development Support',
  'Website Development & Management',
  'App Development (No-Code / MVP)',
  'E-Commerce Store Setup',
  'Logo, Branding & Content Creation',
  'Growth Consulting (sessions or ongoing)',
  'Any required service — modular & customizable',
];

const ConsultationServices = () => (
  <section id="services" className="py-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12" data-animate="fade-up">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
          What we bring to the <span className="text-primary">table</span>.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4" data-stagger-children>
        {SERVICES.map((s) => (
          <div key={s} className="p-4 rounded-lg bg-[#141414] border border-white/10 flex items-start gap-3">
            <FlameIcon size={20} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm text-white/85">{s}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-white/40 mt-6">
        Services are modular and customisable per project.
      </p>
    </div>
  </section>
);

export default ConsultationServices;
