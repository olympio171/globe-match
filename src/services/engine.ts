import { DESTINATIONS } from '../data/destinations';
import { MONTHS } from '../data/questions';
import type {
  BudgetChoice,
  ClimateChoice,
  Companion,
  CostEstimate,
  CriterionKey,
  CriterionResult,
  CultureKey,
  Destination,
  DurationChoice,
  FeatureKey,
  FlightChoice,
  Lodging,
  MatchResult,
  Origin,
  Priority,
  QuizAnswers,
  Recommendation,
  Vibe,
} from '../types';
import { buildProfile } from './profile';
import { parseWishes, type DetectedWish } from './keywords';
import { CUISINE_LABELS, FEATURE_LABELS, VIBE_LABELS, euros, hoursLabel, joinFr } from './labels';

/* ------------------------------------------------------------------------ */
/* Reference tables                                                          */
/* ------------------------------------------------------------------------ */

export const DURATION_DAYS: Record<DurationChoice, number> = {
  long_weekend: 4,
  short_week: 6,
  week: 8,
  two_weeks: 14,
  three_weeks: 21,
  month: 30,
};

export const BUDGET_CAP: Record<BudgetChoice, number> = {
  b700: 700,
  b1300: 1300,
  b2200: 2200,
  b3500: 3500,
  b6000: 6000,
  unlimited: Infinity,
};

export const FLIGHT_CAP: Record<FlightChoice, number> = {
  h3: 3,
  h5: 5,
  h8: 8,
  h12: 12,
  any: Infinity,
};

export const ORIGINS: Record<Origin, { coords: [number, number]; utc: number; city: string }> = {
  paris: { coords: [49.01, 2.55], utc: 1, city: 'Paris' },
  montreal: { coords: [45.47, -73.74], utc: -5, city: 'Montréal' },
};

/** Target daytime highs for each climate wish, °C. */
const CLIMATE_RANGE: Record<Exclude<ClimateChoice, 'any'>, [number, number]> = {
  scorching: [29, 36],
  hot: [24, 30],
  mild: [17, 25],
  cool: [7, 18],
  cold: [-25, 4],
};

/** How much on-site spending each way of sleeping implies: multiplier, then a fixed € add-on. */
const LODGING_COST: Record<Lodging, [number, number]> = {
  camping: [0.6, 0],
  homestay: [0.75, 0],
  apartment: [0.85, 0],
  boutique: [1, 0],
  eco: [1.1, 25],
  luxury: [1.6, 130],
};

/** Per-person cost shifts: single supplements, shared rooms, cheaper children, long stays. */
const COMPANION_COST: Record<Companion, number> = {
  solo: 1.15,
  couple: 1,
  family_young: 0.8,
  family_teens: 0.9,
  friends: 0.9,
  nomad: 0.8,
};

const BASE_WEIGHT: Record<CriterionKey, number> = {
  climate: 3,
  season: 1.5,
  landscapes: 3,
  activities: 3,
  culture: 2,
  exotic: 1.5,
  crowd: 1.5,
  pace: 1.5,
  food: 1,
  budget: 3,
  access: 2.5,
  tripFit: 2,
  companion: 1.5,
  lodging: 1,
  vibes: 2,
  notes: 2,
};

const CRITERION_LABELS: Record<CriterionKey, string> = {
  climate: 'Météo à vos dates',
  season: 'Saison',
  landscapes: 'Paysages',
  activities: 'Activités',
  culture: 'Culture',
  exotic: 'Dépaysement',
  crowd: 'Affluence',
  pace: 'Rythme',
  food: 'Gastronomie',
  budget: 'Budget',
  access: 'Temps de trajet',
  tripFit: 'Durée du séjour',
  companion: 'Compagnons',
  lodging: 'Hébergement',
  vibes: 'Ambiance',
  notes: 'Vos envies',
};

const PRIORITY_CRITERIA: Record<Priority, CriterionKey[]> = {
  weather: ['climate', 'season'],
  budget: ['budget'],
  scenery: ['landscapes'],
  activities: ['activities'],
  culture: ['culture'],
  food: ['food'],
  calm: ['crowd'],
  exotic: ['exotic'],
  easy: ['access', 'tripFit'],
};

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const topMean = (xs: number[], n: number) => mean([...xs].sort((a, b) => b - a).slice(0, n));

function haversineKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export interface FlightEstimate {
  hours: number;
  stops: number;
  price: number;
  km: number;
}

/**
 * Door-to-door flight time and a return-fare estimate from the great-circle
 * distance, the usual number of stops and a per-route premium. European
 * flights to North-East Asia still detour around Russian airspace.
 */
export function estimateFlight(dest: Destination, origin: Origin = 'paris'): FlightEstimate {
  const from = ORIGINS[origin];
  let km = haversineKm(from.coords, dest.coords);
  const [lat, lon] = dest.coords;
  if (origin === 'paris' && lat > 30 && lon > 95 && lon < 150) km *= 1.12;
  const stops = dest.stops[origin === 'paris' ? 0 : 1];
  const hours = Math.max(1, km / 820 + 0.6 + stops * 2.2);
  const price = (70 + 0.068 * km) * (1 + 0.15 * stops) * (dest.flightFactor ?? 1);
  return { hours, stops, km, price: Math.round(price / 10) * 10 };
}

export function estimateCost(
  dest: Destination,
  answers: QuizAnswers,
  flight: FlightEstimate,
  days: number
): CostEstimate {
  const [mult, add] = LODGING_COST[answers.lodging ?? 'boutique'];
  const who = COMPANION_COST[answers.companion ?? 'couple'];
  const daily = (dest.cost * mult + add) * who;
  const lowDaily = dest.cost * 0.55 * who;
  return {
    flight: flight.price,
    daily: Math.round(daily),
    days,
    total: Math.round(flight.price + daily * days),
    low: Math.round(flight.price + lowDaily * days),
  };
}

/**
 * A trait as it really is in a given month: no swimming at 18 °C, no skiing
 * without snow, no aurora under the midnight sun, no hiking at 40 °C.
 */
export function seasonal(dest: Destination, key: FeatureKey, month: number): number {
  const v = dest.f[key] ?? 0;
  if (!v) return 0;
  const t = dest.climate.t[month];
  const swim = clamp((t - 19) / 7);
  const outdoor = t < 8 ? (t < 0 ? 0.45 : 0.55 + (0.45 * t) / 8) : t > 34 ? Math.max(0.35, 1 - (t - 34) / 8) : 1;

  switch (key) {
    case 'beach':
      return v * (0.25 + 0.75 * swim);
    case 'island':
      return v * (0.6 + 0.4 * swim);
    case 'diving':
      return v * (0.5 + 0.5 * swim);
    case 'surf':
      return v * (0.6 + 0.4 * swim);
    case 'relax':
      return (dest.f.beach ?? 0) >= 3 ? v * (0.4 + 0.6 * swim) : v;
    case 'ski':
      return v * clamp((12 - t) / 7);
    case 'snow': {
      // Glaciers and high peaks stay white all year; valley temperatures lie.
      const floor = dest.altitude || dest.glaciers ? 0.85 : 0.5;
      return v * (floor + (1 - floor) * clamp((8 - t) / 8));
    }
    case 'sky': {
      const lat = dest.coords[0];
      const whiteNights = (lat > 55 && month >= 4 && month <= 7) || (lat < -55 && (month >= 10 || month <= 1));
      return whiteNights ? v * 0.2 : v;
    }
    case 'hiking': {
      // Trails above the valleys stay snowbound long after the valley thaws.
      const trail = t >= 10 ? 1 : t >= 5 ? 0.7 + 0.06 * (t - 5) : 0.4;
      return v * Math.min(trail, t > 34 ? outdoor : 1);
    }
    case 'roadtrip':
    case 'adventure':
    case 'camping':
    case 'wildlife':
      return v * outdoor;
    default:
      return v;
  }
}

/** 0–1 blend rewarding one strong match and, above all, several matches at once. */
function coverage(values: number[], maxWeight: number): number {
  if (!values.length) return 0;
  const max = Math.max(...values);
  return maxWeight * max + (1 - maxWeight) * mean(values);
}

function tempFit(t: number, choice: Exclude<ClimateChoice, 'any'>): number {
  const [lo, hi] = CLIMATE_RANGE[choice];
  if (t >= lo && t <= hi) return 1;
  const gap = t < lo ? lo - t : t - hi;
  return clamp(1 - gap / 7);
}

/** Satisfaction by rain level: dry, showers, wet, rainy season. */
const RAIN_FIT = [1, 0.85, 0.6, 0.2];

/* ------------------------------------------------------------------------ */
/* Scoring one destination for one month                                     */
/* ------------------------------------------------------------------------ */

interface Context {
  answers: QuizAnswers;
  origin: Origin;
  days: number;
  wishes: DetectedWish[];
  boosted: Set<CriterionKey>;
}

interface MonthEvaluation {
  score: number;
  criteria: CriterionResult[];
  penalties: { factor: number; note: string }[];
}

function evaluate(dest: Destination, month: number, ctx: Context, flight: FlightEstimate, cost: CostEstimate): MonthEvaluation {
  const { answers: a } = ctx;
  const f = dest.f;
  const sv = (key: FeatureKey) => seasonal(dest, key, month) / 5;
  const criteria: CriterionResult[] = [];
  const penalties: { factor: number; note: string }[] = [];
  const add = (key: CriterionKey, s: number, weight = BASE_WEIGHT[key]) => {
    const w = weight * (ctx.boosted.has(key) ? 2 : 1);
    if (w > 0) criteria.push({ key, label: CRITERION_LABELS[key], s: clamp(s), w });
  };

  const t = dest.climate.t[month];
  const rain = Number(dest.climate.r[month]);

  // Climate — temperature against every wished range, then rain.
  if (a.climate?.length) {
    const wishes = a.climate.filter((c): c is Exclude<ClimateChoice, 'any'> => c !== 'any');
    const temp = wishes.length ? Math.max(...wishes.map((c) => tempFit(t, c))) : 1;
    // Below freezing, precipitation falls as snow — which is the point for winter lovers.
    const wet = wishes.includes('cold') && t <= 4 ? Math.max(RAIN_FIT[rain], 0.85) : RAIN_FIT[rain];
    add('climate', temp * (0.4 + 0.6 * wet));
  } else if (a.when) {
    add('climate', 0.4 + 0.6 * RAIN_FIT[rain], 1.5);
  }

  // Season — local know-how: migrations, festivals, hurricane months, closures.
  if (a.when) add('season', dest.climate.best[month] === '1' ? 1 : 0.55);

  if (a.landscapes?.length) add('landscapes', coverage(a.landscapes.map(sv), 0.5));
  if (a.activities?.length) add('activities', coverage(a.activities.map(sv), 0.45));

  const culture = (a.culture ?? []).filter((c): c is CultureKey => c !== 'none');
  if (culture.length) add('culture', coverage(culture.map(sv), 0.5));

  if (a.exotic) add('exotic', 1 - (Math.abs(a.exotic - f.exotic) / 4) ** 1.2);

  if (a.crowd) {
    const [lo, hi] = ({ wild: [0, 1], calm: [0, 2.5], balanced: [2, 4], lively: [4, 5] } as const)[a.crowd];
    const fit = clamp(1 - Math.max(lo - f.crowds, f.crowds - hi, 0) / 3);
    add('crowd', a.crowd === 'lively' ? 0.6 * fit + 0.4 * (Math.max(f.city ?? 0, f.nightlife ?? 0) / 5) : fit);
  }

  if (a.pace) {
    const rest = Math.max(sv('relax'), (f.wellness ?? 0) / 5, sv('beach') * 0.8);
    const busy = topMean(
      (['hiking', 'adventure', 'roadtrip', 'history', 'heritage', 'city', 'wildlife', 'markets', 'architecture'] as FeatureKey[]).map(sv),
      3
    );
    const effort = Math.max(sv('hiking'), sv('adventure'));
    const s = {
      lazy: rest,
      slow: 0.7 * rest + 0.3 * busy,
      balanced: 0.4 + 0.3 * rest + 0.3 * busy,
      active: busy,
      intense: 0.4 * busy + 0.6 * effort,
    }[a.pace];
    add('pace', s);
  }

  if (a.foodImportance || a.cuisines?.length) {
    const importance = a.foodImportance ?? 3;
    const weight = [0, 0.5, 1.2, 2.2, 3.2][importance - 1];
    const base = f.food / 5;
    let s = base;
    if (a.cuisines?.length) {
      const hits = a.cuisines.filter((c) => dest.cuisine.includes(c)).length;
      const match = clamp(hits / Math.min(2, a.cuisines.length));
      s = 0.55 * base + 0.45 * match;
      if (a.cuisines.includes('veggie') && !dest.cuisine.includes('veggie')) s *= 0.8;
    }
    add('food', s, weight || 0.3);
  }

  // Budget — the real per-person total for this trip, flights included.
  if (a.budget && a.budget !== 'unlimited') {
    const cap = BUDGET_CAP[a.budget];
    let s = cost.total <= cap ? 1 : clamp(1 - (cost.total / cap - 1) * 1.8);
    if (cost.total > cap && cost.low <= cap) s = Math.max(s, 0.6);
    add('budget', s);
    if (cost.low > cap * 1.25) penalties.push({ factor: 0.6, note: `Hors budget même en voyageant simplement (~${euros(cost.low)} par personne)` });
    else if (cost.low > cap) penalties.push({ factor: 0.85, note: `Budget très serré : ~${euros(cost.low)} au minimum` });
  }

  // Flight limit — a stated maximum is close to a hard constraint.
  if (a.flightMax && a.flightMax !== 'any') {
    const cap = FLIGHT_CAP[a.flightMax];
    const over = flight.hours - cap;
    add('access', over <= 0 ? 1 : clamp(1 - over / 3));
    if (over > 6) penalties.push({ factor: 0.4, note: `${hoursLabel(flight.hours)} de trajet, bien au-delà de vos ${cap} h` });
    else if (over > 3) penalties.push({ factor: 0.55, note: `${hoursLabel(flight.hours)} de trajet pour ${cap} h souhaitées` });
    else if (over > 1) penalties.push({ factor: 0.8, note: `Un peu plus de ${cap} h de trajet (${hoursLabel(flight.hours)})` });
  }

  // Trip length — worth the flight, and long enough to do the place justice.
  if (a.duration) {
    const ratio = (2 * flight.hours) / (ctx.days * 24);
    const travel = ratio <= 0.08 ? 1 : clamp(1 - (ratio - 0.08) / 0.2);
    const [min, max] = dest.days;
    // Someone working remotely happily spends a month in a city seen in a week.
    const tooLong = ctx.days > max * 1.8 && a.companion !== 'nomad';
    const length = ctx.days < min ? Math.max(0.25, 1 - ((min - ctx.days) / min) * 1.2) : tooLong ? 0.7 : 1;
    add('tripFit', 0.5 * travel + 0.5 * length);
  }

  if (a.companion) {
    const c = a.companion;
    let s: number;
    if (c === 'solo') s = 0.5 * (f.safety / 5) + 0.25 * (f.carfree / 5) + 0.25 * (Math.max(f.nightlife ?? 0, f.homestay ?? 0) / 5);
    else if (c === 'couple') s = f.romance / 5;
    else if (c === 'family_young')
      s = (f.family / 5) * (dest.malaria ? 0.6 : 1) * (dest.altitude ? 0.7 : 1) * (flight.hours > 11 ? 0.85 : 1);
    else if (c === 'family_teens')
      s = 0.6 * (f.family / 5) + 0.4 * Math.max(sv('adventure'), sv('beach'), sv('wildlife'), (f.city ?? 0) / 5);
    else if (c === 'friends')
      s = 0.5 * (Math.max(f.nightlife ?? 0, sv('adventure') * 5) / 5) + 0.3 * Math.max(sv('beach'), sv('roadtrip'), (f.city ?? 0) / 5) + 0.2 * (f.food / 5);
    else s = (f.nomad / 5) * (ctx.days >= 14 ? 1 : 0.9);
    add('companion', s);
  }

  if (a.lodging) {
    const l = a.lodging;
    const s =
      l === 'homestay' ? Math.max(0.3, (f.homestay ?? 0) / 5)
      : l === 'boutique' ? 0.5 * ((f.heritage ?? 0) / 5) + 0.5 * (f.comfort / 5)
      : l === 'apartment' ? 0.5 + 0.5 * (Math.max(f.city ?? 0, f.heritage ?? 0, f.nomad) / 5)
      : l === 'eco' ? Math.max(0.2, (f.eco ?? 0) / 5)
      : l === 'camping' ? Math.max(0.15, sv('camping'))
      : f.luxury / 5;
    add('lodging', s, l === 'boutique' || l === 'apartment' ? 1 : 1.5);
  }

  if (a.vibes?.length) {
    const fits: Record<Vibe, () => number> = {
      serenity: () => 0.45 * sv('relax') + 0.3 * ((f.wellness ?? 0) / 5) + 0.25 * ((5 - f.crowds) / 5),
      wonder: () => topMean((['mountain', 'lake', 'volcano', 'desert', 'snow', 'jungle', 'island', 'wildlife', 'sky', 'savanna'] as FeatureKey[]).map(sv), 3),
      culture_shock: () => (0.6 * f.exotic + 0.4 * (f.traditions ?? 0)) / 5,
      romance: () => f.romance / 5,
      adrenaline: () => 0.7 * sv('adventure') + 0.3 * Math.max(sv('hiking'), sv('surf')),
      festive: () => (0.6 * (f.nightlife ?? 0) + 0.4 * (f.music ?? 0)) / 5,
      gourmet: () => f.food / 5,
      learn: () => topMean((['history', 'art', 'traditions', 'spiritual'] as FeatureKey[]).map(sv), 2),
    };
    add('vibes', mean(a.vibes.map((v) => fits[v]())));
  }

  // Free-text wishes, each one a small criterion of its own.
  for (const wish of ctx.wishes) {
    let v: number;
    if (wish.key === 'quiet') v = (5 - f.crowds) / 5;
    else if (wish.key === 'cheap') v = clamp((150 - dest.cost) / 110);
    else v = sv(wish.key);
    add('notes', wish.negated ? 1 - v : v);
  }

  // Deal-breakers.
  const c = new Set(a.constraints ?? []);
  if (c.has('safety') && f.safety <= 3) penalties.push({ factor: f.safety <= 2 ? 0.35 : 0.8, note: 'Sécurité à surveiller' });
  if (c.has('no_visa') && dest.visa !== 'none') penalties.push({ factor: dest.visa === 'required' ? 0.4 : 0.8, note: 'Visa ou autorisation à prévoir' });
  if (c.has('no_malaria') && dest.malaria) penalties.push({ factor: 0.3, note: 'Zone de paludisme' });
  if (c.has('jetlag')) {
    const lag = Math.abs(dest.utc - ORIGINS[ctx.origin].utc);
    if (lag > 3) penalties.push({ factor: 0.3, note: `${Math.round(lag)} h de décalage horaire` });
  }
  if (c.has('no_altitude') && dest.altitude) penalties.push({ factor: 0.35, note: 'Séjour en haute altitude' });
  if (c.has('car_free') && f.carfree <= 2) penalties.push({ factor: f.carfree <= 1 ? 0.5 : 0.75, note: 'Difficile sans voiture' });
  if (c.has('french') && dest.french < 2) penalties.push({ factor: dest.french === 0 ? 0.45 : 0.8, note: 'On y parle peu français' });
  if (c.has('wifi') && f.nomad <= 3) penalties.push({ factor: f.nomad <= 2 ? 0.5 : 0.85, note: 'Connexion inégale' });

  if (a.zones?.length && !a.zones.includes('all') && !dest.zones.some((z) => a.zones!.includes(z))) {
    penalties.push({ factor: 0.05, note: 'Hors des régions choisies' });
  }

  const totalW = criteria.reduce((sum, c) => sum + c.w, 0);
  const base = totalW ? criteria.reduce((sum, c) => sum + c.w * c.s, 0) / totalW : 0.5;
  const factor = penalties.reduce((p, x) => p * x.factor, 1);
  return { score: base * factor, criteria, penalties };
}

/* ------------------------------------------------------------------------ */
/* Explanations                                                              */
/* ------------------------------------------------------------------------ */

function strongest(dest: Destination, keys: FeatureKey[], month: number, n: number): string[] {
  return keys
    .map((k) => ({ k, v: seasonal(dest, k, month) }))
    .filter((x) => x.v >= 3)
    .sort((a, b) => b.v - a.v)
    .slice(0, n)
    .map((x) => FEATURE_LABELS[x.k]);
}

function explain(
  dest: Destination,
  month: number,
  ctx: Context,
  flight: FlightEstimate,
  cost: CostEstimate,
  ev: MonthEvaluation
): { reasons: string[]; caveats: string[] } {
  const a = ctx.answers;
  const t = dest.climate.t[month];
  const rain = Number(dest.climate.r[month]);
  const by = new Map(ev.criteria.map((c) => [c.key, c]));
  const reasons: { text: string; weight: number }[] = [];
  const caveats: { text: string; weight: number }[] = [];
  const good = (key: CriterionKey, min = 0.72) => {
    const c = by.get(key);
    return c && c.s >= min ? c : undefined;
  };
  const bad = (key: CriterionKey, max = 0.45) => {
    const c = by.get(key);
    return c && c.s <= max ? c : undefined;
  };
  const monthName = MONTHS[month].toLowerCase();
  const rainWord = ['un temps sec', 'quelques averses', 'des pluies fréquentes', 'la saison des pluies'][rain];

  let c = good('climate');
  if (c) reasons.push({ text: `En ${monthName}, ${Math.round(t)} °C en journée et ${rainWord}.`, weight: c.w * c.s });
  c = bad('climate');
  if (c) {
    const wishes = (a.climate ?? []).filter((x): x is Exclude<ClimateChoice, 'any'> => x !== 'any');
    const tempOk = !wishes.length || Math.max(...wishes.map((x) => tempFit(t, x))) > 0.6;
    const text = tempOk
      ? `En ${monthName}, attendez-vous à ${rainWord}.`
      : `En ${monthName}, ${Math.round(t)} °C en journée : ${t < (CLIMATE_RANGE[wishes[0]]?.[0] ?? 0) ? 'plus frais' : 'plus chaud'} que ce que vous cherchez.`;
    caveats.push({ text, weight: c.w * (1 - c.s) });
  }
  c = good('season', 0.99);
  if (c && a.when !== 'flexible') reasons.push({ text: `${MONTHS[month]} fait partie de la meilleure saison pour y aller.`, weight: c.w * 0.8 });
  c = bad('season', 0.6);
  if (c && Array.isArray(a.when)) caveats.push({ text: `${MONTHS[month]} n’est pas la période idéale pour ce voyage.`, weight: c.w * 0.4 });

  c = good('landscapes');
  if (c) {
    const list = strongest(dest, a.landscapes ?? [], month, 3);
    if (list.length) reasons.push({ text: `Les décors que vous aimez : ${joinFr(list)}.`, weight: c.w * c.s });
  }
  c = bad('landscapes', 0.4);
  if (c) caveats.push({ text: 'Peu des paysages que vous recherchez.', weight: c.w * (1 - c.s) });

  c = good('activities');
  if (c) {
    const list = strongest(dest, a.activities ?? [], month, 3);
    if (list.length) reasons.push({ text: `Idéal pour ${joinFr(list)}.`, weight: c.w * c.s });
  }
  c = bad('activities', 0.4);
  if (c) caveats.push({ text: 'Peu adapté aux activités que vous aimez à cette période.', weight: c.w * (1 - c.s) });

  c = good('culture');
  if (c) {
    const list = strongest(dest, (a.culture ?? []).filter((x): x is CultureKey => x !== 'none'), month, 3);
    if (list.length) reasons.push({ text: `Une destination forte pour ${joinFr(list)}.`, weight: c.w * c.s });
  }

  c = good('budget', 0.99);
  if (c) reasons.push({ text: `Environ ${euros(cost.total)} par personne pour ${cost.days} jours, vols compris : dans votre budget.`, weight: c.w * 0.9 });
  c = bad('budget', 0.7);
  if (c && a.budget) {
    const cap = BUDGET_CAP[a.budget];
    caveats.push({
      text:
        cost.low <= cap
          ? `Budget serré : ~${euros(cost.total)} à votre standard, ~${euros(cost.low)} en voyageant simplement.`
          : `Au-dessus de votre budget : ~${euros(cost.total)} par personne.`,
      weight: c.w * (1 - c.s) + 1,
    });
  }

  const stopsText = flight.stops === 0 ? 'vol direct' : flight.stops === 1 ? '1 escale' : `${flight.stops} escales`;
  c = good('access', 0.99);
  if (c && flight.hours <= 6) reasons.push({ text: `À ${hoursLabel(flight.hours)} de ${ORIGINS[ctx.origin].city} (${stopsText}).`, weight: c.w * 0.7 });

  c = bad('tripFit', 0.55);
  if (c) {
    const [min] = dest.days;
    caveats.push({
      text: ctx.days < min ? `Mérite au moins ${min} jours sur place.` : `Long trajet (${hoursLabel(flight.hours)}) pour un séjour de ${ctx.days} jours.`,
      weight: c.w * (1 - c.s),
    });
  }

  c = good('crowd', 0.8);
  if (c) {
    const text = a.crowd === 'lively' ? 'Une destination vibrante, qui bouge jour et nuit.' : a.crowd === 'balanced' ? 'Les grands classiques, avec des échappées plus calmes.' : 'Loin des foules : une destination encore préservée.';
    reasons.push({ text, weight: c.w * c.s * 0.8 });
  }
  c = bad('crowd', 0.35);
  if (c) caveats.push({ text: a.crowd === 'lively' ? 'Plutôt calme, peu de vie nocturne.' : 'Très fréquenté, surtout en haute saison.', weight: c.w * (1 - c.s) });

  c = good('exotic', 0.99);
  if (c && a.exotic) reasons.push({ text: a.exotic >= 4 ? 'Un vrai choc culturel, comme vous le souhaitez.' : a.exotic <= 2 ? 'Dépaysant sans être déroutant.' : 'Le bon dosage de dépaysement.', weight: c.w * 0.7 });
  c = bad('exotic', 0.34);
  if (c && a.exotic) caveats.push({ text: a.exotic > dest.f.exotic ? 'Moins dépaysant que ce que vous cherchez.' : 'Plus déroutant que ce que vous cherchez.', weight: c.w * (1 - c.s) });

  c = good('food', 0.8);
  if (c) {
    const hits = (a.cuisines ?? []).filter((x) => dest.cuisine.includes(x)).map((x) => CUISINE_LABELS[x]);
    reasons.push({ text: hits.length ? `Une cuisine ${joinFr(hits)} réputée.` : 'Une gastronomie réputée.', weight: c.w * c.s });
  }

  c = good('companion', 0.8);
  if (c && a.companion) {
    const text = {
      solo: 'Sûr et facile à parcourir en solo.',
      couple: 'Très romantique : parfait à deux.',
      family_young: 'Idéal avec de jeunes enfants.',
      family_teens: 'De quoi occuper toute la famille, ados compris.',
      friends: 'Parfait pour un voyage entre amis.',
      nomad: 'Bien équipé pour travailler à distance.',
    }[a.companion];
    reasons.push({ text, weight: c.w * c.s * 0.8 });
  }
  if (a.companion === 'family_young' && dest.malaria && !(a.constraints ?? []).includes('no_malaria')) {
    caveats.push({ text: 'Zone de paludisme : traitement préventif à voir avec votre médecin.', weight: 1.5 });
  }

  c = good('vibes', 0.75);
  if (c && a.vibes?.length) reasons.push({ text: `Parfait pour ${joinFr(a.vibes.map((v) => VIBE_LABELS[v]))}.`, weight: c.w * c.s });

  const liked = ctx.wishes.filter((w) => !w.negated && (w.key === 'quiet' || w.key === 'cheap' || seasonal(dest, w.key, month) >= 3.5));
  if (liked.length) reasons.push({ text: `Répond à vos envies : ${joinFr(liked.map((w) => w.label))}.`, weight: 2.5 });

  for (const p of ev.penalties) caveats.push({ text: `${p.note}.`, weight: 5 * (1 - p.factor) });

  const pick = (xs: { text: string; weight: number }[], n: number) =>
    [...new Map(xs.sort((x, y) => y.weight - x.weight).map((x) => [x.text, x])).values()].slice(0, n).map((x) => x.text);

  return { reasons: pick(reasons, 4), caveats: pick(caveats, 3) };
}

/* ------------------------------------------------------------------------ */
/* Public API                                                                */
/* ------------------------------------------------------------------------ */

function context(answers: QuizAnswers): Context {
  const boosted = new Set<CriterionKey>();
  for (const p of answers.priorities ?? []) for (const k of PRIORITY_CRITERIA[p]) boosted.add(k);
  return {
    answers,
    origin: answers.origin ?? 'paris',
    days: DURATION_DAYS[answers.duration ?? 'week'],
    wishes: parseWishes(answers.notes),
    boosted,
  };
}

function allowedMonths(answers: QuizAnswers): number[] {
  return Array.isArray(answers.when) && answers.when.length ? answers.when : [...Array(12).keys()];
}

export function scoreDestination(dest: Destination, answers: QuizAnswers, ctx = context(answers)): MatchResult {
  const flight = estimateFlight(dest, ctx.origin);
  const cost = estimateCost(dest, answers, flight, ctx.days);

  let best: { month: number; ev: MonthEvaluation } | null = null;
  for (const month of allowedMonths(answers)) {
    const ev = evaluate(dest, month, ctx, flight, cost);
    // Ties go to the recommended season, then to the earliest month.
    const tieBreak = dest.climate.best[month] === '1' ? 1e-6 : 0;
    if (!best || ev.score + tieBreak > best.ev.score + (dest.climate.best[best.month] === '1' ? 1e-6 : 0)) {
      best = { month, ev };
    }
  }
  const { month, ev } = best!;
  const { reasons, caveats } = explain(dest, month, ctx, flight, cost, ev);

  return {
    dest,
    score: ev.score,
    pct: Math.round(ev.score * 100),
    month,
    flightHours: flight.hours,
    stops: flight.stops,
    cost,
    criteria: ev.criteria,
    reasons,
    caveats,
  };
}

export function rankDestinations(answers: QuizAnswers): MatchResult[] {
  const ctx = context(answers);
  return DESTINATIONS.map((d) => scoreDestination(d, answers, ctx)).sort((x, y) => y.score - x.score);
}

/** Same country and same part of the world count as one “place” for variety. */
const placeKey = (m: MatchResult) => `${m.dest.country}|${m.dest.zones[0]}`;

/**
 * Keeps the podium from being three takes on one country or one corner of the
 * map. Repeats cost a few points rather than being banned, so variety only
 * breaks near-ties and never promotes a clearly worse match.
 */
function diversify(ranked: MatchResult[], count: number, answers: QuizAnswers, taken: MatchResult[] = []): MatchResult[] {
  const narrowed = !!answers.zones?.length && !answers.zones.includes('all') && answers.zones.length <= 2;
  const countryCost = taken.length ? 0.06 : 0.12;
  const zoneCost = narrowed ? 0 : 0.025;
  const pool = ranked.filter((m) => !taken.includes(m)).slice(0, 40);
  const picks: MatchResult[] = [];

  while (picks.length < count && pool.length) {
    const chosen = [...taken, ...picks];
    let best = 0;
    let bestScore = -Infinity;
    pool.forEach((m, i) => {
      const sameCountry = chosen.filter((x) => placeKey(x) === placeKey(m)).length;
      const sameZone = chosen.filter((x) => x.dest.zones[0] === m.dest.zones[0]).length;
      const adjusted = m.score - countryCost * sameCountry - zoneCost * sameZone;
      if (adjusted > bestScore) {
        bestScore = adjusted;
        best = i;
      }
    });
    picks.push(pool.splice(best, 1)[0]);
  }
  return picks.sort((x, y) => y.score - x.score);
}

export function recommend(answers: QuizAnswers): Recommendation {
  const ranking = rankDestinations(answers);
  const podium = diversify(ranking, 3, answers);
  const alternatives = diversify(ranking, 6, answers, podium);
  return { podium, alternatives, ranking, profile: buildProfile(answers) };
}

/** How many destinations still fit well — the live counter during the quiz. */
export function countStrongMatches(answers: QuizAnswers, threshold = 0.7): number {
  const ranking = rankDestinations(answers);
  // Nothing discriminating answered yet (only the departure airport): all still in play.
  if (ranking.every((m) => m.criteria.length === 0)) return ranking.length;
  return ranking.filter((m) => m.score >= threshold).length;
}

