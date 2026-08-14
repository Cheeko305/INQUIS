'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { OPERATIONS, FLEETS, COMMANDERS, PLANETS, JEDI, type Operation } from '@/lib/data';
import { Plus, Rocket, Archive, ClipboardList, Target, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notify } from '@/lib/notify';

export function OperationPlanner() {
  const [ops, setOps] = useState<Operation[]>(OPERATIONS.slice(0, 40));
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', target: '', commander: '', assignedFleet: '', planet: '', priority: 'medium' as Operation['priority'],
  });

  const op = ops.find(o => o.id === selected);

  const createOp = () => {
    if (!form.name || !form.target) return;
    const newOp: Operation = {
      id: `OP-${String(ops.length + 1).padStart(3, '0')}`,
      name: form.name,
      target: form.target,
      commander: form.commander || 'Unassigned',
      assignedFleet: form.assignedFleet || 'Unassigned',
      planet: form.planet,
      priority: form.priority,
      objectives: ['Eliminate target', 'Secure perimeter', 'Extract intelligence'],
      timeline: '3 standard days',
      estimatedCasualties: Math.floor(Math.random() * 3000),
      requiredResources: ['2 Star Destroyers', 'TIE Squadron', 'Probe Droid Pack'],
      aiPrediction: Math.floor(Math.random() * 40 + 55),
      status: 'planning',
      createdAt: 'Just now',
    };
    setOps([newOp, ...ops]);
    setShowForm(false);
    setForm({ name: '', target: '', commander: '', assignedFleet: '', planet: '', priority: 'medium' });
  };

  const priorityColor = (p: Operation['priority']) => cn(
    'rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest',
    p === 'critical' ? 'border-danger/30 bg-danger/15 text-danger' :
    p === 'high' ? 'border-warning/30 bg-warning/15 text-warning' :
    p === 'medium' ? 'border-holographic/30 bg-holographic/15 text-holographic' :
    'border-border bg-card text-muted-foreground'
  );

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <PageHeader title="OPERATION PLANNER" subtitle="Plan, launch, and archive military operations">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-md border border-imperial/40 bg-imperial/20 px-3 py-2 font-display text-[11px] font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red"
        >
          <Plus className="h-3.5 w-3.5" /> NEW OPERATION
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={`OPERATIONS (${ops.length})`} accent="red" className="lg:col-span-2">
          <div className="max-h-[600px] overflow-y-auto thin-scrollbar">
            {ops.map((o, i) => (
              <motion.button
                key={o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                onClick={() => setSelected(o.id)}
                className={cn('flex w-full items-center justify-between border-b border-border/30 px-4 py-3 text-left transition-colors hover:bg-imperial/5', selected === o.id && 'bg-imperial/10')}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-md border',
                    o.status === 'active' ? 'border-imperial/40 bg-imperial/10' :
                    o.status === 'completed' ? 'border-success/30 bg-success/10' :
                    o.status === 'archived' ? 'border-border bg-black/30' : 'border-holographic/30 bg-holographic/10')}>
                    <ClipboardList className={cn('h-4 w-4', o.status === 'active' ? 'text-imperial' : o.status === 'completed' ? 'text-success' : o.status === 'archived' ? 'text-muted-foreground' : 'text-holographic')} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{o.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Target: {o.target} // {o.planet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={priorityColor(o.priority)}>{o.priority.toUpperCase()}</span>
                  <span className={cn('font-mono text-[10px] capitalize', o.status === 'active' ? 'text-imperial' : o.status === 'completed' ? 'text-success' : 'text-muted-foreground')}>{o.status}</span>
                  <span className="font-num text-sm font-bold text-holographic">{o.aiPrediction}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </Panel>

        <Panel title="OPERATION DETAILS" accent="red">
          {op ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{op.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{op.id} // Created {op.createdAt}</p>
                </div>
                <span className={priorityColor(op.priority)}>{op.priority.toUpperCase()}</span>
              </div>

              <div className="space-y-2">
                {[
                  { l: 'Target', v: op.target, icon: Target },
                  { l: 'Commander', v: op.commander },
                  { l: 'Assigned Fleet', v: op.assignedFleet },
                  { l: 'Planet', v: op.planet },
                  { l: 'Timeline', v: op.timeline },
                  { l: 'Est. Casualties', v: op.estimatedCasualties.toLocaleString() },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between rounded-md border border-border/40 bg-black/30 px-3 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.l}</span>
                    <span className="font-display text-xs font-semibold text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Objectives</p>
                <ul className="space-y-1">
                  {op.objectives.map((o, i) => (
                    <li key={i} className="flex items-center gap-2 font-mono text-[11px] text-foreground">
                      <span className="h-1 w-1 rounded-full bg-imperial" /> {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 rounded-md border border-holographic/30 bg-holographic/5 px-3 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-holographic">AI Prediction // Mission Success</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${op.aiPrediction}%` }} className="h-full rounded-full bg-gradient-to-r from-holographic/60 to-holographic" />
                  </div>
                  <span className="font-num text-lg font-bold text-holographic">{op.aiPrediction}%</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setOps((prev) => prev.map((o) => o.id === op.id ? { ...o, status: 'active' as const } : o));
                    notify('Operation launched', `${op.name} is now active. Fleet mobilizing to ${op.planet}.`);
                  }}
                  disabled={op.status === 'active' || op.status === 'completed' || op.status === 'archived'}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-imperial/40 bg-imperial/20 py-2.5 font-display text-xs font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red disabled:opacity-40"
                >
                  <Rocket className="h-3.5 w-3.5" /> LAUNCH
                </button>
                <button
                  onClick={() => {
                    setOps((prev) => prev.map((o) => o.id === op.id ? { ...o, status: 'archived' as const } : o));
                    notify('Operation archived', `${op.name} moved to Imperial Archive.`);
                  }}
                  disabled={op.status === 'archived'}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-card py-2.5 font-display text-xs font-bold tracking-widest text-muted-foreground transition-all hover:text-foreground disabled:opacity-40"
                >
                  <Archive className="h-3.5 w-3.5" /> ARCHIVE
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">SELECT AN OPERATION</p>
            </div>
          )}
        </Panel>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong clip-corner w-full max-w-lg p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold tracking-widest text-foreground">NEW OPERATION</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3">
                <Field label="Operation Name"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="imp-input" placeholder="Operation Vengeance" /></Field>
                <Field label="Target"><select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="imp-input">
                  <option value="">Select target...</option>
                  {JEDI.slice(0, 50).map(j => <option key={j.id} value={j.name}>{j.name}</option>)}
                </select></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Commander"><select value={form.commander} onChange={e => setForm({ ...form, commander: e.target.value })} className="imp-input">
                    <option value="">Select...</option>
                    {COMMANDERS.slice(0, 30).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select></Field>
                  <Field label="Assigned Fleet"><select value={form.assignedFleet} onChange={e => setForm({ ...form, assignedFleet: e.target.value })} className="imp-input">
                    <option value="">Select...</option>
                    {FLEETS.slice(0, 30).map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select></Field>
                </div>
                <Field label="Planet"><select value={form.planet} onChange={e => setForm({ ...form, planet: e.target.value })} className="imp-input">
                  <option value="">Select...</option>
                  {PLANETS.slice(0, 50).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select></Field>
                <Field label="Priority"><div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map(p => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })} className={cn('flex-1 rounded-md border py-2 font-mono text-[10px] tracking-widest', form.priority === p ? 'border-imperial/40 bg-imperial/15 text-imperial' : 'border-border bg-card text-muted-foreground')}>{p.toUpperCase()}</button>
                  ))}
                </div></Field>
              </div>
              <button onClick={createOp} className="mt-5 w-full rounded-md border border-imperial/40 bg-imperial/20 py-3 font-display text-sm font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red">CREATE OPERATION</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .imp-input { width: 100%; border-radius: 0.375rem; border: 1px solid hsl(var(--border)); background: rgba(0,0,0,0.4); padding: 0.5rem 0.75rem; font-family: var(--font-jetbrains), monospace; font-size: 0.75rem; color: hsl(var(--foreground)); outline: none; }
        .imp-input:focus { border-color: hsl(var(--imperial) / 0.5); }
        .imp-input option { background: #111; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
