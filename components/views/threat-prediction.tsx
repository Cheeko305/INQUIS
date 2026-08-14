'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader, ThreatBadge } from '@/components/ui-imperial';
import { PLANETS, JEDI } from '@/lib/data';
import { Activity, Brain, Target, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThreatPrediction() {
  const predictions = useMemo(() => {
    return PLANETS.map(p => {
      const jediNearby = JEDI.filter(j => j.status === 'alive' && j.lastSeenPlanet === p.name).length;
      const templeFactor = p.forceTemples * 15;
      const sightingFactor = jediNearby * 20;
      const terrainFactor = ['Swamps', 'Forests', 'Mountains', 'Ice Caves'].includes(p.terrain) ? 12 : 0;
      const instabilityFactor = p.civilianLoyalty < 50 ? 18 : 0;
      const baseThreat = p.threatScore * 0.4;
      const predicted = Math.min(99, Math.round(baseThreat + templeFactor + sightingFactor + terrainFactor + instabilityFactor));
      const confidence = Math.min(95, 60 + p.probeDroids + jediNearby * 5);
      const reasons: string[] = [];
      if (p.forceTemples > 0) reasons.push(`${p.forceTemples} Force temple(s) detected`);
      if (jediNearby > 0) reasons.push(`${jediNearby} recent Jedi sighting(s)`);
      if (p.civilianLoyalty < 50) reasons.push('Low civilian loyalty — rebel sympathy likely');
      if (p.probeDroids < 5) reasons.push('Insufficient probe coverage');
      if (['Swamps', 'Forests', 'Mountains'].includes(p.terrain)) reasons.push(`${p.terrain} provide concealment`);
      if (reasons.length === 0) reasons.push('No significant threat indicators');
      return { planet: p, predicted, confidence, reasons, jediNearby };
    }).sort((a, b) => b.predicted - a.predicted).slice(0, 20);
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="THREAT PREDICTION" subtitle="AI-powered predictive analysis of Jedi hideout probability" />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: 'Predictions Generated', v: PLANETS.length, icon: Brain, c: 'text-holographic' },
          { l: 'High-Confidence Hits', v: predictions.filter(p => p.predicted > 70).length, icon: Target, c: 'text-danger' },
          { l: 'Avg Confidence', v: Math.round(predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length), suffix: '%', icon: Activity, c: 'text-success' },
          { l: 'Jedi Tracked', v: JEDI.filter(j => j.status === 'alive').length, icon: TrendingUp, c: 'text-warning' },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass clip-corner p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
              <s.icon className={cn('h-4 w-4', s.c)} />
            </div>
            <p className={cn('mt-2 font-num text-2xl font-bold', s.c)}>{s.v}{s.suffix ?? ''}</p>
          </motion.div>
        ))}
      </div>

      <Panel title="PREDICTED JEDI HIDEOUTS" accent="red">
        <div className="max-h-[600px] overflow-y-auto thin-scrollbar">
          {predictions.map((p, i) => (
            <motion.div
              key={p.planet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className="border-b border-border/30 px-4 py-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-num text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm font-bold text-foreground">{p.planet.name}</p>
                      <ThreatBadge level={p.planet.threatLevel} />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">{p.planet.sector} // {p.planet.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Threat %</p>
                    <p className="font-num text-xl font-bold text-danger">{p.predicted}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Confidence</p>
                    <p className="font-num text-xl font-bold text-holographic">{p.confidence}%</p>
                  </div>
                  <div className="hidden text-right md:block">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Action</p>
                    <p className="font-display text-xs font-bold capitalize text-warning">{p.planet.aiRecommendation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.reasons.map((r, ri) => (
                  <span key={ri} className="flex items-center gap-1 rounded-sm border border-border bg-black/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    <Zap className="h-2.5 w-2.5 text-warning" /> {r}
                  </span>
                ))}
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/50">
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.predicted}%` }} transition={{ delay: i * 0.03 + 0.2, duration: 0.6 }} className={cn('h-full rounded-full', p.predicted > 70 ? 'bg-danger' : p.predicted > 40 ? 'bg-warning' : 'bg-holographic')} />
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
