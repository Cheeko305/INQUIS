'use client';

import { useApp } from '@/lib/store';
import { NAV } from '@/lib/nav';
import { JEDI, PLANETS } from '@/lib/data';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const soundOn = useApp((s) => s.soundOn);
  const toggleSound = useApp((s) => s.toggleSound);
  const groups = [...new Set(NAV.map((n) => n.group))];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <ImperialLogo className="h-8 w-8" />
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground">
            INQU<span className="text-imperial">IS</span>
          </span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            v4.19 // ORDER 66
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {group}
            </p>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const active = view === item.id;
                const Icon = item.icon;
                const count =
                  item.badge === 'count' && item.id === 'jedi'
                    ? JEDI.filter((j) => j.status === 'alive').length
                    : item.badge === 'alert'
                    ? PLANETS.filter((p) => p.threatLevel === 'red').length
                    : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all',
                      active
                        ? 'bg-imperial/10 text-foreground'
                        : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-imperial"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn('h-4 w-4 shrink-0', active && 'text-imperial')} />
                    <span className="flex-1 text-left text-[13px]">{item.label}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold',
                          item.badge === 'alert'
                            ? 'bg-danger/20 text-danger'
                            : 'bg-holographic/15 text-holographic'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={toggleSound}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-foreground"
        >
          {soundOn ? <Volume2 className="h-4 w-4 text-holographic" /> : <VolumeX className="h-4 w-4" />}
          <span>Sound {soundOn ? 'Enabled' : 'Disabled'}</span>
        </button>
        <div className="mt-2 flex items-center gap-2 rounded-md bg-black/40 px-3 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            UPLINK STABLE // ENCRYPTED
          </span>
        </div>
      </div>
    </aside>
  );
}

export function ImperialLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn('shrink-0 bg-white', className)}
      style={{
        WebkitMaskImage: "url('/imperial-logo.png')",
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: "url('/imperial-logo.png')",
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
      aria-hidden
    />
  );
}
