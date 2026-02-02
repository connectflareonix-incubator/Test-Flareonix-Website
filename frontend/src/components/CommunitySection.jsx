import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Users, Zap, Trophy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501";

const CommunitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    occupation: '',
    interest: ''
  });

  const audiences = [
    { icon: <Users className="h-5 w-5" />, text: "Students with startup dreams" },
    { icon: <Zap className="h-5 w-5" />, text: "Freelancers ready to scale" },
    { icon: <Trophy className="h-5 w-5" />, text: "First-generation founders" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Creators who want to build products" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.occupation || !formData.interest) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post(`${API}/community/signup`, formData);
      setIsSuccess(true);
      toast.success('Welcome to Flareonix! Redirecting to our community...');
      
      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        window.open(WHATSAPP_URL, '_blank');
      }, 1500);
      
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'This email is already registered!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      id="community" 
      ref={ref}
      className="relative py-24 md:py-32 bg-[#050505]"
      data-testid="community-section"
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
            Join The Movement
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Built for the <span className="text-primary">Hungry</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a community of ambitious builders who believe in execution over excuses. 
            Your network is your net worth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Who Should Join */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
                Who is this for?
              </h3>
              <div className="space-y-4">
                {audiences.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-white/10"
                    data-testid={`audience-${index}`}
                  >
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-white font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 glass rounded-xl border border-primary/30">
              <h4 className="font-heading text-lg font-semibold text-white mb-3">
                What you'll gain:
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  Direct access to founders and mentors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  Weekly insights on building startups
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  Collaboration opportunities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  Early access to resources and tools
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!isSuccess ? (
              <form 
                onSubmit={handleSubmit}
                className="p-8 glass rounded-2xl border border-white/10"
                data-testid="community-signup-form"
              >
                <h3 className="font-heading text-xl font-bold text-white mb-6">
                  Join the Flareonix Community
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="full_name" className="text-white mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 h-12"
                      required
                      data-testid="input-full-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 h-12"
                      required
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white mb-2 block">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10 focus:border-primary text-white placeholder:text-white/30 h-12"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupation" className="text-white mb-2 block">
                      What describes you best? *
                    </Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('occupation', value)}
                      data-testid="select-occupation"
                    >
                      <SelectTrigger className="bg-black/50 border-white/10 focus:border-primary text-white h-12">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                        <SelectItem value="working_professional">Working Professional</SelectItem>
                        <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                        <SelectItem value="creator">Content Creator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interest" className="text-white mb-2 block">
                      What are you most interested in? *
                    </Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('interest', value)}
                      data-testid="select-interest"
                    >
                      <SelectTrigger className="bg-black/50 border-white/10 focus:border-primary text-white h-12">
                        <SelectValue placeholder="Select your interest" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="startup_building">Building a Startup</SelectItem>
                        <SelectItem value="ai_tools">Leveraging AI Tools</SelectItem>
                        <SelectItem value="networking">Networking & Community</SelectItem>
                        <SelectItem value="mentorship">Mentorship</SelectItem>
                        <SelectItem value="freelancing">Freelancing to Business</SelectItem>
                        <SelectItem value="all">All of the above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white hover:bg-primary/90 rounded-full py-6 text-lg font-bold transition-all hover:scale-[1.02] hover-glow mt-4"
                    data-testid="submit-btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Join the Community
                      </span>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By joining, you agree to receive updates from Flareonix.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 glass rounded-2xl border border-primary/30 text-center"
                data-testid="success-message"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-4">
                  Welcome to Flareonix!
                </h3>
                <p className="text-muted-foreground mb-6">
                  You're now part of the movement. Redirecting you to our WhatsApp community...
                </p>
                <Button
                  onClick={() => window.open(WHATSAPP_URL, '_blank')}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-4"
                  data-testid="whatsapp-redirect-btn"
                >
                  Join WhatsApp Channel
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
