import React from 'react';
import FlameIcon from './FlameIcon';

const EmberBadge = ({ children = 'Limited Slots', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CC2200] text-white shadow-[0_0_18px_-4px_rgba(255,107,0,0.6)] ${className}`}
  >
    <FlameIcon size={14} />
    {children}
  </span>
);

export default EmberBadge;
