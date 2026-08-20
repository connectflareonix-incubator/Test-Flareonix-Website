import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Calendar, MapPin, Sparkles, ArrowLeft, ExternalLink, MessageSquare,
  Users, CheckCircle2, CornerDownRight,
} from 'lucide-react';
import { API } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const STATUS_STYLES = {
  upcoming: { label: 'Upcoming', bg: 'rgba(255,107,0,0.15)', color: '#FF6B00', dot: '#FF6B00' },
  ongoing: { label: 'Ongoing', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', dot: '#22c55e' },
  past: { label: 'Past', bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', dot: 'rgba(255,255,255,0.5)' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.upcoming;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
      data-testid={`event-detail-status-${status}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

const Avatar = ({ name, picture, size = 'h-9 w-9' }) => (
  picture ? (
    <img src={picture} alt="" className={`${size} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${size} rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0`}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
);

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

const EventDetailPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, login } = useAuth();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [seats, setSeats] = useState({ capacity: 0, filled: 0 });

  const loadComments = () => {
    axios.get(`${API}/events/${id}/comments`).then((r) => setComments(r.data || []));
  };

  useEffect(() => {
    axios.get(`${API}/events/${id}`)
      .then((r) => {
        setEvent(r.data);
        setSeats({ capacity: r.data.capacity || 0, filled: r.data.spots_filled || 0 });
      })
      .catch(() => { toast.error('Event not found'); nav('/events'); });
    loadComments();
  }, [id]); // eslint-disable-line

  const postComment = (content, parentId) =>
    axios.post(`${API}/events/${id}/comments`, { content, parent_id: parentId || null }, { withCredentials: true });

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (comment.trim().length < 2) return;
    setSubmitting(true);
    try {
      await postComment(comment, null);
      toast.success('Comment posted');
      setComment('');
      loadComments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post comment');
    }
    setSubmitting(false);
  };

  const submitReply = async (e, parentId) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (replyText.trim().length < 2) return;
    setReplySubmitting(true);
    try {
      await postComment(replyText, parentId);
      toast.success('Reply posted');
      setReplyText('');
      setReplyingTo(null);
      loadComments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reply');
    }
    setReplySubmitting(false);
  };

  const handleApply = () => {
    const key = `flareonix_event_interest_${id}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      axios.post(`${API}/events/${id}/interest`)
        .then((r) => setSeats({ capacity: r.data.capacity || 0, filled: r.data.spots_filled || 0 }))
        .catch(() => {});
    }
  };

  if (!event) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="pt-32 text-center text-white/40">Loading…</div>
        <Footer />
      </main>
    );
  }

  const highlights = event.highlights || [];
  const guests = event.guests || [];
  const topLevel = comments.filter((c) => !c.parent_id);

  // Seats math (local identifiers only)
  const cap = seats.capacity || 0;
  const filled = Math.min(seats.filled || 0, cap || Infinity);
  const pct = cap ? Math.min(100, Math.round((filled / cap) * 100)) : 0;
  const left = cap ? Math.max(0, cap - filled) : 0;
  const urgent = cap ? left <= Math.max(1, Math.round(cap * 0.25)) : false;

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <article className="pt-24 pb-20">
        {/* Cover banner */}
        {event.cover_image_url && (
          <div className="relative w-full h-56 md:h-80 overflow-hidden" data-testid="event-cover">
            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/20" />
          </div>
        )}

        <div className={`px-6 ${event.cover_image_url ? '-mt-20 relative' : 'pt-8'}`}>
          <div className="max-w-3xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <StatusBadge status={event.status} />
              {event.theme && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Theme: {event.theme}
                </span>
              )}
            </div>

            <h1 data-animate="fade-up" className="font-heading text-3xl md:text-5xl font-black text-white mb-5">
              {event.title}
            </h1>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-white/10">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-white/40">Date</p>
                  <p className="text-sm text-white font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-white/10">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-white/40">Venue</p>
                  <p className="text-sm text-white font-medium">{event.venue || 'To be announced'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-white/70 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-lg font-bold text-white mb-3">Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-[#0f0f0f] border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-white/80">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guests / Speakers */}
            {guests.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Guests & Speakers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guests.map((g, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seats / spots filling up */}
            {cap > 0 && (
              <div className="mb-8 p-5 rounded-2xl bg-[#0f0f0f] border border-white/10" data-testid="event-seats">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-semibold inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Seats filling up
                  </span>
                  <span className="text-sm text-white/60">{filled}/{cap} filled</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#CC2200] transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <p className={`text-xs mt-2 ${urgent ? 'text-primary font-semibold' : 'text-white/40'}`}>
                  {left === 0 ? 'Fully booked — join the waitlist.' : `Only ${left} ${left === 1 ? 'spot' : 'spots'} left — ${urgent ? 'filling fast!' : 'grab yours.'}`}
                </p>
              </div>
            )}

            {/* Registration CTA */}
            {event.registration_link && (
              <div className="mb-12 p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent text-center">
                <h3 className="font-heading text-xl font-bold text-white mb-2">Want in?</h3>
                <p className="text-sm text-white/60 mb-4">Seats are limited. Secure your spot now.</p>
                <a href={event.registration_link} target="_blank" rel="noopener noreferrer" onClick={handleApply} data-testid="event-register-link">
                  <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold hover-glow">
                    {event.registration_button_text || 'Register Now'}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            )}

            <hr className="my-10 border-white/10" />

            {/* Comments / discussion */}
            <section data-testid="event-comments">
              <h3 className="font-heading text-xl font-bold text-white mb-5 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Discussion ({comments.length})
              </h3>

              {!user ? (
                <div className="p-5 rounded-xl glass border border-primary/20 text-center mb-6">
                  <p className="text-sm text-white/70 mb-3">Login to join the discussion.</p>
                  <Button onClick={login} className="bg-primary text-white rounded-full px-6" data-testid="event-comment-login">
                    Login with Google
                  </Button>
                </div>
              ) : (
                <form onSubmit={submitComment} className="space-y-3 mb-8">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this event…"
                    rows={4}
                    className="bg-black/40 border-white/10 text-white"
                    data-testid="event-comment-input"
                  />
                  <Button type="submit" disabled={submitting} className="bg-primary text-white rounded-full px-6" data-testid="event-comment-submit">
                    {submitting ? 'Posting…' : 'Post Comment'}
                  </Button>
                </form>
              )}

              {topLevel.length === 0 ? (
                <p className="text-sm text-white/40">No comments yet. Be the first to start the conversation.</p>
              ) : (
                <div className="space-y-4">
                  {topLevel.map((c) => {
                    const replies = comments.filter((r) => r.parent_id === c.id);
                    return (
                      <div key={c.id} className="p-4 rounded-xl bg-[#0f0f0f] border border-white/10" data-testid={`event-comment-${c.id}`}>
                        <div className="flex gap-3">
                          <Avatar name={c.user_name} picture={c.user_picture} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white">{c.user_name}</span>
                              <span className="text-xs text-white/30">{fmtDate(c.created_at)}</span>
                            </div>
                            <p className="text-sm text-white/70 mt-1 whitespace-pre-line break-words">{c.content}</p>
                            <button
                              onClick={() => { if (!user) { login(); return; } setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-white/40 hover:text-primary transition-colors"
                              data-testid={`event-reply-btn-${c.id}`}
                            >
                              <CornerDownRight className="h-3.5 w-3.5" /> Reply
                            </button>
                          </div>
                        </div>

                        {/* Reply form */}
                        {replyingTo === c.id && user && (
                          <form onSubmit={(e) => submitReply(e, c.id)} className="mt-3 ml-12 space-y-2" data-testid={`event-reply-form-${c.id}`}>
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${c.user_name}…`}
                              rows={2}
                              className="bg-black/40 border-white/10 text-white text-sm"
                              data-testid={`event-reply-input-${c.id}`}
                            />
                            <div className="flex gap-2">
                              <Button type="submit" disabled={replySubmitting} className="bg-primary text-white rounded-full px-4 py-1 h-8 text-xs">
                                {replySubmitting ? 'Replying…' : 'Reply'}
                              </Button>
                              <Button type="button" variant="ghost" onClick={() => setReplyingTo(null)} className="text-white/50 rounded-full px-4 py-1 h-8 text-xs">
                                Cancel
                              </Button>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="mt-3 ml-6 pl-6 border-l border-white/10 space-y-3">
                            {replies.map((r) => (
                              <div key={r.id} className="flex gap-3" data-testid={`event-reply-${r.id}`}>
                                <Avatar name={r.user_name} picture={r.user_picture} size="h-7 w-7" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-white">{r.user_name}</span>
                                    <span className="text-xs text-white/30">{fmtDate(r.created_at)}</span>
                                  </div>
                                  <p className="text-sm text-white/70 mt-1 whitespace-pre-line break-words">{r.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default EventDetailPage;
