import type { Cuisine, FeatureKey, Vibe } from '../types';

/** How each trait reads in a sentence (“Idéal pour la plongée et la randonnée”). */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  beach: 'les plages',
  island: 'les îles et lagons',
  mountain: 'la montagne',
  lake: 'les lacs et cascades',
  jungle: 'la jungle',
  forest: 'les forêts',
  desert: 'le désert',
  volcano: 'les volcans',
  city: 'la vie urbaine',
  heritage: 'les villes anciennes',
  countryside: 'la campagne',
  snow: 'la neige et les glaciers',
  savanna: 'la savane',
  hiking: 'la randonnée',
  diving: 'la plongée',
  surf: 'la glisse',
  wildlife: 'la faune sauvage',
  ski: 'le ski',
  roadtrip: 'le road-trip',
  nightlife: 'les sorties',
  markets: 'les marchés',
  wellness: 'le bien-être',
  relax: 'le farniente',
  adventure: 'les sensations fortes',
  wine: 'les dégustations',
  boat: 'le bateau',
  sky: 'les ciels étoilés',
  history: 'l’histoire',
  art: 'l’art',
  spiritual: 'la spiritualité',
  traditions: 'les traditions',
  architecture: 'l’architecture',
  music: 'la musique',
  food: 'la gastronomie',
  exotic: 'le dépaysement',
  crowds: 'l’animation',
  safety: 'la sécurité',
  comfort: 'le confort',
  family: 'les familles',
  romance: 'le romantisme',
  nomad: 'le télétravail',
  luxury: 'le luxe',
  carfree: 'les déplacements sans voiture',
  eco: 'les écolodges',
  homestay: 'l’accueil chez l’habitant',
  camping: 'le camping',
};

/** Short noun used on bars and chips. */
export const FEATURE_SHORT: Partial<Record<FeatureKey, string>> = {
  beach: 'Plages', island: 'Îles', mountain: 'Montagne', lake: 'Lacs', jungle: 'Jungle',
  forest: 'Forêts', desert: 'Désert', volcano: 'Volcans', city: 'Ville', heritage: 'Patrimoine',
  countryside: 'Campagne', snow: 'Neige', savanna: 'Savane', hiking: 'Rando', diving: 'Plongée',
  surf: 'Surf', wildlife: 'Faune', ski: 'Ski', roadtrip: 'Road-trip', nightlife: 'Sorties',
  markets: 'Marchés', wellness: 'Bien-être', relax: 'Farniente', adventure: 'Aventure', wine: 'Vins',
  boat: 'Bateau', sky: 'Étoiles', history: 'Histoire', art: 'Art', spiritual: 'Spiritualité',
  traditions: 'Traditions', architecture: 'Architecture', music: 'Musique', food: 'Cuisine',
};

export const CUISINE_LABELS: Record<Cuisine, string> = {
  spicy: 'épicée',
  mediterranean: 'méditerranéenne',
  asian: 'asiatique',
  terroir: 'de terroir',
  seafood: 'de la mer',
  streetfood: 'de rue',
  veggie: 'végétarienne',
  latin: 'latino',
};

export const VIBE_LABELS: Record<Vibe, string> = {
  serenity: 'la sérénité',
  wonder: 'l’émerveillement',
  culture_shock: 'le dépaysement',
  romance: 'le romantisme',
  adrenaline: 'l’adrénaline',
  festive: 'la fête',
  gourmet: 'la gourmandise',
  learn: 'la découverte culturelle',
};

/** “A, B et C” */
export function joinFr(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

/** Regular no-break space: the narrow one (U+202F) is missing from many fonts. */
const NBSP = '\u00a0';

export function euros(n: number): string {
  return `${Math.round(n).toLocaleString('fr-FR').replace(/\s/g, NBSP)}${NBSP}€`;
}

export function hoursLabel(h: number): string {
  if (h < 1) return 'moins d’1 h';
  const whole = Math.floor(h);
  const half = h - whole >= 0.25 && h - whole < 0.75;
  const rounded = h - whole >= 0.75 ? whole + 1 : whole;
  return half ? `${whole} h 30` : `${rounded} h`;
}
