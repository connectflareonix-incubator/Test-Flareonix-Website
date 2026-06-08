import { PenTool, FileText, Lightbulb, CalendarDays, Send, Brain } from 'lucide-react';

export const TOOLS = [
  {
    slug: 'caption',
    name: 'Caption Generator',
    desc: 'Generate 5 viral social-media captions with hashtags & CTAs.',
    icon: PenTool,
    placeholder: 'Brand: Flareonix (youth startup ecosystem). Topic: launch announcement. Tone: bold, hype.',
    accent: 'text-primary',
  },
  {
    slug: 'ad-copy',
    name: 'Ad Copy Writer',
    desc: 'High-converting Meta + Google ad copy variants.',
    icon: FileText,
    placeholder: 'Product: Online Personal Branding course for college students in India. Price: ₹1,999. Target: 18-24, hustlers.',
    accent: 'text-orange-400',
  },
  {
    slug: 'business-idea',
    name: 'Business Idea Generator',
    desc: 'Three lean, India-specific startup ideas tailored to you.',
    icon: Lightbulb,
    placeholder: 'Skills: video editing, basic Python. Interests: fitness, education. Budget: ₹20k. Time: 10 hrs/week.',
    accent: 'text-yellow-400',
  },
  {
    slug: 'content-calendar',
    name: 'Content Calendar',
    desc: 'A punchy 7-day plan across Reels, carousels, tweets.',
    icon: CalendarDays,
    placeholder: 'Niche: AI for freelancers. Goal: grow IG from 500 to 5k. Style: punchy, educational.',
    accent: 'text-blue-400',
  },
  {
    slug: 'email-writer',
    name: 'Email Writer',
    desc: 'Cold emails that get replies — under 90 words.',
    icon: Send,
    placeholder: 'Goal: pitch a podcast collab. Recipient: a fintech founder with 50k followers. My angle: AI for solopreneurs.',
    accent: 'text-green-400',
  },
  {
    slug: 'pitch-deck',
    name: 'Pitch Deck Assistant',
    desc: 'A 10-slide investor-ready deck outline in seconds.',
    icon: Brain,
    placeholder: 'Startup: AI co-pilot for Indian D2C founders. Stage: pre-seed. Traction: 200 waitlist, 12 paid pilots.',
    accent: 'text-purple-400',
  },
];

export const getTool = (slug) => TOOLS.find((t) => t.slug === slug);
