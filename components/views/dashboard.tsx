'use client';

import { motion } from 'framer-motion';
import { Panel, StatCard, PageHeader, ThreatBadge } from '@/components/ui-imperial';
import { stats, PLANETS, INTEL_REPORTS, SECTORS, JEDI } from '@/lib/data';
import { useApp } from '@/lib/store';
import {
  Ship, ClipboardList, Swords, Radar, Shield, AlertTriangle, Activity,
  TrendingUp, ArrowUpRight, Globe2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const s = stats();
  const setView = useApp((x) => x.setView);
  const setSelectedPlanet = useApp((x) => x.setSelectedPlanet);
  const demoRunning = useApp((x) => x.demoRunning);
  const [feed, setFeed] = useState(INTEL_REPORTS.slice(0, 8));

  useEffect(() => {
    const interval = demoRunning ? 1500 : 4000;
    const i = setInterval(() => {
      setFeed((prev) => {
        const next = INTEL_REPORTS[Math.floor(Math.random() * INTEL_REPORTS.length)];
        return [next, ...prev].slice(0, 8);
      });
    }, interval);
    return () => clearInterval(i);
  }, [demoRunning]);

  const topThreats = [...PLANETS].sort((a, b) => b.threatScore - a.threatScore).slice(0, 5);
  const topJedi = JEDI.filter((j) => j.status === 'alive').sort((a, b) => b.captureProbability - a.captureProbability).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="COMMAND DASHBOARD" subtitle="Galaxy-wide operational overview // Real-time intelligence">
        <button
          onClick={() => setView('galaxy')}
          className="flex items-center gap-1.5 rounded-md border border-holographic/30 bg-holographic/10 px-3 py-2 font-display text-[11px] font-bold tracking-widest text-holographic transition-all hover:bg-holographic/20"
        >
          <Globe2 className="h-3.5 w-3.5" /> OPEN GALAXY MAP
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Total Fleets" value={s.totalFleets} icon={Ship} accent="blue" index={0} onClick={() => setView('fleet')} />
        <StatCard label="Active Missions" value={s.activeMissions} icon={ClipboardList} accent="red" index={1} onClick={() => setView('operations')} />
        <StatCard label="Jedi Remaining" value={s.jediRemaining} icon={Swords} accent="red" trend={`${s.jediCaptured} captured`} index={2} onClick={() => setView('jedi')} />
        <StatCard label="Probe Droids" value={s.probeDroidsActive} icon={Radar} accent="blue" index={3} onClick={() => setView('probes')} />
        <StatCard label="Sector Security" value={s.sectorSecurity} suffix="%" icon={Shield} accent="success" index={4} onClick={() => setView('analytics')} />
        <StatCard label="Active Alerts" value={s.alerts} icon={AlertTriangle} accent="warning" index={5} onClick={() => setView('intel-feed')} />
        <StatCard label="Jedi Eliminated" value={s.jediEliminated} icon={Activity} accent="success" index={6} onClick={() => setView('jedi')} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="LIVE INTELLIGENCE FEED" accent="red" className="lg:col-span-2" right={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />}>
          <div className="max-h-[320px] overflow-y-auto thin-scrollbar p-3">
            {feed.map((r, i) => (
              <motion.div
                key={r.id + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 border-b border-border/40 px-2 py-2.5 last:border-0"
              >
                <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${r.severity === 'critical' ? 'bg-danger' : r.severity === 'high' ? 'bg-warning' : 'bg-holographic'}`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{r.message}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{r.planet} // {r.timestamp}</p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{r.category}</span>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="TOP THREAT PLANETS" accent="red">
          <div className="space-y-2 p-3">
            {topThreats.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPlanet(p.id); setView('galaxy'); }}
                className="group flex w-full items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2.5 transition-all hover:border-imperial/40 hover:bg-imperial/5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-num text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="text-left">
                    <p className="font-display text-sm font-semibold text-foreground group-hover:text-imperial">{p.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{p.sector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThreatBadge level={p.threatLevel} />
                  <span className="font-num text-sm font-bold text-danger">{p.threatScore}%</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="SECTOR CONTROL" accent="blue">
          <div className="space-y-3 p-4">
            {SECTORS.slice(0, 6).map((sec, i) => (
              <div key={sec.id}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground">{sec.name}</span>
                  <span className="font-num text-xs font-bold text-holographic">{sec.control}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sec.control}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-holographic/60 to-holographic"
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="MOST WANTED JEDI" accent="red">
          <div className="space-y-2 p-3">
            {topJedi.map((j) => (
              <button
                key={j.id}
                onClick={() => setView('jedi')}
                className="flex w-full items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2.5 text-left transition-all hover:border-imperial/40 hover:bg-imperial/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-black/50 font-display text-xs font-bold text-imperial">
                    {j.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{j.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{j.rank} // {j.lastSeenPlanet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThreatBadge level={j.threatLevel} />
                  <span className="flex items-center gap-1 font-num text-sm font-bold text-warning">
                    <TrendingUp className="h-3 w-3" />
                    {j.captureProbability}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
