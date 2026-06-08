import React from 'react';

/** Atmospheric phoenix silhouette — geometric, not illustrative. */
const PhoenixSilhouette = ({ className = '', opacity = 0.2, size = 360 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    aria-hidden="true"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="phx-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#CC2200" />
      </linearGradient>
    </defs>
    <g fill="url(#phx-g)">
      <path d="M200 60 L230 130 L300 110 L260 170 L340 210 L255 215 L290 290 L210 240 L200 340 L190 240 L110 290 L145 215 L60 210 L140 170 L100 110 L170 130 Z" />
    </g>
    <g fill="none" stroke="url(#phx-g)" strokeWidth="2" opacity="0.6">
      <path d="M50 230 Q110 200 200 220 Q290 200 350 230" />
      <path d="M80 180 Q140 150 200 170 Q260 150 320 180" />
    </g>
  </svg>
);

export default PhoenixSilhouette;
