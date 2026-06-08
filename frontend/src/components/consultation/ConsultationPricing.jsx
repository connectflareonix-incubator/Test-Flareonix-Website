import React from 'react';
import FlameIcon from '@/components/decor/FlameIcon';
import { Sparkles } from 'lucide-react';
import { PACKAGES, OTHER_SERVICES, ENGAGEMENT_OPTIONS } from './packagesData';

const PricingRow = ({ label, cell }) => (
  <tr className="border-t border-white/5">
    <td className="p-4 font-semibold text-white/60 sticky left-0 bg-[#0c0c0c]">{label}</td>
    {PACKAGES.map((p) => <td key={p.slug} className="p-4 align-top">{cell(p)}</td>)}
  </tr>
);

const PackageItems = ({ items }) => (
  <ul className="space-y-2">
    {items.map((it, i) => (
      <li key={i} className="flex items-start gap-2 text-xs">
        <FlameIcon size={14} className="mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-white/85">{it.label}</div>
          <div className="text-primary text-xs">{it.price}</div>
          {it.market && <div className="text-white/40 text-[10px] line-through">Market: {it.market}</div>}
          {it.sub && <div className="text-white/40 text-[10px]">{it.sub}</div>}
        </div>
      </li>
    ))}
  </ul>
);

const ConsultationPricing = () => (
  <section id="pricing" className="py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10" data-animate="fade-up">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
          Transparent pricing. <span className="text-primary">Real value.</span>
        </h2>
        <p className="text-white/60 mt-2">Compare every tier side-by-side. Scroll horizontally on mobile.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-[#141414] text-white/80">
            <tr>
              <th className="text-left p-4 sticky left-0 bg-[#141414] z-10">Tier</th>
              {PACKAGES.map((p) => (
                <th key={p.slug} className="text-left p-4 font-heading text-base text-primary">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#0c0c0c]">
            <PricingRow label="Goal" cell={(p) => <span className="text-white/80">{p.goal}</span>} />
            <PricingRow label="Market Rate" cell={(p) => <span className="text-white/50 line-through">{p.market}</span>} />
            <PricingRow label="Flareonix Price" cell={(p) => <span className="text-primary font-bold text-base">{p.ours}</span>} />
            <PricingRow label="Best For" cell={(p) => <span className="text-white/70 text-xs">{p.best}</span>} />
            <PricingRow label="Included" cell={(p) => <PackageItems items={p.items} />} />
            <PricingRow label="Why it works" cell={(p) => <span className="text-white/70 italic text-xs">{p.why}</span>} />
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h3 className="font-heading text-xl font-bold text-white mb-4">À la carte / Other Services</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3" data-stagger-children>
          {OTHER_SERVICES.map((s) => (
            <div key={s.name} className="p-4 rounded-lg bg-[#141414] border border-white/10">
              <div className="font-semibold text-white text-sm">{s.name}</div>
              <div className="text-xs text-white/50 mt-1 italic">{s.why}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-heading text-xl font-bold text-white mb-4 text-center">Flexible Engagement Options</h3>
        <div className="grid md:grid-cols-4 gap-4" data-stagger-children>
          {ENGAGEMENT_OPTIONS.map((e) => (
            <div key={e.title} className="p-5 rounded-xl bg-gradient-to-br from-[#141414] to-[#0c0c0c] border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-heading font-bold text-white text-sm">{e.title}</h4>
              <p className="text-xs text-white/60 mt-2">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ConsultationPricing;
