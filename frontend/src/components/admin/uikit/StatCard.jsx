import React from 'react';
import Card from './Card';

const StatCard = ({ label, value, accent = '#FF6B00' }) => (
  <Card className="text-left">
    <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
    <div className="font-heading text-3xl font-black mt-2" style={{ color: accent }}>
      {value ?? '—'}
    </div>
  </Card>
);

export default StatCard;
