'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { INTEL_REPORTS, type IntelReport } from '@/lib/data';
import { Radio, Radar, Satellite, Swords, Shield, Ship, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<IntelReport['category'], React.ComponentType<{ className?: string }>> = {
  probe: Radar,
  clone: Shield,
  signal: Radio,
  force: Activity,
  operation: Swords,
  blockade: Shield,
  fleet: Ship,
};

const SEVERITY_COLORS = {
  low: 'text-holographic',
  medium: 'text-warning',
  high: 'text-orange-400',
  critical: 'text-danger',
};

export function IntelFeed() {
  const [feed, setFeed] = useState<IntelReport[]>(INTEL_REPORTS.slice(0, 30));
  const [filter, setFilter] = useState<IntelReport['severity'] | 'all'>('all');

  useEffect(() => {
    const i = setInterval(() => {
      const next = INTEL_REPORTS[Math.floor(Math.random() * INTEL_REPORTS.length)];
      setFeed(prev => [{ ...next, id: next.id + '-' + Date.now(), timestamp: 'Just now' }, ...prev].slice(0, 50));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const filtered = filter === 'all' ? feed : feed.filter(r => r.severity === filter);

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-6">
      <PageHeader title="LIVE INTELLIGENCE FEED" subtitle="Real-time galaxy-wide intelligence stream" />

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all',
              filter === f ? 'border-imperial/40 bg-imperial/15 text-imperial' : 'border-border bg-card text-muted-foreground hover:text-foreground'
            )}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <Panel accent="red" right={<span className="flex items-center gap-1.5 font-mono text-[10px] text-danger"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> LIVE</span>}>
        <div className="max-h-[650px] overflow-y-auto thin-scrollbar">
          <AnimatePresence initial={false}>
            {filtered.map((r, i) => {
              const Icon = CATEGORY_ICONS[r.category];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, height: 0, x: -20 }}
                  animate={{ opacity: 1, height: 'auto', x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 border-b border-border/30 px-4 py-3"
                >
                  <div className={cn('mt-0.5 rounded-md border p-2',
                    r.severity === 'critical' ? 'border-danger/30 bg-danger/10' :
                    r.severity === 'high' ? 'border-warning/30 bg-warning/10' :
                    'border-border bg-black/30')}>
                    <Icon className={cn('h-4 w-4', SEVERITY_COLORS[r.severity])} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn('font-mono text-[10px] uppercase tracking-widest', SEVERITY_COLORS[r.severity])}>{r.severity}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{r.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{r.message}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="font-mono text-[10px] text-holographic">{r.planet}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{r.category}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}
