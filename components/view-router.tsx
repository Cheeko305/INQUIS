'use client';

import { useApp, type ViewId } from '@/lib/store';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/views/dashboard').then((m) => m.Dashboard), { ssr: false });
const GalaxyView = dynamic(() => import('@/components/views/galaxy-view').then((m) => m.GalaxyView), { ssr: false });
const JediDatabase = dynamic(() => import('@/components/views/jedi-database').then((m) => m.JediDatabase), { ssr: false });
const FleetManagement = dynamic(() => import('@/components/views/fleet-management').then((m) => m.FleetManagement), { ssr: false });
const OperationPlanner = dynamic(() => import('@/components/views/operation-planner').then((m) => m.OperationPlanner), { ssr: false });
const Sentinel = dynamic(() => import('@/components/views/sentinel').then((m) => m.Sentinel), { ssr: false });
const ThreatPrediction = dynamic(() => import('@/components/views/threat-prediction').then((m) => m.ThreatPrediction), { ssr: false });
const IntelFeed = dynamic(() => import('@/components/views/intel-feed').then((m) => m.IntelFeed), { ssr: false });
const Communications = dynamic(() => import('@/components/views/communications').then((m) => m.Communications), { ssr: false });
const ProbeControl = dynamic(() => import('@/components/views/probe-control').then((m) => m.ProbeControl), { ssr: false });
const SatelliteNetwork = dynamic(() => import('@/components/views/satellite-network').then((m) => m.SatelliteNetwork), { ssr: false });
const ResourceManagement = dynamic(() => import('@/components/views/resource-management').then((m) => m.ResourceManagement), { ssr: false });
const Analytics = dynamic(() => import('@/components/views/analytics').then((m) => m.Analytics), { ssr: false });
const BountyNetwork = dynamic(() => import('@/components/views/bounty-network').then((m) => m.BountyNetwork), { ssr: false });
const Archive = dynamic(() => import('@/components/views/archive').then((m) => m.ArchiveView), { ssr: false });
const Timeline = dynamic(() => import('@/components/views/timeline').then((m) => m.Timeline), { ssr: false });
const OfficerProfiles = dynamic(() => import('@/components/views/officer-profiles').then((m) => m.OfficerProfiles), { ssr: false });
const HyperspaceRouter = dynamic(() => import('@/components/views/hyperspace-router').then((m) => m.HyperspaceRouter), { ssr: false });
const Achievements = dynamic(() => import('@/components/views/achievements').then((m) => m.Achievements), { ssr: false });
const Settings = dynamic(() => import('@/components/views/settings').then((m) => m.Settings), { ssr: false });

const VIEWS: Record<ViewId, React.ComponentType> = {
  dashboard: Dashboard,
  galaxy: GalaxyView,
  jedi: JediDatabase,
  fleet: FleetManagement,
  operations: OperationPlanner,
  sentinel: Sentinel,
  threat: ThreatPrediction,
  'intel-feed': IntelFeed,
  comms: Communications,
  probes: ProbeControl,
  satellites: SatelliteNetwork,
  resources: ResourceManagement,
  analytics: Analytics,
  bounty: BountyNetwork,
  archive: Archive,
  timeline: Timeline,
  officers: OfficerProfiles,
  hyperspace: HyperspaceRouter,
  achievements: Achievements,
  settings: Settings,
};

export function ViewRouter({ children }: { children?: React.ReactNode }) {
  const view = useApp((s) => s.view);
  const Component = VIEWS[view] ?? Dashboard;
  return <Component />;
}
