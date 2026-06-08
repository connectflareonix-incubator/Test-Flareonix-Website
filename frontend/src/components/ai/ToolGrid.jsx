import React from 'react';
import ToolCard from './ToolCard';
import { TOOLS } from './toolsConfig';

const ToolGrid = ({ onSelect }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ai-tools-grid">
      {TOOLS.map((tool, i) => (
        <ToolCard key={tool.slug} tool={tool} onSelect={onSelect} index={i} />
      ))}
    </div>
  );
};

export default ToolGrid;
