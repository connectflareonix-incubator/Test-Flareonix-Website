import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Textarea, Select, Loader, Empty, Pill } from '../ui';
import { toast } from 'sonner';

const empty = { title: '', description: '', status: 'Ongoing', timeline_start: '', timeline_end: '', outcomes: '', client_partner_name: '', testimonial_quote: '', photos: [], tags: [], display_order: 0 };

const Projects = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => setItems(await adminApi.listProjects());
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (p) => { setForm({ ...p, tags: p.tags || [] }); setEditing(p.id); };

  const save = async () => {
    try {
      if (editing === 'new') await adminApi.createProject(form);
      else await adminApi.updateProject(editing, form);
      toast.success('Saved'); setEditing(null); load();
    } catch { toast.error('Failed'); }
  };
  const del = async (id) => { if (window.confirm('Remove?')) { await adminApi.deleteProject(id); load(); } };

  if (items === null) return <Loader />;

  if (editing) return (
    <div data-testid="admin-projects-editor">
      <SectionHeader title={editing === 'new' ? 'Add Project' : 'Edit Project'} actions={[<GhostButton key="b" onClick={() => setEditing(null)}>Back</GhostButton>]} />
      <Card className="space-y-3 max-w-2xl">
        <div><label className="text-xs text-white/60">Title</label><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Description</label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">Status</label><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Ongoing</option><option>Completed</option></Select></div>
          <div><label className="text-xs text-white/60">Client / Partner</label><TextInput value={form.client_partner_name || ''} onChange={(e) => setForm({ ...form, client_partner_name: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Timeline start</label><TextInput type="date" value={form.timeline_start || ''} onChange={(e) => setForm({ ...form, timeline_start: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Timeline end</label><TextInput type="date" value={form.timeline_end || ''} onChange={(e) => setForm({ ...form, timeline_end: e.target.value })} /></div>
        </div>
        <div><label className="text-xs text-white/60">Outcomes</label><Textarea rows={2} value={form.outcomes || ''} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Testimonial</label><Textarea rows={2} value={form.testimonial_quote || ''} onChange={(e) => setForm({ ...form, testimonial_quote: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Tags (comma)</label><TextInput value={(form.tags || []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} /></div>
        <div><label className="text-xs text-white/60">Display order</label><TextInput type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) || 0 })} /></div>
        <PrimaryButton onClick={save}>Save</PrimaryButton>
      </Card>
    </div>
  );

  return (
    <div data-testid="admin-projects">
      <SectionHeader title="Projects" actions={[<PrimaryButton key="n" onClick={openNew}><Plus className="inline h-4 w-4 mr-1" /> Add Project</PrimaryButton>]} />
      <Card>
        {items.length === 0 ? <Empty /> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Title</th><th className="p-2">Status</th><th className="p-2">Client</th><th className="p-2">Order</th><th></th></tr></thead>
            <tbody>{items.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="p-2 max-w-md">{p.title}</td>
                <td className="p-2"><Pill color={p.status === 'Completed' ? 'green' : 'orange'}>{p.status}</Pill></td>
                <td className="p-2 text-white/70">{p.client_partner_name || '—'}</td>
                <td className="p-2">{p.display_order}</td>
                <td className="p-2 text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/10 rounded mr-1"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => del(p.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Projects;
