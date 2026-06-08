import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight } from 'lucide-react';
import { FOUNDER_FORM, CALENDLY_LINK, FREELANCER_FORM } from '@/config/constants';

const ConsultationCTA = () => (
  <>
    <section className="py-20 px-6">
      <div
        className="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0c0c0c] border border-primary/30 text-center"
        data-animate="scale-up"
      >
        <Flame className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Ready to ignite growth?</h2>
        <p className="text-white/70 mt-3">
          Submit your project details below. Our team reviews every application and responds within 48 hours.
          If your project has strong potential, we&apos;ll personally send you a Calendly link to schedule your Strategy Meeting.
        </p>
        <a href={FOUNDER_FORM} target="_blank" rel="noreferrer" className="inline-block mt-6">
          <Button
            className="bg-primary text-white rounded-full px-8 py-6 text-base font-bold hover-glow"
            data-testid="consultation-apply-cta"
          >
            Schedule a Strategy Meeting <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
        <div className="mt-4">
          <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" className="text-sm text-white/60 hover:text-primary underline">
            Already received approval? Schedule directly →
          </a>
        </div>
      </div>
    </section>

    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center" data-animate="fade-up">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
          Want to work <span className="text-primary">with us</span>?
        </h2>
        <p className="text-white/60 mt-2">
          We&apos;re always looking for skilled freelancers and collaborators to join the Flareonix ecosystem.
        </p>
        <a href={FREELANCER_FORM} target="_blank" rel="noreferrer">
          <Button className="mt-5 bg-primary text-white rounded-full px-7 py-5 font-bold">
            Apply as Freelancer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
    </section>
  </>
);

export default ConsultationCTA;
