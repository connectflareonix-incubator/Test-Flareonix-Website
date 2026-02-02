import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Send, MessageSquare, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '@/config/constants';
import { trackClick } from '@/utils/analytics';

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_email: '',
    rating: 5,
    title: '',
    content: ''
  });

  // Fetch approved reviews on mount
  React.useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews/approved`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.user_email || !formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await trackClick('submit-review', 'Submit Review', 'reviews');

    try {
      await axios.post(`${API}/reviews`, formData);
      toast.success('Thank you! Your review has been submitted for approval.');
      setShowForm(false);
      setFormData({ user_email: '', rating: 5, title: '', content: '' });
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Please sign up for our community first before posting a review.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'You already have a pending review.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onChange, interactive = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-primary text-primary'
                  : 'fill-none text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section 
      id="reviews" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#050505]"
      data-testid="reviews-section"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Community Voices
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Our <span className="text-primary">Founders</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our community members who are building the future.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-6 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all"
                data-testid={`review-card-${index}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{review.user_name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>
                <h4 className="font-heading text-lg font-semibold text-white mb-2">
                  {review.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "{review.content}"
                </p>
                {review.admin_reply && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border-l-2 border-primary">
                    <p className="text-xs text-primary font-semibold mb-1">Flareonix Team:</p>
                    <p className="text-sm text-muted-foreground">{review.admin_reply}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Be the first to share your experience!</p>
          </div>
        )}

        {/* Write Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          {!showForm ? (
            <Button
              onClick={() => {
                setShowForm(true);
                trackClick('write-review', 'Write Review', 'reviews');
              }}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold hover-glow"
              data-testid="write-review-btn"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Share Your Experience
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto p-8 glass rounded-2xl border border-white/10"
            >
              <h3 className="font-heading text-xl font-bold text-white mb-6">
                Write a Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div>
                  <Label htmlFor="user_email" className="text-white mb-2 block">
                    Your Registered Email *
                  </Label>
                  <Input
                    id="user_email"
                    name="user_email"
                    type="email"
                    placeholder="The email you signed up with"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 h-12"
                    required
                    data-testid="review-email-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be a registered community member
                  </p>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Rating *</Label>
                  <StarRating 
                    rating={formData.rating} 
                    onChange={handleRatingChange}
                    interactive 
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-white mb-2 block">
                    Review Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Sum up your experience"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 h-12"
                    maxLength={100}
                    required
                    data-testid="review-title-input"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-white mb-2 block">
                    Your Review *
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Share your experience with Flareonix..."
                    value={formData.content}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 min-h-[120px]"
                    maxLength={1000}
                    required
                    data-testid="review-content-input"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                    data-testid="submit-review-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Reviews are moderated and will appear after admin approval.
                </p>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
