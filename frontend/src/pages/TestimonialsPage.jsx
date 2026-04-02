import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { API } from '@/config/constants';
import { trackPageView } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const TestimonialsPage = () => {
  const { login } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    trackPageView('/testimonials');
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

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Testimonials
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              What Our <span className="text-primary">Community</span> Says
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real members who are building, earning, and growing with Flareonix.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 glass rounded-2xl border border-white/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{review.user_name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-white mb-2">{review.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">"{review.content}"</p>
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
            <div className="text-center py-20">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-8">
                Be the first to share your experience with Flareonix!
              </p>
              <Button
                onClick={login}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-bold"
              >
                Login to Write a Review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start <span className="text-primary">Your Story</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join the community and become our next success story.
            </p>
            <Button
              onClick={login}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold hover-glow"
            >
              Join Flareonix Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TestimonialsPage;
