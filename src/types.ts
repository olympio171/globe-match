/**
 * Every trait a destination is rated on, 0 (absent) to 5 (world class).
 * The same keys are used by the quiz options, the scoring engine and the
 * itinerary builder, so a typo anywhere is a type error rather than a
 * silently ignored criterion.
 */
export const LANDSCAPE_KEYS = [
  'beach', 'island', 'mountain', 'lake', 'jungle', 'forest', 'desert',
  'volcano', 'city', 'heritage', 'countryside', 'snow', 'savanna',
] as const;

export const ACTIVITY_KEYS = [
  'hiking', 'diving', 'surf', 'wildlife', 'ski', 'roadtrip', 'nightlife',
  'markets', 'wellness', 'relax', 'adventure', 'wine', 'boat', 'sky',
] as const;

export const CULTURE_KEYS = [
  'history', 'art', 'spiritual', 'traditions', 'architecture', 'music',
] as const;

/** Traits every destination must rate explicitly: no silent zero. */
export const BASE_KEYS = [
  'food', 'exotic', 'crowds', 'safety', 'comfort', 'family', 'romance',
  'nomad', 'luxury', 'carfree',
] as const;

/** Kinds of stay a place is especially good for. */
export const STAY_KEYS = ['eco', 'homestay', 'camping'] as const;

export type LandscapeKey = (typeof LANDSCAPE_KEYS)[number];
export type ActivityKey = (typeof ACTIVITY_KEYS)[number];
export type CultureKey = (typeof CULTURE_KEYS)[number];
export type BaseKey = (typeof BASE_KEYS)[number];
export type StayKey = (typeof STAY_KEYS)[number];
export type FeatureKey = LandscapeKey | ActivityKey | CultureKey | BaseKey | StayKey;

export const FEATURE_KEYS: readonly FeatureKey[] = [
  ...LANDSCAPE_KEYS,
  ...ACTIVITY_KEYS,
  ...CULTURE_KEYS,
  ...BASE_KEYS,
  ...STAY_KEYS,
];

export type Features = Record<BaseKey, number> & Partial<Record<FeatureKey, number>>;

export type Zone =
  | 'europe'
  | 'mena'
  | 'africa'
  | 'asia'
  | 'oceania'
  | 'north_america'
  | 'latin_america';

export type Cuisine =
  | 'spicy'
  | 'mediterranean'
  | 'asian'
  | 'terroir'
  | 'seafood'
  | 'streetfood'
  | 'veggie'
  | 'latin';

export type Origin = 'paris' | 'montreal';

export interface Experience {
  title: string;
  text: string;
  tags: FeatureKey[];
  /** How much of the trip it takes: 0.5 for a half day, 1, 2… */
  days: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  /** First zone is the primary one, used to keep the podium varied. */
  zones: Zone[];
  /** Latitude, longitude of the main arrival point. */
  coords: [number, number];
  /** Signature hue (OKLCH degrees) the interface takes on for this place. */
  hue: number;
  /** English Wikipedia article whose lead photo illustrates the place. */
  wiki: string;
  tagline: string;
  summary: string;
  climate: {
    /** Average daytime high, °C, January to December. */
    t: number[];
    /** Rain, one digit per month: 0 dry · 1 showers · 2 wet · 3 rainy season. */
    r: string;
    /** Recommended months, one digit per month: 1 recommended. */
    best: string;
  };
  /** Mid-range cost on site, € per person per day, flights excluded. */
  cost: number;
  /** Usual number of stops from [Paris, Montréal]. */
  stops: [number, number];
  /** Multiplier on the flight price model for poorly served routes. */
  flightFactor?: number;
  /** Stay length, in days, that does the place justice: [minimum, comfortable]. */
  days: [number, number];
  f: Features;
  cuisine: Cuisine[];
  /** Entry formalities for French / EU passports. */
  visa: 'none' | 'easy' | 'required';
  /** Standard-time UTC offset. */
  utc: number;
  /** How far French gets you: 0 barely, 1 in tourist spots, 2 widely spoken. */
  french: 0 | 1 | 2;
  malaria?: boolean;
  /** Much of the stay above ~2 500 m. */
  altitude?: boolean;
  /** Glaciers or permanent snow worth seeing in every season. */
  glaciers?: boolean;
  experiences: Experience[];
  dishes: string[];
  practical: {
    visa: string;
    money: string;
    language: string;
    transport: string;
    tip: string;
  };
  /** Where to extend the trip when there is time left. */
  nearby: string;
}

export interface DestinationImage {
  url: string;
  /** Author and licence, as published on Wikimedia Commons. */
  credit: string;
  /** Commons file page, for attribution. */
  source: string;
}

/* ------------------------------------------------------------------------ */
/* Quiz answers                                                              */
/* ------------------------------------------------------------------------ */

export type Companion = 'solo' | 'couple' | 'family_young' | 'family_teens' | 'friends' | 'nomad';
export type DurationChoice =
  | 'long_weekend'
  | 'short_week'
  | 'week'
  | 'two_weeks'
  | 'three_weeks'
  | 'month';
export type Pace = 'lazy' | 'slow' | 'balanced' | 'active' | 'intense';
export type ClimateChoice = 'scorching' | 'hot' | 'mild' | 'cool' | 'cold' | 'any';
export type CrowdChoice = 'wild' | 'calm' | 'balanced' | 'lively';
export type Lodging = 'homestay' | 'boutique' | 'luxury' | 'eco' | 'camping' | 'apartment';
export type BudgetChoice = 'b700' | 'b1300' | 'b2200' | 'b3500' | 'b6000' | 'unlimited';
export type FlightChoice = 'h3' | 'h5' | 'h8' | 'h12' | 'any';
export type Constraint =
  | 'safety'
  | 'no_visa'
  | 'no_malaria'
  | 'jetlag'
  | 'no_altitude'
  | 'car_free'
  | 'french'
  | 'wifi';
export type Vibe =
  | 'serenity'
  | 'wonder'
  | 'culture_shock'
  | 'romance'
  | 'adrenaline'
  | 'festive'
  | 'gourmet'
  | 'learn';
export type Priority =
  | 'weather'
  | 'budget'
  | 'scenery'
  | 'activities'
  | 'culture'
  | 'food'
  | 'calm'
  | 'exotic'
  | 'easy';

export interface QuizAnswers {
  origin?: Origin;
  companion?: Companion;
  duration?: DurationChoice;
  /** Months 0–11 the traveller can leave in; 'flexible' lets the engine pick. */
  when?: number[] | 'flexible';
  pace?: Pace;
  climate?: ClimateChoice[];
  landscapes?: LandscapeKey[];
  activities?: ActivityKey[];
  culture?: (CultureKey | 'none')[];
  /** 1 familiar surroundings … 5 total culture shock. */
  exotic?: number;
  crowd?: CrowdChoice;
  /** 1 food is fuel … 5 the trip is about food. */
  foodImportance?: number;
  cuisines?: Cuisine[];
  lodging?: Lodging;
  budget?: BudgetChoice;
  flightMax?: FlightChoice;
  zones?: (Zone | 'all')[];
  constraints?: Constraint[];
  vibes?: Vibe[];
  priorities?: Priority[];
  notes?: string;
}

/* ------------------------------------------------------------------------ */
/* Engine output                                                             */
/* ------------------------------------------------------------------------ */

export type CriterionKey =
  | 'climate'
  | 'season'
  | 'landscapes'
  | 'activities'
  | 'culture'
  | 'exotic'
  | 'crowd'
  | 'pace'
  | 'food'
  | 'budget'
  | 'access'
  | 'tripFit'
  | 'companion'
  | 'lodging'
  | 'vibes'
  | 'notes';

export interface CriterionResult {
  key: CriterionKey;
  label: string;
  /** Satisfaction, 0–1. */
  s: number;
  /** Weight this criterion carried for this traveller. */
  w: number;
}

export interface CostEstimate {
  flight: number;
  daily: number;
  days: number;
  /** Per person, flights included, at the traveller's chosen standard. */
  total: number;
  /** Per person travelling as simply as the place allows. */
  low: number;
}

export interface MatchResult {
  dest: Destination;
  /** 0–1, after deal-breaker penalties. */
  score: number;
  pct: number;
  /** Month the score was computed for (best among those allowed). */
  month: number;
  flightHours: number;
  stops: number;
  cost: CostEstimate;
  criteria: CriterionResult[];
  reasons: string[];
  caveats: string[];
}

export interface TravellerProfile {
  title: string;
  description: string;
  traits: string[];
}

export interface Recommendation {
  podium: MatchResult[];
  alternatives: MatchResult[];
  ranking: MatchResult[];
  profile: TravellerProfile;
}
