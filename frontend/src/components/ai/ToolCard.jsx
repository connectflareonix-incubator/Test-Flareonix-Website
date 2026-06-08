import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ToolCard = ({ tool, onSelect, index }) => {
  const Icon = tool.icon;
  return (
    <motion.button
      type="button"
      data-testid={`ai-tool-card-${tool.slug}`}
      onClick={() => onSelect(tool.slug)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="text-left p-6 glass rounded-2xl border border-white/10 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_rgba(255,69,0,0.5)] transition-all group"
    >
      <div className={`mb-4 ${tool.accent}`}>
        <Icon className="h-8 w-8 group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="font-heading text-xl font-bold text-white mb-2">{tool.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
      <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold">
        Open <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </motion.button>
  );
};

export default ToolCard;
