import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import RisingArrow from './RisingArrow';
import { API } from '@/config/constants';
import axios from 'axios';

const Counter = ({ value }) => {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, ease: 'easeOut' });
    const unsub = mv.on('change', (v) => setDisplay(Math.floor(v)));
    return () => { controls.stop(); unsub(); };
  }, [value, mv]);
  return <span>{display}+</span>;
};

const SocialProofCounter = ({ className = '' }) => {
  const [stats, setStats] = useState({ stat_founders: 250, stat_businesses: 40, stat_projects: 75 });

  useEffect(() => {
    axios.get(`${API}/settings`).then((r) => {
      setStats((s) => ({ ...s, ...r.data }));
    }).catch(() => {});
  }, []);

  const items = [
    { value: Number(stats.stat_founders) || 0, label: 'Founders Ignited' },
    { value: Number(stats.stat_businesses) || 0, label: 'Businesses Scaled' },
    { value: Number(stats.stat_projects) || 0, label: 'Projects Delivered' },
  ];

  return (
    <div className={`grid grid-cols-3 gap-4 md:gap-8 ${className}`} data-testid="social-proof-counter">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative text-center p-4 rounded-xl"
        >
          <div className="absolute inset-0 -z-10 rounded-xl" style={{
            background: 'radial-gradient(circle at center, rgba(255,107,0,0.12), transparent 70%)'
          }} />
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-heading text-4xl md:text-5xl font-black text-[#FF6B00]">
              <Counter value={it.value} />
            </span>
            <RisingArrow size={20} />
          </div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1">{it.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialProofCounter;
