import React from 'react';
import { Linkedin } from 'lucide-react';

const initials = (n) => (n || '').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

const TeamCard = ({ m }) => (
  <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 text-center" data-testid={`team-card-${m.id}`}>
    {m.photo_url
      ? <img src={m.photo_url} alt={m.name} className="h-40 w-40 rounded-full object-cover mx-auto mb-4" />
      : <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary to-[#CC2200] mx-auto mb-4 flex items-center justify-center text-white font-black text-3xl">{initials(m.name)}</div>}
    <h4 className="font-heading text-xl font-bold text-white">{m.name}</h4>
    <div className="text-primary text-sm mb-2">{m.role}</div>
    <p className="text-sm text-white/60 line-clamp-3">{m.bio}</p>
    {m.linkedin_url && (
      <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-white/70 hover:text-primary">
        <Linkedin className="h-4 w-4" /> LinkedIn
      </a>
    )}
  </div>
);

export default TeamCard;
