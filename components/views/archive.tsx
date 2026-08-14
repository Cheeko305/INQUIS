'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { OPERATIONS } from '@/lib/data';
import { Archive as ArchiveIcon, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArchiveView() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return OPERATIONS.filter(o => {
      const mq = !query || o.name.toLowerCase().includes(query.toLowerCase()) || o.target.toLowerCase().includes(query.toLowerCase()) || o.planet.toLowerCase().includes(query.toLowerCase()) || o.commander.toLowerCase().includes(query.toLowerCase());
      const ms = statusFilter === 'all' || o.status === statusFilter;
      return mq && ms;
    }).slice(0, 60);
  }, [query, statusFilter]);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="IMPERIAL ARCHIVE" subtitle="Complete mission history and operational records">
        <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, target, planet, commander..." className="w-44 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:w-64" />
        </div>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'planning', 'active', 'completed', 'archived'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={cn('rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all', statusFilter === f ? 'border-imperial/40 bg-imperial/15 text-imperial' : 'border-border bg-card text-muted-foreground hover:text-foreground')}>{f.toUpperCase()}</button>
        ))}
      </div>

      <Panel title={`ARCHIVED RECORDS (${filtered.length})`} accent="blue">
        <div className="max-h-[650px] overflow-y-auto thin-scrollbar">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card/95 backdrop-blur">
              <tr className="border-b border-border">
                <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Operation</th>
                <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:table-cell">Target</th>
                <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground lg:table-cell">Commander</th>
                <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:table-cell">Planet</th>
                <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="hidden px-3 py-2.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:table-cell">Success %</th>
                <th className="px-3 py-2.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.01, 0.3) }} className="border-b border-border/30 hover:bg-white/[0.02]">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <ArchiveIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <div><p className="font-display text-xs font-semibold text-foreground">{o.name}</p><p className="font-mono text-[9px] text-muted-foreground">{o.id}</p></div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 md:table-cell"><span className="font-mono text-[10px] text-foreground">{o.target}</span></td>
                  <td className="hidden px-3 py-2.5 lg:table-cell"><span className="font-mono text-[10px] text-muted-foreground">{o.commander}</span></td>
                  <td className="hidden px-3 py-2.5 sm:table-cell"><span className="font-mono text-[10px] text-muted-foreground">{o.planet}</span></td>
                  <td className="px-3 py-2.5">
                    <span className={cn('flex items-center gap-1 font-mono text-[10px] capitalize',
                      o.status === 'completed' ? 'text-success' : o.status === 'active' ? 'text-imperial' : o.status === 'archived' ? 'text-muted-foreground' : 'text-holographic')}>
                      {o.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : o.status === 'active' ? <Clock className="h-3 w-3" /> : <ArchiveIcon className="h-3 w-3" />}
                      {o.status}
                    </span>
                  </td>
                  <td className="hidden px-3 py-2.5 text-right md:table-cell"><span className="font-num text-xs font-bold text-holographic">{o.aiPrediction}%</span></td>
                  <td className="px-3 py-2.5 text-right"><span className="font-mono text-[10px] text-muted-foreground">{o.createdAt}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
