import type { Destination, Experience, FeatureKey, Pace, QuizAnswers, Vibe } from '../types';

export interface ItineraryBlock {
  /** First and last day covered, 1-based. */
  from: number;
  to: number;
  kind: 'arrival' | 'experience' | 'free' | 'extension' | 'departure';
  title: string;
  text: string;
  tags: FeatureKey[];
}

export interface Itinerary {
  blocks: ItineraryBlock[];
  /** Experiences that did not fit, suggested for a longer trip. */
  later: Experience[];
}

/** Days of sightseeing one calendar day can hold, by travel pace. */
const CAPACITY: Record<Pace, number> = { lazy: 0.5, slow: 0.75, balanced: 1, active: 1.25, intense: 1.5 };

const VIBE_TAGS: Record<Vibe, FeatureKey[]> = {
  serenity: ['relax', 'wellness', 'lake'],
  wonder: ['mountain', 'volcano', 'desert', 'snow', 'wildlife', 'sky', 'lake'],
  culture_shock: ['traditions', 'markets', 'spiritual'],
  romance: ['romance', 'relax'],
  adrenaline: ['adventure', 'hiking', 'surf'],
  festive: ['nightlife', 'music'],
  gourmet: ['food', 'markets', 'wine'],
  learn: ['history', 'art', 'traditions', 'architecture'],
};

function interests(a: QuizAnswers): Map<FeatureKey, number> {
  const w = new Map<FeatureKey, number>();
  const bump = (k: FeatureKey, v: number) => w.set(k, Math.max(w.get(k) ?? 0, v));
  for (const k of a.landscapes ?? []) bump(k, 2);
  for (const k of a.activities ?? []) bump(k, 2.2);
  for (const k of a.culture ?? []) if (k !== 'none') bump(k, 2);
  for (const v of a.vibes ?? []) for (const k of VIBE_TAGS[v]) bump(k, 1.2);
  if ((a.foodImportance ?? 0) >= 4) bump('food', 1.5);
  if (a.companion === 'family_young' || a.companion === 'family_teens') bump('family', 1.5);
  if (a.companion === 'couple') bump('romance', 1);
  return w;
}

function freeDay(dest: Destination): { title: string; text: string } {
  const f = dest.f;
  if ((f.beach ?? 0) >= 4) return { title: 'Journée plage', text: 'Rien de prévu : baignade, sieste et coucher de soleil.' };
  if ((f.wellness ?? 0) >= 4) return { title: 'Journée bien-être', text: 'Massage, bains et lenteur assumée.' };
  if ((f.city ?? 0) >= 4) return { title: 'Flânerie libre', text: 'Un quartier au hasard, un café, et laissez-vous porter.' };
  if ((f.hiking ?? 0) >= 4) return { title: 'Journée libre', text: 'Une randonnée de plus, ou du repos pour les jambes.' };
  return { title: 'Journée libre', text: 'Revenir sur un coup de cœur, ou ne rien faire du tout.' };
}

/**
 * A day-by-day plan built from the destination’s signature experiences,
 * ordered as they appear (roughly geographical), keeping those that match the
 * traveller’s interests first, and paced to their rhythm.
 */
export function buildItinerary(dest: Destination, answers: QuizAnswers, days: number): Itinerary {
  const pace = answers.pace ?? 'balanced';
  const capacity = CAPACITY[pace];
  const weights = interests(answers);

  const scored = dest.experiences.map((e, index) => ({
    e,
    index,
    score:
      Math.max(0.3, ...e.tags.map((t) => weights.get(t) ?? 0)) +
      0.15 * e.tags.filter((t) => weights.has(t)).length +
      (index === 0 ? 1 : 0),
  }));

  // Day 1 is arrival, the last day departure; the rest holds the programme.
  // Brisk travellers also use the afternoon of the arrival day.
  const arrivalAfternoon = capacity >= 1 && days >= 3 ? 0.5 : 0;
  const budget = Math.max(0.5, (days - 2) * capacity + arrivalAfternoon);
  const chosen: typeof scored = [];
  let used = 0;
  for (const s of [...scored].sort((x, y) => y.score - x.score)) {
    if (used + s.e.days <= budget + 1e-6) {
      chosen.push(s);
      used += s.e.days;
    }
  }
  chosen.sort((x, y) => x.index - y.index);

  const blocks: ItineraryBlock[] = [];
  blocks.push({
    from: 1,
    to: 1,
    kind: 'arrival',
    title: 'Arrivée',
    text: days <= 4 ? 'Installation et premier tour du quartier.' : 'Installation, premier repas local et une nuit pour se caler.',
    tags: [],
  });

  let cursor = 2 - arrivalAfternoon / capacity; // fractional day pointer
  const rest = freeDay(dest);
  let sinceRest = 0;
  const bumped: Experience[] = [];
  const lastDay = Math.max(2, days - 1);
  for (const { e } of chosen) {
    const span = e.days / capacity;
    const from = Math.floor(cursor);
    if (from > lastDay) {
      bumped.push(e);
      continue;
    }
    cursor += span;
    const to = Math.min(lastDay, Math.max(from, Math.ceil(cursor - 1e-6) - 1));
    blocks.push({ from, to, kind: 'experience', title: e.title, text: e.text, tags: e.tags });
    sinceRest += span;
    // Slow travellers get a breather every couple of days.
    if ((pace === 'lazy' || pace === 'slow') && sinceRest >= 2.5 && cursor + 1 < days) {
      const day = Math.ceil(cursor - 1e-6);
      blocks.push({ from: day, to: day, kind: 'free', title: rest.title, text: rest.text, tags: [] });
      cursor = day + 1;
      sinceRest = 0;
    }
  }

  const firstFree = Math.max(2, Math.ceil(cursor - 1e-6));
  const lastFree = days - 1;
  if (lastFree >= firstFree) {
    const spare = lastFree - firstFree + 1;
    if (spare >= 3) {
      blocks.push({
        from: firstFree,
        to: lastFree - 1,
        kind: 'extension',
        title: 'Prolonger l’aventure',
        text: `Du temps devant vous : cap sur ${dest.nearby}.`,
        tags: [],
      });
      blocks.push({ from: lastFree, to: lastFree, kind: 'free', title: rest.title, text: rest.text, tags: [] });
    } else {
      blocks.push({ from: firstFree, to: lastFree, kind: 'free', title: rest.title, text: rest.text, tags: [] });
    }
  }

  if (days > 1) {
    blocks.push({ from: days, to: days, kind: 'departure', title: 'Départ', text: 'Derniers achats, dernier café, et retour.', tags: [] });
  }

  const later = [
    ...bumped,
    ...scored.filter((s) => !chosen.includes(s)).sort((x, y) => y.score - x.score).map((s) => s.e),
  ];
  return { blocks, later };
}
