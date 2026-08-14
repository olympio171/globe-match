import { QuizAnswers, DestinationRecommendation, RecommendationResponse } from '../types';
import { CURATED_DESTINATIONS, CuratedDestination } from '../data/curatedDestinations';


/**
 * One scoring criterion applied to one destination.
 *
 * `possible` is the weight this criterion can contribute *given this user's
 * answers*. A criterion the traveller left open — no flight limit, no flavour
 * preference — contributes 0 to both sides instead of silently capping the
 * score. That is what makes the final percentage an honest "share of what you
 * actually asked for that this place delivers", rather than a decoration.
 */
interface Criterion {
  earned: number;
  possible: number;
  badge?: string;
}

function scoreDestination(
  dest: CuratedDestination,
  answers: QuizAnswers
): { affinity: number; badges: string[] } {
  const criteria: Criterion[] = [];

  // 1. Continent — an explicit exclusion is penalised, not merely unrewarded.
  const prefersAll = answers.continentsPreferred.includes('all');
  const continentOk =
    prefersAll || answers.continentsPreferred.includes(dest.attributes.continentTag as any);
  criteria.push({ earned: continentOk ? 15 : -25, possible: 15 });

  // 2. Budget
  const budgetOk = dest.attributes.budgetTiers.includes(answers.budgetTier);
  criteria.push({
    earned: budgetOk ? 15 : -5,
    possible: 15,
    badge: budgetOk ? 'Budget Calibré' : undefined,
  });

  // 3. Flight time. Stating no limit means the criterion is satisfied — it used
  //    to award nothing at all, which quietly capped every long-haul profile.
  const flightCat = dest.attributes.flightCategory;
  let flightEarned = 12;
  let flightBadge: string | undefined;
  if (answers.flightMax === 'short') {
    flightEarned = flightCat === 'short' ? 12 : flightCat === 'medium' ? 0 : -20;
    if (flightCat === 'short') flightBadge = 'Court-Courrier (<4h)';
  } else if (answers.flightMax === 'medium') {
    flightEarned = flightCat === 'long' ? -8 : 12;
  }
  criteria.push({ earned: flightEarned, possible: 12, badge: flightBadge });

  // 4. Climate
  const climateOk = answers.climate === 'any' || dest.attributes.climates.includes(answers.climate);
  criteria.push({
    earned: climateOk ? 12 : 0,
    possible: 12,
    badge: climateOk ? 'Météo Idéale' : undefined,
  });

  // 5. Landscapes
  const landscapeHits = dest.attributes.landscapes.filter((l) =>
    answers.landscapes.includes(l)
  ).length;
  criteria.push({
    earned: Math.min(15, landscapeHits * 6),
    possible: answers.landscapes.length ? 15 : 0,
    badge: landscapeHits ? 'Décors Rêvés' : undefined,
  });

  // 6. Cultural interests
  const cultureHits = dest.attributes.culturalTags.filter((c) =>
    answers.culturalInterests.includes(c)
  ).length;
  criteria.push({
    earned: Math.min(12, cultureHits * 5),
    possible: answers.culturalInterests.length ? 12 : 0,
    badge: cultureHits ? 'Richesse Culturelle' : undefined,
  });

  // 7. Pace & companions
  const paceOk = dest.attributes.pace.includes(answers.pace);
  criteria.push({
    earned: paceOk ? 8 : 0,
    possible: 8,
    badge: paceOk ? 'Rythme Parfait' : undefined,
  });
  criteria.push({
    earned: dest.attributes.companions.includes(answers.companion) ? 6 : 0,
    possible: 6,
  });

  // 8. Gastronomy — only weighed for travellers who said food matters to them.
  if (answers.foodImportance >= 4) {
    const foodOk = dest.attributes.foodImportanceMin >= 3;
    criteria.push({
      earned: foodOk ? 8 : 0,
      possible: 8,
      badge: foodOk ? 'Paradis Gastronomique' : undefined,
    });
  }
  if (answers.foodFlavors.length) {
    const flavourHit = dest.attributes.foodFlavors.some((f) => answers.foodFlavors.includes(f));
    criteria.push({ earned: flavourHit ? 5 : 0, possible: 5 });
  }

  // 9. Vibe
  criteria.push({
    earned: dest.attributes.vibes.includes(answers.tripVibe) ? 8 : 0,
    possible: 8,
  });

  // 10. Season
  const seasonOk =
    answers.travelSeason === 'any' || dest.attributes.seasons.includes(answers.travelSeason);
  criteria.push({ earned: seasonOk ? 6 : 0, possible: 6 });

  const earned = criteria.reduce((sum, c) => sum + c.earned, 0);
  const possible = criteria.reduce((sum, c) => sum + c.possible, 0);

  return {
    affinity: Math.max(0, Math.min(100, Math.round((earned / possible) * 100))),
    badges: criteria.map((c) => c.badge).filter((b): b is string => Boolean(b)),
  };
}

/** Keeps the podium from being three variations on the same corner of the map. */
const MAX_PER_CONTINENT = 2;

export function calculateDestinationMatches(answers: QuizAnswers): RecommendationResponse {
  const scored = CURATED_DESTINATIONS.map((dest) => {
    const { affinity, badges } = scoreDestination(dest, answers);
    return {
      continentTag: dest.attributes.continentTag,
      destination: {
        ...dest,
        matchScore: affinity,
        // Answer-derived badges first, padded with the destination's own.
        matchBadges: Array.from(new Set([...badges, ...dest.matchBadges])).slice(0, 4),
      } as DestinationRecommendation,
      affinity,
    };
  });

  scored.sort((a, b) => b.affinity - a.affinity);

  // The diversity rule only applies to travellers who left the map open. If
  // someone explicitly narrowed the search to one or two continents, forcing a
  // third pick from elsewhere would override the answer they actually gave.
  const openToTheWorld =
    answers.continentsPreferred.includes('all') || answers.continentsPreferred.length >= 3;

  const podium: typeof scored = [];

  if (openToTheWorld) {
    const perContinent = new Map<string, number>();
    for (const entry of scored) {
      if (podium.length === 3) break;
      const used = perContinent.get(entry.continentTag) ?? 0;
      if (used >= MAX_PER_CONTINENT) continue;
      perContinent.set(entry.continentTag, used + 1);
      podium.push(entry);
    }
  }

  // Straight ranking for narrowed searches, and a safety net if the rule above
  // could not fill three slots.
  for (const entry of scored) {
    if (podium.length === 3) break;
    if (!podium.includes(entry)) podium.push(entry);
  }

  return {
    topDestinations: podium.map((entry) => entry.destination),
    userProfileSummary: determineTravelerArchetype(answers),
    generatedWithAi: false,
  };
}


function determineTravelerArchetype(answers: QuizAnswers): {
  archetypeTitle: string;
  archetypeDesc: string;
  dominantTraits: string[];
} {
  const traits: string[] = [];

  if (answers.pace === 'intense_adventure' || answers.physicalIntensity >= 4) {
    traits.push('Aventurier Intrépide');
  } else if (answers.pace === 'relaxation') {
    traits.push('Slow Traveler Contemplatif');
  } else {
    traits.push('Explorateur Curieux');
  }

  if (answers.foodImportance >= 4) {
    traits.push('Gourmet Passionné');
  }

  if (answers.culturalInterests.includes('ancient_history') || answers.culturalInterests.includes('art_museums')) {
    traits.push('Amateur de Patrimoine & Histoire');
  }

  if (answers.landscapes.includes('mountains') || answers.landscapes.includes('forests')) {
    traits.push('Amoureux de Nature Sauvage');
  } else if (answers.landscapes.includes('beaches')) {
    traits.push('Inconditionnel des Rivages d’Azur');
  }

  let archetypeTitle = 'L’Explorateur Humaniste & Épicurien';
  let archetypeDesc = 'Vous concevez le voyage comme un équilibre subtil entre émerveillement culturel, plaisirs de la table et immersion dans des paysages grandioses.';

  if (answers.tripVibe === 'adrenaline' || answers.physicalIntensity >= 4) {
    archetypeTitle = 'Le Conquérant des Grands Espaces';
    archetypeDesc = 'Votre moteur est le dépassement de soi, la pureté des éléments sauvages et la quête de panoramas bruts hors des sentiers battus.';
  } else if (answers.tripVibe === 'disconnection' || answers.pace === 'relaxation') {
    archetypeTitle = 'L’Esthète en Quête de Sérénité';
    archetypeDesc = 'Pour vous, le voyage parfait rime avec ressourcement profond, hébergements de caractère, lenteur bienfaisante et contemplation.';
  } else if (answers.tripVibe === 'romance') {
    archetypeTitle = 'Le Voyageur Poète & Romantique';
    archetypeDesc = 'Vous cherchez des atmosphères intemporelles, des lumières dorées, des ruelles chargées de charme et des moments de grâce partagés.';
  } else if (answers.tripVibe === 'cultural_shock') {
    archetypeTitle = 'Le Passionné de Civilisations & Dépaysement';
    archetypeDesc = 'Vous êtes attiré par les rituels séculaires, l’accueil sincère des habitants et le frisson d’une immersion culturelle totale.';
  }

  return {
    archetypeTitle,
    archetypeDesc,
    dominantTraits: traits.slice(0, 3)
  };
}
