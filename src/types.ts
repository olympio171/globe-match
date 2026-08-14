export type CompanionType = 'solo' | 'couple' | 'family' | 'friends' | 'digital_nomad';
export type DurationType = 'weekend' | 'one_to_two_weeks' | 'three_weeks_to_month' | 'long_travel';
export type TravelPace = 'relaxation' | 'balanced' | 'active_explorer' | 'intense_adventure';
export type ClimatePreference = 'tropical_warm' | 'temperate_mild' | 'cool_mountain' | 'cold_snow' | 'any';
export type CrowdPreference = 'secret_hidden' | 'balanced_mix' | 'vibrant_lively';
export type BudgetTier = 'backpacker' | 'moderate' | 'comfort' | 'luxury';
export type FlightDurationMax = 'short' | 'medium' | 'long';
export type ContinentChoice = 'all' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'middle_east';
export type SeasonChoice = 'any' | 'spring' | 'summer' | 'autumn' | 'winter';

export interface QuizAnswers {
  // Stage 1: Profil & Compagnons
  companion: CompanionType;
  duration: DurationType;
  pace: TravelPace;
  
  // Stage 2: Climat & Nature
  climate: ClimatePreference;
  landscapes: string[]; // e.g. ['beaches', 'mountains', 'forests', 'deserts', 'historic_cities', 'countryside']
  crowdPreference: CrowdPreference;
  
  // Stage 3: Culture & Patrimoine
  culturalInterests: string[]; // e.g. ['ancient_history', 'art_museums', 'local_traditions', 'music_festivals', 'crafts_markets', 'architecture']
  accommodationStyle: string; // 'homestay', 'authentic_boutique', 'luxury_resort', 'eco_lodge'
  
  // Stage 4: Gastronomie
  foodImportance: number; // 1 to 5
  foodFlavors: string[]; // e.g. ['spicy_exotic', 'mediterranean_fresh', 'comfort_traditional', 'asian_sweet_savory', 'seafood']
  
  // Stage 5: Activités & Loisirs
  favoriteActivities: string[]; // e.g. ['hiking_outdoor', 'cultural_visits', 'water_sports', 'nightlife_shopping', 'wellness_spa', 'safari_wildlife']
  physicalIntensity: number; // 1 (Zen/Facile) to 5 (Extrême)
  
  // Stage 6: Budget & Logistique
  budgetTier: BudgetTier;
  flightMax: FlightDurationMax;
  continentsPreferred: ContinentChoice[];
  travelSeason: SeasonChoice;
  tripVibe: string; // 'disconnection', 'cultural_shock', 'romance', 'adrenaline', 'festive'
  additionalNotes?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlight: string;
}

export interface BudgetBreakdown {
  currency: string;
  flightEstimatePerPerson: number;
  lodgingPerNight: number;
  foodPerDayPerPerson: number;
  activitiesPerDayPerPerson: number;
  totalEstimated7DaysPerPerson: number;
  budgetTip: string;
}

export interface DestinationRecommendation {
  id: string;
  name: string;
  country: string;
  continent: string;
  region: string;
  matchScore: number; // 0-100
  tagline: string;
  coverImage: string;
  matchBadges: string[];
  whyPerfect: string;
  summary: string;
  bestSeasons: string[];
  weatherExpected: string;
  flightTimeFromEurope: string;
  idealDuration: string;
  vibe: string;
  highlights: string[];
  gastronomy: {
    mustTryDishes: string[];
    specialtyDesc: string;
    foodieSpot: string;
  };
  budget: BudgetBreakdown;
  itinerary: DayItinerary[];
  practicalTips: {
    visa: string;
    currency: string;
    languages: string;
    safetyLevel: string;
    localTransport: string;
    insiderSecret: string;
  };
  aiCustomAnalysis?: string;
}

export interface RecommendationResponse {
  topDestinations: DestinationRecommendation[];
  userProfileSummary: {
    archetypeTitle: string;
    archetypeDesc: string;
    dominantTraits: string[];
  };
  generatedWithAi: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

/**
 * Progress events streamed by /api/recommendations as NDJSON, one per line.
 * Each one marks a real unit of work that has actually finished — the loading
 * screen advances on these and on nothing else.
 */
export type ProgressEvent =
  | { phase: 'scoring'; poolSize: number; criteria: number }
  | { phase: 'scored'; kept: number; topName: string }
  | { phase: 'ai_start'; model: string }
  | { phase: 'ai_fallback'; from: string; to: string; status: string }
  | { phase: 'ai_done'; model: string }
  | { phase: 'ai_failed'; status: string }
  | { phase: 'ai_skipped' }
  | { phase: 'result'; payload: RecommendationResponse };

export type LoadingStepState = 'pending' | 'active' | 'done' | 'skipped' | 'failed';

export interface LoadingStep {
  id: string;
  label: string;
  /** Real detail filled in once the step reports back (model used, count…). */
  detail?: string;
  state: LoadingStepState;
}
