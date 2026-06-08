import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API } from '@/config/constants';

const STORAGE_KEY = 'flareonix_dismissed_announcement';

const AnnouncementBanner = () => {
  const [ann, setAnn] = useState(null);

  useEffect(() => {
    axios.get(`${API}/announcements/active`).then((r) => {
      const a = r.data;
      if (a && a.id && a.is_active) {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (a.is_dismissible && dismissed === a.id) return;
        setAnn(a);
      }
    }).catch(() => {});
  }, []);

  if (!ann) return null;

  const close = () => {
    localStorage.setItem(STORAGE_KEY, ann.id);
    setAnn(null);
  };

  return (
    <div
      className="relative z-30 w-full text-white text-sm px-4 py-2 text-center"
      style={{ background: 'linear-gradient(90deg, #CC2200, #FF6B00)' }}
      data-testid="announcement-banner"
    >
      <span>{ann.message}</span>
      {ann.cta_text && ann.cta_url && (
        <a
          href={ann.cta_url}
          target={ann.cta_url.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className="ml-3 underline font-semibold"
        >
          {ann.cta_text}
        </a>
      )}
      {ann.is_dismissible && (
        <button
          onClick={close}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
          aria-label="Dismiss"
          data-testid="announcement-dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default AnnouncementBanner;
