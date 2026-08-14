'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { LoginScreen } from '@/components/login-screen';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { EmergencyOverlay } from '@/components/emergency-overlay';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewRouter } from '@/components/view-router';

export function AppShell({ children }: { children: React.ReactNode }) {
  const authenticated = useApp((s) => s.authenticated);
  const emergency = useApp((s) => s.emergency);
  const view = useApp((s) => s.view);

  useEffect(() => {
    if (emergency) {
      const t = setTimeout(() => useApp.getState().triggerEmergency(false), 8000);
      return () => clearTimeout(t);
    }
  }, [emergency]);

  if (!authenticated) return <LoginScreen />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 scanline opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(176,0,32,0.06),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,191,255,0.04),transparent_55%)]" />

      <AnimatePresence>{emergency && <EmergencyOverlay />}</AnimatePresence>

      <div className="relative z-10 flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto thin-scrollbar">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full"
            >
              <ViewRouter>{children}</ViewRouter>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
