import React from 'react';

export const PrimaryButton = ({ children, className = '', style, ...rest }) => (
  <button
    {...rest}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all ${className}`}
    style={{ background: 'linear-gradient(135deg, #FF6B00, #CC2200)', ...(style || {}) }}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={`px-3 py-2 rounded-lg text-sm border border-white/15 hover:bg-white/5 ${className}`}
  >
    {children}
  </button>
);
