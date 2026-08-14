import type { ViewId } from '@/lib/store';
import {
  LayoutDashboard, Globe, Swords, Ship, ClipboardList, Bot, Activity,
  Radio, MessageSquare, Radar, Satellite, Boxes, BarChart3, Crosshair,
  Archive, History, Users, Route, Trophy, Settings, type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  group: string;
  badge?: 'alert' | 'count';
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'galaxy', label: 'Galaxy Map', icon: Globe, group: 'Overview' },
  { id: 'sentinel', label: 'Project Sentinel', icon: Bot, group: 'Overview' },
  { id: 'intel-feed', label: 'Intelligence Feed', icon: Radio, group: 'Overview', badge: 'alert' },

  { id: 'jedi', label: 'Jedi Database', icon: Swords, group: 'Operations', badge: 'count' },
  { id: 'fleet', label: 'Fleet Management', icon: Ship, group: 'Operations' },
  { id: 'operations', label: 'Operation Planner', icon: ClipboardList, group: 'Operations' },
  { id: 'threat', label: 'Threat Prediction', icon: Activity, group: 'Operations' },
  { id: 'bounty', label: 'Bounty Hunter Network', icon: Crosshair, group: 'Operations' },

  { id: 'comms', label: 'Communications', icon: MessageSquare, group: 'Network' },
  { id: 'probes', label: 'Probe Droid Control', icon: Radar, group: 'Network' },
  { id: 'satellites', label: 'Satellite Network', icon: Satellite, group: 'Network' },
  { id: 'hyperspace', label: 'Hyperspace Router', icon: Route, group: 'Network' },

  { id: 'resources', label: 'Resource Management', icon: Boxes, group: 'Intelligence' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Intelligence' },
  { id: 'archive', label: 'Imperial Archive', icon: Archive, group: 'Intelligence' },
  { id: 'timeline', label: 'Historical Timeline', icon: History, group: 'Intelligence' },
  { id: 'officers', label: 'Officer Profiles', icon: Users, group: 'Intelligence' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, group: 'Intelligence' },

  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];
