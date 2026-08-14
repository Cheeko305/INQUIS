'use client';

import { motion } from 'framer-motion';
import { Panel, PageHeader, AnimatedCounter } from '@/components/ui-imperial';
import { RESOURCES_STATE } from '@/lib/data';
import { Coins, Fuel, Wheat, Pill, Ship, Sword, Gem, Users, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { key: 'credits', label: 'Credits', icon: Coins, color: 'text-warning', bar: 78, prefix: '₡ ' },
  { key: 'fuel', label: 'Fuel Reserves', icon: Fuel, color: 'text-holographic', bar: 64, suffix: '%' },
  { key: 'food', label: 'Food Supplies', icon: Wheat, color: 'text-success', bar: 78, suffix: '%' },
  { key: 'medical', label: 'Medical', icon: Pill, color: 'text-danger', bar: 52, suffix: '%' },
  { key: 'ships', label: 'Ships', icon: Ship, color: 'text-holographic', bar: 85 },
  { key: 'weapons', label: 'Weapons', icon: Sword, color: 'text-imperial', bar: 92, suffix: '%' },
  { key: 'kyberCrystals', label: 'Kyber Crystals', icon: Gem, color: 'text-purple-400', bar: 45 },
  { key: 'troops', label: 'Troops', icon: Users, color: 'text-success', bar: 71 },
  { key: 'supplies', label: 'General Supplies', icon: Package, color: 'text-warning', bar: 68, suffix: '%' },
] as const;

export function ResourceManagement() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="RESOURCE MANAGEMENT" subtitle="Galaxy-wide logistics and supply chain overview" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => {
          const value = RESOURCES_STATE[item.key];
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass clip-corner p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                  <p className={cn('mt-2 font-num text-2xl font-bold', item.color)}>
                    <AnimatedCounter
                      value={typeof value === 'number' ? value : 0}
                      prefix={'prefix' in item ? (item.prefix as string) : ''}
                      suffix={'suffix' in item ? (item.suffix as string) : ''}
                    />
                  </p>
                </div>
                <div className={cn('rounded-md border border-border bg-black/40 p-2.5')}>
                  <item.icon className={cn('h-5 w-5', item.color)} />
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.bar}%` }}
                  transition={{ delay: i * 0.05 + 0.2, duration: 0.8 }}
                  className={cn('h-full rounded-full',
                    item.bar > 70 ? 'bg-success' : item.bar > 40 ? 'bg-warning' : 'bg-danger')}
                />
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                {item.bar > 70 ? 'STABLE' : item.bar > 40 ? 'MODERATE' : 'CRITICAL — resupply needed'}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="LOGISTICS FLOW" accent="blue">
          <div className="space-y-3 p-4">
            {[
              { from: 'Kuat Drive Yards', to: 'Coruscant', item: 'Star Destroyers', qty: 4, status: 'in-transit' },
              { from: 'Bespin', to: 'Fleet Alpha-3', item: 'Tibanna Gas', qty: 12000, status: 'delivered' },
              { from: 'Kamino', to: 'Sector 9', item: 'Clone Troops', qty: 5000, status: 'in-transit' },
              { from: 'Ilum', to: 'Inquisitorius', item: 'Kyber Crystals', qty: 12, status: 'pending' },
              { from: 'Corellia', to: 'Fleet Beta-2', item: 'Hyperdrive Units', qty: 80, status: 'in-transit' },
            ].map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
                <div>
                  <p className="font-display text-xs font-semibold text-foreground">{l.item} ×{l.qty.toLocaleString()}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{l.from} → {l.to}</p>
                </div>
                <span className={cn('rounded-sm border px-2 py-0.5 font-mono text-[9px] tracking-widest',
                  l.status === 'delivered' ? 'border-success/30 bg-success/10 text-success' :
                  l.status === 'in-transit' ? 'border-holographic/30 bg-holographic/10 text-holographic' :
                  'border-warning/30 bg-warning/10 text-warning')}>
                  {l.status.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="SUPPLY DEMAND" accent="red">
          <div className="space-y-3 p-4">
            {ITEMS.slice(0, 6).map((item, i) => {
              const value = RESOURCES_STATE[item.key];
              return (
                <div key={item.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
                      <item.icon className={cn('h-3 w-3', item.color)} /> {item.label}
                    </span>
                    <span className="font-num text-xs font-bold text-foreground">
                      {typeof value === 'number' && value > 999999 ? (value / 1000000).toFixed(1) + 'M' : value}{'suffix' in item ? (item.suffix as string) : ''}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.bar}%` }} transition={{ delay: i * 0.08 + 0.2 }} className={cn('h-full rounded-full', item.bar > 70 ? 'bg-success' : item.bar > 40 ? 'bg-warning' : 'bg-danger')} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
