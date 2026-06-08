import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Textarea, Select, Pill, Loader, Empty } from '../ui';
import RichTextEditor from '../RichTextEditor';
import { readFileAsDataURL } from '../fileUtil';
import { toast } from 'sonner';

const empty = {
  title: '', slug: '', category: 'Updates', tags: '', featured_image_url: '',
  content: '', excerpt: '', status: 'draft',
};

const Blog = () => {
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [q, setQ] = useState('');
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState('posts');
  const [filter, setFilter] = useState('');

  const load = async () => {
    const data = await adminApi.listPosts();
    setPosts(data);
  };
  const loadComments = async () => setComments(await adminApi.listComments(filter));

  useEffect(() => { load(); }, []);
  useEffect(() => { if (tab === 'comments') loadComments(); }, [tab, filter]);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (p) => {
    setForm({ ...p, tags: (p.tags || []).join(', ') });
    setEditing(p.id);
  };

  const save = async (publish) => {
    const body = {
      title: form.title,
      slug: form.slug || undefined,
      content: form.content,
      excerpt: form.excerpt,
      featured_image_url: form.featured_image_url || null,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: publish ? 'published' : 'draft',
    };
    try {
      if (editing === 'new') await adminApi.createPost(body);
      else await adminApi.updatePost(editing, body);
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (e) { toast.error('Failed to save'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await adminApi.deletePost(id);
    load();
  };

  const onImage = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dataUrl = await readFileAsDataURL(f);
      setForm((s) => ({ ...s, featured_image_url: dataUrl }));
    } catch (err) { toast.error(err.message); }
  };

  if (posts === null) return <Loader />;

  if (editing) {
    return (
      <div data-testid="admin-blog-editor">
        <SectionHeader
          title={editing === 'new' ? 'New Blog Post' : 'Edit Blog Post'}
          actions={[<GhostButton key="back" onClick={() => setEditing(null)}>Back</GhostButton>]}
        />
        <Card className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Title</label>
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} data-testid="blog-title" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60">Slug</label>
              <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/60">Category</label>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Opportunities', 'Updates', 'Announcements', 'Events', 'Founders_Note'].map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60">Tags (comma separated)</label>
            <TextInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/60">Excerpt</label>
            <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/60">Featured image</label>
            <input type="file" accept="image/*" onChange={onImage} className="text-sm" />
            {form.featured_image_url && <img src={form.featured_image_url} alt="" className="mt-2 max-h-32 rounded" />}
          </div>
          <div>
            <label className="text-xs text-white/60">Content</label>
            <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
          </div>
          <div className="flex gap-2">
            <GhostButton onClick={() => save(false)}>Save Draft</GhostButton>
            <PrimaryButton onClick={() => save(true)} data-testid="blog-publish">Publish</PrimaryButton>
          </div>
        </Card>
      </div>
    );
  }

  const filtered = (posts || []).filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div data-testid="admin-blog">
      <SectionHeader
        title="Blog Management"
        actions={[
          <GhostButton key="t1" onClick={() => setTab('posts')} className={tab === 'posts' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Posts</GhostButton>,
          <GhostButton key="t2" onClick={() => setTab('comments')} className={tab === 'comments' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Comments</GhostButton>,
          tab === 'posts' && <PrimaryButton key="new" onClick={openNew} data-testid="blog-new"><Plus className="inline h-4 w-4 mr-1" /> New Post</PrimaryButton>,
        ]}
      />

      {tab === 'posts' && (
        <Card>
          <TextInput placeholder="Search title..." value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-sm" />
          {filtered.length === 0 ? <Empty>No posts yet.</Empty> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/60">
                  <tr><th className="p-2">Title</th><th className="p-2">Category</th><th className="p-2">Status</th><th className="p-2">Views</th><th className="p-2">Created</th><th className="p-2"></th></tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-white/5">
                      <td className="p-2">{p.title}</td>
                      <td className="p-2"><Pill color="gray">{p.category}</Pill></td>
                      <td className="p-2"><Pill color={p.status === 'published' ? 'green' : 'yellow'}>{p.status}</Pill></td>
                      <td className="p-2"><Eye className="inline h-3 w-3 mr-1" />{p.views || 0}</td>
                      <td className="p-2 text-white/50">{(p.created_at || '').slice(0, 10)}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/10 rounded mr-1"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => del(p.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab === 'comments' && (
        <Card>
          <div className="flex gap-2 mb-4 flex-wrap">
            {['', 'unread', 'replied', 'unreplied'].map((f) => (
              <GhostButton key={f} onClick={() => setFilter(f)} className={filter === f ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>
                {f || 'All'}
              </GhostButton>
            ))}
          </div>
          {comments.length === 0 ? <Empty>No comments.</Empty> : (
            <div className="space-y-2">
              {comments.map((c) => (
                <CommentRow key={c.id} c={c} onChange={loadComments} />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

const CommentRow = ({ c, onChange }) => {
  const [reply, setReply] = useState(c.admin_reply || '');
  const [open, setOpen] = useState(false);
  const submit = async () => {
    await adminApi.updateComment(c.id, { admin_reply: reply, is_read_by_admin: true });
    toast.success('Reply saved');
    onChange();
  };
  return (
    <div className="p-3 border border-white/10 rounded-lg">
      <div className="flex justify-between gap-2 mb-1 text-sm">
        <div className="min-w-0">
          <strong>{c.user_name}</strong> <span className="text-white/40 text-xs">{c.user_email}</span>
        </div>
        <div className="flex gap-1 items-center">
          {!c.is_read_by_admin && <Pill color="yellow">unread</Pill>}
          {c.admin_reply && <Pill color="green">replied</Pill>}
        </div>
      </div>
      <p className="text-sm text-white/80">{c.content}</p>
      <button onClick={() => setOpen(!open)} className="text-xs text-[#FF6B00] mt-1">{open ? 'Hide' : 'Reply / Edit'}</button>
      {open && (
        <div className="mt-2 space-y-2">
          <Textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply..." />
          <div className="flex gap-2">
            <PrimaryButton onClick={submit}>Save reply</PrimaryButton>
            <GhostButton onClick={async () => { await adminApi.updateComment(c.id, { is_read_by_admin: true }); onChange(); }}>Mark read</GhostButton>
            <GhostButton onClick={async () => { if (window.confirm('Delete?')) { await adminApi.deleteComment(c.id); onChange(); } }}>Delete</GhostButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
