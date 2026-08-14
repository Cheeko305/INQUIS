'use client';

import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { ACHIEVEMENTS } from '@/lib/data';
import { Crosshair, Ship, Shield, Skull, Crown, Eye, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Crosshair, Ship, Shield, Skull, Crown, Eye,
};

export function Achievements() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-6">
      <PageHeader title="ACHIEVEMENTS" subtitle={`${unlocked}/${ACHIEVEMENTS.length} unlocked // Imperial service commendations`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const Icon = ICONS[a.icon] ?? Crosshair;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={cn('glass clip-corner relative overflow-hidden p-5', a.unlocked && 'glow-red')}
            >
              {a.unlocked && <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-imperial/10 blur-2xl" />}
              <div className="flex items-start justify-between">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-md border-2', a.unlocked ? 'border-imperial/40 bg-imperial/10' : 'border-border bg-black/40')}>
                  {a.unlocked ? <Icon className="h-7 w-7 text-imperial" /> : <Lock className="h-6 w-6 text-muted-foreground/40" />}
                </div>
                {a.unlocked && <span className="rounded-sm border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-success">UNLOCKED</span>}
              </div>
              <h3 className={cn('mt-4 font-display text-base font-bold', a.unlocked ? 'text-foreground' : 'text-muted-foreground')}>{a.name}</h3>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{a.desc}</p>
              {!a.unlocked && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">Progress</span><span className="font-num text-xs font-bold text-warning">{a.progress}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50"><motion.div initial={{ width: 0 }} animate={{ width: `${a.progress}%` }} transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }} className="h-full rounded-full bg-warning" /></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
