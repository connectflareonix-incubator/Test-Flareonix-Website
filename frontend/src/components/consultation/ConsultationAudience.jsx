import React from 'react';
import { Rocket, Building2, Briefcase, Heart } from 'lucide-react';

const AUDIENCE = [
  { icon: Rocket, title: 'Founders & Startups', desc: 'From idea to scale — built for the speed of ambition.' },
  { icon: Building2, title: 'Local Businesses', desc: 'Tier 2/3 brands ready to go fully digital.' },
  { icon: Briefcase, title: 'Freelancers & Creators', desc: 'Scale from solo to a real business.' },
  { icon: Heart, title: 'NGOs & Youth Orgs', desc: 'Amplify mission-led work with real reach.' },
];

const ConsultationAudience = () => (
  <section className="py-20 bg-[#0a0a0a]">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12" data-animate="fade-up">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
          Built for <span className="text-primary">bold builders</span>.
        </h2>
      </div>
      <div className="grid md:grid-cols-4 gap-5" data-stagger-children>
        {AUDIENCE.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.title} className="p-6 rounded-xl bg-[#141414] border border-white/10">
              <Icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-bold text-white">{a.title}</h3>
              <p className="text-sm text-white/60 mt-1">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ConsultationAudience;
