import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Select, Loader, Empty, Pill } from '../ui';
import { toast } from 'sonner';

const empty = { org_name: '', logo_url: '', collab_type: 'Other', year: new Date().getFullYear(), link: '', display_order: 0 };
const TYPES = ['Event_Partner', 'Knowledge_Partner', 'Startup', 'Sponsor', 'Other'];

const Collaborations = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => setItems(await adminApi.listCollabs());
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (m) => { setForm(m); setEditing(m.id); };
  const save = async () => {
    try {
      if (editing === 'new') await adminApi.createCollab(form);
      else await adminApi.updateCollab(editing, form);
      toast.success('Saved'); setEditing(null); load();
    } catch { toast.error('Failed'); }
  };
  const del = async (id) => { if (window.confirm('Remove?')) { await adminApi.deleteCollab(id); load(); } };

  if (items === null) return <Loader />;

  if (editing) return (
    <div>
      <SectionHeader title={editing === 'new' ? 'Add Collaboration' : 'Edit Collaboration'} actions={[<GhostButton key="b" onClick={() => setEditing(null)}>Back</GhostButton>]} />
      <Card className="space-y-3 max-w-xl">
        <div><label className="text-xs text-white/60">Organisation</label><TextInput value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Type</label><Select value={form.collab_type} onChange={(e) => setForm({ ...form, collab_type: e.target.value })}>{TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</Select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">Year</label><TextInput type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) || 0 })} /></div>
          <div><label className="text-xs text-white/60">Display order</label><TextInput type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) || 0 })} /></div>
        </div>
        <div><label className="text-xs text-white/60">Link</label><TextInput value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
        <PrimaryButton onClick={save}>Save</PrimaryButton>
      </Card>
    </div>
  );

  return (
    <div data-testid="admin-collabs">
      <SectionHeader title="Collaborations" actions={[<PrimaryButton key="n" onClick={openNew}><Plus className="inline h-4 w-4 mr-1" /> Add</PrimaryButton>]} />
      <Card>
        {items.length === 0 ? <Empty /> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Org</th><th className="p-2">Type</th><th className="p-2">Year</th><th className="p-2">Link</th><th></th></tr></thead>
            <tbody>{items.map((m) => (
              <tr key={m.id} className="border-t border-white/5">
                <td className="p-2">{m.org_name}</td>
                <td className="p-2"><Pill>{m.collab_type.replace('_', ' ')}</Pill></td>
                <td className="p-2">{m.year}</td>
                <td className="p-2 text-white/60 truncate max-w-xs">{m.link || '—'}</td>
                <td className="p-2 text-right">
                  <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-white/10 rounded mr-1"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => del(m.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Collaborations;
