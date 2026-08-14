'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { BOUNTY_HUNTERS, type BountyHunter } from '@/lib/data';
import { Crosshair, Coins, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_ICON = {
  available: { icon: CheckCircle, color: 'text-success', label: 'Available' },
  'on-mission': { icon: Clock, color: 'text-warning', label: 'On Mission' },
  unavailable: { icon: XCircle, color: 'text-danger', label: 'Unavailable' },
} as const;

export function BountyNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const hunter = BOUNTY_HUNTERS.find(h => h.id === selected);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="BOUNTY HUNTER NETWORK" subtitle="Licensed contractors for high-value target acquisition" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={`HUNTERS (${BOUNTY_HUNTERS.length})`} accent="red" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            {BOUNTY_HUNTERS.map((h, i) => {
              const s = STATUS_ICON[h.availability];
              return (
                <motion.button
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(h.id)}
                  whileHover={{ y: -2 }}
                  className={cn('rounded-md border bg-black/30 p-4 text-left transition-all hover:border-imperial/40',
                    selected === h.id ? 'border-imperial/40 bg-imperial/10' : 'border-border/40')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-black/50 font-display text-sm font-bold text-imperial">
                        {h.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-foreground">{h.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{h.species}</p>
                      </div>
                    </div>
                    <s.icon className={cn('h-4 w-4', s.color)} />
                  </div>
                  <p className="mt-3 font-mono text-[10px] text-muted-foreground">{h.specialization}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-num text-sm font-bold text-warning"><Coins className="h-3 w-3" />{h.price.toLocaleString()}</span>
                    <div className="flex gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground">REL: <span className="font-bold text-foreground">{h.reliability}%</span></span>
                      <span className="font-mono text-[10px] text-muted-foreground">SUCC: <span className="font-bold text-success">{h.successRate}%</span></span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Panel>

        <Panel title="CONTRACT DETAILS" accent="red">
          {hunter ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-imperial/40 bg-black/50 font-display text-xl font-bold text-imperial">
                  {hunter.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{hunter.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{hunter.species} // {hunter.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { l: 'Status', v: STATUS_ICON[hunter.availability].label },
                  { l: 'Specialization', v: hunter.specialization },
                  { l: 'Price', v: `${hunter.price.toLocaleString()} credits` },
                  { l: 'Reliability', v: `${hunter.reliability}%` },
                  { l: 'Success Rate', v: `${hunter.successRate}%` },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.l}</span>
                    <span className="font-display text-xs font-semibold text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Performance</p>
                <div className="space-y-2">
                  {[
                    { l: 'Reliability', v: hunter.reliability, c: 'bg-holographic' },
                    { l: 'Success Rate', v: hunter.successRate, c: 'bg-success' },
                  ].map(r => (
                    <div key={r.l}>
                      <div className="mb-1 flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">{r.l}</span><span className="font-num text-xs font-bold text-foreground">{r.v}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-black/50"><motion.div initial={{ width: 0 }} animate={{ width: `${r.v}%` }} className={cn('h-full rounded-full', r.c)} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={hunter.availability !== 'available'}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-imperial/40 bg-imperial/20 py-2.5 font-display text-xs font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red disabled:opacity-40"
              >
                <Crosshair className="h-3.5 w-3.5" /> ASSIGN MISSION
              </button>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <Crosshair className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">SELECT A HUNTER FOR CONTRACT DETAILS</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
