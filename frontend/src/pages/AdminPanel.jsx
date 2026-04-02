import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Users, Star, Mail, RefreshCw, Download, Trash2, Check, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API } from '@/config/constants';
import { toast } from 'sonner';
import axios from 'axios';

function AdminPanel() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuth = () => ({ auth: { username: email, password: pwd } });

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get(API + '/admin/verify', getAuth());
      setAuth(true);
      toast.success('Logged in!');
      load();
    } catch (err) { toast.error('Invalid credentials'); }
    setLoading(false);
  };

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        axios.get(API + '/admin/dashboard', getAuth()),
        axios.get(API + '/admin/users', getAuth()),
        axios.get(API + '/reviews/all', getAuth()),
        axios.get(API + '/contact/messages', getAuth())
      ]);
      setData({ 
        stats: results[0].data.stats, 
        users: results[1].data, 
        reviews: results[2].data, 
        messages: results[3].data 
      });
    } catch (err) { toast.error('Failed to load'); }
    setLoading(false);
  };

  const updateReview = async (id, status) => {
    try {
      await axios.put(API + '/reviews/' + id, { status }, getAuth());
      toast.success('Updated'); load();
    } catch (err) { toast.error('Failed'); }
  };

  const delReview = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await axios.delete(API + '/reviews/' + id, getAuth()); toast.success('Deleted'); load(); } catch (err) { toast.error('Failed'); }
  };

  const exp = async (t) => {
    try {
      const r = await axios.get(API + '/admin/export/' + t, getAuth());
      const b = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); 
      a.href = URL.createObjectURL(b); 
      a.download = t + '.json'; 
      a.click();
    } catch (err) { toast.error('Failed'); }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-white">Admin Login</h1>
          </div>
          <form onSubmit={login} className="p-6 glass rounded-xl border border-white/10 space-y-4">
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="bg-black/50 border-white/10 text-white" required data-testid="admin-email" />
            <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password" className="bg-black/50 border-white/10 text-white" required data-testid="admin-password" />
            <Button type="submit" disabled={loading} className="w-full bg-primary" data-testid="admin-login-btn">{loading ? 'Loading...' : 'Login'}</Button>
          </form>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground mx-auto mt-4"><ArrowLeft className="h-4 w-4" />Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="bg-[#0a0a0a] border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-heading text-lg font-bold text-white">Admin Panel</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={load} className="text-white"><RefreshCw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} /></Button>
            <Button size="sm" variant="ghost" onClick={() => navigate('/')} className="text-white"><ArrowLeft className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab('overview')} className={'px-4 py-2 rounded-full text-sm ' + (tab === 'overview' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground')}>Overview</button>
          <button onClick={() => setTab('users')} className={'px-4 py-2 rounded-full text-sm ' + (tab === 'users' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground')}>Users</button>
          <button onClick={() => setTab('reviews')} className={'px-4 py-2 rounded-full text-sm ' + (tab === 'reviews' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground')}>Reviews</button>
          <button onClick={() => setTab('messages')} className={'px-4 py-2 rounded-full text-sm ' + (tab === 'messages' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground')}>Messages</button>
        </div>

        {tab === 'overview' && data && data.stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 glass rounded-lg border border-white/10"><Users className="h-5 w-5 text-primary mb-2" /><div className="text-2xl font-bold text-white">{data.stats.total_users}</div><div className="text-xs text-muted-foreground">Users</div></div>
              <div className="p-4 glass rounded-lg border border-white/10"><FileText className="h-5 w-5 text-primary mb-2" /><div className="text-2xl font-bold text-white">{data.stats.total_signups}</div><div className="text-xs text-muted-foreground">Signups</div></div>
              <div className="p-4 glass rounded-lg border border-white/10"><Star className="h-5 w-5 text-primary mb-2" /><div className="text-2xl font-bold text-white">{data.stats.pending_reviews}</div><div className="text-xs text-muted-foreground">Pending Reviews</div></div>
              <div className="p-4 glass rounded-lg border border-white/10"><Mail className="h-5 w-5 text-primary mb-2" /><div className="text-2xl font-bold text-white">{data.stats.unread_messages}</div><div className="text-xs text-muted-foreground">Unread</div></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => exp('users')} className="text-white border-white/20"><Download className="h-4 w-4 mr-1" />Users</Button>
              <Button size="sm" variant="outline" onClick={() => exp('signups')} className="text-white border-white/20"><Download className="h-4 w-4 mr-1" />Signups</Button>
            </div>
          </div>
        )}

        {tab === 'users' && data && data.users && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Users ({data.users.length})</h2>
            {data.users.map(function(u) { return (
              <div key={u.user_id} className="p-3 glass rounded-lg border border-white/10 flex justify-between items-center">
                <div><p className="text-white">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                <span className={'text-xs px-2 py-1 rounded ' + (u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white')}>{u.role}</span>
              </div>
            )})}
          </div>
        )}

        {tab === 'reviews' && data && data.reviews && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Reviews ({data.reviews.length})</h2>
            {data.reviews.map(function(r) { return (
              <div key={r.id} className="p-4 glass rounded-lg border border-white/10">
                <div className="flex justify-between mb-2">
                  <div><p className="font-semibold text-white">{r.title}</p><p className="text-xs text-muted-foreground">{r.user_name}</p></div>
                  <span className={'text-xs px-2 py-1 rounded ' + (r.status === 'approved' ? 'bg-green-500/20 text-green-400' : r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')}>{r.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{r.content}</p>
                <div className="flex gap-2">
                  {r.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => updateReview(r.id, 'approved')} className="bg-green-500 text-xs"><Check className="h-3 w-3 mr-1" />Approve</Button>
                      <Button size="sm" onClick={() => updateReview(r.id, 'rejected')} variant="destructive" className="text-xs"><X className="h-3 w-3 mr-1" />Reject</Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => delReview(r.id)} className="text-red-400 text-xs"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            )})}
          </div>
        )}

        {tab === 'messages' && data && data.messages && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Messages ({data.messages.length})</h2>
            {data.messages.map(function(m) { return (
              <div key={m.id} className="p-4 glass rounded-lg border border-white/10">
                <div className="flex justify-between mb-2">
                  <div><p className="font-semibold text-white">{m.subject}</p><p className="text-xs text-muted-foreground">{m.name} - {m.email}</p></div>
                  <span className={'text-xs px-2 py-1 rounded ' + (m.status === 'unread' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white')}>{m.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.message}</p>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
