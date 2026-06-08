import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API } from '@/config/constants';
import { toast } from 'sonner';
import axios from 'axios';

const HistoryList = ({ refreshKey }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/ai/history`, { withCredentials: true });
      setItems(res.data || []);
    } catch (e) {
      // silent — user may not be logged in yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/ai/history/${id}`, { withCredentials: true });
      setItems((prev) => prev.filter((it) => it.id !== id));
      toast.success('Removed');
    } catch {
      toast.error('Could not remove');
    }
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  return (
    <div className="space-y-3" data-testid="ai-history-list">
      <div className="flex items-center gap-2 text-white">
        <History className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-bold">Recent generations</h3>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nothing yet — generate your first idea above.</p>
      )}
      {items.map((it, i) => (
        <motion.div
          key={it.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="p-4 glass rounded-xl border border-white/10"
          data-testid={`ai-history-item-${it.id}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 bg-primary/15 text-primary rounded-full">{it.tool_name}</span>
                <span className="text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-white truncate">{it.prompt}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => handleCopy(it.response)} className="text-white hover:bg-white/10 h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)} className="text-red-400 hover:bg-red-500/10 h-8 w-8" data-testid={`ai-history-delete-${it.id}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <button
            onClick={() => setOpenId(openId === it.id ? null : it.id)}
            className="text-xs text-primary mt-2 hover:underline"
          >
            {openId === it.id ? 'Hide output' : 'View output'}
          </button>
          {openId === it.id && (
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-muted-foreground border-t border-white/10 pt-3">
              {it.response}
            </pre>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default HistoryList;
