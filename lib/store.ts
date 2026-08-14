import { create } from 'zustand';

export type ViewId =
  | 'dashboard'
  | 'galaxy'
  | 'jedi'
  | 'fleet'
  | 'operations'
  | 'sentinel'
  | 'threat'
  | 'intel-feed'
  | 'comms'
  | 'probes'
  | 'satellites'
  | 'resources'
  | 'analytics'
  | 'bounty'
  | 'archive'
  | 'timeline'
  | 'officers'
  | 'hyperspace'
  | 'achievements'
  | 'settings';

interface AppState {
  view: ViewId;
  setView: (v: ViewId) => void;
  selectedPlanetId: string | null;
  setSelectedPlanet: (id: string | null) => void;
  emergency: boolean;
  triggerEmergency: (on: boolean) => void;
  soundOn: boolean;
  toggleSound: () => void;
  demoRunning: boolean;
  setDemo: (v: boolean) => void;
  authenticated: boolean;
  setAuthenticated: (v: boolean) => void;
}

export const useApp = create<AppState>((set) => ({
  view: 'dashboard',
  setView: (v) => set({ view: v }),
  selectedPlanetId: null,
  setSelectedPlanet: (id) => set({ selectedPlanetId: id }),
  emergency: false,
  triggerEmergency: (on) => set({ emergency: on }),
  soundOn: false,
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  demoRunning: false,
  setDemo: (v) => set({ demoRunning: v }),
  authenticated: false,
  setAuthenticated: (v) => set({ authenticated: v }),
}));
