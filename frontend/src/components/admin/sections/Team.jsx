import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Textarea, Loader, Empty, Pill } from '../ui';
import { readFileAsDataURL } from '../fileUtil';
import { toast } from 'sonner';

const empty = { name: '', role: '', bio: '', photo_url: '', linkedin_url: '', display_order: 0, is_active: true };

const Team = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => setItems(await adminApi.listTeam());
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (m) => { setForm(m); setEditing(m.id); };

  const save = async () => {
    try {
      if (editing === 'new') await adminApi.createTeam(form);
      else await adminApi.updateTeam(editing, form);
      toast.success('Saved'); setEditing(null); load();
    } catch { toast.error('Failed'); }
  };

  const del = async (id) => { if (window.confirm('Remove?')) { await adminApi.deleteTeam(id); load(); } };

  const onPhoto = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { const url = await readFileAsDataURL(f); setForm((s) => ({ ...s, photo_url: url })); }
    catch (err) { toast.error(err.message); }
  };

  if (items === null) return <Loader />;

  if (editing) return (
    <div data-testid="admin-team-editor">
      <SectionHeader title={editing === 'new' ? 'Add Team Member' : 'Edit Member'} actions={[<GhostButton key="b" onClick={() => setEditing(null)}>Back</GhostButton>]} />
      <Card className="space-y-3 max-w-xl">
        <div><label className="text-xs text-white/60">Name</label><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="team-name" /></div>
        <div><label className="text-xs text-white/60">Role</label><TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Bio</label><Textarea rows={3} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">LinkedIn URL</label><TextInput value={form.linkedin_url || ''} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></div>
        <div>
          <label className="text-xs text-white/60">Photo</label>
          <input type="file" accept="image/*" onChange={onPhoto} className="text-sm block" />
          {form.photo_url && <img src={form.photo_url} alt="" className="mt-2 h-24 w-24 rounded-full object-cover" />}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">Display order</label><TextInput type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) || 0 })} /></div>
          <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        </div>
        <PrimaryButton onClick={save} data-testid="team-save">Save</PrimaryButton>
      </Card>
    </div>
  );

  return (
    <div data-testid="admin-team">
      <SectionHeader title="Team Gallery" actions={[<PrimaryButton key="n" onClick={openNew} data-testid="team-new"><Plus className="inline h-4 w-4 mr-1" /> Add Member</PrimaryButton>]} />
      <Card>
        {items.length === 0 ? <Empty>No team members.</Empty> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Photo</th><th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Order</th><th className="p-2">Active</th><th></th></tr></thead>
            <tbody>{items.map((m) => (
              <tr key={m.id} className="border-t border-white/5">
                <td className="p-2">{m.photo_url ? <img src={m.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-white/10" />}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2 text-white/70">{m.role}</td>
                <td className="p-2">{m.display_order}</td>
                <td className="p-2"><Pill color={m.is_active ? 'green' : 'gray'}>{m.is_active ? 'on' : 'off'}</Pill></td>
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

export default Team;
