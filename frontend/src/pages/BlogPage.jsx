import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, MessageSquare, Search, Flame } from 'lucide-react';
import axios from 'axios';
import { API } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { categoryLabel, categoryColor } from '@/lib/blogMeta';
import { Button } from '@/components/ui/button';

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
};

const BlogPage = () => {
  const { user, login } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    axios.get(`${API}/blog/posts`).then((r) => setPosts(r.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = posts
    .filter((p) => !cat || p.category === cat)
    .filter((p) => {
      if (!q || !user) return true;
      const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')} ${p.category}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const cats = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div data-animate="fade-up" className="text-center mb-10">
            <h1 className="font-heading text-4xl md:text-6xl font-black text-white">
              Flareonix <span className="text-primary">Updates & Insights</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Opportunities, behind-the-scenes notes, and growth playbooks from the team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6" data-animate="fade-in">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-black/40 flex-1 min-w-[200px] ${!user ? 'opacity-60' : ''}`}>
              <Search className="h-4 w-4 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={user ? 'Search posts…' : 'Login to search'}
                className="bg-transparent text-sm flex-1 outline-none text-white placeholder-white/30"
                disabled={!user}
                data-testid="blog-search"
              />
            </div>
            {user && (
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-black/40 border border-white/10 rounded-full px-3 py-2 text-sm">
                <option>Newest</option><option>Oldest</option>
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8" data-animate="fade-in">
            <button onClick={() => user ? setCat('') : login()} className={`px-3 py-1 rounded-full text-xs border ${!cat ? 'border-primary text-primary' : 'border-white/10 text-white/60'}`}>All</button>
            {cats.map((c) => (
              <button key={c} onClick={() => user ? setCat(c) : login()} className={`px-3 py-1 rounded-full text-xs border ${cat === c ? 'border-primary text-primary' : 'border-white/10 text-white/60'}`} style={{ borderColor: cat === c ? categoryColor(c) : undefined, color: cat === c ? categoryColor(c) : undefined }}>
                {categoryLabel(c)}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-white/40 text-center py-12">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
              <Flame className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-white/60">No posts yet — the team is writing.</p>
            </div>
          ) : (
            <div className="space-y-5" data-stagger-children>
              {filtered.map((p, i) => (
                <React.Fragment key={p.id}>
                  <Link
                    to={user ? `/blog/${p.slug}` : '#'}
                    onClick={(e) => { if (!user) { e.preventDefault(); login(); } }}
                    className="block p-5 md:p-6 rounded-xl bg-[#0f0f0f] border border-white/10 hover:border-primary/40 transition-colors group"
                    data-testid={`blog-card-${p.slug}`}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: `${categoryColor(p.category)}22`, color: categoryColor(p.category) }}>
                        {categoryLabel(p.category)}
                      </span>
                      <span className="text-xs text-white/40">{fmtDate(p.created_at)}</span>
                      <span className="text-xs text-white/40 inline-flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {(p.comments?.length || 0)} comments
                      </span>
                      {p.views > 100 && <span className="px-2 py-0.5 text-xs rounded-full bg-primary/15 text-primary">Trending</span>}
                    </div>
                    <h2 className="font-heading text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {p.title}
                    </h2>
                    {user ? (
                      <p className="text-sm text-white/60 mt-2 line-clamp-3">{p.excerpt || (p.content || '').replace(/<[^>]+>/g, '').slice(0, 200)}…</p>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 text-sm text-white/40">
                        <Lock className="h-4 w-4" /> Login to read
                      </div>
                    )}
                  </Link>

                  {!user && i === 2 && (
                    <div className="p-6 rounded-xl glass border border-primary/30 text-center" data-testid="blog-login-prompt">
                      <h3 className="font-heading text-xl font-bold text-white mb-2">Join the Flareonix community</h3>
                      <p className="text-sm text-white/60 mb-4">Read full articles, comment, and stay updated.</p>
                      <Button onClick={login} className="bg-primary text-white rounded-full px-6 hover-glow" data-testid="blog-login-cta">Login with Google</Button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default BlogPage;
