import React from 'react';
import { categoryLabel, categoryColor } from '@/lib/blogMeta';

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const BlogPostMeta = ({ post }) => (
  <div className="flex flex-wrap items-center gap-2 mb-4" data-animate="fade-in">
    <span
      className="px-2 py-0.5 text-xs rounded-full font-medium"
      style={{ background: `${categoryColor(post.category)}22`, color: categoryColor(post.category) }}
    >
      {categoryLabel(post.category)}
    </span>
    <span className="text-xs text-white/40">{fmtDate(post.created_at)}</span>
    <span className="text-xs text-white/40">by Flareonix Team</span>
    <span className="text-xs text-white/40">· {post.views || 0} views</span>
  </div>
);

export default BlogPostMeta;
