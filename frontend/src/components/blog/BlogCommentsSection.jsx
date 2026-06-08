import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import BlogCommentItem from './BlogCommentItem';

const BlogCommentsSection = ({ user, login, comments, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const myComments = (comments || []).filter((c) => user && c.user_id === user.user_id);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (comment.trim().length < 2) return;
    setSubmitting(true);
    await onSubmit(comment);
    setComment('');
    setSubmitting(false);
  };

  return (
    <section data-testid="blog-comments">
      <h3 className="font-heading text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" /> Join the conversation
      </h3>

      {!user ? (
        <div className="p-5 rounded-xl glass border border-primary/20 text-center">
          <p className="text-sm text-white/70 mb-3">Login to comment and view your conversation thread.</p>
          <Button onClick={login} className="bg-primary text-white rounded-full px-6">Login with Google</Button>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="space-y-3 mb-6">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts…"
              rows={4}
              className="bg-black/40 border-white/10 text-white"
              data-testid="blog-comment-input"
            />
            <Button type="submit" disabled={submitting} className="bg-primary text-white rounded-full px-6" data-testid="blog-comment-submit">
              {submitting ? 'Posting…' : 'Post Comment'}
            </Button>
          </form>

          {myComments.length === 0 ? (
            <p className="text-sm text-white/40">You haven&apos;t commented yet. Share your perspective above.</p>
          ) : (
            <div className="space-y-3">
              {myComments.map((c) => <BlogCommentItem key={c.id} c={c} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BlogCommentsSection;
