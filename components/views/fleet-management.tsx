'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { FLEETS, type FleetStatus } from '@/lib/data';
import { Search, Ship, Fuel, Heart, Swords, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notify } from '@/lib/notify';

const STATUS_FILTERS: { id: FleetStatus | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'text-foreground' },
  { id: 'moving', label: 'Moving', color: 'text-holographic' },
  { id: 'docked', label: 'Docked', color: 'text-success' },
  { id: 'attacking', label: 'Attacking', color: 'text-danger' },
  { id: 'destroyed', label: 'Destroyed', color: 'text-muted-foreground' },
];

export function FleetManagement() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FleetStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, FleetStatus>>({});

  const filtered = useMemo(() => {
    return FLEETS.filter(f => {
      const mq = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.commander.toLowerCase().includes(query.toLowerCase());
      const status = statusOverrides[f.id] ?? f.status;
      const ms = statusFilter === 'all' || status === statusFilter;
      return mq && ms;
    }).slice(0, 60);
  }, [query, statusFilter, statusOverrides]);

  const fleet = FLEETS.find(f => f.id === selected);
  const fleetStatus = fleet ? (statusOverrides[fleet.id] ?? fleet.status) : null;

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="FLEET MANAGEMENT" subtitle={`${FLEETS.length} fleets registered // Galaxy-wide deployment`}>
        <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search fleet or commander..."
            className="w-40 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:w-56"
          />
        </div>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all',
              statusFilter === f.id ? 'border-imperial/40 bg-imperial/15 text-imperial' : 'border-border bg-card text-muted-foreground hover:text-foreground'
            )}
          >
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={`FLEETS (${filtered.length})`} accent="blue" className="lg:col-span-2">
          <div className="max-h-[600px] overflow-y-auto thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/95 backdrop-blur">
                <tr className="border-b border-border">
                  <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Fleet</th>
                  <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:table-cell">Commander</th>
                  <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground lg:table-cell">Location</th>
                  <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="hidden px-3 py-2.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:table-cell">Ships</th>
                  <th className="px-3 py-2.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Fuel</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    onClick={() => setSelected(f.id)}
                    className={cn('cursor-pointer border-b border-border/30 transition-colors hover:bg-holographic/5', selected === f.id && 'bg-holographic/10')}
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-display text-xs font-semibold text-foreground">{f.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{f.id}</p>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell"><span className="font-mono text-[10px] text-muted-foreground">{f.commander}</span></td>
                    <td className="hidden px-3 py-2.5 lg:table-cell">
                      <span className="font-mono text-[10px] text-muted-foreground">{f.location}</span>
                      {f.destination && <span className="ml-1 font-mono text-[10px] text-holographic">→ {f.destination}</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={cn('font-mono text-[10px] capitalize', (statusOverrides[f.id] ?? f.status) === 'moving' ? 'text-holographic' : (statusOverrides[f.id] ?? f.status) === 'attacking' ? 'text-danger' : (statusOverrides[f.id] ?? f.status) === 'docked' ? 'text-success' : 'text-muted-foreground')}>
                        {statusOverrides[f.id] ?? f.status}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 text-right sm:table-cell"><span className="font-num text-xs font-bold text-foreground">{f.starDestroyers + f.cruisers + f.frigates}</span></td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={cn('font-num text-xs font-bold', f.fuel > 50 ? 'text-success' : f.fuel > 25 ? 'text-warning' : 'text-danger')}>{f.fuel}%</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="FLEET DETAILS" accent="blue">
          {fleet ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="mb-4">
                <h3 className="font-display text-lg font-bold text-foreground">{fleet.name}</h3>
                <p className="font-mono text-[10px] text-muted-foreground">{fleet.id} // {fleet.commander}</p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {[
                  { l: 'Star Destroyers', v: fleet.starDestroyers, icon: Ship },
                  { l: 'Cruisers', v: fleet.cruisers, icon: Ship },
                  { l: 'Frigates', v: fleet.frigates, icon: Ship },
                  { l: 'TIE Fighters', v: fleet.tieFighters, icon: Swords },
                  { l: 'Troops', v: fleet.troops.toLocaleString(), icon: Users },
                ].map(r => (
                  <div key={r.l} className="rounded-md border border-border/40 bg-black/30 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <r.icon className="h-3 w-3 text-holographic" />
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{r.l}</p>
                    </div>
                    <p className="mt-1 font-num text-lg font-bold text-foreground">{r.v}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"><Fuel className="h-3 w-3" /> Fuel</span>
                    <span className="font-num text-xs font-bold text-foreground">{fleet.fuel}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fleet.fuel}%` }} className={cn('h-full rounded-full', fleet.fuel > 50 ? 'bg-success' : fleet.fuel > 25 ? 'bg-warning' : 'bg-danger')} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"><Heart className="h-3 w-3" /> Morale</span>
                    <span className="font-num text-xs font-bold text-foreground">{fleet.morale}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fleet.morale}%` }} className="h-full rounded-full bg-holographic" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Current Status</p>
                <p className={cn('mt-1 font-display text-sm font-bold capitalize', fleetStatus === 'attacking' ? 'text-danger' : fleetStatus === 'moving' ? 'text-holographic' : fleetStatus === 'docked' ? 'text-success' : 'text-muted-foreground')}>
                  {fleetStatus?.toUpperCase()}
                </p>
                {fleet.destination && <p className="mt-1 font-mono text-[10px] text-holographic">En route to {fleet.destination} // {Math.round(fleet.progress * 100)}%</p>}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setStatusOverrides((prev) => ({ ...prev, [fleet.id]: 'moving' }));
                    notify('Fleet deployed', `${fleet.name} has been dispatched from ${fleet.location}.`);
                  }}
                  disabled={fleetStatus === 'destroyed'}
                  className="flex-1 rounded-md border border-imperial/40 bg-imperial/20 py-2.5 font-display text-xs font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red disabled:opacity-40"
                >
                  DEPLOY
                </button>
                <button
                  onClick={() => {
                    setStatusOverrides((prev) => ({ ...prev, [fleet.id]: 'docked' }));
                    notify('Fleet recalled', `${fleet.name} returning to ${fleet.location}.`);
                  }}
                  disabled={fleetStatus === 'destroyed' || fleetStatus === 'docked'}
                  className="flex-1 rounded-md border border-border bg-card py-2.5 font-display text-xs font-bold tracking-widest text-muted-foreground transition-all hover:text-foreground disabled:opacity-40"
                >
                  RECALL
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <Ship className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">SELECT A FLEET TO VIEW DETAILS</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
