'use client';

import { useApp } from '@/lib/store';
import { NAV } from '@/lib/nav';
import { ImperialLogo } from '@/components/sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, AlertTriangle, Play, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { INTEL_REPORTS } from '@/lib/data';
import { globalSearch, type SearchResult } from '@/lib/search';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

export function Topbar() {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const setSelectedPlanet = useApp((s) => s.setSelectedPlanet);
  const triggerEmergency = useApp((s) => s.triggerEmergency);
  const setDemo = useApp((s) => s.setDemo);
  const demoRunning = useApp((s) => s.demoRunning);
  const current = NAV.find((n) => n.id === view);
  const [time, setTime] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString('en-GB', { hour12: false }) + ' // GALACTIC STANDARD'
      );
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchResults = useMemo(() => globalSearch(searchQuery), [searchQuery]);
  const alerts = useMemo(
    () => INTEL_REPORTS.filter((r) => r.severity === 'critical' || r.severity === 'high').slice(0, 6),
    []
  );
  const critical = alerts.filter((r) => r.severity === 'critical').length;

  const openResult = (result: SearchResult) => {
    if (result.planetId) setSelectedPlanet(result.planetId);
    setView(result.view);
    setSearchQuery('');
    setSearchOpen(false);
    notify('Target acquired', `Navigating to ${result.label}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults[0]) {
      openResult(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const toggleDemo = () => {
    const next = !demoRunning;
    setDemo(next);
    notify(
      next ? 'Demo mode activated' : 'Demo mode deactivated',
      next
        ? 'Live data streams accelerated across all feeds'
        : 'Systems returned to standard polling rate'
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/30 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-2 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground md:hidden"
            onClick={() => setMobileNav(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <ImperialLogo className="h-5 w-5 md:hidden" />
            <h1 className="font-display text-sm font-bold tracking-[0.15em] text-foreground md:text-base">
              {current?.label.toUpperCase()}
            </h1>
          </div>
          <span className="hidden font-mono text-[10px] tracking-widest text-imperial/70 lg:inline">
            CLASSIFIED // EYES ONLY
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search database..."
                className="w-32 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none lg:w-48"
              />
            </div>
            <AnimatePresence>
              {searchOpen && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-md border border-border bg-card/95 shadow-2xl backdrop-blur-xl"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.view}-${result.label}`}
                        onClick={() => openResult(result)}
                        className="flex w-full flex-col gap-0.5 border-b border-border/40 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-imperial/10"
                      >
                        <span className="font-display text-xs font-semibold text-foreground">{result.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{result.description}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 font-mono text-[10px] text-muted-foreground">No records match query</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-border bg-black/40 px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{time}</span>
          </div>

          <button
            onClick={toggleDemo}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
              demoRunning
                ? 'border-imperial/40 bg-imperial/20 text-imperial'
                : 'border-holographic/30 bg-holographic/10 text-holographic hover:bg-holographic/20'
            )}
          >
            <Play className="h-3 w-3" />
            <span className="hidden sm:inline">{demoRunning ? 'Stop Demo' : 'Start Demo'}</span>
          </button>

          <button
            onClick={() => triggerEmergency(true)}
            className="flex items-center gap-1.5 rounded-md border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition-all hover:bg-danger/20 hover:glow-red"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">EMERGENCY</span>
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationsOpen((o) => !o)}
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {critical > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
                  {critical}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-md border border-border bg-card/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="font-display text-xs font-bold tracking-widest text-foreground">ALERTS</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{alerts.length} priority reports</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto thin-scrollbar">
                    {alerts.map((alert) => (
                      <button
                        key={alert.id}
                        onClick={() => {
                          setView('intel-feed');
                          setNotificationsOpen(false);
                          notify('Intel report opened', alert.message.slice(0, 80));
                        }}
                        className="flex w-full flex-col gap-1 border-b border-border/40 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-imperial/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn('font-mono text-[9px] uppercase tracking-widest', alert.severity === 'critical' ? 'text-danger' : 'text-warning')}>
                            {alert.severity}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-foreground">{alert.message}</p>
                        <p className="font-mono text-[10px] text-holographic">{alert.planet}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileNav(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="h-full w-72 overflow-y-auto border-r border-border bg-card p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImperialLogo className="h-7 w-7" />
                  <span className="font-display text-sm font-bold tracking-widest">
                    INQU<span className="text-imperial">IS</span>
                  </span>
                </div>
                <button onClick={() => setMobileNav(false)} className="p-2 text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setMobileNav(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                      view === item.id
                        ? 'bg-imperial/10 text-foreground'
                        : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
