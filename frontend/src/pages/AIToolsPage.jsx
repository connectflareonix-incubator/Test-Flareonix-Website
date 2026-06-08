import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolGrid from '@/components/ai/ToolGrid';
import ToolWorkspace from '@/components/ai/ToolWorkspace';
import HistoryList from '@/components/ai/HistoryList';
import { useAuth } from '@/context/AuthContext';
import { trackPageView } from '@/utils/analytics';

const AIToolsPage = () => {
  const { user, login } = useAuth();
  const [activeSlug, setActiveSlug] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { trackPageView('/ai-tools'); }, []);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" /> Powered by Claude Sonnet 4.5
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Flareonix <span className="text-primary">AI</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Six battle-tested AI tools for creators, freelancers and founders. Generate, copy, ship.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {!user && (
            <div className="mb-12 p-8 glass rounded-2xl border border-primary/20 text-center" data-testid="ai-login-gate">
              <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-white mb-2">Login to start generating</h2>
              <p className="text-muted-foreground mb-6">
                Free for community members. Sign in with Google to access all six tools.
              </p>
              <Button
                onClick={login}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-5 font-bold hover-glow"
                data-testid="ai-login-cta"
              >
                <Lock className="mr-2 h-4 w-4" /> Login to Access
              </Button>
            </div>
          )}

          {user && activeSlug && (
            <ToolWorkspace
              slug={activeSlug}
              onBack={() => setActiveSlug(null)}
              onSaved={() => setRefreshKey((k) => k + 1)}
            />
          )}

          {user && !activeSlug && (
            <div className="space-y-12">
              <ToolGrid onSelect={setActiveSlug} />
              <HistoryList refreshKey={refreshKey} />
            </div>
          )}

          {!user && (
            <div className="opacity-60 pointer-events-none">
              <ToolGrid onSelect={() => {}} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AIToolsPage;
