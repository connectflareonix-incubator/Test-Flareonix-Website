import React from 'react';
import { ArrowUpRight, Flame } from 'lucide-react';

const CollabCard = ({ c }) => {
  const Tag = c.link ? 'a' : 'div';
  return (
    <Tag
      {...(c.link ? { href: c.link, target: '_blank', rel: 'noreferrer' } : {})}
      className="p-5 rounded-xl bg-[#141414] border border-white/10 hover:border-primary/40 transition text-center"
    >
      {c.logo_url
        ? <img src={c.logo_url} alt={c.org_name} className="h-12 mx-auto mb-3 object-contain" />
        : <Flame className="h-8 w-8 text-primary mx-auto mb-3" />}
      <div className="font-heading font-bold text-white">{c.org_name}</div>
      <div className="text-xs text-white/40 mt-1">
        {(c.collab_type || '').replace('_', ' ')} · {c.year}
      </div>
      {c.link && <ArrowUpRight className="h-4 w-4 text-primary inline-block mt-2" />}
    </Tag>
  );
};

export default CollabCard;
