import React from 'react';

const ConsultationProof = ({ caseStudies, testimonials }) => (
  <section className="py-16 px-6 bg-[#0a0a0a]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10" data-animate="fade-up">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
          Results we&apos;ve <span className="text-primary">ignited</span>.
        </h2>
      </div>
      {(caseStudies.length === 0 && testimonials.length === 0) ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <p className="text-white/50">
            Case studies coming soon. <span className="text-primary">Be our next success story.</span>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" data-stagger-children>
          {caseStudies.map((c) => (
            <div key={c.id} className="p-5 rounded-xl bg-[#141414] border border-white/10">
              <h4 className="font-heading font-bold text-white">{c.title}</h4>
              <div className="text-xs text-white/50 mb-2">{c.client_name}</div>
              <p className="text-sm text-white/70">{c.outcome_summary || c.results}</p>
              {c.testimonial_quote && (
                <blockquote className="mt-3 pl-3 border-l-2 border-primary italic text-xs text-white/70">
                  &ldquo;{c.testimonial_quote}&rdquo;
                </blockquote>
              )}
            </div>
          ))}
          {testimonials.map((t) => (
            <div key={t.id} className="p-5 rounded-xl bg-[#141414] border border-white/10">
              <blockquote className="italic text-sm text-white/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="text-xs text-white/60 mt-3">
                — <strong>{t.client_name}</strong>
                {t.client_role && <>, {t.client_role}</>}
                {t.client_org && <> · {t.client_org}</>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default ConsultationProof;
