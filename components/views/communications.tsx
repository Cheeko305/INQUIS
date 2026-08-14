'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { Hash, Send, Paperclip, Pin, Users, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notify } from '@/lib/notify';

interface ChatMessage { id: string; user: string; role: string; content: string; time: string; }

const CHANNELS = [
  { id: 'fleet-command', name: 'fleet-command', desc: 'Strategic fleet coordination', unread: 3 },
  { id: 'outer-rim', name: 'outer-rim', desc: 'Outer Rim operations', unread: 0 },
  { id: 'coruscant', name: 'coruscant', desc: 'Capital defense & logistics', unread: 12 },
  { id: 'inquisitors', name: 'inquisitors', desc: 'Jedi hunting division', unread: 7 },
  { id: 'logistics', name: 'logistics', desc: 'Supply chain & resources', unread: 0 },
  { id: 'encrypted', name: 'encrypted', desc: 'ISB encrypted channel', unread: 1 },
];

const MOCK_MSGS: Record<string, ChatMessage[]> = {
  'fleet-command': [
    { id: '1', user: 'Adm. Piett', role: 'Admiral', content: 'Fleet Alpha-7 has entered the Tatooine system. Awaiting confirmation to deploy probe droids.', time: '14:32' },
    { id: '2', user: 'Gr. Adm. Thrawn', role: 'Grand Admiral', content: 'Confirmed. Deploy probes in standard search pattern. Report any anomalous signatures immediately.', time: '14:33' },
    { id: '3', user: 'Gen. Veers', role: 'General', content: 'Ground forces standing by. AT-AT walkers prepped for planetary assault if needed.', time: '14:35' },
  ],
  'outer-rim': [
    { id: '1', user: 'Cmd. Pellaeon', role: 'Commander', content: 'Patrol sweep of Sector 9 complete. No Jedi signatures detected. Smuggler activity nominal.', time: '12:08' },
    { id: '2', user: 'Cap. Needa', role: 'Captain', content: 'Aurra Sing spotted on Nar Shaddaa. Bounty hunter, not our jurisdiction. Logging for ISB.', time: '12:15' },
  ],
  'coruscant': [
    { id: '1', user: 'Gr. Moff Tarkin', role: 'Grand Moff', content: 'Senate session concluded. Dissolved permanently. The Emperor is pleased.', time: '09:00' },
    { id: '2', user: 'Adm. Ozzel', role: 'Admiral', content: 'Defense perimeter holding. All sectors green. Civilian traffic flowing normally.', time: '09:30' },
  ],
  'inquisitors': [
    { id: '1', user: 'Inquisitor (4th)', role: 'Inquisitor', content: 'Force signature traced to a temple on Malachor. Requesting extraction team.', time: '16:45' },
    { id: '2', user: 'Inquisitor (2nd)', role: 'Inquisitor', content: 'The hunt continues. Two padawans confirmed on Lothal. Moving to intercept.', time: '16:50' },
  ],
  'logistics': [
    { id: '1', user: 'Cmd. Jerjerrod', role: 'Commander', content: 'Tibanna gas reserves at 64%. Recommend increased extraction from Bespin.', time: '11:20' },
    { id: '2', user: 'Com. Helies', role: 'Commodore', content: 'Troop rations distributed to all battalions. Medical supplies en route to Kashyyyk.', time: '11:35' },
  ],
  'encrypted': [
    { id: '1', user: '[ENCRYPTED]', role: 'ISB Agent', content: 'Rebel cell identified in Sector 4. Awaiting authorization for strike.', time: '18:00' },
  ],
};

export function Communications() {
  const [active, setActive] = useState('fleet-command');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MSGS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, active]);

  useEffect(() => {
    const i = setInterval(() => {
      setTyping(t => !t);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = { id: Date.now().toString(), user: 'You', role: 'Commander', content: input, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => ({ ...m, [active]: [...(m[active] ?? []), msg] }));
    setInput('');
  };

  const attachFile = () => {
    notify('Attachment queued', 'Encrypted tactical briefing uploaded to channel.');
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      role: 'Commander',
      content: '[ATTACHMENT] sector-briefing-66.pdf // 2.4 MB // ENCRYPTED',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => ({ ...m, [active]: [...(m[active] ?? []), msg] }));
  };

  const startVoice = () => {
    notify('Voice channel open', 'Holo-transmission link established. Speak to transmit.');
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      role: 'Commander',
      content: '[VOICE MESSAGE] "All units maintain current positions. Await further orders."',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => ({ ...m, [active]: [...(m[active] ?? []), msg] }));
  };

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col p-4 md:p-6">
      <PageHeader title="COMMUNICATIONS" subtitle="Encrypted military channels // Imperial Holo-Net" />

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-4">
        <Panel title="CHANNELS" accent="blue" className="lg:col-span-1">
          <div className="space-y-1 p-2">
            {CHANNELS.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                  active === c.id ? 'bg-imperial/10' : 'hover:bg-white/[0.03]')}
              >
                <div className="relative">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-md border',
                    active === c.id ? 'border-imperial/40 bg-imperial/10' : 'border-border bg-black/30')}>
                    <Hash className={cn('h-4 w-4', active === c.id ? 'text-imperial' : 'text-muted-foreground')} />
                  </div>
                  {c.unread > 0 && <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">{c.unread}</span>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={cn('font-mono text-xs font-semibold', active === c.id ? 'text-foreground' : 'text-muted-foreground')}>{c.name}</p>
                  <p className="truncate font-mono text-[9px] text-muted-foreground">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-md bg-black/30 px-3 py-2">
              <Users className="h-3.5 w-3.5 text-success" />
              <span className="font-mono text-[10px] text-muted-foreground">1,247 officers online</span>
            </div>
          </div>
        </Panel>

        <Panel className="flex flex-col overflow-hidden lg:col-span-3" title={`#${active}`} accent="red" right={<div className="flex items-center gap-2"><Pin className="h-3 w-3 text-muted-foreground" /><span className="font-mono text-[10px] text-muted-foreground">3 pinned</span></div>}>
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto thin-scrollbar p-4">
            {(messages[active] ?? []).map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-black/40 font-display text-[10px] font-bold text-imperial">
                  {m.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-foreground">{m.user}</span>
                    <span className="rounded-sm border border-holographic/20 bg-holographic/5 px-1.5 py-0.5 font-mono text-[8px] text-holographic">{m.role}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{m.content}</p>
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 pl-12">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />)}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">officer is typing...</span>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <button onClick={attachFile} className="rounded-md p-2 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"><Paperclip className="h-4 w-4" /></button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={`Message #${active}...`}
                className="flex-1 rounded-md border border-border bg-black/40 px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-holographic/40 focus:outline-none"
              />
              <button onClick={startVoice} className="rounded-md p-2 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"><Mic className="h-4 w-4" /></button>
              <button onClick={send} className="rounded-md border border-imperial/30 bg-imperial/15 p-2.5 text-imperial transition-all hover:bg-imperial/25 hover:glow-red"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
