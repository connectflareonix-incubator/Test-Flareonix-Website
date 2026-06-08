import React from 'react';

export const FlameIcon = ({ size = 18, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
    style={style}
  >
    <path
      d="M12 2.5c.3 3.6 3 4.6 3 7.5 0 1.7-1 3-2.5 3 .6-1.4.1-2.8-1-3.5-.6 1.4-2 2.3-2 4 0 2.5 2 4.5 5 4.5s5-2.3 5-5c0-4-4.5-5.5-7.5-10.5Z"
      fill="#FF6B00"
    />
    <path
      d="M9.5 13.5C8.5 14.2 8 15.3 8 16.5 8 18.4 9.6 20 11.6 20c-1.6-.5-2.6-1.9-2.6-3.5 0-1 .2-1.9.5-3Z"
      fill="#FFB300"
    />
  </svg>
);

export default FlameIcon;
