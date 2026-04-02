import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Star, Mail, BarChart3, Download, RefreshCw, ArrowLeft, Lock, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/config/constants';
import { toast } from 'sonner';
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseForm, setCaseForm] = useState({ title: '', client_name: '', industry: '', challenge: '', solution: '', results: '', status: 'ongoing' });

  const auth = { auth: { username: email, password: password } };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.get(`${API}/admin/verify`, auth);
      setIsAuthenticated(true);
      toast.success('Welcome, Admin!');
      fetchData();
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dashboard, analytics, users, signups, reviews, caseStudies, messages] = await Promise.all([
        axios.get(`${API}/admin/dashboard`, auth),
        axios.get(`${API}/analytics/summary`, auth),
        axios.get(`${API}/admin/users`, auth),
        axios.get(`${API}/admin/signups`, auth),
        axios.get(`${API}/reviews/all`, auth),
        axios.get(`${API}/case-studies`),
        axios.get(`${API}/contact/messages`, auth)
      ]);
      setData({ dashboard: dashboard.data, analytics: analytics.data, users: users.data, signups: signups.data, reviews: reviews.data, caseStudies: caseStudies.data, messages: messages.data });
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAction = async (id, action, reply) => {
    try {
      const payload = action === 'reply' ? { admin_reply: reply } : { status: action };
      await axios.put(`${API}/reviews/${id}`, payload, auth);
      toast.success('Review updated');
      fetchData();
    } catch (error) { toast.error('Failed'); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await axios.delete(`${API}/reviews/${id}`, auth); toast.success('Deleted'); fetchData(); } catch (error) { toast.error('Failed'); }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try { await axios.post(`${API}/case-studies`, caseForm, auth); toast.success('Created'); setShowCaseForm(false); setCaseForm({ title: '', client_name: '', industry: '', challenge: '', solution: '', results: '', status: 'ongoing' }); fetchData(); } catch (error) { toast.error('Failed'); }
  };

  const handleDeleteCase = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await axios.delete(`${API}/case-studies/${id}`, auth); toast.success('Deleted'); fetchData(); } catch (error) { toast.error('Failed'); }
  };

  const handleExport = async (type) => {
    try {
      const res = await axios.get(`${API}/admin/export/${type}`, auth);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `flareonix_${type}.json`; a.click();
      toast.success('Exported');
    } catch (error) { toast.error('Failed'); }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Enter your admin credentials</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 glass rounded-2xl border border-white/10">
            <div className="space-y-4">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/50 border-white/10 text-white" placeholder="admin@email.com" required data-testid="admin-email" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/50 border-white/10 text-white" placeholder="••••••••" required data-testid="admin-password" />
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white hover:bg-primary/90" data-testid="admin-login-btn">
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>
            </div>
          </form>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-white mt-6 mx-auto">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'cases', label: 'Case Studies', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Mail },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-white">Flareonix <span className="text-primary">Admin</span></h1>
          <div className="flex items-center gap-4">
            <Button onClick={fetchData} variant="ghost" size="sm" className="text-white"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="text-white"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && data?.dashboard && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 glass rounded-xl border border-white/10"><Users className="h-6 w-6 text-primary mb-2" /><div className="text-3xl font-heading font-bold text-white">{data.dashboard.stats.total_users}</div><div className="text-sm text-muted-foreground">Total Users</div></div>
              <div className="p-6 glass rounded-xl border border-white/10"><FileText className="h-6 w-6 text-primary mb-2" /><div className="text-3xl font-heading font-bold text-white">{data.dashboard.stats.total_signups}</div><div className="text-sm text-muted-foreground">Signups</div></div>
              <div className="p-6 glass rounded-xl border border-white/10"><Star className="h-6 w-6 text-primary mb-2" /><div className="text-3xl font-heading font-bold text-white">{data.dashboard.stats.pending_reviews}</div><div className="text-sm text-muted-foreground">Pending Reviews</div></div>
              <div className="p-6 glass rounded-xl border border-white/10"><Mail className="h-6 w-6 text-primary mb-2" /><div className="text-3xl font-heading font-bold text-white">{data.dashboard.stats.unread_messages}</div><div className="text-sm text-muted-foreground">Unread Messages</div></div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => handleExport('users')} variant="outline" className="text-white border-white/20"><Download className="h-4 w-4 mr-2" />Export Users</Button>
              <Button onClick={() => handleExport('signups')} variant="outline" className="text-white border-white/20"><Download className="h-4 w-4 mr-2" />Export Signups</Button>
            </div>
          </div>
        )}

        {activeTab === 'users' && data?.users && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-white">Users ({data.users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-muted-foreground text-sm border-b border-white/10"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Joined</th></tr></thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.user_id} className="border-b border-white/5">
                      <td className="py-3 text-white">{user.name}</td>
                      <td className="py-3 text-muted-foreground">{user.email}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>{user.role}</span></td>
                      <td className="py-3 text-muted-foreground text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && data?.reviews && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white">Reviews ({data.reviews.length})</h2>
            <div className="space-y-4">
              {data.reviews.map((review) => (
                <div key={review.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="font-semibold text-white">{review.title}</h3><p className="text-sm text-muted-foreground">by {review.user_name}</p></div>
                    <span className={`px-2 py-1 rounded-full text-xs ${review.status === 'approved' ? 'bg-green-500/20 text-green-400' : review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{review.status}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">"{review.content}"</p>
                  {review.status === 'pending' && (
                    <div className="flex gap-2 mb-4">
                      <Button size="sm" onClick={() => handleReviewAction(review.id, 'approved')} className="bg-green-500 hover:bg-green-600"><Check className="h-4 w-4 mr-1" />Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReviewAction(review.id, 'rejected')}><X className="h-4 w-4 mr-1" />Reject</Button>
                    </div>
                  )}
                  <div className="flex gap-2 items-end">
                    <Input placeholder="Reply..." value={replyText[review.id] || ''} onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
                    <Button size="sm" onClick={() => { handleReviewAction(review.id, 'reply', replyText[review.id]); setReplyText(prev => ({ ...prev, [review.id]: '' })); }} disabled={!replyText[review.id]}>Reply</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteReview(review.id)} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && data?.caseStudies && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white">Case Studies ({data.caseStudies.length})</h2>
              <Button onClick={() => setShowCaseForm(!showCaseForm)} className="bg-primary">{showCaseForm ? 'Cancel' : 'Add New'}</Button>
            </div>
            {showCaseForm && (
              <form onSubmit={handleCreateCase} className="p-6 glass rounded-xl border border-white/10 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={caseForm.title} onChange={(e) => setCaseForm(prev => ({ ...prev, title: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                  <Input placeholder="Client Name" value={caseForm.client_name} onChange={(e) => setCaseForm(prev => ({ ...prev, client_name: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                  <Input placeholder="Industry" value={caseForm.industry} onChange={(e) => setCaseForm(prev => ({ ...prev, industry: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                  <select value={caseForm.status} onChange={(e) => setCaseForm(prev => ({ ...prev, status: e.target.value }))} className="bg-black/50 border border-white/10 text-white rounded-md px-3 py-2"><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select>
                </div>
                <Textarea placeholder="Challenge" value={caseForm.challenge} onChange={(e) => setCaseForm(prev => ({ ...prev, challenge: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                <Textarea placeholder="Solution" value={caseForm.solution} onChange={(e) => setCaseForm(prev => ({ ...prev, solution: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                <Textarea placeholder="Results" value={caseForm.results} onChange={(e) => setCaseForm(prev => ({ ...prev, results: e.target.value }))} className="bg-black/50 border-white/10 text-white" required />
                <Button type="submit" className="bg-primary">Create</Button>
              </form>
            )}
            <div className="space-y-4">
              {data.caseStudies.map((study) => (
                <div key={study.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="font-semibold text-white">{study.title}</h3><p className="text-sm text-muted-foreground">{study.client_name} • {study.industry}</p></div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${study.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{study.status}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteCase(study.id)} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground"><span className="text-primary">Results:</span> {study.results}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && data?.messages && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white">Messages ({data.messages.length})</h2>
            <div className="space-y-4">
              {data.messages.map((msg) => (
                <div key={msg.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="font-semibold text-white">{msg.subject}</h3><p className="text-sm text-muted-foreground">{msg.name} • {msg.email}</p></div>
                    <span className={`px-2 py-1 rounded-full text-xs ${msg.status === 'unread' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>{msg.status}</span>
                  </div>
                  <p className="text-muted-foreground">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
