import React from 'react';

export const Empty = ({ children = 'Nothing here yet.' }) => (
  <div className="p-10 text-center text-white/40 border border-dashed border-white/10 rounded-xl">
    {children}
  </div>
);

export const Loader = () => (
  <div className="p-10 text-center text-white/40">Loading…</div>
);
