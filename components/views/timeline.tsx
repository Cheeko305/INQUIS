'use client';

import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { TIMELINE_EVENTS } from '@/lib/data';
import { Skull, Flame, Users, Eye, Activity } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Skull, Flame, Users, Eye, Activity,
};

export function Timeline() {
  return (
    <div className="mx-auto max-w-[1000px] p-4 md:p-6">
      <PageHeader title="HISTORICAL TIMELINE" subtitle="Key events from Order 66 to current operations" />

      <Panel accent="red">
        <div className="relative p-6 md:p-8">
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-imperial via-holographic/40 to-transparent md:left-1/2" />

          <div className="space-y-8">
            {TIMELINE_EVENTS.map((e, i) => {
              const Icon = ICONS[e.icon] ?? Activity;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-imperial/40 bg-black/60" style={{ boxShadow: '0 0 16px -4px rgba(176,0,32,0.5)' }}>
                    <Icon className="h-5 w-5 text-imperial" />
                  </div>
                  <div className={`flex-1 ${isLeft ? 'md:text-right' : ''}`}>
                    <div className="glass clip-corner p-4">
                      <p className="font-mono text-[10px] tracking-widest text-imperial">{e.year}</p>
                      <h3 className="mt-1 font-display text-base font-bold text-foreground">{e.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Panel>
    </div>
  );
}
