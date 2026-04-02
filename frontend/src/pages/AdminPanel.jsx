import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, RefreshCw } from 'lucide-react';
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
      const dashRes = await axios.get(API + '/admin/dashboard', getAuth());
      setData(dashRes.data);
    } catch (err) { toast.error('Failed to load'); }
    setLoading(false);
  };

  const exportData = async (type) => {
    try {
      const r = await axios.get(API + '/admin/export/' + type, getAuth());
      const b = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); 
      a.href = URL.createObjectURL(b); 
      a.download = type + '.json'; 
      a.click();
      toast.success('Exported!');
    } catch (err) { toast.error('Failed'); }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Email: connectflareonix@gmail.com</p>
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
        {data && data.stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 glass rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white">{data.stats.total_users}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
              <div className="p-4 glass rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white">{data.stats.total_signups}</div>
                <div className="text-xs text-muted-foreground">Community Signups</div>
              </div>
              <div className="p-4 glass rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white">{data.stats.pending_reviews}</div>
                <div className="text-xs text-muted-foreground">Pending Reviews</div>
              </div>
              <div className="p-4 glass rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white">{data.stats.unread_messages}</div>
                <div className="text-xs text-muted-foreground">Unread Messages</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => exportData('users')} className="text-white border-white/20">Export Users</Button>
              <Button size="sm" variant="outline" onClick={() => exportData('signups')} className="text-white border-white/20">Export Signups</Button>
              <Button size="sm" variant="outline" onClick={() => exportData('reviews')} className="text-white border-white/20">Export Reviews</Button>
              <Button size="sm" variant="outline" onClick={() => exportData('messages')} className="text-white border-white/20">Export Messages</Button>
            </div>
            <p className="text-muted-foreground text-sm">Full admin features available. Export data as JSON for detailed analysis.</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
