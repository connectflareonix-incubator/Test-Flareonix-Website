import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostMeta from '@/components/blog/BlogPostMeta';
import BlogPostBody from '@/components/blog/BlogPostBody';
import BlogCommentsSection from '@/components/blog/BlogCommentsSection';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

const BlogPostPage = () => {
  const { slug } = useParams();
  const nav = useNavigate();
  const { user, login } = useAuth();
  const [post, setPost] = useState(null);

  const load = () => {
    axios.get(`${API}/blog/posts/${slug}`).then((r) => setPost(r.data))
      .catch(() => { toast.error('Post not found'); nav('/blog'); });
  };
  useEffect(() => { load(); }, [slug]); // eslint-disable-line

  if (!post) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="pt-32 text-center text-white/40">Loading…</div>
        <Footer />
      </main>
    );
  }

  const onSubmitComment = async (content) => {
    try {
      await axios.post(`${API}/blog/posts/${post.id}/comments`, { content }, { withCredentials: true });
      toast.success('Comment posted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm text-primary mb-6 ml-4">
              <Edit3 className="h-4 w-4" /> Edit posts in Admin
            </Link>
          )}
          {post.featured_image_url && (
            <div data-animate="wipe-left" className="mb-8 rounded-xl overflow-hidden">
              <img src={post.featured_image_url} alt="" className="w-full max-h-[400px] object-cover" />
            </div>
          )}
          <BlogPostMeta post={post} />
          <h1 data-animate="fade-up" className="font-heading text-3xl md:text-5xl font-black text-white mb-6">
            {post.title}
          </h1>
          <BlogPostBody html={post.content} tags={post.tags || []} />
          <hr className="my-10 border-white/10" />
          <BlogCommentsSection
            user={user}
            login={login}
            comments={post.comments}
            onSubmit={onSubmitComment}
          />
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogPostPage;
