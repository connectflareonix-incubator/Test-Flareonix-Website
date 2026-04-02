import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, MessageSquare, BarChart3, Eye, Trash2, Check, X, 
  Download, RefreshCw, Mail, Star, Briefcase, ArrowLeft, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API, ADMIN_CREDENTIALS } from '@/config/constants';
import { toast } from 'sonner';
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [users, setUsers] = useState([]);
  const [signups, setSignups] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState({});

  // Case study form
  const [showCaseStudyForm, setShowCaseStudyForm] = useState(false);
  const [caseStudyForm, setCaseStudyForm] = useState({
    title: '', client_name: '', industry: '', challenge: '', solution: '', results: '', status: 'ongoing'
  });

  const getAuthHeader = () => ({
    auth: { username: credentials.email, password: credentials.password }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.get(`${API}/admin/verify`, getAuthHeader());
      setIsAuthenticated(true);
      toast.success('Welcome, Admin!');
      fetchAllData();
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [dashboard, analytics, usersRes, signupsRes, reviewsRes, caseStudiesRes, messagesRes] = await Promise.all([
        axios.get(`${API}/admin/dashboard`, getAuthHeader()),
        axios.get(`${API}/analytics/summary`, getAuthHeader()),
        axios.get(`${API}/admin/users`, getAuthHeader()),
        axios.get(`${API}/admin/signups`, getAuthHeader()),
        axios.get(`${API}/reviews/all`, getAuthHeader()),
        axios.get(`${API}/case-studies`),
        axios.get(`${API}/contact/messages`, getAuthHeader())
      ]);
      setDashboardData(dashboard.data);
      setAnalyticsData(analytics.data);
      setUsers(usersRes.data);
      setSignups(signupsRes.data);
      setReviews(reviewsRes.data);
      setCaseStudies(caseStudiesRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action, reply = null) => {
    try {
      const data = action === 'reply' ? { admin_reply: reply } : { status: action };
      await axios.put(`${API}/reviews/${reviewId}`, data, getAuthHeader());
      toast.success('Review updated');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`${API}/reviews/${reviewId}`, getAuthHeader());
      toast.success('Review deleted');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleCreateCaseStudy = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/case-studies`, caseStudyForm, getAuthHeader());
      toast.success('Case study created');
      setShowCaseStudyForm(false);
      setCaseStudyForm({ title: '', client_name: '', industry: '', challenge: '', solution: '', results: '', status: 'ongoing' });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to create case study');
    }
  };

  const handleDeleteCaseStudy = async (id) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      await axios.delete(`${API}/case-studies/${id}`, getAuthHeader());
      toast.success('Case study deleted');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete case study');
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.get(`${API}/admin/export/${type}`, getAuthHeader());
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flareonix_${type}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success(`${type} exported successfully`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Enter your admin credentials</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 glass rounded-2xl border border-white/10">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Email</label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white"
                  placeholder="admin@email.com"
                  required
                  data-testid="admin-email"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Password</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white"
                  placeholder="••••••••"
                  required
                  data-testid="admin-password"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white hover:bg-primary/90"
                data-testid="admin-login-btn"
              >
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>
            </div>
          </form>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white mt-6 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </motion.div>
      </main>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'case-studies', label: 'Case Studies', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: Eye },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-white">
            Flareonix <span className="text-primary">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={fetchAllData} variant="ghost" size="sm" className="text-white">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: dashboardData.stats.total_users, icon: Users },
                { label: 'Community Signups', value: dashboardData.stats.total_signups, icon: FileText },
                { label: 'Pending Reviews', value: dashboardData.stats.pending_reviews, icon: Star },
                { label: 'Unread Messages', value: dashboardData.stats.unread_messages, icon: Mail },
              ].map((stat) => (
                <div key={stat.label} className="p-6 glass rounded-xl border border-white/10">
                  <stat.icon className="h-6 w-6 text-primary mb-2" />
                  <div className="text-3xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => handleExport('users')} variant="outline" className="text-white border-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
              <Button onClick={() => handleExport('signups')} variant="outline" className="text-white border-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export Signups
              </Button>
              <Button onClick={() => handleExport('analytics')} variant="outline" className="text-white border-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-white">Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-muted-foreground text-sm border-b border-white/10">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id} className="border-b border-white/5">
                      <td className="py-3 text-white">{user.name}</td>
                      <td className="py-3 text-muted-foreground">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white">Reviews ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{review.title}</h3>
                      <p className="text-sm text-muted-foreground">by {review.user_name} ({review.user_email})</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">"{review.content}"</p>
                  
                  {review.status === 'pending' && (
                    <div className="flex gap-2 mb-4">
                      <Button size="sm" onClick={() => handleReviewAction(review.id, 'approved')} className="bg-green-500 hover:bg-green-600">
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReviewAction(review.id, 'rejected')}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    <Input
                      placeholder="Reply to this review..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                      className="bg-black/50 border-white/10 text-white"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleReviewAction(review.id, 'reply', replyText[review.id]);
                        setReplyText(prev => ({ ...prev, [review.id]: '' }));
                      }}
                      disabled={!replyText[review.id]}
                    >
                      Reply
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteReview(review.id)} className="text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies Tab */}
        {activeTab === 'case-studies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white">Case Studies ({caseStudies.length})</h2>
              <Button onClick={() => setShowCaseStudyForm(!showCaseStudyForm)} className="bg-primary">
                {showCaseStudyForm ? 'Cancel' : 'Add New'}
              </Button>
            </div>

            {showCaseStudyForm && (
              <form onSubmit={handleCreateCaseStudy} className="p-6 glass rounded-xl border border-white/10 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Title"
                    value={caseStudyForm.title}
                    onChange={(e) => setCaseStudyForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white"
                    required
                  />
                  <Input
                    placeholder="Client Name"
                    value={caseStudyForm.client_name}
                    onChange={(e) => setCaseStudyForm(prev => ({ ...prev, client_name: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white"
                    required
                  />
                  <Input
                    placeholder="Industry"
                    value={caseStudyForm.industry}
                    onChange={(e) => setCaseStudyForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white"
                    required
                  />
                  <select
                    value={caseStudyForm.status}
                    onChange={(e) => setCaseStudyForm(prev => ({ ...prev, status: e.target.value }))}
                    className="bg-black/50 border border-white/10 text-white rounded-md px-3 py-2"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <Textarea
                  placeholder="Challenge"
                  value={caseStudyForm.challenge}
                  onChange={(e) => setCaseStudyForm(prev => ({ ...prev, challenge: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
                <Textarea
                  placeholder="Solution"
                  value={caseStudyForm.solution}
                  onChange={(e) => setCaseStudyForm(prev => ({ ...prev, solution: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
                <Textarea
                  placeholder="Results"
                  value={caseStudyForm.results}
                  onChange={(e) => setCaseStudyForm(prev => ({ ...prev, results: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
                <Button type="submit" className="bg-primary">Create Case Study</Button>
              </form>
            )}

            <div className="space-y-4">
              {caseStudies.map((study) => (
                <div key={study.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{study.title}</h3>
                      <p className="text-sm text-muted-foreground">{study.client_name} • {study.industry}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        study.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {study.status}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteCaseStudy(study.id)} className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground"><span className="text-primary">Results:</span> {study.results}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white">Contact Messages ({messages.length})</h2>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{msg.subject}</h3>
                      <p className="text-sm text-muted-foreground">{msg.name} • {msg.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      msg.status === 'unread' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 glass rounded-xl border border-white/10">
                <div className="text-3xl font-heading font-bold text-primary">{analyticsData.overview.total_pageviews}</div>
                <div className="text-sm text-muted-foreground">Page Views</div>
              </div>
              <div className="p-6 glass rounded-xl border border-white/10">
                <div className="text-3xl font-heading font-bold text-accent">{analyticsData.overview.total_clicks}</div>
                <div className="text-sm text-muted-foreground">Button Clicks</div>
              </div>
              <div className="p-6 glass rounded-xl border border-white/10">
                <div className="text-3xl font-heading font-bold text-green-400">{analyticsData.overview.conversion_rate}%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
              <div className="p-6 glass rounded-xl border border-white/10">
                <div className="text-3xl font-heading font-bold text-white">{analyticsData.overview.total_users}</div>
                <div className="text-sm text-muted-foreground">Registered Users</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 glass rounded-xl border border-white/10">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {analyticsData.pageviews_by_page.map((page, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{page.page}</span>
                      <span className="text-white font-semibold">{page.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 glass rounded-xl border border-white/10">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Top Clicks</h3>
                <div className="space-y-3">
                  {analyticsData.clicks_by_button.map((btn, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{btn.button}</span>
                      <span className="text-white font-semibold">{btn.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
