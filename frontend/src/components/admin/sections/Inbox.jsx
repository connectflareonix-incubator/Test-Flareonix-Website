import React, { useEffect, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, GhostButton, Loader, Empty, Pill } from '../ui';
import { downloadCSV } from '../csvUtil';
import { FREELANCER_FORM, FOUNDER_FORM, CALENDLY_LINK } from '@/config/constants';
import { toast } from 'sonner';

const Inbox = () => {
  const [tab, setTab] = useState('contacts');
  const [contacts, setContacts] = useState(null);
  const [openId, setOpenId] = useState(null);

  const load = async () => setContacts(await adminApi.listContacts());
  useEffect(() => { load(); }, []);

  const markRead = async (id) => { await adminApi.updateContact(id, { is_read: true }); load(); };
  const del = async (id) => { if (window.confirm('Delete?')) { await adminApi.deleteContact(id); load(); } };

  return (
    <div data-testid="admin-inbox">
      <SectionHeader title="Inbox" subtitle="All contact & form submissions" actions={[
        <GhostButton key="t1" onClick={() => setTab('contacts')} className={tab === 'contacts' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Contact Forms</GhostButton>,
        <GhostButton key="t2" onClick={() => setTab('freelancers')} className={tab === 'freelancers' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Freelancers</GhostButton>,
        <GhostButton key="t3" onClick={() => setTab('founders')} className={tab === 'founders' ? 'border-[#FF6B00] text-[#FF6B00]' : ''}>Founders</GhostButton>,
      ]} />

      {tab === 'contacts' && (
        <Card>
          <div className="flex justify-end mb-3">
            <GhostButton onClick={() => downloadCSV(contacts || [], 'contact-submissions.csv')}>Export CSV</GhostButton>
          </div>
          {contacts === null ? <Loader /> : contacts.length === 0 ? <Empty /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/60"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Inquiry</th><th className="p-2">Message</th><th className="p-2">Date</th><th className="p-2">Status</th><th></th></tr></thead>
                <tbody>{contacts.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="border-t border-white/5">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2 text-white/70">{c.email}</td>
                      <td className="p-2"><Pill>{c.inquiry_type}</Pill></td>
                      <td className="p-2 text-white/70 truncate max-w-xs">{c.message.slice(0, 60)}…</td>
                      <td className="p-2 text-white/50">{(c.created_at || '').slice(0, 10)}</td>
                      <td className="p-2"><Pill color={c.is_read ? 'green' : 'yellow'}>{c.is_read ? 'read' : 'new'}</Pill></td>
                      <td className="p-2 text-right">
                        <button onClick={() => setOpenId(openId === c.id ? null : c.id)} className="p-1.5 hover:bg-white/10 rounded mr-1"><Eye className="h-4 w-4" /></button>
                        {!c.is_read && <button onClick={() => markRead(c.id)} className="text-xs text-[#FF6B00] mr-2">Mark read</button>}
                        <button onClick={() => del(c.id)} className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                    {openId === c.id && (
                      <tr><td colSpan="7" className="p-3 bg-black/30 text-sm whitespace-pre-wrap">{c.message}<br /><span className="text-white/50">WhatsApp: {c.whatsapp || '—'}</span></td></tr>
                    )}
                  </React.Fragment>
                ))}</tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab === 'freelancers' && (
        <Card>
          <p className="text-sm text-white/70">
            Freelancer applications submitted via Google Form. View responses at:{' '}
            <a href={FREELANCER_FORM} target="_blank" rel="noreferrer" className="text-[#FF6B00] underline">Freelancer Form →</a>
          </p>
          <p className="text-xs text-white/40 mt-2">Manual tracking can be done via the Contact Forms tab or an external sheet.</p>
        </Card>
      )}

      {tab === 'founders' && (
        <Card>
          <p className="text-sm text-white/70">
            Founder applications submitted via Google Form. View responses at:{' '}
            <a href={FOUNDER_FORM} target="_blank" rel="noreferrer" className="text-[#FF6B00] underline">Founder Form →</a>
          </p>
          <p className="text-xs text-white/40 mt-2">
            To schedule a call with an applicant, send them this Calendly link:{' '}
            <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" className="text-[#FF6B00] underline">{CALENDLY_LINK}</a>
          </p>
        </Card>
      )}
    </div>
  );
};

export default Inbox;
