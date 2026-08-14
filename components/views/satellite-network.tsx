'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { Satellite, Plus, Radar, Signal } from 'lucide-react';
import { PLANETS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface SatelliteData {
  id: string;
  orbit: string;
  coverage: number;
  status: 'active' | 'maintenance' | 'offline';
  sector: string;
}

export function SatelliteNetwork() {
  const [sats] = useState<SatelliteData[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: `SAT-${String(i + 1).padStart(3, '0')}`,
      orbit: ['Low Orbit', 'Geosynchronous', 'High Orbit', 'Polar'][i % 4],
      coverage: Math.floor(Math.random() * 40 + 60),
      status: (['active', 'active', 'active', 'maintenance', 'offline'][Math.floor(Math.random() * 5)]) as SatelliteData['status'],
      sector: PLANETS[i % PLANETS.length].sector,
    }))
  );

  const avgCoverage = Math.round(sats.reduce((a, s) => a + s.coverage, 0) / sats.length);
  const blindSpots = PLANETS.length - Math.round((avgCoverage / 100) * PLANETS.length);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="SATELLITE NETWORK" subtitle="Galaxy-wide surveillance and coverage management">
        <button className="flex items-center gap-1.5 rounded-md border border-holographic/30 bg-holographic/10 px-3 py-2 font-display text-[11px] font-bold tracking-widest text-holographic transition-all hover:bg-holographic/20">
          <Plus className="h-3.5 w-3.5" /> DEPLOY SATELLITE
        </button>
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: 'Active Satellites', v: sats.filter(s => s.status === 'active').length, c: 'text-success' },
          { l: 'Avg Coverage', v: `${avgCoverage}%`, c: 'text-holographic' },
          { l: 'Blind Spots', v: blindSpots, c: 'text-warning' },
          { l: 'Offline', v: sats.filter(s => s.status === 'offline').length, c: 'text-danger' },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass clip-corner p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className={cn('mt-2 font-num text-2xl font-bold', s.c)}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="COVERAGE MAP" accent="blue" className="lg:col-span-2">
          <div className="relative h-80 overflow-hidden rounded-md bg-black/50">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-holographic/20" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-holographic/15" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-holographic/10" />
            {sats.slice(0, 8).map((s, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = 100;
              return (
                <motion.div key={s.id} className="absolute" style={{ left: `calc(50% + ${Math.cos(angle) * r}px)`, top: `calc(50% + ${Math.sin(angle) * r}px)` }}
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
                  <div className="h-2 w-2 rounded-full bg-holographic" style={{ boxShadow: '0 0 8px #00BFFF' }} />
                </motion.div>
              );
            })}
            <div className="absolute bottom-3 left-3 font-mono text-[9px] text-holographic">RADAR ACTIVE // {avgCoverage}% COVERAGE</div>
          </div>
        </Panel>

        <Panel title="SATELLITE ARRAY" accent="blue">
          <div className="max-h-[320px] space-y-2 overflow-y-auto thin-scrollbar p-3">
            {sats.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }} className="rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Satellite className={cn('h-3.5 w-3.5', s.status === 'active' ? 'text-success' : s.status === 'maintenance' ? 'text-warning' : 'text-danger')} />
                    <span className="font-display text-xs font-semibold text-foreground">{s.id}</span>
                  </div>
                  <span className={cn('font-mono text-[9px] capitalize', s.status === 'active' ? 'text-success' : s.status === 'maintenance' ? 'text-warning' : 'text-danger')}>{s.status}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{s.orbit} // {s.sector}</span>
                  <span className="flex items-center gap-1 font-num text-xs font-bold text-holographic"><Signal className="h-3 w-3" />{s.coverage}%</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.coverage}%` }} className="h-full rounded-full bg-holographic" />
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
