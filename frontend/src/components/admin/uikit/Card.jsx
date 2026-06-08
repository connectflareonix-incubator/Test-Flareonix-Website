import React from 'react';

const Card = ({ children, className = '', ...rest }) => (
  <div className={`p-5 rounded-xl bg-[#161616] border border-white/10 ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;
