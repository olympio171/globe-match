import { MONTH_TINTS, QUIZ_STEPS, type Tint } from '../data/questions';
import type { Destination, FeatureKey, LandscapeKey, QuizAnswers } from '../types';

/** The silhouette drawn along the bottom of the screen. */
export type Scene =
  | 'neutral'
  | 'sea'
  | 'peaks'
  | 'fjord'
  | 'canopy'
  | 'dunes'
  | 'volcano'
  | 'skyline'
  | 'domes'
  | 'hills';

export interface Mood {
  /** Main and secondary hue, OKLCH degrees. */
  h1: number;
  h2: number;
  /** 0 = greyscale, 1 = fully saturated palette. */
  chroma: number;
  /** 0 = languid, 1 = restless: drives how fast the ambient light drifts. */
  energy: number;
  scene: Scene;
  /** Human name of the palette, e.g. “Lagon & corail”. */
  name: string;
  /** The tints that built it, strongest first, for the palette preview. */
  swatches: { h: number; name: string }[];
}

export const NEUTRAL_MOOD: Mood = {
  h1: 75,
  h2: 75,
  chroma: 0,
  energy: 0.3,
  scene: 'neutral',
  name: 'Page blanche',
  swatches: [],
};

const LANDSCAPE_SCENE: Record<LandscapeKey, Scene> = {
  beach: 'sea',
  island: 'sea',
  mountain: 'peaks',
  snow: 'peaks',
  lake: 'fjord',
  jungle: 'canopy',
  forest: 'canopy',
  desert: 'dunes',
  savanna: 'dunes',
  volcano: 'volcano',
  city: 'skyline',
  heritage: 'domes',
  countryside: 'hills',
};

const PACE_ENERGY = { lazy: 0.1, slow: 0.25, balanced: 0.45, active: 0.7, intense: 0.9 } as const;

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Weighted circular mean of hues. */
function meanHue(tints: { h: number; w: number }[]): number {
  let x = 0;
  let y = 0;
  for (const t of tints) {
    const r = (t.h * Math.PI) / 180;
    x += Math.cos(r) * t.w;
    y += Math.sin(r) * t.w;
  }
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

const CLUSTER = 45;

/**
 * The dominant family of hues. Averaging every tint would turn coral plus
 * turquoise into a green nobody picked, so tints vote for nearby hues and the
 * strongest neighbourhood wins.
 */
function dominantCluster<T extends { h: number; w: number }>(tints: T[]): { h: number; weight: number; members: T[] } | null {
  let best: { h: number; weight: number; members: T[] } | null = null;
  for (const centre of tints) {
    const members = tints.filter((t) => hueGap(t.h, centre.h) <= CLUSTER);
    const weight = members.reduce((sum, t) => sum + t.w * (1 - hueGap(t.h, centre.h) / (CLUSTER * 2)), 0);
    if (!best || weight > best.weight) best = { h: meanHue(members), weight, members };
  }
  return best;
}

const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * The interface’s colours as a function of the answers so far: the more the
 * traveller answers — and the more consistently — the richer the palette.
 */
export function moodFromAnswers(answers: QuizAnswers): Mood {
  const tints: (Tint & { w: number })[] = [];

  for (const step of QUIZ_STEPS) {
    const weight = step.tintWeight ?? 0;
    if (!weight) continue;
    const value = answers[step.id];
    if (value === undefined) continue;

    if (step.type === 'months' && Array.isArray(value)) {
      const n = (value as number[]).length || 1;
      for (const m of value as number[]) tints.push({ ...MONTH_TINTS[m], w: weight / Math.sqrt(n) });
    } else if (step.type === 'scale' && typeof value === 'number') {
      const tint = step.scale?.[value - 1]?.tint;
      if (tint) tints.push({ ...tint, w: (tint.w ?? 1) * weight });
    } else if (step.options) {
      const ids = Array.isArray(value) ? (value as string[]) : [value as string];
      const n = Math.sqrt(ids.length || 1);
      for (const id of ids) {
        const tint = step.options.find((o) => o.id === id)?.tint;
        if (tint) tints.push({ ...tint, w: ((tint.w ?? 1) * weight) / n });
      }
    }
  }

  if (!tints.length) return { ...NEUTRAL_MOOD, energy: answers.pace ? PACE_ENERGY[answers.pace] : NEUTRAL_MOOD.energy };

  const total = tints.reduce((sum, t) => sum + t.w, 0);
  const first = dominantCluster(tints)!;
  const rest = tints.filter((t) => hueGap(t.h, first.h) > CLUSTER);
  const second = rest.length ? dominantCluster(rest) : null;
  const h = first.h;
  const h2 = second ? second.h : (h + 40) % 360;
  const agreement = first.weight / total;
  const chroma = Math.min(1, total / 4.5) * (0.6 + 0.4 * agreement);

  const strongest = (members: typeof tints) => [...members].sort((a, b) => b.w - a.w)[0]?.name;
  const names = [strongest(first.members), second ? strongest(second.members) : undefined].filter(
    (n, i, all): n is string => !!n && all.indexOf(n) === i
  );

  const swatches: { h: number; name: string }[] = [];
  for (const t of [...tints].sort((a, b) => b.w - a.w)) {
    if (swatches.some((sw) => sw.name === t.name || hueGap(sw.h, t.h) < 12)) continue;
    swatches.push({ h: t.h, name: t.name });
    if (swatches.length === 5) break;
  }

  let scene: Scene = 'neutral';
  if (answers.landscapes?.length) scene = LANDSCAPE_SCENE[answers.landscapes[0]];
  else if (answers.climate?.includes('cold')) scene = 'peaks';
  else if (answers.climate?.some((c) => c === 'scorching' || c === 'hot')) scene = 'sea';
  else if (answers.climate?.includes('mild')) scene = 'hills';
  else if (answers.climate?.includes('cool')) scene = 'fjord';

  let energy = answers.pace ? PACE_ENERGY[answers.pace] : 0.4;
  if (answers.vibes?.some((v) => v === 'adrenaline' || v === 'festive')) energy = Math.min(1, energy + 0.2);
  if (answers.vibes?.includes('serenity')) energy = Math.max(0, energy - 0.15);

  return {
    h1: h,
    h2,
    chroma,
    energy,
    scene,
    name: names.map(capitalise).join(' & ').replace(/^(.)/, (c) => c.toUpperCase()),
    swatches,
  };
}

const SCENE_TRAITS: [FeatureKey, Scene][] = [
  ['volcano', 'volcano'],
  ['desert', 'dunes'],
  ['beach', 'sea'],
  ['island', 'sea'],
  ['mountain', 'peaks'],
  ['snow', 'peaks'],
  ['lake', 'fjord'],
  ['jungle', 'canopy'],
  ['savanna', 'dunes'],
  ['city', 'skyline'],
  ['heritage', 'domes'],
  ['countryside', 'hills'],
  ['forest', 'canopy'],
];

/** On the results page the interface takes on the selected destination’s colours. */
export function moodFromDestination(dest: Destination): Mood {
  let scene: Scene = 'neutral';
  let best = 0;
  for (const [key, s] of SCENE_TRAITS) {
    const v = dest.f[key] ?? 0;
    if (v > best) {
      best = v;
      scene = s;
    }
  }
  return {
    h1: dest.hue,
    h2: (dest.hue + 38) % 360,
    chroma: 0.9,
    energy: 0.35,
    scene,
    name: dest.name,
    swatches: [{ h: dest.hue, name: dest.name }],
  };
}
