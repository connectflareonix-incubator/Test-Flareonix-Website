import React from 'react';

const SectionHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div>
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
    </div>
    <div className="flex gap-2 flex-wrap">{actions}</div>
  </div>
);

export default SectionHeader;
