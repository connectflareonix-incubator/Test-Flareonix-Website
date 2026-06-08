import React from 'react';
import { Flame, Shield, Zap } from 'lucide-react';

const items = [
  { icon: Flame, label: 'Youth-Powered Execution' },
  { icon: Shield, label: 'Results-First Approach' },
  { icon: Zap, label: 'Tier 2/3 India Experts' },
];

const TrustBadgeRow = ({ className = '' }) => (
  <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`} data-testid="trust-badges">
    {items.map((it) => {
      const Icon = it.icon;
      return (
        <span
          key={it.label}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#0D0D0D]/80 text-white border border-[#FF6B00]/40"
        >
          <Icon className="h-4 w-4 text-[#FF6B00]" />
          {it.label}
        </span>
      );
    })}
  </div>
);

export default TrustBadgeRow;
