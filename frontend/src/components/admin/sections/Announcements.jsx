import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Loader, Empty, Pill } from '../ui';
import { toast } from 'sonner';

const empty = { message: '', cta_text: '', cta_url: '', is_active: true, is_dismissible: true };

const Announcements = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => setItems(await adminApi.listAnnouncements());
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing === 'new') await adminApi.createAnnouncement(form);
      else await adminApi.updateAnnouncement(editing, form);
      toast.success('Saved'); setEditing(null); load();
    } catch { toast.error('Failed'); }
  };
  const toggle = async (a) => { await adminApi.updateAnnouncement(a.id, { ...a, is_active: !a.is_active }); load(); };
  const del = async (id) => { if (window.confirm('Delete?')) { await adminApi.deleteAnnouncement(id); load(); } };

  if (items === null) return <Loader />;

  const active = items.find((a) => a.is_active);

  if (editing) return (
    <div>
      <SectionHeader title={editing === 'new' ? 'Create Announcement' : 'Edit'} actions={[<GhostButton key="b" onClick={() => setEditing(null)}>Back</GhostButton>]} />
      <Card className="space-y-3 max-w-xl">
        <div><label className="text-xs text-white/60">Message</label><TextInput value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">CTA text</label><TextInput value={form.cta_text || ''} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">CTA URL</label><TextInput value={form.cta_url || ''} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Activate now</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_dismissible} onChange={(e) => setForm({ ...form, is_dismissible: e.target.checked })} /> Dismissible by user</label>
        <PrimaryButton onClick={save}>Save</PrimaryButton>
      </Card>
    </div>
  );

  return (
    <div data-testid="admin-announcements">
      <SectionHeader title="Announcements" actions={[<PrimaryButton key="n" onClick={() => { setForm(empty); setEditing('new'); }}><Plus className="inline h-4 w-4 mr-1" /> New</PrimaryButton>]} />
      <Card className="mb-4">
        <h3 className="text-sm text-white/60 mb-2">Currently active</h3>
        {active ? (
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="text-white">{active.message}</p>
              {active.cta_text && <a href={active.cta_url} className="text-xs text-[#FF6B00]">{active.cta_text} →</a>}
            </div>
            <GhostButton onClick={() => toggle(active)}>Deactivate</GhostButton>
          </div>
        ) : <p className="text-white/40 text-sm">None active</p>}
      </Card>

      <Card>
        {items.length === 0 ? <Empty /> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Message</th><th className="p-2">CTA</th><th className="p-2">Status</th><th></th></tr></thead>
            <tbody>{items.map((a) => (
              <tr key={a.id} className="border-t border-white/5">
                <td className="p-2 max-w-md truncate">{a.message}</td>
                <td className="p-2 text-white/60">{a.cta_text || '—'}</td>
                <td className="p-2"><Pill color={a.is_active ? 'green' : 'gray'}>{a.is_active ? 'active' : 'inactive'}</Pill></td>
                <td className="p-2 text-right">
                  <button onClick={() => toggle(a)} className="text-xs text-[#FF6B00] hover:underline mr-2">{a.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => { setForm(a); setEditing(a.id); }} className="p-1.5 hover:bg-white/10 rounded mr-1"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => del(a.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Announcements;
