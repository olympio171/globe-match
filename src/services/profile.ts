import type { QuizAnswers, TravellerProfile } from '../types';

type Axis = 'nature' | 'shore' | 'culture' | 'thrill' | 'calm' | 'gourmet' | 'night' | 'luxe' | 'roots' | 'tribe';

const ARCHETYPES: Record<Axis, { title: string; description: string; trait: string }> = {
  nature: {
    title: 'L’Explorateur des grands espaces',
    description: 'Vous voyagez pour les panoramas qui se méritent : sommets, glaciers, déserts et forêts. Le confort passe après l’émerveillement.',
    trait: 'Amoureux de nature',
  },
  shore: {
    title: 'L’Épicurien des rivages',
    description: 'Eau turquoise, sable chaud et temps suspendu : votre voyage idéal se vit pieds nus, au rythme des marées.',
    trait: 'Accro aux lagons',
  },
  culture: {
    title: 'Le Curieux des civilisations',
    description: 'Temples, musées, ruelles chargées d’histoire : vous voyagez pour comprendre le monde et ceux qui l’habitent.',
    trait: 'Passionné de culture',
  },
  thrill: {
    title: 'L’Aventurier intrépide',
    description: 'Défis, frissons et levers aux aurores : pour vous, un voyage réussi se raconte avec des histoires à couper le souffle.',
    trait: 'Goût de l’aventure',
  },
  calm: {
    title: 'Le Contemplatif',
    description: 'Lenteur, beauté et silence : vous cherchez des lieux qui apaisent et laissent le temps de rêver.',
    trait: 'Adepte du slow travel',
  },
  gourmet: {
    title: 'Le Gourmet nomade',
    description: 'Vous choisissez vos destinations avec les papilles : marchés, tables de quartier et spécialités locales rythment vos journées.',
    trait: 'Fin gourmet',
  },
  night: {
    title: 'L’Oiseau de nuit',
    description: 'Musique live, rencontres et nuits blanches : vous aimez les destinations qui vibrent jusqu’à l’aube.',
    trait: 'Noctambule',
  },
  luxe: {
    title: 'L’Esthète raffiné',
    description: 'Adresses d’exception, service impeccable et beauté partout : vous voyagez pour vous offrir le meilleur.',
    trait: 'Exigeant',
  },
  roots: {
    title: 'Le Routard au long cours',
    description: 'Petit budget, grand appétit de découverte : l’authenticité d’une guesthouse vous parle plus que le confort d’un palace.',
    trait: 'Voyageur malin',
  },
  tribe: {
    title: 'La Tribu en vadrouille',
    description: 'Des souvenirs pour petits et grands : vous cherchez des destinations faciles, sûres et pleines de découvertes à partager.',
    trait: 'Esprit tribu',
  },
};

/** Reads the answers as a handful of tendencies and names the strongest one. */
export function buildProfile(a: QuizAnswers): TravellerProfile {
  const s: Record<Axis, number> = {
    nature: 0, shore: 0, culture: 0, thrill: 0, calm: 0, gourmet: 0, night: 0, luxe: 0, roots: 0, tribe: 0,
  };
  const has = <T,>(list: T[] | undefined, ...items: T[]) => items.filter((i) => list?.includes(i)).length;

  s.nature += has(a.landscapes, 'mountain', 'lake', 'jungle', 'forest', 'desert', 'volcano', 'snow', 'savanna');
  s.nature += has(a.activities, 'hiking', 'wildlife', 'sky') + 2 * has(a.vibes, 'wonder');
  s.shore += 2 * has(a.landscapes, 'beach', 'island') + has(a.activities, 'diving', 'surf', 'relax', 'boat');
  s.culture += 1.2 * (a.culture ?? []).filter((c) => c !== 'none').length + has(a.landscapes, 'heritage') + 2 * has(a.vibes, 'learn', 'culture_shock');
  s.thrill += (a.pace === 'intense' ? 2.5 : a.pace === 'active' ? 1 : 0) + has(a.activities, 'adventure', 'ski', 'roadtrip') + 2 * has(a.vibes, 'adrenaline');
  s.calm += (a.pace === 'lazy' ? 2 : a.pace === 'slow' ? 1.5 : 0) + 0.5 * has(a.activities, 'wellness') + 2 * has(a.vibes, 'serenity') + (a.crowd === 'wild' || a.crowd === 'calm' ? 0.5 : 0);
  s.gourmet += Math.max(0, (a.foodImportance ?? 3) - 3) * 1.5 + 2 * has(a.vibes, 'gourmet') + has(a.activities, 'wine', 'markets');
  s.night += 1.5 * has(a.activities, 'nightlife') + 2 * has(a.vibes, 'festive') + has(a.culture, 'music') + (a.crowd === 'lively' ? 1 : 0);
  s.luxe += (a.budget === 'b6000' || a.budget === 'unlimited' ? 2 : 0) + (a.lodging === 'luxury' ? 2.5 : 0) + has(a.vibes, 'romance');
  s.roots += (a.budget === 'b700' || a.budget === 'b1300' ? 1.5 : 0) + (a.lodging === 'homestay' || a.lodging === 'camping' ? 1.5 : 0) + ((a.exotic ?? 0) >= 4 ? 1 : 0) + (a.duration === 'month' ? 1 : 0);
  s.tribe += a.companion === 'family_young' ? 4 : a.companion === 'family_teens' ? 3 : 0;

  const ranked = (Object.keys(s) as Axis[]).filter((k) => s[k] > 0).sort((x, y) => s[y] - s[x]);
  const lead = ranked[0] ?? 'culture';
  const archetype = ARCHETYPES[lead];
  return {
    title: archetype.title,
    description: archetype.description,
    traits: (ranked.length ? ranked : ['culture' as Axis]).slice(0, 3).map((k) => ARCHETYPES[k].trait),
  };
}
