import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trackPageView } from '@/utils/analytics';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-white/10">
    <button
      onClick={onClick}
      className="w-full py-4 flex items-center justify-between text-left"
    >
      <span className="text-white font-medium pr-4">{question}</span>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-primary shrink-0" />
      ) : (
        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="pb-4 text-muted-foreground">
        {answer}
      </div>
    )}
  </div>
);

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    trackPageView('/faq');
  }, []);

  const toggleItem = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generalFaqs = [
    { q: "What is Flareonix?", a: "Flareonix is an ecosystem for ambitious creators, freelancers, and founders. We provide community, AI tools, mentorship, and real opportunities." },
    { q: "Is Flareonix free to join?", a: "Basic membership is free. Premium features may require a subscription in the future." },
    { q: "Who can join Flareonix?", a: "Anyone with ambition and a desire to grow. Students, freelancers, creators, or aspiring entrepreneurs." },
  ];

  const communityFaqs = [
    { q: "What's the difference between Founders and Freelancers community?", a: "Founders Community is for those building startups. Freelancers Community is for those monetizing their skills." },
    { q: "Can I be part of both communities?", a: "Yes! Many members are part of both and choose where to engage based on their current focus." },
    { q: "How active is the community?", a: "Very active. We have daily discussions, weekly workshops, and regular events." },
  ];

  const earningFaqs = [
    { q: "How can I earn through Flareonix?", a: "Through our Freelancer Hub, you can access real client projects from our agency partnerships." },
    { q: "Do I need experience to join the Freelancer Hub?", a: "Not necessarily. We have tracks for beginners who are just learning their craft." },
    { q: "What skills are in demand?", a: "Web development, UI/UX design, video editing, social media marketing, and content writing." },
  ];

  const aiFaqs = [
    { q: "What is Flareonix AI?", a: "A suite of tools designed to help creators and founders work faster including caption generators, ad copy writers, and more." },
    { q: "When will AI tools be available?", a: "We're launching our first set of AI tools in Q2 2026. Join now to get early access." },
    { q: "Will AI tools be free?", a: "Basic usage will be free for all members. Power users may need a premium subscription." },
  ];

  const incubatorFaqs = [
    { q: "What is the Flareonix Incubator?", a: "Our startup program that takes founders from idea to funded company with mentorship and investor connections." },
    { q: "When does the Incubator launch?", a: "The first cohort will begin in Q2 2026. Join the waitlist now." },
    { q: "Do I need a working product to apply?", a: "No. We accept founders at the idea stage. We look for a validated problem and commitment." },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">FAQ</span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Flareonix.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">General</h2>
            <div className="glass rounded-xl border border-white/10 px-6">
              {generalFaqs.map((faq, i) => (
                <FAQItem 
                  key={`general-${i}`}
                  question={faq.q} 
                  answer={faq.a}
                  isOpen={openItems[`general-${i}`]}
                  onClick={() => toggleItem(`general-${i}`)}
                />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Community</h2>
            <div className="glass rounded-xl border border-white/10 px-6">
              {communityFaqs.map((faq, i) => (
                <FAQItem 
                  key={`community-${i}`}
                  question={faq.q} 
                  answer={faq.a}
                  isOpen={openItems[`community-${i}`]}
                  onClick={() => toggleItem(`community-${i}`)}
                />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Earning & Freelancing</h2>
            <div className="glass rounded-xl border border-white/10 px-6">
              {earningFaqs.map((faq, i) => (
                <FAQItem 
                  key={`earning-${i}`}
                  question={faq.q} 
                  answer={faq.a}
                  isOpen={openItems[`earning-${i}`]}
                  onClick={() => toggleItem(`earning-${i}`)}
                />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">AI Tools</h2>
            <div className="glass rounded-xl border border-white/10 px-6">
              {aiFaqs.map((faq, i) => (
                <FAQItem 
                  key={`ai-${i}`}
                  question={faq.q} 
                  answer={faq.a}
                  isOpen={openItems[`ai-${i}`]}
                  onClick={() => toggleItem(`ai-${i}`)}
                />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Incubator</h2>
            <div className="glass rounded-xl border border-white/10 px-6">
              {incubatorFaqs.map((faq, i) => (
                <FAQItem 
                  key={`incubator-${i}`}
                  question={faq.q} 
                  answer={faq.a}
                  isOpen={openItems[`incubator-${i}`]}
                  onClick={() => toggleItem(`incubator-${i}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">Can't find what you're looking for? Reach out to us directly.</p>
          <a href="/contact" className="text-primary font-semibold hover:underline">Contact Us →</a>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQPage;
