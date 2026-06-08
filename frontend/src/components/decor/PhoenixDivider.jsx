import React from 'react';

const PhoenixDivider = ({ className = '' }) => (
  <div className={`relative w-full h-8 my-12 ${className}`} aria-hidden="true">
    <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent" />
    <svg
      width="48"
      height="32"
      viewBox="0 0 48 32"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d="M2 16c8-2 12-8 22-8s14 6 22 8c-7-1-11 4-22 4S9 15 2 16Z"
        fill="none"
        stroke="#FF6B00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="16" r="1.5" fill="#FFB300" />
    </svg>
  </div>
);

export default PhoenixDivider;
