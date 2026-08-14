'use client';

import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { OPERATIONS, JEDI, FLEETS, PLANETS } from '@/lib/data';
import { BarChart, BarChart3, TrendingUp, Activity, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Analytics() {
  const missionSuccess = OPERATIONS.filter(o => o.status === 'completed').length;
  const missionTotal = OPERATIONS.length;
  const successRate = Math.round((missionSuccess / missionTotal) * 100);
  const jediCaptured = JEDI.filter(j => j.status === 'captured' || j.status === 'eliminated').length;
  const avgMorale = Math.round(FLEETS.reduce((a, f) => a + f.morale, 0) / FLEETS.length);
  const avgFuel = Math.round(FLEETS.reduce((a, f) => a + f.fuel, 0) / FLEETS.length);

  const weeklyData = [
    { day: 'Mon', missions: 12, threats: 8, captured: 3 },
    { day: 'Tue', missions: 15, threats: 10, captured: 5 },
    { day: 'Wed', missions: 8, threats: 6, captured: 2 },
    { day: 'Thu', missions: 18, threats: 12, captured: 7 },
    { day: 'Fri', missions: 22, threats: 15, captured: 9 },
    { day: 'Sat', missions: 14, threats: 9, captured: 4 },
    { day: 'Sun', missions: 10, threats: 7, captured: 3 },
  ];

  const maxMissions = Math.max(...weeklyData.map(d => d.missions));

  const sectorData = PLANETS.reduce((acc, p) => {
    acc[p.region] = (acc[p.region] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="ANALYTICS" subtitle="Imperial operational performance metrics" />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: 'Mission Success Rate', v: `${successRate}%`, c: 'text-success', icon: Target },
          { l: 'Jedi Neutralized', v: jediCaptured, c: 'text-imperial', icon: Activity },
          { l: 'Fleet Morale', v: `${avgMorale}%`, c: 'text-holographic', icon: Users },
          { l: 'Fleet Fuel Avg', v: `${avgFuel}%`, c: 'text-warning', icon: TrendingUp },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass clip-corner p-4">
            <div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p><s.icon className={cn('h-4 w-4', s.c)} /></div>
            <p className={cn('mt-2 font-num text-2xl font-bold', s.c)}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="WEEKLY OPERATIONS" accent="blue">
          <div className="p-4">
            <div className="flex h-56 items-end justify-between gap-3">
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full flex-col justify-end gap-0.5">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.captured / maxMissions) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.6 }} className="w-full rounded-t-sm bg-imperial/60" title={`Captured: ${d.captured}`} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.threats / maxMissions) * 100}%` }} transition={{ delay: i * 0.08 + 0.1, duration: 0.6 }} className="w-full rounded-t-sm bg-warning/60" title={`Threats: ${d.threats}`} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.missions / maxMissions) * 100}%` }} transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }} className="w-full rounded-t-sm bg-holographic" title={`Missions: ${d.missions}`} />
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4">
              {[
                { c: 'bg-holographic', l: 'Missions' },
                { c: 'bg-warning/60', l: 'Threats' },
                { c: 'bg-imperial/60', l: 'Captured' },
              ].map(x => (
                <div key={x.l} className="flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-sm', x.c)} />
                  <span className="font-mono text-[10px] text-muted-foreground">{x.l}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="SECTOR DISTRIBUTION" accent="red">
          <div className="space-y-3 p-4">
            {Object.entries(sectorData).map(([region, count], i) => {
              const max = Math.max(...Object.values(sectorData));
              return (
                <div key={region}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-foreground">{region}</span>
                    <span className="font-num text-xs font-bold text-holographic">{count} planets</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / max) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-imperial/40 to-imperial" />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="MISSION STATUS" accent="blue" className="lg:col-span-1">
          <div className="space-y-3 p-4">
            {['planning', 'active', 'completed', 'archived'].map((status, i) => {
              const count = OPERATIONS.filter(o => o.status === status).length;
              const pct = Math.round((count / OPERATIONS.length) * 100);
              const color = status === 'active' ? 'text-imperial' : status === 'completed' ? 'text-success' : status === 'archived' ? 'text-muted-foreground' : 'text-holographic';
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className={cn('font-mono text-[11px] capitalize', color)}>{status}</span>
                    <span className="font-num text-xs font-bold text-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.6 }} className={cn('h-full rounded-full',
                      status === 'active' ? 'bg-imperial' : status === 'completed' ? 'bg-success' : status === 'archived' ? 'bg-muted-foreground/40' : 'bg-holographic')} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="THREAT TRENDS" accent="red" className="lg:col-span-2">
          <div className="p-4">
            <div className="flex h-40 items-end justify-between gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const val = 30 + Math.sin(i * 0.3) * 20 + Math.random() * 15;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.02, duration: 0.4 }}
                    className={cn('flex-1 rounded-t-sm', val > 55 ? 'bg-danger/70' : val > 35 ? 'bg-warning/70' : 'bg-success/70')}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
              <span>30-DAY THREAT INDEX</span>
              <span className="text-danger">TREND: +8.2%</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
