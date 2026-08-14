'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { PLANETS, JEDI, FLEETS, OPERATIONS } from '@/lib/data';
import { Bot, Send, Sparkles, Activity, Crosshair, FileText, Swords, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
  streaming?: boolean;
}

const SUGGESTIONS = [
  'Find all planets with high Jedi activity',
  'Recommend deployment strategy for Outer Rim',
  'Generate military report for today',
  'Create operation against a high-value target',
  'Summarize today\'s intelligence',
  'Explain threat level for Kashyyyk',
];

function generateResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('high jedi') || q.includes('jedi activity')) {
    const planets = PLANETS.filter(p => p.threatLevel === 'red').slice(0, 5);
    return `ANALYSIS COMPLETE. ${planets.length} planets with critical Jedi activity detected:\n\n${planets.map((p, i) => `${i + 1}. ${p.name} — Threat: ${p.threatScore}% | Temples: ${p.forceTemples} | Recommendation: ${p.aiRecommendation.toUpperCase()}`).join('\n')}\n\nRECOMMENDED ACTION: Deploy Inquisitor teams to top 3 targets. Establish blockade on ${planets[0]?.name}.`;
  }
  if (q.includes('deploy') || q.includes('strategy')) {
    return `DEPLOYMENT STRATEGY RECOMMENDATION:\n\n1. OUTER RIM: Position 12 Star Destroyers along major hyperspace lanes. Current fleet strength: ${FLEETS.filter(f => f.status === 'docked').length} docked, ${FLEETS.filter(f => f.status === 'moving').length} en route.\n\n2. CORE WORLDS: Maintain defensive perimeter. Civilian loyalty averaging ${Math.round(PLANETS.reduce((a, p) => a + p.civilianLoyalty, 0) / PLANETS.length)}%.\n\n3. PRIORITY TARGETS: ${JEDI.filter(j => j.status === 'alive' && j.captureProbability > 70).length} Jedi with capture probability >70%.\n\nCONFIDENCE: 87% // Based on current fleet distribution and threat analysis.`;
  }
  if (q.includes('report') || q.includes('summar') || q.includes('intelligence')) {
    const s = { alive: JEDI.filter(j => j.status === 'alive').length, active: OPERATIONS.filter(o => o.status === 'active').length, red: PLANETS.filter(p => p.threatLevel === 'red').length };
    return `DAILY INTELLIGENCE SUMMARY // GALACTIC STANDARD DATE 4190.7\n\n- Jedi remaining: ${s.alive} (down 3 from yesterday)\n- Active operations: ${s.active}\n- Critical threat planets: ${s.red}\n- Probe droids deployed: ${PLANETS.reduce((a, p) => a + p.probeDroids, 0)}\n- Fleet readiness: ${Math.round(FLEETS.reduce((a, f) => a + f.fuel, 0) / FLEETS.length)}% avg fuel\n\nNOTABLE: Encrypted Jedi signal intercepted near ${PLANETS[5].name}. Inquisitor team dispatched. Operation ${OPERATIONS[0].name} proceeding on schedule.`;
  }
  if (q.includes('operation') || q.includes('create') || q.includes('battle plan')) {
    const target = JEDI.find(j => j.status === 'alive' && j.captureProbability > 60) ?? JEDI[0];
    const planet = PLANETS.find(p => p.name === target.lastSeenPlanet) ?? PLANETS[0];
    return `BATTLE PLAN GENERATED // OPERATION SHADOW STRIKE\n\nTARGET: ${target.name} (${target.rank}, ${target.combatStyle})\nLAST SEEN: ${target.lastSeen} on ${target.lastSeenPlanet}\nTHREAT LEVEL: ${target.threatLevel.toUpperCase()} // Capture probability: ${target.captureProbability}%\n\nPHASE 1: Deploy probe droid pack to ${planet.name} for reconnaissance.\nPHASE 2: Establish orbital blockade with 3 Star Destroyers.\nPHASE 3: Deploy Inquisitor team for direct engagement.\nPHASE 4: Extraction via Lambda shuttle.\n\nEST. CASUALTIES: ${Math.floor(target.captureProbability * 30)} // SUCCESS PROBABILITY: ${Math.min(95, target.captureProbability + 15)}%`;
  }
  if (q.includes('threat') || q.includes('kashyyyk') || q.includes('explain')) {
    const p = PLANETS.find(pl => q.includes(pl.name.toLowerCase())) ?? PLANETS.find(pl => pl.threatLevel === 'red')!;
    return `THREAT ANALYSIS: ${p.name}\n\nTHREAT SCORE: ${p.threatScore}% (${p.threatLevel.toUpperCase()})\n\nFACTORS:\n- Force temples: ${p.forceTemples}\n- Clone presence: ${p.clonePresence} battalions\n- Civilian loyalty: ${p.civilianLoyalty}%\n- Recent activity: ${p.recentActivity}\n\nREASONING: ${p.forceTemples > 0 ? 'Force temple presence increases likelihood of Jedi refuge. ' : ''}${p.civilianLoyalty < 50 ? 'Low civilian loyalty indicates rebel sympathy. ' : ''}${p.probeDroids < 5 ? 'Insufficient probe coverage. ' : ''}\n\nRECOMMENDED ACTION: ${p.aiRecommendation.toUpperCase()}\nCONFIDENCE: ${Math.min(95, p.threatScore + 10)}%`;
  }
  return `QUERY PROCESSED. Standing by for further orders, Commander. I can analyze Jedi activity, recommend deployment strategies, generate military reports, create battle plans, and assess threat levels. Specify your request for detailed intelligence.`;
}

export function Sentinel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'PROJECT SENTINEL ONLINE. I am the Empire\'s tactical AI assistant. How may I serve the Empire today, Commander?' },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: 'user', content: text };
    const aiResponse = generateResponse(text);
    setMessages(m => [...m, userMsg, { role: 'ai', content: '', streaming: true }]);
    setInput('');
    setStreaming(true);

    let i = 0;
    const stream = () => {
      i += 3;
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'ai', content: aiResponse.slice(0, i), streaming: i < aiResponse.length };
        return copy;
      });
      if (i < aiResponse.length) {
        setTimeout(stream, 20);
      } else {
        setStreaming(false);
      }
    };
    setTimeout(stream, 300);
  };

  return (
    <div className="mx-auto flex h-full max-w-[1200px] flex-col p-4 md:p-6">
      <PageHeader title="PROJECT SENTINEL" subtitle="Imperial Tactical AI // Natural language interface" />

      <Panel accent="blue" className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto thin-scrollbar p-4 md:p-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {m.role === 'ai' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-holographic/30 bg-holographic/10">
                  <Bot className="h-5 w-5 text-holographic" />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm',
                m.role === 'user'
                  ? 'bg-imperial/15 border border-imperial/30 text-foreground'
                  : 'glass-blue border border-holographic/20 text-foreground'
              )}>
                {m.content}
                {m.streaming && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-holographic" />}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={streaming}
                className="flex items-center gap-1 rounded-sm border border-border bg-black/30 px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-holographic/30 hover:text-holographic disabled:opacity-40"
              >
                <Sparkles className="h-2.5 w-2.5" /> {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Issue command to Sentinel..."
              disabled={streaming}
              className="flex-1 rounded-md border border-border bg-black/40 px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-holographic/40 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input}
              className="rounded-md border border-holographic/30 bg-holographic/10 p-2.5 text-holographic transition-all hover:bg-holographic/20 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
