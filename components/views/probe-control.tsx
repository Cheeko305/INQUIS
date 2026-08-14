'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { Radar, Battery, Signal, Camera, Activity, Plus, MapPin } from 'lucide-react';
import { PLANETS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface Probe {
  id: string;
  planet: string;
  battery: number;
  signal: number;
  status: 'active' | 'standby' | 'destroyed' | 'recovered';
  reports: number;
  lastReport: string;
}

function genProbes(): Probe[] {
  return Array.from({ length: 24 }, (_, i) => {
    const planet = PLANET[Math.floor(Math.random() * PLANET.length)];
    const status = ['active', 'active', 'active', 'standby', 'destroyed', 'recovered'][Math.floor(Math.random() * 6)] as Probe['status'];
    return {
      id: `PRB-${String(i + 1).padStart(3, '0')}`,
      planet: planet.name,
      battery: Math.floor(Math.random() * 100),
      signal: Math.floor(Math.random() * 100),
      status,
      reports: Math.floor(Math.random() * 50),
      lastReport: `${Math.floor(Math.random() * 60)}m ago`,
    };
  });
}

const PLANET = PLANETS;

export function ProbeControl() {
  const [probes] = useState<Probe[]>(genProbes);
  const [selected, setSelected] = useState<string | null>(null);
  const probe = probes.find(p => p.id === selected);

  const statusColor = (s: Probe['status']) => s === 'active' ? 'text-success' : s === 'standby' ? 'text-warning' : s === 'destroyed' ? 'text-danger' : 'text-muted-foreground';

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="PROBE DROID CONTROL" subtitle={`${probes.length} probe droids deployed galaxy-wide`} >
        <button className="flex items-center gap-1.5 rounded-md border border-holographic/30 bg-holographic/10 px-3 py-2 font-display text-[11px] font-bold tracking-widest text-holographic transition-all hover:bg-holographic/20">
          <Plus className="h-3.5 w-3.5" /> DEPLOY PROBE
        </button>
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: 'Active', v: probes.filter(p => p.status === 'active').length, c: 'text-success', icon: Activity },
          { l: 'Standby', v: probes.filter(p => p.status === 'standby').length, c: 'text-warning', icon: Radar },
          { l: 'Destroyed', v: probes.filter(p => p.status === 'destroyed').length, c: 'text-danger', icon: Activity },
          { l: 'Recovered', v: probes.filter(p => p.status === 'recovered').length, c: 'text-muted-foreground', icon: Activity },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass clip-corner p-4">
            <div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p><s.icon className={cn('h-4 w-4', s.c)} /></div>
            <p className={cn('mt-2 font-num text-2xl font-bold', s.c)}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="PROBE NETWORK" accent="blue" className="lg:col-span-2">
          <div className="max-h-[550px] overflow-y-auto thin-scrollbar">
            {probes.map((p, i) => (
              <motion.button key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} onClick={() => setSelected(p.id)}
                className={cn('flex w-full items-center gap-3 border-b border-border/30 px-4 py-3 text-left transition-colors hover:bg-holographic/5', selected === p.id && 'bg-holographic/10')}>
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-black/40"><Radar className={cn('h-4 w-4', statusColor(p.status))} /></div>
                <div className="flex-1">
                  <p className="font-display text-xs font-semibold text-foreground">{p.id}</p>
                  <p className="font-mono text-[10px] text-muted-foreground"><MapPin className="mr-0.5 inline h-2.5 w-2.5" />{p.planet}</p>
                </div>
                <div className="hidden items-center gap-4 sm:flex">
                  <div className="flex items-center gap-1.5"><Battery className={cn('h-3.5 w-3.5', p.battery > 50 ? 'text-success' : p.battery > 20 ? 'text-warning' : 'text-danger')} /><span className="font-num text-xs font-bold text-foreground">{p.battery}%</span></div>
                  <div className="flex items-center gap-1.5"><Signal className={cn('h-3.5 w-3.5', p.signal > 50 ? 'text-success' : 'text-warning')} /><span className="font-num text-xs font-bold text-foreground">{p.signal}%</span></div>
                  <span className={cn('font-mono text-[10px] capitalize', statusColor(p.status))}>{p.status}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </Panel>

        <Panel title="PROBE TELEMETRY" accent="blue">
          {probe ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-holographic/30 bg-holographic/10"><Radar className="h-7 w-7 text-holographic" /></div>
                <div><h3 className="font-display text-lg font-bold text-foreground">{probe.id}</h3><p className="font-mono text-[10px] text-muted-foreground">{probe.planet}</p></div>
              </div>

              <div className="mb-4 h-40 overflow-hidden rounded-md border border-border bg-black/50">
                <div className="relative h-full">
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-holographic/30" />
                  <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-holographic/20" />
                  <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-holographic animate-pulse" />
                  <div className="absolute bottom-2 left-2 font-mono text-[9px] text-holographic">SCAN ACTIVE</div>
                  <div className="absolute bottom-2 right-2 font-mono text-[9px] text-muted-foreground">{probe.lastReport}</div>
                </div>
              </div>

              <div className="space-y-3">
                {[{ l: 'Battery', v: probe.battery, icon: Battery, c: probe.battery > 50 ? 'bg-success' : probe.battery > 20 ? 'bg-warning' : 'bg-danger' },
                  { l: 'Signal Strength', v: probe.signal, icon: Signal, c: probe.signal > 50 ? 'bg-success' : 'bg-warning' }].map(r => (
                  <div key={r.l}>
                    <div className="mb-1 flex items-center justify-between"><span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"><r.icon className="h-3 w-3" /> {r.l}</span><span className="font-num text-xs font-bold text-foreground">{r.v}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/50"><motion.div initial={{ width: 0 }} animate={{ width: `${r.v}%` }} className={cn('h-full rounded-full', r.c)} /></div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border/40 bg-black/30 px-3 py-2"><p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Reports</p><p className="font-num text-lg font-bold text-foreground">{probe.reports}</p></div>
                <div className="rounded-md border border-border/40 bg-black/30 px-3 py-2"><p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Status</p><p className={cn('font-display text-sm font-bold capitalize', statusColor(probe.status))}>{probe.status}</p></div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-md border border-holographic/30 bg-holographic/10 py-2.5 font-display text-xs font-bold tracking-widest text-holographic transition-all hover:bg-holographic/20"><Camera className="mr-1 inline h-3.5 w-3.5" /> CAPTURE</button>
                <button className="flex-1 rounded-md border border-border bg-card py-2.5 font-display text-xs font-bold tracking-widest text-muted-foreground transition-all hover:text-foreground">RECALL</button>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <Radar className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">SELECT A PROBE FOR TELEMETRY</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
