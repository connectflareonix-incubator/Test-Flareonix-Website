import React, { useEffect, useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { adminApi } from '../adminApi';
import { Card, StatCard, SectionHeader, Loader, PrimaryButton, GhostButton } from '../ui';
import { toast } from 'sonner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartCommon = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#fff' } } },
  scales: {
    x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
  },
};

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [ts, setTs] = useState(null);
  const [days, setDays] = useState(30);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookActive, setWebhookActive] = useState(false);
  const [webhookId, setWebhookId] = useState(null);

  const load = async () => {
    try {
      const [ov, t, whs] = await Promise.all([
        adminApi.overview(),
        adminApi.timeseries(days),
        adminApi.listWebhooks(),
      ]);
      setOverview(ov);
      setTs(t);
      const wh = whs[0];
      if (wh) { setWebhookUrl(wh.url || ''); setWebhookActive(!!wh.is_active); setWebhookId(wh.id); }
    } catch (e) {
      toast.error('Failed to load dashboard');
    }
  };

  useEffect(() => { load(); const i = setInterval(load, 60000); return () => clearInterval(i); }, [days]);

  const signups = useMemo(() => ({
    labels: (ts?.signups || []).map((d) => d.date.slice(5)),
    datasets: [{
      label: 'Signups', data: (ts?.signups || []).map((d) => d.count),
      borderColor: '#FF6B00', backgroundColor: 'rgba(255,107,0,0.15)', tension: 0.3, fill: true,
    }],
  }), [ts]);

  const views = useMemo(() => ({
    labels: (ts?.pageviews || []).map((d) => d.date.slice(5)),
    datasets: [{
      label: 'Page views', data: (ts?.pageviews || []).map((d) => d.count),
      borderColor: '#FFB300', backgroundColor: 'rgba(255,179,0,0.15)', tension: 0.3, fill: true,
    }],
  }), [ts]);

  const byType = useMemo(() => ({
    labels: (ts?.inquiry_types || []).map((d) => d.type),
    datasets: [{
      label: 'Submissions', data: (ts?.inquiry_types || []).map((d) => d.count),
      backgroundColor: ['#FF6B00', '#CC2200', '#FFB300', '#FF8C00', '#FF4500'],
    }],
  }), [ts]);

  const saveWebhook = async () => {
    if (!webhookId) return;
    await adminApi.updateWebhook(webhookId, { url: webhookUrl, is_active: webhookActive });
    toast.success('Webhook saved');
  };

  const testWebhook = async () => {
    try {
      const r = await adminApi.testWebhook(webhookId);
      toast.success(`Test sent — status ${r.status_code}`);
    } catch (e) { toast.error(e.response?.data?.detail || 'Failed'); }
  };

  if (!overview) return <Loader />;

  return (
    <div data-testid="admin-dashboard">
      <SectionHeader
        title="Dashboard"
        subtitle="Real-time overview · refreshes every 60s"
        actions={[
          <GhostButton key="7" onClick={() => setDays(7)}>7d</GhostButton>,
          <GhostButton key="30" onClick={() => setDays(30)}>30d</GhostButton>,
          <GhostButton key="90" onClick={() => setDays(90)}>90d</GhostButton>,
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={overview.total_users} />
        <StatCard label="New Today" value={overview.new_users_today} />
        <StatCard label="New This Week" value={overview.new_users_week} />
        <StatCard label="New This Month" value={overview.new_users_month} />
        <StatCard label="Blog Published" value={overview.blog_published} accent="#FFB300" />
        <StatCard label="Blog Drafts" value={overview.blog_drafts} accent="#FFB300" />
        <StatCard label="Pending Comments" value={overview.pending_comments} accent="#FF8C00" />
        <StatCard label="Unread Inbox" value={overview.unread_contact_subs} accent="#CC2200" />
        <StatCard label="Pending Testimonials" value={overview.pending_testimonials} accent="#FF6B00" />
        <StatCard label="Pending Reviews" value={overview.pending_reviews} accent="#FF6B00" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-semibold mb-3">User signups · last {days}d</h3>
          <div className="h-64"><Line data={signups} options={chartCommon} /></div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Page views · last {days}d</h3>
          <div className="h-64"><Line data={views} options={chartCommon} /></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <h3 className="font-semibold mb-3">Contacts by inquiry type</h3>
          <div className="h-64">
            {(ts?.inquiry_types?.length || 0) > 0
              ? <Bar data={byType} options={chartCommon} />
              : <div className="h-full flex items-center justify-center text-white/40 text-sm">No data yet</div>}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Inquiry distribution</h3>
          <div className="h-64">
            {(ts?.inquiry_types?.length || 0) > 0
              ? <Doughnut data={byType} options={{ ...chartCommon, scales: undefined }} />
              : <div className="h-full flex items-center justify-center text-white/40 text-sm">No data yet</div>}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-2">Automation Webhook</h3>
        <p className="text-xs text-white/50 mb-3">
          Connect via Zapier to auto-sync all form submissions to Google Sheets. Paste your Zapier webhook URL to activate.
        </p>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
            data-testid="webhook-url-input"
          />
          <label className="flex items-center gap-2 text-sm px-2">
            <input type="checkbox" checked={webhookActive} onChange={(e) => setWebhookActive(e.target.checked)} />
            Active
          </label>
          <PrimaryButton onClick={saveWebhook} data-testid="webhook-save">Save</PrimaryButton>
          <GhostButton onClick={testWebhook} disabled={!webhookActive}>Test</GhostButton>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
