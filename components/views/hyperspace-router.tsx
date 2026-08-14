'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { PLANETS } from '@/lib/data';
import { Route, MapPin, Fuel, Clock, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HyperspaceRouter() {
  const [from, setFrom] = useState(PLANETS[0].name);
  const [to, setTo] = useState(PLANETS[10].name);

  const result = useMemo(() => {
    const pA = PLANETS.find(p => p.name === from);
    const pB = PLANETS.find(p => p.name === to);
    if (!pA || !pB) return null;
    const dx = pA.position[0] - pB.position[0];
    const dy = pA.position[1] - pB.position[1];
    const dz = pA.position[2] - pB.position[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const shortest = Math.round(dist * 0.8);
    const fastest = Math.round(dist * 0.6);
    const danger = Math.min(99, Math.round((pB.threatScore + pA.threatScore) / 2));
    const fuelCost = Math.round(dist * 4);
    const travelTime = `${Math.floor(dist / 8)}h ${Math.round((dist % 8) * 7)}m`;
    return { shortest, fastest, danger, fuelCost, travelTime };
  }, [from, to]);

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-6">
      <PageHeader title="HYPERSPACE ROUTE CALCULATOR" subtitle="Calculate optimal hyperspace routes between planets" />

      <Panel accent="blue">
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Departure</label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-holographic" />
              <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-transparent font-mono text-sm text-foreground focus:outline-none">
                {PLANETS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Destination</label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-imperial" />
              <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-transparent font-mono text-sm text-foreground focus:outline-none">
                {PLANETS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Panel>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Panel title="ROUTE ANALYSIS" accent="blue">
            <div className="space-y-3 p-4">
              {[
                { l: 'Shortest Route', v: `${result.shortest} parsecs`, icon: Route, c: 'text-holographic' },
                { l: 'Fastest Route', v: `${result.fastest} parsecs`, icon: Zap, c: 'text-success' },
                { l: 'Travel Time', v: result.travelTime, icon: Clock, c: 'text-warning' },
                { l: 'Fuel Cost', v: `${result.fuelCost} units`, icon: Fuel, c: 'text-imperial' },
                { l: 'Danger Level', v: `${result.danger}%`, icon: AlertTriangle, c: result.danger > 60 ? 'text-danger' : result.danger > 30 ? 'text-warning' : 'text-success' },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between rounded-md border border-border/40 bg-black/30 px-4 py-3">
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"><r.icon className={cn('h-4 w-4', r.c)} /> {r.l}</span>
                  <span className={cn('font-num text-lg font-bold', r.c)}>{r.v}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="ROUTE VISUALIZATION" accent="red">
            <div className="relative h-64 overflow-hidden rounded-md bg-black/50">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 256">
                <motion.path
                  d="M 60 128 Q 200 40 340 128"
                  fill="none"
                  stroke="#00BFFF"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <motion.path
                  d="M 60 128 Q 200 216 340 128"
                  fill="none"
                  stroke="#2ECC71"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                <circle cx="60" cy="128" r="6" fill="#00BFFF" />
                <circle cx="340" cy="128" r="6" fill="#B00020" />
                <text x="60" y="118" fill="#00BFFF" fontSize="10" fontFamily="monospace" textAnchor="middle">{from.slice(0, 8)}</text>
                <text x="340" y="118" fill="#B00020" fontSize="10" fontFamily="monospace" textAnchor="middle">{to.slice(0, 8)}</text>
              </svg>
              <div className="absolute bottom-3 left-3 flex gap-4">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-holographic"><span className="h-2 w-2 rounded-full bg-holographic" /> Shortest</span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-success"><span className="h-2 w-2 rounded-full bg-success" /> Fastest</span>
              </div>
            </div>
            <div className="p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-imperial/40 bg-imperial/20 py-2.5 font-display text-xs font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red">
                <Route className="h-3.5 w-3.5" /> PLOT COURSE
              </button>
            </div>
          </Panel>
        </motion.div>
      )}
    </div>
  );
}
