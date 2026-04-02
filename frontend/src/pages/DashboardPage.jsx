import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Star, MessageSquare, Flame, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { API } from '@/config/constants';
import { trackPageView } from '@/utils/analytics';
import { toast } from 'sonner';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    trackPageView('/dashboard');
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/users/me/dashboard`, { withCredentials: true });
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) { toast.error('Please fill in all fields'); return; }
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/reviews`, { rating, title, content }, { withCredentials: true });
      toast.success('Review submitted! It will appear after admin approval.');
      setShowReviewForm(false);
      setTitle(''); setContent(''); setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-3xl font-bold text-white">
                  Welcome, <span className="text-primary">{user?.name?.split(' ')[0]}</span>!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link to="/community" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
              <Flame className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">Join Community</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with founders and freelancers</p>
              <span className="text-primary text-sm font-semibold group-hover:underline">Explore →</span>
            </Link>

            <Link to="/ai-tools" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
              <Star className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">AI Tools</h3>
              <p className="text-sm text-muted-foreground mb-4">Supercharge your productivity</p>
              <span className="text-primary text-sm font-semibold group-hover:underline">Coming Soon →</span>
            </Link>

            <Link to="/freelancer-hub" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
              <MessageSquare className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">Freelancer Hub</h3>
              <p className="text-sm text-muted-foreground mb-4">Find projects and start earning</p>
              <span className="text-primary text-sm font-semibold group-hover:underline">Apply Now →</span>
            </Link>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-white">Your Reviews</h2>
              {!showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)} className="bg-primary text-white hover:bg-primary/90 rounded-full">
                  Write a Review
                </Button>
              )}
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-6 glass rounded-xl border border-white/10 mb-6">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Share Your Experience</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Rating</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)} className="cursor-pointer hover:scale-110 transition-transform">
                          <Star className={`h-6 w-6 ${star <= rating ? 'fill-primary text-primary' : 'fill-none text-muted-foreground'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum up your experience" className="bg-black/50 border-white/10 text-white" maxLength={100} required />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Review</Label>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell us about your experience..." className="bg-black/50 border-white/10 text-white min-h-[100px]" maxLength={1000} required />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} className="border-white/20 text-white hover:bg-white/10">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90">
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 glass rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{review.status}</span>
                    </div>
                    <h4 className="font-semibold text-white">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">You haven't written any reviews yet.</p>
            )}
          </div>

          {user?.role === 'admin' && (
            <Link to="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
              Go to Admin Panel
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default DashboardPage;
