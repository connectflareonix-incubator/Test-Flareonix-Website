import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { API } from '@/config/constants';
import { toast } from 'sonner';
import axios from 'axios';
import { getTool } from './toolsConfig';

const ToolWorkspace = ({ slug, onBack, onSaved }) => {
  const tool = getTool(slug);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!tool) return null;
  const Icon = tool.icon;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (prompt.trim().length < 5) {
      toast.error('Add a few more details to get a great result.');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const res = await axios.post(
        `${API}/ai/generate`,
        { tool: slug, prompt },
        { withCredentials: true }
      );
      setResult(res.data.response);
      onSaved && onSaved();
      toast.success('Generated with Claude Sonnet 4.5');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Generation failed';
      toast.error(typeof msg === 'string' ? msg : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-testid="ai-tool-workspace"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
        data-testid="ai-tool-back-btn"
      >
        <ArrowLeft className="h-4 w-4" /> All tools
      </button>

      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${tool.accent}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{tool.name}</h2>
          <p className="text-sm text-muted-foreground">Powered by Claude Sonnet 4.5</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="p-6 glass rounded-2xl border border-white/10 space-y-4">
        <div>
          <Label className="text-white mb-2 block">Tell us what you need</Label>
          <Textarea
            data-testid="ai-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={tool.placeholder}
            className="bg-black/50 border-white/10 text-white min-h-[140px]"
            maxLength={2000}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">{prompt.length}/2000</p>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-5 font-bold"
          data-testid="ai-generate-btn"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> Generate</>
          )}
        </Button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 glass rounded-2xl border border-primary/20"
          data-testid="ai-result-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-white">Output</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-white hover:bg-white/10"
              data-testid="ai-copy-btn"
            >
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground leading-relaxed">
            {result}
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ToolWorkspace;
