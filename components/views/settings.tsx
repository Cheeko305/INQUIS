'use client';

import { useState } from 'react';
import { Panel, PageHeader } from '@/components/ui-imperial';
import { useApp } from '@/lib/store';
import { Volume2, VolumeX, Eye, EyeOff, Bell, BellOff, Globe, Accessibility, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Settings() {
  const soundOn = useApp(s => s.soundOn);
  const toggleSound = useApp(s => s.toggleSound);
  const [animations, setAnimations] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [accessibility, setAccessibility] = useState(false);
  const [language, setLanguage] = useState('Galactic Basic');

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={cn('relative h-6 w-11 rounded-full transition-colors', on ? 'bg-imperial/60' : 'bg-border')}>
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );

  return (
    <div className="mx-auto max-w-[800px] p-4 md:p-6">
      <PageHeader title="SETTINGS" subtitle="System preferences and configuration" />

      <div className="space-y-4">
        <Panel title="AUDIO & VISUAL" accent="blue">
          <div className="divide-y divide-border/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {soundOn ? <Volume2 className="h-5 w-5 text-holographic" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                <div><p className="font-display text-sm font-semibold text-foreground">Sound Effects</p><p className="font-mono text-[10px] text-muted-foreground">Boot, alerts, clicks, alarms</p></div>
              </div>
              <Toggle on={soundOn} onClick={toggleSound} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {animations ? <Eye className="h-5 w-5 text-holographic" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                <div><p className="font-display text-sm font-semibold text-foreground">Animations</p><p className="font-mono text-[10px] text-muted-foreground">Galaxy rotation, transitions, micro-interactions</p></div>
              </div>
              <Toggle on={animations} onClick={() => setAnimations(!animations)} />
            </div>
          </div>
        </Panel>

        <Panel title="NOTIFICATIONS" accent="red">
          <div className="divide-y divide-border/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {notifications ? <Bell className="h-5 w-5 text-holographic" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
                <div><p className="font-display text-sm font-semibold text-foreground">Push Notifications</p><p className="font-mono text-[10px] text-muted-foreground">Intel alerts, mission updates, emergency signals</p></div>
              </div>
              <Toggle on={notifications} onClick={() => setNotifications(!notifications)} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Accessibility className="h-5 w-5 text-holographic" />
                <div><p className="font-display text-sm font-semibold text-foreground">Accessibility Mode</p><p className="font-mono text-[10px] text-muted-foreground">Reduced motion, high contrast, screen reader hints</p></div>
              </div>
              <Toggle on={accessibility} onClick={() => setAccessibility(!accessibility)} />
            </div>
          </div>
        </Panel>

        <Panel title="PREFERENCES" accent="blue">
          <div className="divide-y divide-border/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-holographic" />
                <div><p className="font-display text-sm font-semibold text-foreground">Theme</p><p className="font-mono text-[10px] text-muted-foreground">Imperial Dark (default)</p></div>
              </div>
              <span className="rounded-sm border border-border bg-black/40 px-3 py-1 font-mono text-[10px] text-muted-foreground">DARK</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-holographic" />
                <div><p className="font-display text-sm font-semibold text-foreground">Language</p><p className="font-mono text-[10px] text-muted-foreground">Interface language</p></div>
              </div>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="rounded-md border border-border bg-black/40 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none">
                <option>Galactic Basic</option>
                <option>Huttese</option>
                <option>Mando'a</option>
                <option>Binary (Droid)</option>
              </select>
            </div>
          </div>
        </Panel>

        <div className="flex items-center justify-center gap-2 rounded-md border border-border/40 bg-black/20 px-4 py-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">INQUIS v4.19 // ALL SYSTEMS NOMINAL // ENCRYPTED UPLINK ACTIVE</p>
        </div>
      </div>
    </div>
  );
}
