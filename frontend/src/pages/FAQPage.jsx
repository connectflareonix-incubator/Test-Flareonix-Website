import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trackPageView } from '@/utils/analytics';

const FAQPage = () => {
  useEffect(() => {
    trackPageView('/faq');
  }, []);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is Flareonix?",
          a: "Flareonix is an ecosystem for ambitious creators, freelancers, and founders. We provide community, AI tools, mentorship, and real opportunities to help you build a successful career or business."
        },
        {
          q: "Is Flareonix free to join?",
          a: "Basic membership is free and gives you access to the community, certain resources, and limited AI tools. Premium features and advanced tools may require a subscription in the future."
        },
        {
          q: "Who can join Flareonix?",
          a: "Anyone with ambition and a desire to grow. Whether you're a student, freelancer, creator, or aspiring entrepreneur — if you're willing to put in the work, you belong here."
        },
      ]
    },
    {
      category: "Community",
      questions: [
        {
          q: "What's the difference between Founders and Freelancers community?",
          a: "The Founders Community is for those building startups — we focus on fundraising, co-founder matching, and scaling companies. The Freelancers Community is for those monetizing their skills — we focus on client acquisition, portfolio building, and income growth."
        },
        {
          q: "Can I be part of both communities?",
          a: "Yes! Many members start as freelancers and transition to founders. You can access both communities and choose where to engage based on your current focus."
        },
        {
          q: "How active is the community?",
          a: "Very active. We have daily discussions, weekly workshops, and regular events. Our members are builders, not lurkers — you'll find genuine engagement and support."
        },
      ]
    },
    {
      category: "Earning & Freelancing",
      questions: [
        {
          q: "How can I earn through Flareonix?",
          a: "Through our Freelancer Hub, you can access real client projects from our agency partnerships. As you level up your skills and reputation, you get access to higher-paying opportunities."
        },
        {
          q: "Do I need experience to join the Freelancer Hub?",
          a: "Not necessarily. We have tracks for beginners who are just learning their craft. However, you should have a basic understanding of your chosen skill and be committed to improving."
        },
        {
          q: "What skills are in demand?",
          a: "Web development, UI/UX design, video editing, social media marketing, and content writing are consistently in high demand. Check our Freelancer Hub page for the full list."
        },
      ]
    },
    {
      category: "AI Tools",
      questions: [
        {
          q: "What is Flareonix AI?",
          a: "Flareonix AI is a suite of tools designed to help creators and founders work faster. It includes caption generators, ad copy writers, business idea validators, and more."
        },
        {
          q: "When will AI tools be available?",
          a: "We're launching our first set of AI tools in Q2 2026. Join Flareonix now to get early access when they launch."
        },
        {
          q: "Will AI tools be free?",
          a: "Basic usage will be free for all members. Power users and professionals may need a premium subscription for unlimited access."
        },
      ]
    },
    {
      category: "Incubator",
      questions: [
        {
          q: "What is the Flareonix Incubator?",
          a: "It's our startup program that takes founders from idea to funded company. We provide mentorship, investor connections, resources, and support throughout the journey."
        },
        {
          q: "When does the Incubator launch?",
          a: "The first cohort will begin in Q2 2026. Join the waitlist now to be considered for early selection."
        },
        {
          q: "Do I need a working product to apply?",
          a: "No. We accept founders at the idea stage. What we look for is a validated problem, commitment to go full-time, and the hunger to execute."
        },
      ]
    },
  ];

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
              FAQ
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Flareonix.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          {faqs.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${section.category}-${index}`}
                    className="glass rounded-xl border border-white/10 px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-4 text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Reach out to us directly.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Contact Us →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQPage;
