import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Flame, ArrowRight, MessageSquare, Users } from 'lucide-react';
import { API } from '@/config/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_STYLES = {
  upcoming: { label: 'Upcoming', bg: 'rgba(255,107,0,0.15)', color: '#FF6B00', dot: '#FF6B00' },
  ongoing: { label: 'Ongoing', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', dot: '#22c55e' },
  past: { label: 'Past', bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', dot: 'rgba(255,255,255,0.5)' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.upcoming;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
      data-testid={`event-status-${status}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/events`)
      .then((r) => setEvents(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div data-animate="fade-up" className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 text-primary mb-4">
              <Flame className="h-3.5 w-3.5" /> Flareonix Events
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-black text-white">
              Where Founders <span className="text-primary">Come Alive</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Closed-door meetups, summits, and gatherings built for the next generation of
              builders. Real rooms. Real conversations. Real energy.
            </p>
          </div>

          {loading ? (
            <p className="text-white/40 text-center py-12">Loading events…</p>
          ) : events.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
              <Flame className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-white/60">No events yet — something is brewing.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6" data-stagger-children>
              {events.map((ev) => {
                const cap = ev.capacity || 0;
                const filled = Math.min(ev.spots_filled || 0, cap || Infinity);
                const pct = cap ? Math.min(100, Math.round((filled / cap) * 100)) : 0;
                const left = cap ? Math.max(0, cap - filled) : 0;
                return (
                <Link
                  key={ev.id}
                  to={`/events/${ev.id}`}
                  className="group block rounded-2xl bg-[#0f0f0f] border border-white/10 hover:border-primary/40 transition-all hover:-translate-y-1 overflow-hidden"
                  data-testid={`event-card-${ev.id}`}
                >
                  {ev.cover_image_url && (
                    <div className="relative h-44 overflow-hidden">
                      <img src={ev.cover_image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
                      <div className="absolute top-3 left-3"><StatusBadge status={ev.status} /></div>
                      {ev.theme && (
                        <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur px-2 py-1 rounded-full font-medium italic">“{ev.theme}”</span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    {!ev.cover_image_url && (
                      <div className="flex items-center justify-between mb-4">
                        <StatusBadge status={ev.status} />
                        {ev.theme && (
                          <span className="text-xs text-primary/80 font-medium italic">“{ev.theme}”</span>
                        )}
                      </div>
                    )}
                    <h2 className="font-heading text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {ev.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/50">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary/70" /> {ev.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary/70" /> {ev.venue || 'TBA'}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-4 line-clamp-2">
                      {ev.short_description || ev.description}
                    </p>

                    {cap > 0 && (
                      <div className="mt-4" data-testid={`event-seats-${ev.id}`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-white/50 inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {filled}/{cap} seats
                          </span>
                          <span className={left <= Math.max(1, cap * 0.25) ? 'text-primary font-semibold' : 'text-white/40'}>
                            {left === 0 ? 'Waitlist open' : `Only ${left} left`}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#CC2200]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <span className="text-xs text-white/40 inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> {ev.comment_count || 0} comments
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        View Details <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default EventsPage;
