import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '@/config/constants';
import { adminGetCreds, adminSetCreds } from '@/components/admin/adminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/sections/Dashboard';
import Blog from '@/components/admin/sections/Blog';
import Team from '@/components/admin/sections/Team';
import Projects from '@/components/admin/sections/Projects';
import Events from '@/components/admin/sections/Events';
import Collaborations from '@/components/admin/sections/Collaborations';
import Inbox from '@/components/admin/sections/Inbox';
import Feedback from '@/components/admin/sections/Feedback';
import Users from '@/components/admin/sections/Users';
import Announcements from '@/components/admin/sections/Announcements';
import Settings from '@/components/admin/sections/Settings';

const LoginScreen = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get(`${API}/admin/verify`, { auth: { username: email, password: pwd } });
      adminSetCreds(email, pwd);
      toast.success('Logged in');
      onSuccess();
    } catch { toast.error('Invalid credentials'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Lock className="h-10 w-10 text-[#FF6B00] mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-bold text-white">Flareonix Admin</h1>
          <p className="text-white/50 mt-1 text-sm">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={submit} className="p-6 bg-[#161616] border border-white/10 rounded-xl space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#FF6B00] outline-none"
            required data-testid="admin-email" />
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#FF6B00] outline-none"
            required data-testid="admin-password" />
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #CC2200)' }}
            data-testid="admin-login-btn">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <button onClick={() => nav('/')} className="flex items-center gap-2 text-white/50 mx-auto mt-4 text-sm">
          <ArrowLeft className="h-4 w-4" />Back to site
        </button>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [authed, setAuthed] = useState(!!adminGetCreds());

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="blog" element={<Blog />} />
        <Route path="team" element={<Team />} />
        <Route path="projects" element={<Projects />} />
        <Route path="events" element={<Events />} />
        <Route path="collaborations" element={<Collaborations />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="users" element={<Users />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;
