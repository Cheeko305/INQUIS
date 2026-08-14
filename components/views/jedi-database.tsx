'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader, ThreatBadge } from '@/components/ui-imperial';
import { JEDI, type JediStatus } from '@/lib/data';
import { Search, Swords, MapPin, Crosshair, Filter } from 'lucide-react';
import { useApp } from '@/lib/store';

const STATUS_FILTERS: { id: JediStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'alive', label: 'Alive' },
  { id: 'missing', label: 'Missing' },
  { id: 'captured', label: 'Captured' },
  { id: 'eliminated', label: 'Eliminated' },
];

export function JediDatabase() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JediStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const setView = useApp(s => s.setView);

  const filtered = useMemo(() => {
    return JEDI.filter(j => {
      const matchQuery = !query || j.name.toLowerCase().includes(query.toLowerCase()) || j.homePlanet.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' || j.status === statusFilter;
      return matchQuery && matchStatus;
    }).slice(0, 80);
  }, [query, statusFilter]);

  const selectedJedi = JEDI.find(j => j.id === selected);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="JEDI DATABASE" subtitle={`${JEDI.length} records // Classified intelligence // Order 66 survivors`}>
        <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name or planet..."
            className="w-40 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:w-56"
          />
        </div>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all ${
              statusFilter === f.id
                ? 'border-imperial/40 bg-imperial/15 text-imperial'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={`RECORDS (${filtered.length})`} accent="red" className="lg:col-span-2">
          <div className="max-h-[600px] overflow-y-auto thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/95 backdrop-blur">
                <tr className="border-b border-border">
                  <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Target</th>
                  <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:table-cell">Rank</th>
                  <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground lg:table-cell">Home</th>
                  <th className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Threat</th>
                  <th className="hidden px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:table-cell">Status</th>
                  <th className="px-3 py-2.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Capture %</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j, i) => (
                  <motion.tr
                    key={j.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    onClick={() => setSelected(j.id)}
                    className={`cursor-pointer border-b border-border/30 transition-colors hover:bg-imperial/5 ${selected === j.id ? 'bg-imperial/10' : ''}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-black/50 font-display text-[10px] font-bold text-imperial">
                          {j.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-display text-xs font-semibold text-foreground">{j.name}</p>
                          <p className="font-mono text-[9px] text-muted-foreground">{j.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell"><span className="font-mono text-[10px] capitalize text-muted-foreground">{j.rank}</span></td>
                    <td className="hidden px-3 py-2.5 lg:table-cell"><span className="font-mono text-[10px] text-muted-foreground">{j.homePlanet}</span></td>
                    <td className="px-3 py-2.5"><ThreatBadge level={j.threatLevel} /></td>
                    <td className="hidden px-3 py-2.5 sm:table-cell">
                      <span className={`font-mono text-[10px] capitalize ${j.status === 'alive' ? 'text-danger' : j.status === 'eliminated' ? 'text-muted-foreground' : 'text-warning'}`}>{j.status}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="font-num text-sm font-bold text-warning">{j.captureProbability}%</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="TARGET DOSSIER" accent="red">
          {selectedJedi ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-imperial/40 bg-black/50 font-display text-xl font-bold text-imperial">
                  {selectedJedi.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{selectedJedi.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{selectedJedi.id} // {selectedJedi.rank.toUpperCase()}</p>
                  <div className="mt-1"><ThreatBadge level={selectedJedi.threatLevel} /></div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { l: 'Force Ability', v: selectedJedi.forceAbility },
                  { l: 'Lightsaber', v: selectedJedi.lightsaberColor },
                  { l: 'Combat Style', v: selectedJedi.combatStyle },
                  { l: 'Home Planet', v: selectedJedi.homePlanet },
                  { l: 'Last Seen', v: `${selectedJedi.lastSeen} // ${selectedJedi.lastSeenPlanet}` },
                  { l: 'Status', v: selectedJedi.status },
                  { l: 'Capture Probability', v: `${selectedJedi.captureProbability}%` },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.l}</span>
                    <span className="font-display text-xs font-semibold capitalize text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>

              {selectedJedi.knownAssociates.length > 0 && (
                <div className="mt-3 rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Known Associates</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJedi.knownAssociates.map(a => (
                      <span key={a} className="rounded-sm border border-border bg-black/40 px-2 py-0.5 font-mono text-[10px] text-holographic">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setView('galaxy')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-holographic/30 bg-holographic/10 py-2.5 font-display text-xs font-bold tracking-widest text-holographic transition-all hover:bg-holographic/20"
              >
                <MapPin className="h-3.5 w-3.5" /> VIEW LAST KNOWN LOCATION
              </button>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <Crosshair className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">SELECT A TARGET TO VIEW DOSSIER</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
