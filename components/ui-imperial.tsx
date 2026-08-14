'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 1.4,
  className,
  prefix = '',
  suffix = '',
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) requestAnimationFrame(step);
      else setDisplay(value);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US');

  return (
    <span ref={ref} className={cn('font-num tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function Panel({
  children,
  className,
  glow,
  title,
  accent,
  right,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: 'red' | 'blue' | 'soft';
  title?: string;
  accent?: 'red' | 'blue';
  right?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'glass clip-corner relative overflow-hidden',
        glow === 'red' && 'glow-red',
        glow === 'blue' && 'glow-blue',
        glow === 'soft' && 'glow-soft',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {accent && (
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  accent === 'red' ? 'bg-imperial' : 'bg-holographic'
                )}
              />
            )}
            <h3 className="font-display text-[11px] font-bold tracking-[0.18em] text-foreground/90">
              {title}
            </h3>
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'blue',
  trend,
  index = 0,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'red' | 'blue' | 'success' | 'warning';
  trend?: string;
  index?: number;
  suffix?: string;
  prefix?: string;
  onClick?: () => void;
}) {
  const colors = {
    red: { text: 'text-imperial', bg: 'bg-imperial/10', border: 'border-imperial/30', glow: 'glow-red' },
    blue: { text: 'text-holographic', bg: 'bg-holographic/10', border: 'border-holographic/30', glow: 'glow-blue' },
    success: { text: 'text-success', bg: 'bg-success/10', border: 'border-success/30', glow: '' },
    warning: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', glow: '' },
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'glass clip-corner group relative overflow-hidden p-5 transition-all',
        colors.glow,
        onClick && 'cursor-pointer hover:border-imperial/30'
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <p className={cn('mt-2 font-num text-3xl font-bold', colors.text)}>
            <AnimatedCounter value={value} />
          </p>
          {trend && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn('rounded-md border p-2.5', colors.bg, colors.border)}>
          <Icon className={cn('h-5 w-5', colors.text)} />
        </div>
      </div>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </motion.div>
  );
}

export function ThreatBadge({ level, className }: { level: 'green' | 'yellow' | 'orange' | 'red'; className?: string }) {
  const map = {
    green: { label: 'SECURE', cls: 'bg-success/15 text-success border-success/30' },
    yellow: { label: 'CAUTION', cls: 'bg-warning/15 text-warning border-warning/30' },
    orange: { label: 'HIGH', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
    red: { label: 'CRITICAL', cls: 'bg-danger/15 text-danger border-danger/30' },
  }[level];
  return (
    <span className={cn('rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest', map.cls, className)}>
      {map.label}
    </span>
  );
}

export function LoadingState({ label = 'LOADING' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-imperial/20 border-t-imperial" />
        <div className="absolute inset-2 animate-spin rounded-full border-2 border-holographic/20 border-t-holographic" style={{ animationDirection: 'reverse' }} />
      </div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground animate-pulse">{label}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-bold tracking-widest text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 font-mono text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
