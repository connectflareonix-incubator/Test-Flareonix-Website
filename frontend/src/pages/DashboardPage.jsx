import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Star, MessageSquare, Settings, LogOut, Flame, ArrowRight, Send } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: ''
  });

  useEffect(() => {
    trackPageView('/dashboard');
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API}/users/me/dashboard`, {
        withCredentials: true
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.title || !reviewForm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/reviews`, reviewForm, {
        withCredentials: true
      });
      toast.success('Review submitted! It will appear after admin approval.');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', content: '' });
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="cursor-pointer hover:scale-110 transition-transform"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating ? 'fill-primary text-primary' : 'fill-none text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/community" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
                <Flame className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading text-lg font-bold text-white mb-2">Join Community</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect with founders and freelancers</p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Explore →
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/ai-tools" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
                <Star className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-heading text-lg font-bold text-white mb-2">AI Tools</h3>
                <p className="text-sm text-muted-foreground mb-4">Supercharge your productivity</p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Coming Soon →
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/freelancer-hub" className="block p-6 glass rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
                <MessageSquare className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="font-heading text-lg font-bold text-white mb-2">Freelancer Hub</h3>
                <p className="text-sm text-muted-foreground mb-4">Find projects and start earning</p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Apply Now →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-white">Your Reviews</h2>
              {!showReviewForm && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full"
                  data-testid="write-review-btn"
                >
                  Write a Review
                </Button>
              )}
            </div>

            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleReviewSubmit}
                className="p-6 glass rounded-xl border border-white/10 mb-6"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4">Share Your Experience</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Rating</Label>
                    <StarRating 
                      rating={reviewForm.rating} 
                      onChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Title</Label>
                    <Input
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Sum up your experience"
                      className="bg-black/50 border-white/10 text-white"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Review</Label>
                    <Textarea
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Tell us about your experience with Flareonix..."
                      className="bg-black/50 border-white/10 text-white min-h-[100px]"
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}

            {dashboardData?.reviews?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.reviews.map((review) => (
                  <div key={review.id} className="p-4 glass rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                    {review.admin_reply && (
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-primary font-semibold mb-1">Admin Reply:</p>
                        <p className="text-sm text-muted-foreground">{review.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                You haven't written any reviews yet. Share your experience with the community!
              </p>
            )}
          </motion.div>

          {/* Admin Link (if admin) */}
          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                <Settings className="h-5 w-5" />
                Go to Admin Panel
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default DashboardPage;
