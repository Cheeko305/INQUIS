import { NAV } from '@/lib/nav';
import { JEDI, PLANETS, FLEETS } from '@/lib/data';
import type { ViewId } from '@/lib/store';

export type SearchResult = {
  label: string;
  description: string;
  view: ViewId;
  planetId?: string;
};

export function globalSearch(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  NAV.filter((n) => n.label.toLowerCase().includes(q)).forEach((n) => {
    results.push({ label: n.label, description: 'Navigation section', view: n.id });
  });

  JEDI.filter(
    (j) =>
      j.name.toLowerCase().includes(q) ||
      j.homePlanet.toLowerCase().includes(q) ||
      j.id.toLowerCase().includes(q)
  )
    .slice(0, 5)
    .forEach((j) => {
      results.push({
        label: j.name,
        description: `Jedi target // ${j.status} // ${j.rank}`,
        view: 'jedi',
      });
    });

  PLANETS.filter((p) => p.name.toLowerCase().includes(q) || p.sector.toLowerCase().includes(q))
    .slice(0, 5)
    .forEach((p) => {
      results.push({
        label: p.name,
        description: `${p.sector} // ${p.threatScore}% threat`,
        view: 'galaxy',
        planetId: p.id,
      });
    });

  FLEETS.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.commander.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q)
  )
    .slice(0, 5)
    .forEach((f) => {
      results.push({
        label: f.name,
        description: `${f.commander} // ${f.status} at ${f.location}`,
        view: 'fleet',
      });
    });

  return results.slice(0, 8);
}
