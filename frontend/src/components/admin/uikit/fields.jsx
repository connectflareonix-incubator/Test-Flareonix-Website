import React from 'react';

export const TextInput = (props) => (
  <input
    {...props}
    className={`w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#FF6B00] outline-none ${props.className || ''}`}
  />
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#FF6B00] outline-none ${props.className || ''}`}
  />
);

export const Select = (props) => (
  <select
    {...props}
    className={`w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#FF6B00] outline-none ${props.className || ''}`}
  />
);
