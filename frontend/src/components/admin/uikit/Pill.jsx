import React from 'react';

const colorMap = {
  orange: 'bg-[#FF6B00]/15 text-[#FF6B00]',
  green: 'bg-green-500/15 text-green-400',
  red: 'bg-red-500/15 text-red-400',
  blue: 'bg-blue-500/15 text-blue-400',
  gray: 'bg-white/10 text-white/70',
  yellow: 'bg-yellow-500/15 text-yellow-400',
};

const Pill = ({ children, color = 'orange' }) => (
  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colorMap[color] || colorMap.gray}`}>
    {children}
  </span>
);

export default Pill;
