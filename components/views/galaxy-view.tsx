'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line, Sparkles } from '@react-three/drei';
import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PLANETS, FLEETS, type Planet } from '@/lib/data';
import { useApp } from '@/lib/store';
import { notify } from '@/lib/notify';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreatBadge } from '@/components/ui-imperial';
import { X, Crosshair, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const REGION_RINGS = [
  { label: 'Core Worlds', radius: 6, color: '#FFD700', opacity: 0.08 },
  { label: 'Inner Rim', radius: 11, color: '#00BFFF', opacity: 0.06 },
  { label: 'Mid Rim', radius: 16, color: '#9B59B6', opacity: 0.05 },
  { label: 'Outer Rim', radius: 22, color: '#B00020', opacity: 0.05 },
];

function NebulaField() {
  const nebulae = useMemo(
    () => [
      { pos: [0, 0, -12] as [number, number, number], color: '#1a0a2e', scale: 38 },
      { pos: [14, 6, -8] as [number, number, number], color: '#0a1a3e', scale: 28 },
      { pos: [-12, -4, 6] as [number, number, number], color: '#2e0a1a', scale: 32 },
      { pos: [8, -10, 4] as [number, number, number], color: '#0a2e2e', scale: 24 },
    ],
    []
  );

  return (
    <>
      {nebulae.map((n, i) => (
        <mesh key={i} position={n.pos} scale={n.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={n.color} transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function GalacticCore() {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.15;
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.08;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshBasicMaterial color="#FFF8DC" transparent opacity={0.35} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#FFD700" distance={30} decay={2} />
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0.3, 0]}>
        <ringGeometry args={[2.4, 2.7, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <ringGeometry args={[3.2, 3.35, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RegionRing({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.04, radius, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PlanetNode({
  planet,
  onClick,
  hovered,
  onHover,
  selected,
  labelsHidden,
}: {
  planet: Planet;
  onClick: () => void;
  hovered: boolean;
  onHover: (h: boolean) => void;
  selected: boolean;
  labelsHidden: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hoveredLocal, setHoveredLocal] = useState(false);
  const active = hovered || hoveredLocal || selected;
  const showLabel =
    !labelsHidden && (active || planet.threatLevel === 'red' || planet.threatLevel === 'orange');

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.5 + planet.position[0]) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008;
      const s = 1 + Math.sin(t * 2) * 0.12;
      ringRef.current.scale.setScalar(active ? s * 1.35 : 1);
    }
    if (pulseRef.current && planet.threatLevel === 'red') {
      const pulse = 1 + Math.sin(t * 3) * 0.25;
      pulseRef.current.scale.setScalar(pulse);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 3) * 0.06;
    }
  });

  const color = useMemo(() => new THREE.Color(planet.color), [planet.color]);

  return (
    <group position={planet.position}>
      <mesh scale={planet.size * 1.35}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.18 : 0.08} depthWrite={false} />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredLocal(true);
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredLocal(false);
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.8 : 0.55}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>

      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size * 2.1, planet.size * 2.25, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.size * 1.55, planet.size * 1.85, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.55 : 0.22} side={THREE.DoubleSide} />
      </mesh>

      {planet.threatLevel === 'red' && (
        <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size * 2.1, planet.size * 2.6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      )}

      {showLabel && (
        <Html center distanceFactor={active ? 24 : 32} zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`pointer-events-none whitespace-nowrap rounded-md border px-2.5 py-1.5 backdrop-blur transition-all ${
              active ? 'border-white/30 bg-black/90' : 'border-border/50 bg-black/70'
            }`}
          >
            <p className="font-display text-xs font-bold text-foreground">{planet.name}</p>
            {(active || selected) && (
              <>
                <p className="font-mono text-[9px] text-muted-foreground">{planet.sector}</p>
                <p className="font-num text-sm font-bold" style={{ color: planet.color }}>
                  {planet.threatScore}% THREAT
                </p>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function FleetMarker({
  from,
  to,
  progress,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  progress: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    return f.lerp(t, progress);
  }, [from, to, progress]);

  const trailPoints = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    const dir = t.clone().sub(f).normalize();
    const tail = pos.clone().sub(dir.multiplyScalar(1.2));
    return [tail, pos] as [THREE.Vector3, THREE.Vector3];
  }, [from, to, pos]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 3;
  });

  return (
    <group>
      <Line points={trailPoints} color={color} lineWidth={1} transparent opacity={0.28} />
      <group position={pos.toArray()}>
        <mesh ref={ref}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
}

function HyperspaceLane({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  return (
    <Line
      points={[from, to]}
      color="#00BFFF"
      lineWidth={0.6}
      transparent
      opacity={0.18}
      dashed
      dashSize={0.4}
      gapSize={0.25}
    />
  );
}

function CameraFocus({
  target,
  controlsRef,
}: {
  target: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const focus = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (target) {
      focus.current.set(...target);
      controls.target.lerp(focus.current, Math.min(1, delta * 2.5));
      controls.update();
    }
  });

  return null;
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#030308', 0.018);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

function GalaxyScene({
  onSelectPlanet,
  selectedPlanetId,
  controlsRef,
  showRegions,
  labelsHidden,
}: {
  onSelectPlanet: (id: string) => void;
  selectedPlanetId: string | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  showRegions: boolean;
  labelsHidden: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const movingFleets = useMemo(() => FLEETS.filter((f) => f.status === 'moving' && f.path).slice(0, 30), []);

  const lanes = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number] }[] = [];
    for (let i = 0; i < 25; i++) {
      const a = PLANETS[i];
      const b = PLANETS[(i * 7) % PLANETS.length];
      if (a.id !== b.id) result.push({ from: a.position, to: b.position });
    }
    return result;
  }, []);

  const focusTarget = useMemo(() => {
    if (!selectedPlanetId) return null;
    const planet = PLANETS.find((p) => p.id === selectedPlanetId);
    return planet ? planet.position : null;
  }, [selectedPlanetId]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <>
      <SceneFog />
      <CameraFocus target={focusTarget} controlsRef={controlsRef} />

      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00BFFF" distance={50} decay={2} />
      <pointLight position={[20, 10, 20]} intensity={0.35} color="#B00020" distance={40} decay={2} />
      <directionalLight position={[10, 15, 10]} intensity={0.25} color="#ffffff" />

      <NebulaField />

      <Stars radius={100} depth={80} count={5000} factor={4} saturation={0} fade speed={0.4} />
      <Stars radius={50} depth={30} count={1500} factor={2} saturation={0.2} fade speed={0.8} />
      <Sparkles count={120} scale={40} size={1.5} speed={0.3} opacity={0.35} color="#00BFFF" />

      <GalacticCore />

      {showRegions &&
        REGION_RINGS.map((r) => (
          <RegionRing key={r.label} radius={r.radius} color={r.color} opacity={r.opacity} />
        ))}

      <group ref={groupRef}>
        {lanes.map((l, i) => (
          <HyperspaceLane key={i} {...l} />
        ))}

        {PLANETS.map((p) => (
          <PlanetNode
            key={p.id}
            planet={p}
            onClick={() => onSelectPlanet(p.id)}
            hovered={hoveredId === p.id}
            onHover={(h) => setHoveredId(h ? p.id : null)}
            selected={selectedPlanetId === p.id}
            labelsHidden={labelsHidden}
          />
        ))}

        {movingFleets.map(
          (f) =>
            f.path && (
              <FleetMarker key={f.id} from={f.path[0]} to={f.path[1]} progress={f.progress} color="#00BFFF" />
            )
        )}
      </group>

      <OrbitControls
        ref={controlsRef as React.RefObject<OrbitControlsImpl>}
        enablePan
        enableZoom
        enableRotate
        minDistance={6}
        maxDistance={55}
        autoRotate
        autoRotateSpeed={0.25}
        rotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

function PlanetIntelligence({ planetId, onClose }: { planetId: string; onClose: () => void }) {
  const setView = useApp((s) => s.setView);
  const planet = PLANETS.find((p) => p.id === planetId);
  if (!planet) return null;
  const recColor = {
    deploy: 'text-danger border-danger/40 bg-danger/10',
    blockade: 'text-warning border-warning/40 bg-warning/10',
    observe: 'text-holographic border-holographic/40 bg-holographic/10',
    occupy: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    ignore: 'text-muted-foreground border-border bg-card',
  }[planet.aiRecommendation];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto thin-scrollbar"
    >
      <div className="glass-strong clip-corner m-3 bg-card/95 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-imperial" />
              <h2 className="font-display text-xl font-bold tracking-widest text-foreground">{planet.name}</h2>
            </div>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">
              {planet.id} // {planet.region} // {planet.sector}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <ThreatBadge level={planet.threatLevel} />
          <span className="font-num text-2xl font-bold" style={{ color: planet.color }}>
            {planet.threatScore}%
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">THREAT INDEX</span>
        </div>

        <div className="relative mb-4 h-32 overflow-hidden rounded-md border border-border bg-black/50">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: `radial-gradient(circle at 40% 40%, ${planet.color}, transparent 70%)` }}
          />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-widest text-muted-foreground">
            ORBITAL SCAN // {planet.climate.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Population', value: `${planet.population.toFixed(1)}B` },
            { label: 'Government', value: planet.government },
            { label: 'Climate', value: planet.climate },
            { label: 'Terrain', value: planet.terrain },
            { label: 'Force Temples', value: planet.forceTemples.toString() },
            { label: 'Clone Battalions', value: planet.clonePresence.toString() },
            { label: 'Probe Droids', value: planet.probeDroids.toString() },
            { label: 'Civilian Loyalty', value: `${planet.civilianLoyalty}%` },
            { label: 'Recruitment Prob.', value: `${planet.recruitmentProbability}%` },
          ].map((row) => (
            <div key={row.label} className="rounded-md border border-border/40 bg-black/30 px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{row.label}</p>
              <p className="mt-0.5 font-display text-sm font-semibold text-foreground">{row.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Resources</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {planet.resources.map((r) => (
              <span
                key={r}
                className="rounded-sm border border-border bg-black/40 px-2 py-0.5 font-mono text-[10px] text-holographic"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-md border border-border/40 bg-black/30 px-3 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Recent Activity</p>
          <p className="mt-1 text-sm text-foreground">{planet.recentActivity}</p>
        </div>

        <div className={`mt-4 rounded-md border px-4 py-3 ${recColor}`}>
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-70">AI RECOMMENDATION // PROJECT SENTINEL</p>
          <p className="mt-1 font-display text-lg font-bold tracking-widest">{planet.aiRecommendation.toUpperCase()}</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Confidence: {Math.min(99, planet.threatScore + 10)}% // Based on {planet.forceTemples} temples,{' '}
            {planet.clonePresence} battalions
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              notify('Fleet deployment initiated', `${planet.name} — strike group en route. ETA 4 standard hours.`);
              setView('fleet');
            }}
            className="flex-1 rounded-md border border-imperial/40 bg-imperial/20 py-2.5 font-display text-xs font-bold tracking-widest text-imperial transition-all hover:bg-imperial/30 hover:glow-red"
          >
            DEPLOY FLEET
          </button>
          <button
            onClick={() =>
              notify('Blockade established', `Orbital quarantine active around ${planet.name}. All traffic halted.`)
            }
            className="flex-1 rounded-md border border-border bg-card py-2.5 font-display text-xs font-bold tracking-widest text-muted-foreground transition-all hover:text-foreground"
          >
            BLOCKADE
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function GalaxyView() {
  const selectedPlanetId = useApp((s) => s.selectedPlanetId);
  const setSelectedPlanet = useApp((s) => s.setSelectedPlanet);
  const emergency = useApp((s) => s.emergency);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [showRegions, setShowRegions] = useState(true);

  const handleZoom = (direction: 'in' | 'out') => {
    const controls = controlsRef.current;
    if (!controls) return;
    const camera = controls.object as THREE.PerspectiveCamera;
    const offset = camera.position.clone().sub(controls.target);
    const factor = direction === 'in' ? 0.82 : 1.22;
    offset.multiplyScalar(factor);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };

  const handleReset = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.reset();
    controls.target.set(0, 0, 0);
    (controls.object as THREE.PerspectiveCamera).position.set(0, 8, 28);
    controls.update();
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 transition-[right] duration-300 ease-out',
          selectedPlanetId && 'right-[28rem]'
        )}
      >
        <Canvas camera={{ position: [0, 8, 28], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <GalaxyScene
              onSelectPlanet={(id) => setSelectedPlanet(id)}
              selectedPlanetId={selectedPlanetId}
              controlsRef={controlsRef}
              showRegions={showRegions}
              labelsHidden={!!selectedPlanetId}
            />
          </Suspense>
        </Canvas>
      </div>

      {selectedPlanetId && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-40 w-full max-w-md bg-gradient-to-l from-black/90 via-black/70 to-transparent" />
      )}

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-4 top-4">
          <div className="glass clip-corner-sm px-4 py-2">
            <p className="font-display text-sm font-bold tracking-widest text-foreground">GALAXY MAP</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {PLANETS.length} planets // {FLEETS.filter((f) => f.status === 'moving').length} fleets in transit
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 glass clip-corner-sm px-4 py-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Threat Legend</p>
          <div className="space-y-1.5">
            {[
              { c: '#2ECC71', l: 'Secure' },
              { c: '#F1C40F', l: 'Caution' },
              { c: '#F39C2C', l: 'High' },
              { c: '#FF4444', l: 'Critical' },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: x.c, boxShadow: `0 0 8px ${x.c}` }} />
                <span className="font-mono text-[10px] text-muted-foreground">{x.l}</span>
              </div>
            ))}
          </div>
          {showRegions && (
            <div className="mt-3 border-t border-border/40 pt-2">
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Regions</p>
              <div className="space-y-1">
                {REGION_RINGS.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="h-1.5 w-4 rounded-full" style={{ background: r.color, opacity: 0.7 }} />
                    <span className="font-mono text-[9px] text-muted-foreground">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-auto absolute bottom-4 right-4 flex flex-col gap-2">
          <div className="glass clip-corner-sm flex flex-col overflow-hidden">
            <button
              onClick={() => handleZoom('in')}
              className="flex items-center justify-center p-2.5 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="flex items-center justify-center border-y border-border/40 p-2.5 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center p-2.5 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              title="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowRegions((v) => !v)}
              className={`flex items-center justify-center border-t border-border/40 p-2.5 transition-colors hover:bg-white/[0.04] ${
                showRegions ? 'text-holographic' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle region rings"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
          <div className="glass clip-corner-sm px-3 py-2">
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground">DRAG: ROTATE // SCROLL: ZOOM</p>
          </div>
        </div>

        {emergency && <div className="absolute inset-0 animate-alert-flash" />}
      </div>

      <AnimatePresence>
        {selectedPlanetId && (
          <PlanetIntelligence planetId={selectedPlanetId} onClose={() => setSelectedPlanet(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
