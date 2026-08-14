// Deterministic mock data generator for IMPERIALNET.
// All data is generated from seeded PRNGs so the app is stable across reloads.

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(66);
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const rint = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const rfloat = (min: number, max: number) => rand() * (max - min) + min;
const chance = (p: number) => rand() < p;

export type ThreatLevel = 'green' | 'yellow' | 'orange' | 'red';
export type FleetStatus = 'moving' | 'docked' | 'attacking' | 'destroyed';
export type JediStatus = 'alive' | 'captured' | 'missing' | 'eliminated';
export type JediRank = 'master' | 'knight' | 'padawan';

export interface Planet {
  id: string;
  name: string;
  region: string;
  sector: string;
  position: [number, number, number];
  population: number; // in billions
  government: string;
  climate: string;
  terrain: string;
  resources: string[];
  forceTemples: number;
  clonePresence: number; // battalions
  fleetStationed: string | null;
  probeDroids: number;
  threatScore: number; // 0-100
  threatLevel: ThreatLevel;
  civilianLoyalty: number; // 0-100
  recruitmentProbability: number; // 0-100
  recentActivity: string;
  aiRecommendation: 'deploy' | 'observe' | 'ignore' | 'blockade' | 'occupy';
  color: string;
  size: number;
}

export interface Fleet {
  id: string;
  name: string;
  commander: string;
  starDestroyers: number;
  cruisers: number;
  frigates: number;
  tieFighters: number;
  troops: number;
  fuel: number; // 0-100
  morale: number; // 0-100
  status: FleetStatus;
  location: string; // planet name
  destination: string | null;
  progress: number; // 0-1 for moving fleets
  path: [number, number, number][] | null;
}

export interface Jedi {
  id: string;
  name: string;
  rank: JediRank;
  forceAbility: string;
  lightsaberColor: string;
  homePlanet: string;
  knownAssociates: string[];
  threatLevel: ThreatLevel;
  status: JediStatus;
  lastSeen: string;
  lastSeenPlanet: string;
  combatStyle: string;
  captureProbability: number; // 0-100
  portraitSeed: number;
}

export interface IntelReport {
  id: string;
  timestamp: string;
  category: 'probe' | 'clone' | 'signal' | 'force' | 'operation' | 'blockade' | 'fleet';
  message: string;
  planet: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Commander {
  id: string;
  name: string;
  rank: string;
  experience: number; // years
  awards: string[];
  fleet: string;
  completedMissions: number;
  successRate: number;
  portraitSeed: number;
}

export interface Operation {
  id: string;
  name: string;
  target: string;
  commander: string;
  assignedFleet: string;
  planet: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  objectives: string[];
  timeline: string;
  estimatedCasualties: number;
  requiredResources: string[];
  aiPrediction: number; // success %
  status: 'planning' | 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface BountyHunter {
  id: string;
  name: string;
  species: string;
  availability: 'available' | 'on-mission' | 'unavailable';
  price: number; // credits
  reliability: number; // 0-100
  successRate: number; // 0-100
  specialization: string;
}

const PLANET_NAMES = [
  'Coruscant', 'Naboo', 'Tatooine', 'Kashyyyk', 'Alderaan', 'Mustafar', 'Hoth', 'Endor',
  'Geonosis', 'Kamino', 'Mandalore', 'Dathomir', 'Dagobah', 'Bespin', 'Yavin IV', 'Jakku',
  'Scarif', 'Jedha', 'Corellia', 'Ryloth', 'Sullust', 'Felucia', 'Mygeeto', 'Utapau',
  'Christophsis', 'Malachor', 'Kessel', 'Ord Mantell', 'Lothal', 'Kiros', 'Onderon', 'Polis Massa',
  'Dantooine', 'Ilum', 'Exegol', 'Ahch-To', 'Crait', 'Batuu', 'Vandor', 'Pasaana',
  'Aki-Aki', 'Kijimi', 'Zoh', 'Nevarro', 'Trantor', 'Aargau', 'Balmorra', 'Borleias',
  'Carida', 'Chandrila', 'Duro', 'Eriadu', 'Fondor', 'Haruun Kal', 'Iridonia', 'Jabiim',
  'Kuat', 'Manaan', 'Metalorn', 'Muunilinst', 'Ord Mandell', 'Pantora', 'Quell', 'Rendili',
  'Serenno', 'Taris', 'Voss', 'Wayland', 'Xagobah', 'Zeltros', 'Anaxes', 'Bakura',
  'Bestine', 'Bilbringi', 'Bothawui', 'Cato Neimoidia', 'Concord Dawn', 'Dathomir Prime',
  'Ebaq', 'Falleen', 'Garos IV', 'Hapes', 'Ithor', 'Jomark', 'Kalakar Six', 'Lwhekk',
  'Mrlsst', 'Nzoth', 'Obroa-skai', 'Pellaeon', 'Qoribu', 'Ralltiir', 'Sarapin', 'Teyr',
  'Ubertica', 'Vulpter', 'Wroona', 'Xorrn', 'Yaga Minor', 'Ziost',
];

const REGIONS = ['Core Worlds', 'Inner Rim', 'Mid Rim', 'Outer Rim', 'Unknown Regions', 'Expansion Region', 'Wild Space'];
const GOVERNMENTS = ['Imperial Governor', 'Planetary Council', 'Occupied', 'Loyalist Senate', 'Rebel Sympathizers', 'Neutral', 'Corporate Sector'];
const CLIMATES = ['Temperate', 'Arctic', 'Desert', 'Jungle', 'Ocean', 'Volcanic', 'Gas Giant', 'Toxic', 'Barren'];
const TERRAINS = ['Plains', 'Mountains', 'Forests', 'Deserts', 'Oceans', 'Ice Caves', 'Lava Rivers', 'Swamps', 'Canyons', 'Plateaus'];
const RESOURCES = ['Kyber Crystals', 'Doonium', 'Tibanna Gas', 'Durasteel', 'Bacta', 'Spice', 'Agriculture', 'Hyperdrive Components', 'Energy Cells', 'Water', 'Rare Minerals', 'Crystals'];
const ACTIVITIES = [
  'Probe Droid detected unusual movement in sector 7',
  'Clone Battalion entered atmosphere',
  'Encrypted Jedi signal intercepted',
  'High Force signature detected near ruins',
  'Operation successful — target eliminated',
  'Planet under blockade, smuggling routes closed',
  'Civilian unrest reported in capital',
  'Recruitment drive exceeded quota by 34%',
  'Smuggler vessel intercepted and boarded',
  'Rebel cell dismantled, 12 arrests',
  'Anomalous hyperspace exit signature logged',
  'Inquisitor team deployed to investigate temple ruins',
];

function threatFromScore(score: number): ThreatLevel {
  if (score >= 75) return 'red';
  if (score >= 50) return 'orange';
  if (score >= 25) return 'yellow';
  return 'green';
}

function spherePos(i: number, total: number): [number, number, number] {
  const phi = Math.acos(-1 + (2 * i) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const r = 18 + rfloat(-4, 4);
  return [
    r * Math.cos(theta) * Math.sin(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(phi),
  ];
}

export const PLANETS: Planet[] = PLANET_NAMES.map((name, i) => {
  const score = rint(5, 98);
  const pos = spherePos(i, PLANET_NAMES.length);
  return {
    id: `PL-${String(i + 1).padStart(3, '0')}`,
    name,
    region: pick(REGIONS),
    sector: `Sector ${rint(1, 18)}`,
    position: pos,
    population: rfloat(0.001, 58),
    government: pick(GOVERNMENTS),
    climate: pick(CLIMATES),
    terrain: pick(TERRAINS),
    resources: range(rint(1, 4)).map(() => pick(RESOURCES)),
    forceTemples: chance(0.18) ? rint(1, 3) : 0,
    clonePresence: rint(0, 40),
    fleetStationed: null,
    probeDroids: rint(0, 24),
    threatScore: score,
    threatLevel: threatFromScore(score),
    civilianLoyalty: rint(20, 99),
    recruitmentProbability: rint(10, 95),
    recentActivity: pick(ACTIVITIES),
    aiRecommendation:
      score >= 75 ? 'deploy' : score >= 50 ? 'blockade' : score >= 30 ? 'observe' : 'ignore',
    color:
      score >= 75 ? '#FF4444' : score >= 50 ? '#F39C2C' : score >= 25 ? '#F1C40F' : '#2ECC71',
    size: 0.18 + (score / 100) * 0.22,
  };
});

const COMMANDER_NAMES = [
  'Grand Admiral Thrawn', 'General Veers', 'Admiral Ozzel', 'Captain Needa', 'Grand Moff Tarkin',
  'Admiral Piett', 'General Tagge', 'Commander Jerjerrod', 'Captain Brandei', 'Admiral Daala',
  'General Covell', 'Commodore Helies', 'Captain Dorja', 'Admiral Rogriss', 'General Solo',
  'Captain Bleyd', 'Admiral Tavira', 'General Crix', 'Commander Gherant', 'Captain Motti',
  'Admiral Screed', 'General Mohc', 'Captain Kolaff', 'Admiral Banje', 'Commander Pellaeon',
  'Captain Tanda', 'General Veers II', 'Admiral Natasi', 'Commander Tikkes', 'Captain Lorth',
  'Admiral Grant', 'General Irra', 'Captain Sair', 'Admiral Mordon', 'Commander Voss',
  'Captain Xam', 'General Lennox', 'Admiral Harkov', 'Commander Broz', 'Captain Zuggnik',
  'Admiral Sarn', 'General Covell II', 'Captain Klev', 'Admiral Teradoc', 'Commander Krefey',
  'Captain Doriana', 'General Tanchel', 'Admiral Rogriss II', 'Commander Stel', 'Captain Zsinj',
];

export const COMMANDERS: Commander[] = COMMANDER_NAMES.map((name, i) => ({
  id: `CMD-${String(i + 1).padStart(3, '0')}`,
  name,
  rank: pick(['Grand Admiral', 'Admiral', 'Vice Admiral', 'General', 'Commodore', 'Captain', 'Commander']),
  experience: rint(6, 40),
  awards: range(rint(1, 5)).map(() =>
    pick(['Medal of Valor', 'Order of the Empire', 'Corellian Cross', 'Distinguished Service', 'Crimson Star', 'Moff\'s Commendation'])
  ),
  fleet: '',
  completedMissions: rint(4, 120),
  successRate: rint(62, 99),
  portraitSeed: i + 100,
}));

export const FLEETS: Fleet[] = range(200).map((i) => {
  const planet = pick(PLANETS);
  const status: FleetStatus = pick<FleetStatus>(['docked', 'docked', 'docked', 'moving', 'moving', 'attacking', 'destroyed']);
  const moving = status === 'moving';
  const dest = moving ? pick(PLANETS) : null;
  const path = moving && dest ? [planet.position, dest.position] : null;
  return {
    id: `FLT-${String(i + 1).padStart(3, '0')}`,
    name: `Imperial Fleet ${pick(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Theta', 'Omega', 'Sigma', 'Lambda'])} ${rint(1, 9)}`,
    commander: pick(COMMANDERS).name,
    starDestroyers: rint(1, 12),
    cruisers: rint(2, 30),
    frigates: rint(4, 40),
    tieFighters: rint(120, 1800),
    troops: rint(2000, 95000),
    fuel: rint(20, 100),
    morale: rint(45, 100),
    status,
    location: planet.name,
    destination: dest?.name ?? null,
    progress: moving ? rfloat(0.1, 0.9) : 0,
    path,
  };
});

const JEDI_FIRST = ['Obi-Wan', 'Yoda', 'Ahsoka', 'Kanan', 'Cal', 'Cere', 'Quinlan', 'Gungi', 'Ezra', 'Kato', 'Aayla', 'Luminara', 'Shaak', 'Plo', 'Ki-Adi', 'Mace', 'Depa', 'Even', 'Stass', 'Barriss', 'Agen', 'Saesee', 'Coleman', 'Kit', 'Adi', 'Yaddle', 'Oppo', 'Yarael', 'Tiplar', 'Tiplee', 'Noman', 'Jaro', 'Tera', 'Bultar', 'Knox', 'Petro', 'Byph', 'Ganodi', 'Katooni', 'Zatt', 'Nuru', 'Voolvif', 'Roron', 'Darrus', 'Kruhk', 'Rahm', 'Dooku', 'Satele', 'Revan', 'Bastila', 'Jolee', 'Visas', 'Mical', 'Mira', 'Atton', 'Bao', 'Kreia', 'Malak', 'Nomi', 'Vima', 'Ulic', 'Cay', 'Tott', 'Nomi', 'Vima', 'Sylvar', 'Oss', 'Thon', 'Arca', 'Nomi', 'Vima'];
const JEDI_LAST = ['Kenobi', 'Secura', 'Unduli', 'Ti', 'Koon', 'Mundi', 'Windu', 'Billaba', 'Piell', 'Vos', 'Jarrus', 'Kestis', 'Junda', 'Tapal', 'Tano', 'Bridger', 'Syndulla', 'Ordo', 'Vizsla', 'Dooku', 'Shan', 'Ragnos', 'Sadow', 'Kun', 'Qel-Droma', 'Sunrider', 'Dorme', 'Fisto', 'Gallia', 'Koth', 'Rostu', 'Monn', 'Swan', 'Shaak', 'Tano', 'Kryze', 'Vizsla'];
const FORCE_ABILITIES = ['Telekinesis', 'Mind Trick', 'Force Push', 'Force Lightning', 'Battle Meditation', 'Force Heal', 'Beast Control', 'Force Vision', 'Force Stealth', 'Force Speed', 'Force Jump', 'Force Choke'];
const SABER_COLORS = ['Blue', 'Green', 'Yellow', 'Purple', 'White', 'Cyan', 'Magenta', 'Orange'];
const COMBAT_STYLES = ['Form I Shii-Cho', 'Form II Makashi', 'Form III Soresu', 'Form IV Ataru', 'Form V Shien', 'Form VI Niman', 'Form VII Juyo', 'Form VII Vaapad'];

export const JEDI: Jedi[] = range(300).map((i) => {
  const status: JediStatus = pick<JediStatus>(['alive', 'alive', 'alive', 'missing', 'captured', 'eliminated']);
  const score = rint(10, 99);
  const home = pick(PLANETS).name;
  return {
    id: `JD-${String(i + 1).padStart(3, '0')}`,
    name: `${pick(JEDI_FIRST)} ${pick(JEDI_LAST)}`,
    rank: pick<JediRank>(['master', 'master', 'knight', 'knight', 'padawan']),
    forceAbility: pick(FORCE_ABILITIES),
    lightsaberColor: pick(SABER_COLORS),
    homePlanet: home,
    knownAssociates: range(rint(0, 3)).map(() => `${pick(JEDI_FIRST)} ${pick(JEDI_LAST)}`),
    threatLevel: threatFromScore(score),
    status,
    lastSeen: `${rint(1, 30)} days ago`,
    lastSeenPlanet: pick(PLANETS).name,
    combatStyle: pick(COMBAT_STYLES),
    captureProbability: status === 'eliminated' ? 0 : status === 'captured' ? 100 : rint(8, 92),
    portraitSeed: i + 200,
  };
});

export const INTEL_REPORTS: IntelReport[] = range(1000).map((i) => ({
  id: `INT-${String(i + 1).padStart(4, '0')}`,
  timestamp: `${rint(1, 23)}h ${rint(0, 59)}m ago`,
  category: pick<IntelReport['category']>(['probe', 'clone', 'signal', 'force', 'operation', 'blockade', 'fleet', 'probe', 'signal']),
  message: pick(ACTIVITIES),
  planet: pick(PLANETS).name,
  severity: pick<IntelReport['severity']>(['low', 'low', 'medium', 'medium', 'high', 'critical']),
}));

export const OPERATIONS: Operation[] = range(100).map((i) => {
  const status = pick<Operation['status']>(['planning', 'active', 'active', 'completed', 'completed', 'archived']);
  const priority = pick<Operation['priority']>(['low', 'medium', 'medium', 'high', 'high', 'critical']);
  return {
    id: `OP-${String(i + 1).padStart(3, '0')}`,
    name: `Operation ${pick(['Shadow', 'Nightfall', 'Vengeance', 'Tempest', 'Eclipse', 'Sentinel', 'Inferno', 'Storm', 'Cobra', 'Thunder', 'Iron Fist', 'Dark Hand', 'Silent Strike', 'Red Dawn', 'Blackout'])}`,
    target: pick(JEDI).name,
    commander: pick(COMMANDERS).name,
    assignedFleet: pick(FLEETS).name,
    planet: pick(PLANETS).name,
    priority,
    objectives: range(rint(2, 4)).map(() =>
      pick(['Eliminate target', 'Secure temple ruins', 'Establish blockade', 'Capture alive', 'Destroy rebel cell', 'Seize kyber cache', 'Extract intelligence', 'Disable communications'])
    ),
    timeline: `${rint(1, 12)} standard days`,
    estimatedCasualties: rint(0, 4500),
    requiredResources: range(rint(2, 4)).map(() => pick(['3 Star Destroyers', 'TIE Squadron', 'Probe Droid Pack', 'Clone Battalion', 'Inquisitor Team', 'Fuel Reserve', 'Orbital Strike', 'Bounty Hunter'])),
    aiPrediction: rint(35, 98),
    status,
    createdAt: `${rint(1, 40)} days ago`,
  };
});

export const BOUNTY_HUNTERS: BountyHunter[] = [
  { id: 'BH-001', name: 'Boba Fett', species: 'Human', availability: 'available', price: 250000, reliability: 98, successRate: 94, specialization: 'High-value Jedi targets' },
  { id: 'BH-002', name: 'Cad Bane', species: 'Duros', availability: 'on-mission', price: 180000, reliability: 89, successRate: 87, specialization: 'Infiltration & extraction' },
  { id: 'BH-003', name: 'IG-88', species: 'Droid', availability: 'available', price: 120000, reliability: 92, successRate: 90, specialization: 'Assassination' },
  { id: 'BH-004', name: 'Dengar', species: 'Human', availability: 'unavailable', price: 90000, reliability: 78, successRate: 72, specialization: 'Pursuit & tracking' },
  { id: 'BH-005', name: 'Bossk', species: 'Trandoshan', availability: 'available', price: 110000, reliability: 84, successRate: 81, specialization: 'Wookiee & jungle hunts' },
  { id: 'BH-006', name: 'Aurra Sing', species: 'Human', availability: 'on-mission', price: 140000, reliability: 86, successRate: 83, specialization: 'Sniping & sabotage' },
  { id: 'BH-007', name: 'Embo', species: 'Kyuzo', availability: 'available', price: 130000, reliability: 91, successRate: 88, specialization: 'Close-quarters combat' },
  { id: 'BH-008', name: 'Sugi', species: 'Zabrak', availability: 'available', price: 75000, reliability: 80, successRate: 76, specialization: 'Protection & escort' },
];

export const RESOURCES_STATE = {
  credits: 8_420_000_000,
  fuel: 64,
  food: 78,
  medical: 52,
  ships: 1280,
  weapons: 92,
  kyberCrystals: 318,
  troops: 1_240_000,
  supplies: 68,
};

export const ACHIEVEMENTS = [
  { id: 'ach1', name: 'Master Hunter', desc: 'Eliminate 50 Jedi targets', icon: 'Crosshair', unlocked: true, progress: 100 },
  { id: 'ach2', name: 'Fleet Commander', desc: 'Command 200 fleets simultaneously', icon: 'Ship', unlocked: true, progress: 100 },
  { id: 'ach3', name: 'Outer Rim Guardian', desc: 'Secure all Outer Rim sectors', icon: 'Shield', unlocked: false, progress: 72 },
  { id: 'ach4', name: 'Order 66 Veteran', desc: 'Participated in Order 66 execution', icon: 'Skull', unlocked: true, progress: 100 },
  { id: 'ach5', name: 'Grand Admiral', desc: 'Reach the highest Imperial rank', icon: 'Crown', unlocked: false, progress: 88 },
  { id: 'ach6', name: 'Inquisitor Lord', desc: 'Lead the Inquisitor program', icon: 'Eye', unlocked: false, progress: 45 },
];

export const TIMELINE_EVENTS = [
  { year: '19 BBY', title: 'Order 66', desc: 'Clone troopers execute Order 66. The Jedi Order falls across the galaxy in a single night.', icon: 'Skull' },
  { year: '19 BBY', title: 'Temple Fall', desc: 'The Jedi Temple on Coruscant is stormed. Anakin Skywalker leads the 501st in its destruction.', icon: 'Flame' },
  { year: '18 BBY', title: 'Clone Deployment', desc: 'Clone battalions deployed to every sector to enforce Imperial rule and hunt survivors.', icon: 'Users' },
  { year: '14 BBY', title: 'Inquisitor Program', desc: 'The Inquisitorius is established — fallen Jedi tasked with hunting their former kin.', icon: 'Eye' },
  { year: '5 BBY', title: 'Current Operations', desc: 'Active galaxy-wide operations continue. Remaining Jedi are scattered but not extinct.', icon: 'Activity' },
];

export const SECTORS = REGIONS.map((region, i) => ({
  id: `SEC-${i + 1}`,
  name: region,
  control: rint(40, 99),
  planets: PLANETS.filter((p) => p.region === region).length,
  threat: rint(10, 90),
}));

export function getPlanetByName(name: string) {
  return PLANETS.find((p) => p.name === name) ?? null;
}

export function stats() {
  const jediAlive = JEDI.filter((j) => j.status === 'alive').length;
  const jediCaptured = JEDI.filter((j) => j.status === 'captured').length;
  const jediEliminated = JEDI.filter((j) => j.status === 'eliminated').length;
  const activeMissions = OPERATIONS.filter((o) => o.status === 'active').length;
  const probes = PLANETS.reduce((a, p) => a + p.probeDroids, 0);
  const avgSecurity = Math.round(PLANETS.reduce((a, p) => a + p.civilianLoyalty, 0) / PLANETS.length);
  const redSectors = PLANETS.filter((p) => p.threatLevel === 'red').length;
  return {
    totalFleets: FLEETS.length,
    activeMissions,
    jediRemaining: jediAlive,
    jediCaptured,
    jediEliminated,
    probeDroidsActive: probes,
    sectorSecurity: avgSecurity,
    alerts: redSectors,
  };
}
