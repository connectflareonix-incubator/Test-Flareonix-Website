import React, { useState } from 'react';
import { Linkedin, X } from 'lucide-react';

const initials = (n) => (n || '').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

const TeamCard = ({ m }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="p-6 rounded-2xl bg-[#141414] border border-white/10 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setOpen(true)}
        data-testid={`team-card-${m.id}`}
      >
        {m.photo_url
          ? <img src={m.photo_url} alt={m.name} className="h-40 w-40 rounded-full object-cover mx-auto mb-4" />
          : <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary to-[#CC2200] mx-auto mb-4 flex items-center justify-center text-white font-black text-3xl">{initials(m.name)}</div>}
        <h4 className="font-heading text-xl font-bold text-white">{m.name}</h4>
        <div className="text-primary text-sm mb-2">{m.role}</div>
        <p className="text-sm text-white/60 line-clamp-3">{m.bio}</p>
        {m.linkedin_url && (
          <a href={m.linkedin_url} target="_blank" rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-white/70 hover:text-primary">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        )}
        <div className="mt-3 text-xs text-primary/70">Tap to read more</div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {m.photo_url
              ? <img src={m.photo_url} alt={m.name} className="h-32 w-32 rounded-full object-cover mx-auto mb-4" />
              : <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-[#CC2200] mx-auto mb-4 flex items-center justify-center text-white font-black text-2xl">{initials(m.name)}</div>}

            <h3 className="font-heading text-2xl font-bold text-white text-center">{m.name}</h3>
            <div className="text-primary text-sm text-center mb-4">{m.role}</div>
            <p className="text-sm text-white/70 leading-relaxed">{m.bio}</p>

            {m.linkedin_url && (
              <a href={m.linkedin_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-white/70 hover:text-primary">
                <Linkedin className="h-4 w-4" /> View LinkedIn
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamCard;
