import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, ArrowLeft, ListChecks } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, PrimaryButton, GhostButton, TextInput, Textarea, Select, Loader, Empty, Pill } from '../ui';
import { readFileAsDataURL } from '../fileUtil';
import { toast } from 'sonner';

const empty = {
  title: '', date: 'To be announced', venue: '', theme: '', description: '',
  short_description: '', cover_image_url: '', guests: [], highlights: [], registration_link: '',
  registration_button_text: 'Register Now', capacity: 0, spots_filled: 0, status: 'upcoming', display_order: 0,
};

const statusColor = (s) => (s === 'ongoing' ? 'green' : s === 'past' ? 'gray' : 'orange');

const Events = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // 'new' | id
  const [form, setForm] = useState(empty);
  const [managing, setManaging] = useState(null); // event object for comments
  const [comments, setComments] = useState([]);
  const [managingWaitlist, setManagingWaitlist] = useState(null); // event object for waitlist
  const [waitlist, setWaitlist] = useState([]);

  const load = async () => setItems(await adminApi.listEvents());
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (e) => {
    setForm({ ...empty, ...e, guests: e.guests || [], highlights: e.highlights || [] });
    setEditing(e.id);
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    try {
      if (editing === 'new') await adminApi.createEvent(form);
      else await adminApi.updateEvent(editing, form);
      toast.success('Saved'); setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const del = async (id) => {
    if (window.confirm('Delete this event and all its comments?')) {
      await adminApi.deleteEvent(id); toast.success('Deleted'); load();
    }
  };

  const openComments = async (e) => {
    setManaging(e);
    setComments(await adminApi.listEventComments(e.id));
  };

  const onCover = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { const url = await readFileAsDataURL(f); setForm((s) => ({ ...s, cover_image_url: url })); }
    catch (err) { toast.error(err.message); }
  };

  const openWaitlist = async (e) => {
    setManagingWaitlist(e);
    setWaitlist(await adminApi.listEventWaitlist(e.id));
  };

  const delWaitlistEntry = async (wid) => {
    if (window.confirm('Remove this waitlist entry?')) {
      await adminApi.deleteEventWaitlist(wid);
      setWaitlist(await adminApi.listEventWaitlist(managingWaitlist.id));
      toast.success('Removed');
    }
  };

  const copyEmails = () => {
    const emails = waitlist.map((w) => w.email).join(', ');
    navigator.clipboard?.writeText(emails);
    toast.success('Emails copied');
  };

  const delComment = async (cid) => {
    if (window.confirm('Delete this comment?')) {
      await adminApi.deleteEventComment(cid);
      setComments(await adminApi.listEventComments(managing.id));
      toast.success('Comment removed');
    }
  };

  if (items === null) return <Loader />;

  // ---------- Waitlist view ----------
  if (managingWaitlist) return (
    <div data-testid="admin-events-waitlist">
      <SectionHeader
        title={`Waitlist — ${managingWaitlist.title}`}
        actions={[
          waitlist.length > 0 ? <GhostButton key="c" onClick={copyEmails}>Copy emails</GhostButton> : null,
          <GhostButton key="b" onClick={() => setManagingWaitlist(null)}><ArrowLeft className="inline h-4 w-4 mr-1" /> Back</GhostButton>,
        ].filter(Boolean)}
      />
      <Card>
        {waitlist.length === 0 ? <Empty>No one on the waitlist yet</Empty> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Joined</th><th></th></tr></thead>
            <tbody>{waitlist.map((w) => (
              <tr key={w.id} className="border-t border-white/5">
                <td className="p-2">{w.name || '—'}</td>
                <td className="p-2 text-white/80">{w.email}</td>
                <td className="p-2 text-white/50">{w.created_at ? new Date(w.created_at).toLocaleDateString() : '—'}</td>
                <td className="p-2 text-right">
                  <button onClick={() => delWaitlistEntry(w.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );

  // ---------- Comments moderation view ----------
  if (managing) return (
    <div data-testid="admin-events-comments">
      <SectionHeader
        title={`Comments — ${managing.title}`}
        actions={[<GhostButton key="b" onClick={() => setManaging(null)}><ArrowLeft className="inline h-4 w-4 mr-1" /> Back</GhostButton>]}
      />
      <Card>
        {comments.length === 0 ? <Empty>No comments yet</Empty> : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-black/30 border border-white/5">
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold flex items-center gap-2">
                    {c.parent_id && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">↳ reply</span>}
                    {c.user_name} <span className="text-white/40 font-normal text-xs">· {c.user_email}</span>
                  </p>
                  <p className="text-sm text-white/70 mt-1 whitespace-pre-line break-words">{c.content}</p>
                </div>
                <button onClick={() => delComment(c.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  // ---------- Editor view ----------
  if (editing) return (
    <div data-testid="admin-events-editor">
      <SectionHeader
        title={editing === 'new' ? 'Add Event' : 'Edit Event'}
        actions={[<GhostButton key="b" onClick={() => setEditing(null)}>Back</GhostButton>]}
      />
      <Card className="space-y-3 max-w-2xl">
        <div><label className="text-xs text-white/60">Title</label><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">Date</label><TextInput value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Venue</label><TextInput value={form.venue || ''} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Theme</label><TextInput value={form.theme || ''} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Status</label><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="past">Past</option></Select></div>
        </div>
        <div><label className="text-xs text-white/60">Short description (card)</label><Textarea rows={2} value={form.short_description || ''} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
        <div>
          <label className="text-xs text-white/60">Cover / banner image</label>
          <input type="file" accept="image/*" onChange={onCover} className="text-sm block mt-1" data-testid="event-cover-input" />
          {form.cover_image_url && (
            <div className="mt-2 flex items-start gap-2">
              <img src={form.cover_image_url} alt="" className="h-24 w-40 rounded-lg object-cover border border-white/10" />
              <button type="button" onClick={() => setForm({ ...form, cover_image_url: '' })} className="text-xs text-red-400 hover:underline">Remove</button>
            </div>
          )}
        </div>
        <div><label className="text-xs text-white/60">Full description</label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><label className="text-xs text-white/60">Guests / Speakers (comma separated)</label><TextInput value={(form.guests || []).join(', ')} onChange={(e) => setForm({ ...form, guests: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} /></div>
        <div><label className="text-xs text-white/60">Highlights (comma separated)</label><TextInput value={(form.highlights || []).join(', ')} onChange={(e) => setForm({ ...form, highlights: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="text-xs text-white/60">Registration link</label><TextInput value={form.registration_link || ''} onChange={(e) => setForm({ ...form, registration_link: e.target.value })} /></div>
          <div><label className="text-xs text-white/60">Registration button text</label><TextInput value={form.registration_button_text || ''} onChange={(e) => setForm({ ...form, registration_button_text: e.target.value })} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label className="text-xs text-white/60">Total seats (capacity)</label><TextInput type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) || 0 })} data-testid="event-capacity" /></div>
          <div><label className="text-xs text-white/60">Seats filled</label><TextInput type="number" value={form.spots_filled} onChange={(e) => setForm({ ...form, spots_filled: Number(e.target.value) || 0 })} data-testid="event-spots-filled" /></div>
          <div><label className="text-xs text-white/60">Display order</label><TextInput type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) || 0 })} /></div>
        </div>
        <p className="text-xs text-white/30">Set capacity above 0 to show the “spots filling up” counter. Leave at 0 to hide it.</p>
        <PrimaryButton onClick={save}>Save</PrimaryButton>
      </Card>
    </div>
  );

  // ---------- List view ----------
  return (
    <div data-testid="admin-events">
      <SectionHeader title="Events" actions={[<PrimaryButton key="n" onClick={openNew}><Plus className="inline h-4 w-4 mr-1" /> Add Event</PrimaryButton>]} />
      <Card>
        {items.length === 0 ? <Empty>No events yet</Empty> : (
          <table className="w-full text-sm">
            <thead className="text-left text-white/60"><tr><th className="p-2">Title</th><th className="p-2">Status</th><th className="p-2">Date</th><th className="p-2">Venue</th><th></th></tr></thead>
            <tbody>{items.map((e) => (
              <tr key={e.id} className="border-t border-white/5">
                <td className="p-2 max-w-xs">{e.title}</td>
                <td className="p-2"><Pill color={statusColor(e.status)}>{e.status}</Pill></td>
                <td className="p-2 text-white/70">{e.date}</td>
                <td className="p-2 text-white/70">{e.venue || '—'}</td>
                <td className="p-2 text-right whitespace-nowrap">
                  <button onClick={() => openComments(e)} title="Moderate comments" className="p-1.5 hover:bg-white/10 rounded mr-1"><MessageSquare className="h-4 w-4" /></button>
                  <button onClick={() => openWaitlist(e)} title="View waitlist" className="p-1.5 hover:bg-white/10 rounded mr-1"><ListChecks className="h-4 w-4" /></button>
                  <button onClick={() => openEdit(e)} title="Edit" className="p-1.5 hover:bg-white/10 rounded mr-1"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => del(e.id)} title="Delete" className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Events;
