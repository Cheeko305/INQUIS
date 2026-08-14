'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ImperialLogo } from '@/components/sidebar';
import { Volume2, VolumeX, Fingerprint, Lock, ShieldCheck } from 'lucide-react';

const BOOT_LINES = [
  'INITIALIZING INQUIS UPLINK...',
  'DECRYPTING SECTOR KEY...',
  'ESTABLISHING HOLO-NET CONNECTION...',
  'VERIFYING BIOMETRIC SIGNATURE...',
  'LOADING COMMAND PROTOCOLS...',
  'ACCESSING INQUIS NETWORK...',
];

export function LoginScreen() {
  const setAuthenticated = useApp((s) => s.setAuthenticated);
  const soundOn = useApp((s) => s.soundOn);
  const toggleSound = useApp((s) => s.toggleSound);
  const [phase, setPhase] = useState<'boot' | 'login' | 'entering'>('boot');
  const [bootIdx, setBootIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stars, setStars] = useState<{ x: number; y: number; s: number; d: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setStars(
      Array.from({ length: 120 }, () => ({
        x: Math.random(),
        y: Math.random(),
        s: Math.random() * 2 + 0.5,
        d: Math.random() * 3,
      }))
    );
  }, []);

  useEffect(() => {
    if (phase !== 'boot') return;
    if (bootIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase('login'), 400);
      return () => clearTimeout(t);
    }
    const line = BOOT_LINES[bootIdx];
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(line.slice(0, i));
      if (i >= line.length) {
        clearInterval(typer);
        setTimeout(() => {
          setBootIdx((b) => b + 1);
          setTyped('');
        }, 280);
      }
    }, 22);
    return () => clearInterval(typer);
  }, [phase, bootIdx]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId || !password) {
      setError('OFFICER CREDENTIALS REQUIRED');
      return;
    }
    setError('');
    setPhase('entering');
    setTimeout(() => setAuthenticated(true), 1800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <StarField stars={stars} canvasRef={canvasRef} />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,0,32,0.08),transparent_65%)]" />
      <div className="pointer-events-none fixed inset-0 scanline opacity-40" />

      <button
        onClick={toggleSound}
        className="absolute right-5 top-5 z-20 rounded-md border border-border bg-card/40 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
      >
        {soundOn ? <Volume2 className="h-4 w-4 text-holographic" /> : <VolumeX className="h-4 w-4" />}
      </button>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {phase === 'boot' && (
            <motion.div key="boot" exit={{ opacity: 0 }} className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="mb-8 flex justify-center"
              >
                <ImperialLogo className="h-20 w-20 animate-flicker" />
              </motion.div>
              <div className="glass clip-corner min-h-[180px] p-6 font-mono">
                <div className="mb-3 text-[10px] tracking-widest text-imperial/60">
                  INQUIS BOOT SEQUENCE v4.19
                </div>
                <div className="space-y-1.5">
                  {BOOT_LINES.slice(0, bootIdx).map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-success">
                      <span className="text-success">[OK]</span>
                      <span className="text-muted-foreground">{l}</span>
                    </div>
                  ))}
                  {bootIdx < BOOT_LINES.length && (
                    <div className="flex items-center gap-2 text-xs text-holographic">
                      <span className="animate-pulse">[...]</span>
                      <span>{typed}<span className="animate-pulse">_</span></span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-6 flex flex-col items-center"
              >
                <ImperialLogo className="h-16 w-16" />
                <h1 className="mt-4 font-display text-2xl font-bold tracking-[0.3em] text-foreground">
                  INQU<span className="text-imperial">IS</span>
                </h1>
                <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  ONE EMPIRE // ONE NETWORK // NO ESCAPE
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="glass-strong clip-corner p-6">
                <div className="mb-5 flex items-center gap-2 border-b border-border pb-3">
                  <ShieldCheck className="h-4 w-4 text-holographic" />
                  <span className="font-mono text-[11px] tracking-widest text-holographic">
                    ACCESSING INQUIS NETWORK...
                  </span>
                </div>

                <p className="mb-5 font-display text-sm tracking-widest text-muted-foreground">
                  AUTHENTICATE OFFICER
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-widest text-muted-foreground">
                      OFFICER ID
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-black/50 px-3 py-2.5 focus-within:border-holographic/50">
                      <Fingerprint className="h-4 w-4 text-muted-foreground" />
                      <input
                        value={officerId}
                        onChange={(e) => setOfficerId(e.target.value)}
                        placeholder="TK-9091"
                        className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-widest text-muted-foreground">
                      ACCESS CODE
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-black/50 px-3 py-2.5 focus-within:border-holographic/50">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 font-mono text-xs text-danger"
                  >
                    ! {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="group mt-6 w-full overflow-hidden rounded-md border border-imperial/40 bg-imperial/20 py-3 font-display text-sm font-bold tracking-[0.2em] text-imperial transition-all hover:bg-imperial/30 hover:glow-red"
                >
                  <span className="relative z-10">LOGIN</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-imperial/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>

                <p className="mt-4 text-center font-mono text-[9px] tracking-widest text-muted-foreground/40">
                  UNAUTHORIZED ACCESS IS A CLASS-1 OFFENSE // ISB
                </p>
              </form>
            </motion.div>
          )}

          {phase === 'entering' && (
            <motion.div key="entering" exit={{ opacity: 0 }} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                animate={{ scale: 8, rotate: 360 }}
                transition={{ duration: 1.6, ease: 'easeIn' }}
              >
                <ImperialLogo className="h-24 w-24" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 font-mono text-xs tracking-[0.3em] text-holographic"
              >
                ENTERING GALAXY...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StarField({
  stars,
  canvasRef,
}: {
  stars: { x: number; y: number; s: number; d: number }[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s, i) => {
        const tw = (Math.sin(t * 2 + s.d * 7) + 1) / 2;
        const drift = (t * 6 + s.d * 100) % (canvas.width + 100);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width + drift - 50, s.y * canvas.height, s.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + tw * 0.8})`;
        ctx.fill();
        if (i % 30 === 0) {
          ctx.beginPath();
          ctx.arc(s.x * canvas.width + drift - 50, s.y * canvas.height, s.s * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,191,255,${tw * 0.15})`;
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [stars, canvasRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}
