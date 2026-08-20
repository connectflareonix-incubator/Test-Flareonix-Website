import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Calendar, MapPin, Sparkles, ArrowLeft, ExternalLink, MessageSquare,
  Users, CheckCircle2,
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

  const loadComments = () => {
    axios.get(`${API}/events/${id}/comments`).then((r) => setComments(r.data || []));
  };

  useEffect(() => {
    axios.get(`${API}/events/${id}`)
      .then((r) => setEvent(r.data))
      .catch(() => { toast.error('Event not found'); nav('/events'); });
    loadComments();
  }, [id]); // eslint-disable-line

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (comment.trim().length < 2) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/events/${id}/comments`, { content: comment }, { withCredentials: true });
      toast.success('Comment posted');
      setComment('');
      loadComments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post comment');
    }
    setSubmitting(false);
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

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <article className="pt-32 pb-20 px-6">
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
          <div className="prose-invert mb-8">
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

          {/* Registration CTA */}
          {event.registration_link && (
            <div className="mb-12 p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent text-center">
              <h3 className="font-heading text-xl font-bold text-white mb-2">Want in?</h3>
              <p className="text-sm text-white/60 mb-4">Seats are limited. Secure your spot now.</p>
              <a href={event.registration_link} target="_blank" rel="noopener noreferrer" data-testid="event-register-link">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold hover-glow">
                  {event.registration_button_text || 'Register Now'}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          )}

          <hr className="my-10 border-white/10" />

          {/* Comments */}
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

            {comments.length === 0 ? (
              <p className="text-sm text-white/40">No comments yet. Be the first to start the conversation.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-white/10" data-testid={`event-comment-${c.id}`}>
                    {c.user_picture ? (
                      <img src={c.user_picture} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                        {(c.user_name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{c.user_name}</span>
                        <span className="text-xs text-white/30">{fmtDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1 whitespace-pre-line break-words">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default EventDetailPage;
