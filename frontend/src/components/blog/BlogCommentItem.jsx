import React from 'react';

const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const BlogCommentItem = ({ c }) => (
  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-white/10">
    <div className="text-xs text-white/40 mb-1">{fmt(c.created_at)}</div>
    <p className="text-sm text-white/85">{c.content}</p>
    {c.admin_reply && (
      <div className="mt-3 pl-3 border-l-2 border-primary">
        <div className="text-xs text-primary font-semibold mb-1">Flareonix Reply</div>
        <p className="text-sm text-white/80">{c.admin_reply}</p>
      </div>
    )}
  </div>
);

export default BlogCommentItem;
