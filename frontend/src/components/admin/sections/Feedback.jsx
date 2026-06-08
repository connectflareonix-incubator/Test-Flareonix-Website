import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, Plus } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Textarea, Loader, Empty, Pill } from '../ui';
import { downloadCSV } from '../csvUtil';
import { toast } from 'sonner';

const tEmpty = { client_name: '', client_role: '', client_org: '', quote: '', is_approved: true };

const Feedback = () => {
  const [tab, setTab] = useState('testimonials');
  const [tts, setTts] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(tEmpty);

  const load = async () => {
    setTts(await adminApi.listTestimonials());
    setReviews(await adminApi.listReviews());
  };
  useEffect(() => { load(); }, []);

  const approveT = async (t) => { await adminApi.updateTestimonial(t.id, { ...t, is_approved: true }); load(); };
  const rejectT = async (id) => { if (window.confirm('Delete?')) { await adminApi.deleteTestimonial(id); load(); } };
  const saveT = async () => {
    try { await adminApi.createTestimonial(form); toast.success('Added'); setAdding(false); setForm(tEmpty); load(); }
    catch { toast.error('Failed'); }
  };

  const approveR = async (r) => { await adminApi.updateReview(r.id, { status: 'approved' }); load(); };
  const rejectR = async (id) => { await adminApi.updateReview(id, { status: 'rejected' }); load(); };
  const delR = async (id) => { if (window.confirm('Delete?')) { await adminApi.deleteReview(id); load(); } };

  return (
    <div data-testid="admin-feedback">
      <SectionHeader title="Feedback & Reviews" actions={[
        <GhostButton key="t1" onClick={() => setTab('testimonials')} className={tab === 'testimonials' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Testimonials</GhostButton>,
        <GhostButton key="t2" onClick={() => setTab('reviews')} className={tab === 'reviews' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>User Reviews</GhostButton>,
        tab === 'testimonials' && <PrimaryButton key="n" onClick={() => setAdding(true)}><Plus className="inline h-4 w-4 mr-1" /> Add</PrimaryButton>,
        <GhostButton key="csv" onClick={() => downloadCSV(tab === 'testimonials' ? (tts || []) : (reviews || []), `${tab}.csv`)}>Export CSV</GhostButton>,
      ]} />

      {tab === 'testimonials' && adding && (
        <Card className="mb-4 space-y-3 max-w-xl">
          <div><label className="text-xs text-white/60">Client name</label><TextInput value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-white/60">Role</label><TextInput value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} /></div>
            <div><label className="text-xs text-white/60">Org</label><TextInput value={form.client_org} onChange={(e) => setForm({ ...form, client_org: e.target.value })} /></div>
          </div>
          <div><label className="text-xs text-white/60">Quote</label><Textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
          <div className="flex gap-2"><PrimaryButton onClick={saveT}>Save</PrimaryButton><GhostButton onClick={() => setAdding(false)}>Cancel</GhostButton></div>
        </Card>
      )}

      {tab === 'testimonials' && (
        <Card>
          {tts === null ? <Loader /> : tts.length === 0 ? <Empty /> : (
            <div className="space-y-2">{tts.map((t) => (
              <div key={t.id} className="p-3 border border-white/10 rounded-lg">
                <div className="flex justify-between gap-2 mb-1">
                  <strong>{t.client_name}</strong>
                  <Pill color={t.is_approved ? 'green' : 'yellow'}>{t.is_approved ? 'approved' : 'pending'}</Pill>
                </div>
                <div className="text-xs text-white/50 mb-1">{t.client_role} {t.client_org && `· ${t.client_org}`}</div>
                <p className="text-sm text-white/80 italic">"{t.quote}"</p>
                <div className="flex gap-2 mt-2">
                  {!t.is_approved && <button onClick={() => approveT(t)} className="text-xs text-green-400 hover:underline"><Check className="inline h-3 w-3 mr-1" />Approve</button>}
                  <button onClick={() => rejectT(t.id)} className="text-xs text-red-400 hover:underline"><X className="inline h-3 w-3 mr-1" />Delete</button>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      )}

      {tab === 'reviews' && (
        <Card>
          {reviews === null ? <Loader /> : reviews.length === 0 ? <Empty /> : (
            <div className="space-y-2">{reviews.map((r) => (
              <div key={r.id} className="p-3 border border-white/10 rounded-lg">
                <div className="flex justify-between gap-2 mb-1">
                  <strong>{r.user_name} — {r.title}</strong>
                  <Pill color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'yellow'}>{r.status}</Pill>
                </div>
                <div className="text-xs text-white/50">{'★'.repeat(r.rating)} · {r.user_email}</div>
                <p className="text-sm text-white/80 mt-1">{r.content}</p>
                <div className="flex gap-2 mt-2">
                  {r.status !== 'approved' && <button onClick={() => approveR(r)} className="text-xs text-green-400 hover:underline">Approve</button>}
                  {r.status !== 'rejected' && <button onClick={() => rejectR(r.id)} className="text-xs text-yellow-400 hover:underline">Reject</button>}
                  <button onClick={() => delR(r.id)} className="text-xs text-red-400 hover:underline"><Trash2 className="inline h-3 w-3 mr-1" />Delete</button>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Feedback;
