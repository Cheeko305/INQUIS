'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { COMMANDERS, FLEETS } from '@/lib/data';
import { Award, Star, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfficerProfiles() {
  const [selected, setSelected] = useState<string | null>(COMMANDERS[0].id);
  const cmd = COMMANDERS.find(c => c.id === selected);
  const fleet = FLEETS.find(f => f.commander === cmd?.name);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="OFFICER PROFILES" subtitle={`${COMMANDERS.length} officers in Imperial service`} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="OFFICER ROSTER" accent="blue" className="lg:col-span-1">
          <div className="max-h-[600px] space-y-1 overflow-y-auto thin-scrollbar p-2">
            {COMMANDERS.slice(0, 50).map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
                onClick={() => setSelected(c.id)}
                className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                  selected === c.id ? 'bg-imperial/10' : 'hover:bg-white/[0.03]')}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-black/40 font-display text-[10px] font-bold text-imperial">
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={cn('font-display text-xs font-semibold', selected === c.id ? 'text-foreground' : 'text-muted-foreground')}>{c.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">{c.rank}</p>
                </div>
                <span className="font-num text-xs font-bold text-holographic">{c.successRate}%</span>
              </motion.button>
            ))}
          </div>
        </Panel>

        <Panel title="OFFICER DOSSIER" accent="red" className="lg:col-span-2">
          {cmd ? (
            <motion.div key={cmd.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-imperial/40 bg-black/50 font-display text-2xl font-bold text-imperial glow-red">
                  {cmd.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{cmd.name}</h3>
                  <p className="font-mono text-[11px] text-muted-foreground">{cmd.id} // {cmd.rank}</p>
                  <p className="mt-1 font-mono text-[10px] text-holographic">{cmd.experience} years of service</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { l: 'Missions', v: cmd.completedMissions, icon: Shield, c: 'text-holographic' },
                  { l: 'Success Rate', v: `${cmd.successRate}%`, icon: TrendingUp, c: 'text-success' },
                  { l: 'Experience', v: `${cmd.experience}y`, icon: Star, c: 'text-warning' },
                  { l: 'Awards', v: cmd.awards.length, icon: Award, c: 'text-imperial' },
                ].map(s => (
                  <div key={s.l} className="rounded-md border border-border/40 bg-black/30 px-3 py-3">
                    <div className="flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.l}</p><s.icon className={cn('h-3.5 w-3.5', s.c)} /></div>
                    <p className={cn('mt-1.5 font-num text-xl font-bold', s.c)}>{s.v}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-md border border-border/40 bg-black/30 p-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Awards & Commendations</p>
                <div className="flex flex-wrap gap-2">
                  {cmd.awards.map((a, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-sm border border-warning/30 bg-warning/10 px-2.5 py-1 font-mono text-[10px] text-warning">
                      <Award className="h-3 w-3" /> {a}
                    </span>
                  ))}
                </div>
              </div>

              {fleet && (
                <div className="rounded-md border border-border/40 bg-black/30 p-4">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Assigned Fleet</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{fleet.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{fleet.id} // {fleet.location}</p>
                    </div>
                    <span className={cn('font-mono text-[10px] capitalize', fleet.status === 'attacking' ? 'text-danger' : fleet.status === 'moving' ? 'text-holographic' : 'text-success')}>{fleet.status}</span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Promotion Progress</p>
                <div className="h-2 overflow-hidden rounded-full bg-black/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cmd.successRate}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-imperial/40 to-imperial" />
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{cmd.successRate}% eligible for next rank promotion</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <p className="font-mono text-xs text-muted-foreground">SELECT AN OFFICER</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
