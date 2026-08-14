'use client';

import { useApp } from '@/lib/store';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Crosshair, Radar } from 'lucide-react';
import { PLANETS } from '@/lib/data';

export function EmergencyOverlay() {
  const triggerEmergency = useApp((s) => s.triggerEmergency);
  const setView = useApp((s) => s.setView);
  const redPlanets = PLANETS.filter((p) => p.threatLevel === 'red').slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div className="absolute inset-0 animate-alert-flash" />
      <div className="absolute inset-0 bg-danger/5 backdrop-blur-[2px]" />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative z-10 w-[92%] max-w-lg"
      >
        <div className="glass-red clip-corner glow-red p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AlertTriangle className="h-8 w-8 animate-pulse text-danger" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold tracking-widest text-danger text-glow-red">
                  JEDI DETECTED
                </h2>
                <p className="font-mono text-[10px] tracking-wider text-danger/70">
                  PRIORITY ALPHA // AUTO-MISSION GENERATED
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerEmergency(false)}
              className="rounded-md p-2 text-danger/70 transition-colors hover:bg-danger/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            {redPlanets.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-danger/20 bg-black/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Crosshair className="h-4 w-4 animate-pulse text-danger" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{p.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-num text-lg font-bold text-danger">{p.threatScore}%</p>
                  <p className="font-mono text-[9px] text-muted-foreground">THREAT</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-danger/10 px-4 py-3">
            <Radar className="h-4 w-4 animate-spin-slow text-danger" />
            <p className="font-mono text-xs text-danger/90">
              PROJECT SENTINEL: High Priority Target Detected. Deploying nearest fleet...
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setView('galaxy');
                triggerEmergency(false);
              }}
              className="flex-1 rounded-md border border-danger/40 bg-danger/20 px-4 py-2 font-display text-xs font-bold tracking-widest text-danger transition-all hover:bg-danger/30"
            >
              VIEW ON GALAXY MAP
            </button>
            <button
              onClick={() => triggerEmergency(false)}
              className="rounded-md border border-border bg-card px-4 py-2 font-display text-xs font-bold tracking-widest text-muted-foreground transition-all hover:text-foreground"
            >
              DISMISS
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
