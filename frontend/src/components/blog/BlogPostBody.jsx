import React from 'react';
import DOMPurify from 'dompurify';

const BlogPostBody = ({ html, tags = [] }) => {
  const safe = DOMPurify.sanitize(html || '');
  return (
    <>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: safe }} />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {tags.map((t) => (
            <span key={t} className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70">#{t}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogPostBody;
