import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import PhoenixSilhouette from '@/components/decor/PhoenixSilhouette';
import EmberBadge from '@/components/decor/EmberBadge';
import { FOUNDER_FORM } from '@/config/constants';

const ConsultationHero = ({ onScrollServices }) => (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden">
    <PhoenixSilhouette className="absolute right-[-60px] top-1/4 hidden md:block" opacity={0.15} size={420} />
    <div className="max-w-5xl mx-auto relative z-10" data-stagger-children>
      <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-tight">
        Don&apos;t just grow.
        <br />
        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FFB300] bg-clip-text text-transparent">
          Ignite.
        </span>
      </h1>
      <p className="text-lg md:text-xl text-white/70 max-w-2xl mt-6">
        Flareonix is your growth partner — not just a service provider. We work <em>with</em> you, not <em>for</em> you.
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        <a href={FOUNDER_FORM} target="_blank" rel="noreferrer" data-testid="consultation-strategy-cta">
          <Button className="bg-primary text-white rounded-full px-7 py-6 text-base font-bold hover-glow">
            <Calendar className="mr-2 h-5 w-5" /> Schedule a Strategy Meeting
          </Button>
        </a>
        <Button
          variant="outline"
          onClick={onScrollServices}
          className="border-white/20 text-white hover:bg-white/10 rounded-full px-7 py-6 text-base"
        >
          Explore Services <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="mt-5"><EmberBadge>Limited Strategy Slots Available</EmberBadge></div>
    </div>
  </section>
);

export default ConsultationHero;
