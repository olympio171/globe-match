import type { QuizAnswers } from '../types';

/**
 * How an answer colours the interface. `h` is an OKLCH hue in degrees, `w` how
 * strongly it pulls the palette, `name` the word used to describe the mood.
 */
export interface Tint {
  h: number;
  w?: number;
  name: string;
}

export interface QuizOption {
  id: string;
  label: string;
  hint?: string;
  icon?: string;
  tint?: Tint;
  /** Picking it clears every other option (e.g. “peu importe”). */
  exclusive?: boolean;
}

export type StepType = 'single' | 'multi' | 'scale' | 'months' | 'text';

export interface QuizStep {
  id: keyof QuizAnswers;
  chapter: number;
  question: string;
  subtitle: string;
  type: StepType;
  options?: QuizOption[];
  min?: number;
  max?: number;
  /** Labels for scale steps, index 0 = value 1. */
  scale?: { label: string; hint: string; tint?: Tint }[];
  /** How much this step's tints weigh in the palette. */
  tintWeight?: number;
  optional?: boolean;
  placeholder?: string;
}

export const CHAPTERS = ['Vous', 'Vos envies', 'Votre façon de voyager', 'L’essentiel'];

export const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
export const MONTHS_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

/** Tints of the months step, so a winter departure cools the palette. */
export const MONTH_TINTS: Tint[] = [
  { h: 245, name: 'givre' }, { h: 240, name: 'givre' }, { h: 150, name: 'bourgeon' },
  { h: 140, name: 'bourgeon' }, { h: 120, name: 'tilleul' }, { h: 90, name: 'blé' },
  { h: 70, name: 'soleil' }, { h: 60, name: 'soleil' }, { h: 55, name: 'miel' },
  { h: 40, name: 'rouille' }, { h: 30, name: 'rouille' }, { h: 250, name: 'givre' },
];

export const QUIZ_STEPS: QuizStep[] = [
  /* ---------------------------------------------------------------- Vous */
  {
    id: 'origin',
    chapter: 0,
    question: 'D’où partez-vous ?',
    subtitle: 'Les temps de vol et le prix des billets sont calculés depuis votre aéroport.',
    type: 'single',
    options: [
      { id: 'paris', label: 'France, Belgique, Suisse', hint: 'Départ depuis Paris ou un grand aéroport voisin', icon: 'PlaneTakeoff' },
      { id: 'montreal', label: 'Québec, Canada', hint: 'Départ depuis Montréal', icon: 'Plane' },
    ],
  },
  {
    id: 'companion',
    chapter: 0,
    question: 'Avec qui partez-vous ?',
    subtitle: 'On ne cherche pas la même chose en solo, en amoureux ou avec des enfants.',
    type: 'single',
    tintWeight: 0.5,
    options: [
      { id: 'solo', label: 'En solo', hint: 'Liberté totale, rencontres, sécurité importante', icon: 'Compass', tint: { h: 230, name: 'horizon' } },
      { id: 'couple', label: 'En couple', hint: 'Moments à deux, adresses de charme', icon: 'Heart', tint: { h: 5, name: 'rose' } },
      { id: 'family_young', label: 'En famille, jeunes enfants', hint: 'Enfants de moins de 10 ans : logistique simple', icon: 'Baby', tint: { h: 95, name: 'citron' } },
      { id: 'family_teens', label: 'En famille, avec des ados', hint: 'Il faut de l’action pour tout le monde', icon: 'Users', tint: { h: 160, name: 'menthe' } },
      { id: 'friends', label: 'Entre amis', hint: 'Partage, activités en groupe, soirées', icon: 'PartyPopper', tint: { h: 330, name: 'fuchsia' } },
      { id: 'nomad', label: 'En télétravail', hint: 'Travailler à distance : wifi fiable et séjour long', icon: 'Laptop', tint: { h: 265, name: 'indigo' } },
    ],
  },
  {
    id: 'duration',
    chapter: 0,
    question: 'Combien de temps partez-vous ?',
    subtitle: 'Un long vol se justifie mieux sur deux semaines que sur quatre jours.',
    type: 'single',
    options: [
      { id: 'long_weekend', label: 'Un long week-end', hint: '3 à 4 jours', icon: 'Clock' },
      { id: 'short_week', label: 'Une petite semaine', hint: '5 à 6 jours', icon: 'CalendarDays' },
      { id: 'week', label: 'Une semaine', hint: '7 à 9 jours', icon: 'CalendarDays' },
      { id: 'two_weeks', label: 'Deux semaines', hint: '10 à 15 jours', icon: 'CalendarRange' },
      { id: 'three_weeks', label: 'Trois semaines', hint: '16 à 23 jours', icon: 'CalendarRange' },
      { id: 'month', label: 'Un mois ou plus', hint: 'Grand voyage, sans compter', icon: 'Hourglass' },
    ],
  },
  {
    id: 'when',
    chapter: 0,
    question: 'Quand pouvez-vous partir ?',
    subtitle: 'Choisissez un ou plusieurs mois : on compare la météo réelle de chaque destination à ces dates.',
    type: 'months',
    tintWeight: 0.6,
  },
  {
    id: 'pace',
    chapter: 0,
    question: 'À quel rythme voyagez-vous ?',
    subtitle: 'Du transat à l’aube sur un sentier de crête.',
    type: 'single',
    tintWeight: 0.6,
    options: [
      { id: 'lazy', label: 'Farniente total', hint: 'Transat, lecture, baignade, zéro réveil', icon: 'Coffee', tint: { h: 195, name: 'lagon' } },
      { id: 'slow', label: 'Tranquille', hint: 'Une visite par jour, le reste en douceur', icon: 'Snail', tint: { h: 170, name: 'sauge' } },
      { id: 'balanced', label: 'Équilibré', hint: 'Moitié découvertes, moitié repos', icon: 'Scale', tint: { h: 120, name: 'tilleul' } },
      { id: 'active', label: 'Actif', hint: 'Programme chargé, on bouge beaucoup', icon: 'Footprints', tint: { h: 50, name: 'ambre' } },
      { id: 'intense', label: 'Intense', hint: 'Treks, défis sportifs, levers aux aurores', icon: 'Mountain', tint: { h: 25, name: 'braise' } },
    ],
  },

  /* ---------------------------------------------------------- Vos envies */
  {
    id: 'climate',
    chapter: 1,
    question: 'Quel temps vous fait rêver ?',
    subtitle: 'Jusqu’à 3 choix. Température moyenne en journée, à vos dates.',
    type: 'multi',
    min: 1,
    max: 3,
    tintWeight: 1.6,
    options: [
      { id: 'scorching', label: 'Canicule tropicale', hint: '30 °C et plus, eau chaude, soleil de plomb', icon: 'Flame', tint: { h: 40, name: 'corail' } },
      { id: 'hot', label: 'Chaud et ensoleillé', hint: '25 à 30 °C, l’été idéal', icon: 'Sun', tint: { h: 70, name: 'soleil' } },
      { id: 'mild', label: 'Doux', hint: '18 à 25 °C, parfait pour marcher', icon: 'CloudSun', tint: { h: 135, name: 'sauge' } },
      { id: 'cool', label: 'Frais et vivifiant', hint: '8 à 18 °C, air pur, pull le soir', icon: 'Wind', tint: { h: 215, name: 'brume' } },
      { id: 'cold', label: 'Froid, neige & aurores', hint: 'Sous 5 °C, paysages blancs', icon: 'Snowflake', tint: { h: 250, name: 'glacier' } },
      { id: 'any', label: 'Peu importe', hint: 'L’expérience compte plus que la météo', icon: 'Shuffle', exclusive: true },
    ],
  },
  {
    id: 'landscapes',
    chapter: 1,
    question: 'Quels décors vous attirent ?',
    subtitle: 'Jusqu’à 4 choix. Une destination qui en réunit plusieurs sera favorisée.',
    type: 'multi',
    min: 1,
    max: 4,
    tintWeight: 1.4,
    options: [
      { id: 'beach', label: 'Plages de rêve', hint: 'Sable fin, eau turquoise', icon: 'Palmtree', tint: { h: 195, name: 'turquoise' } },
      { id: 'island', label: 'Îles & lagons', hint: 'Archipels, criques, bateaux', icon: 'Shell', tint: { h: 205, name: 'lagon' } },
      { id: 'mountain', label: 'Montagnes', hint: 'Sommets, cols, panoramas', icon: 'Mountain', tint: { h: 235, name: 'ardoise' } },
      { id: 'lake', label: 'Lacs, fjords & cascades', hint: 'Eau douce et reflets', icon: 'Waves', tint: { h: 220, name: 'fjord' } },
      { id: 'jungle', label: 'Jungle tropicale', hint: 'Canopée, cascades cachées', icon: 'Trees', tint: { h: 150, name: 'jungle' } },
      { id: 'forest', label: 'Forêts & nature verte', hint: 'Sous-bois, landes, grands parcs', icon: 'TreePine', tint: { h: 140, name: 'mousse' } },
      { id: 'desert', label: 'Déserts & canyons', hint: 'Dunes, roches ocre, ciels immenses', icon: 'Sunset', tint: { h: 65, name: 'ocre' } },
      { id: 'volcano', label: 'Volcans', hint: 'Terres de feu, sources chaudes', icon: 'Flame', tint: { h: 30, name: 'lave' } },
      { id: 'city', label: 'Grandes métropoles', hint: 'Énergie urbaine, quartiers branchés', icon: 'Building2', tint: { h: 285, name: 'néon' } },
      { id: 'heritage', label: 'Villes & villages anciens', hint: 'Ruelles, places, vieilles pierres', icon: 'Landmark', tint: { h: 45, name: 'terracotta' } },
      { id: 'countryside', label: 'Campagne & vignobles', hint: 'Collines, domaines, villages', icon: 'Grape', tint: { h: 110, name: 'olive' } },
      { id: 'snow', label: 'Neige & glaciers', hint: 'Blancheur, glace, silence', icon: 'MountainSnow', tint: { h: 245, name: 'glacier' } },
      { id: 'savanna', label: 'Savane & steppes', hint: 'Plaines immenses, faune sauvage', icon: 'Sun', tint: { h: 80, name: 'savane' } },
    ],
  },
  {
    id: 'activities',
    chapter: 1,
    question: 'Que voulez-vous faire sur place ?',
    subtitle: 'Jusqu’à 5 choix. Les visites culturelles viennent à la question suivante.',
    type: 'multi',
    min: 1,
    max: 5,
    tintWeight: 0.7,
    options: [
      { id: 'hiking', label: 'Randonnée & trek', hint: 'Sentiers, refuges, sommets', icon: 'Footprints', tint: { h: 140, name: 'mousse' } },
      { id: 'diving', label: 'Plongée & snorkeling', hint: 'Récifs, tortues, raies', icon: 'Fish', tint: { h: 200, name: 'récif' } },
      { id: 'surf', label: 'Surf & glisse', hint: 'Vagues, kitesurf, paddle', icon: 'Waves', tint: { h: 210, name: 'écume' } },
      { id: 'wildlife', label: 'Safari & faune sauvage', hint: 'Grands animaux, baleines, oiseaux', icon: 'PawPrint', tint: { h: 75, name: 'savane' } },
      { id: 'ski', label: 'Ski & sports d’hiver', hint: 'Pistes, poudreuse, raquettes', icon: 'Snowflake', tint: { h: 245, name: 'glacier' } },
      { id: 'roadtrip', label: 'Road-trip', hint: 'Grandes routes, liberté, étapes', icon: 'Car', tint: { h: 50, name: 'asphalte chaud' } },
      { id: 'boat', label: 'Bateau, voile & kayak', hint: 'Croisières, îles, pagaie', icon: 'Sailboat', tint: { h: 215, name: 'marine' } },
      { id: 'adventure', label: 'Sensations fortes', hint: 'Rafting, parapente, canyoning', icon: 'Zap', tint: { h: 25, name: 'braise' } },
      { id: 'wellness', label: 'Bien-être', hint: 'Spa, onsen, hammam, yoga', icon: 'Bath', tint: { h: 175, name: 'eau thermale' } },
      { id: 'relax', label: 'Farniente', hint: 'Transat, piscine, ne rien faire', icon: 'Coffee', tint: { h: 190, name: 'lagon' } },
      { id: 'markets', label: 'Marchés & shopping', hint: 'Souks, artisans, boutiques', icon: 'ShoppingBag', tint: { h: 35, name: 'épices' } },
      { id: 'nightlife', label: 'Sorties & vie nocturne', hint: 'Bars, clubs, rooftops', icon: 'Moon', tint: { h: 300, name: 'néon' } },
      { id: 'wine', label: 'Vins & dégustations', hint: 'Caves, domaines, vendanges', icon: 'Wine', tint: { h: 355, name: 'bordeaux' } },
      { id: 'sky', label: 'Ciels étoilés & aurores', hint: 'Nuits noires, aurores boréales', icon: 'Telescope', tint: { h: 270, name: 'aurore' } },
    ],
  },
  {
    id: 'culture',
    chapter: 1,
    question: 'Quelle culture vous passionne ?',
    subtitle: 'Jusqu’à 3 choix.',
    type: 'multi',
    min: 1,
    max: 3,
    tintWeight: 0.6,
    options: [
      { id: 'history', label: 'Histoire & ruines antiques', hint: 'Temples perdus, cités millénaires', icon: 'Castle', tint: { h: 60, name: 'pierre dorée' } },
      { id: 'art', label: 'Art & musées', hint: 'Grands musées, galeries, street art', icon: 'Palette', tint: { h: 300, name: 'pourpre' } },
      { id: 'spiritual', label: 'Spiritualité & temples', hint: 'Rituels, monastères, méditation', icon: 'Flower2', tint: { h: 25, name: 'safran' } },
      { id: 'traditions', label: 'Traditions & artisanat', hint: 'Cultures vivantes, savoir-faire', icon: 'Hammer', tint: { h: 40, name: 'argile' } },
      { id: 'architecture', label: 'Architecture', hint: 'Palais, gratte-ciel, design', icon: 'Building2', tint: { h: 260, name: 'bleu nuit' } },
      { id: 'music', label: 'Musique & fêtes', hint: 'Concerts, danse, festivals', icon: 'Music', tint: { h: 330, name: 'fuchsia' } },
      { id: 'none', label: 'Pas ma priorité', hint: 'Je viens pour autre chose', icon: 'Shuffle', exclusive: true },
    ],
  },
  {
    id: 'exotic',
    chapter: 1,
    question: 'Jusqu’où voulez-vous être dépaysé ?',
    subtitle: 'De l’ambiance familière au grand saut culturel.',
    type: 'scale',
    tintWeight: 0.6,
    scale: [
      { label: 'Terrain connu', hint: 'Une culture proche de la mienne, rien d’imprévu', tint: { h: 120, name: 'tilleul' } },
      { label: 'Un peu d’ailleurs', hint: 'Une autre langue, d’autres habitudes, sans surprise', tint: { h: 90, name: 'blé' } },
      { label: 'Vrai dépaysement', hint: 'Une autre culture, mais avec des repères', tint: { h: 55, name: 'miel' } },
      { label: 'Grand dépaysement', hint: 'Tout change : langue, cuisine, codes', tint: { h: 35, name: 'épices' } },
      { label: 'Choc culturel total', hint: 'Je veux être bousculé, perdre mes repères', tint: { h: 15, name: 'vermillon' } },
    ],
  },
  {
    id: 'crowd',
    chapter: 1,
    question: 'Et la foule, dans tout ça ?',
    subtitle: 'Pour doser l’affluence touristique.',
    type: 'single',
    tintWeight: 0.4,
    options: [
      { id: 'wild', label: 'Loin de tout', hint: 'Isolement, silence, nature quasi vierge', icon: 'EyeOff', tint: { h: 160, name: 'mousse' } },
      { id: 'calm', label: 'Plutôt tranquille', hint: 'Peu de touristes, rythme local', icon: 'Feather', tint: { h: 180, name: 'sauge' } },
      { id: 'balanced', label: 'Les classiques, sans excès', hint: 'Voir l’incontournable, s’échapper ensuite', icon: 'Scale' },
      { id: 'lively', label: 'Animé & vibrant', hint: 'J’aime l’énergie des lieux qui bougent', icon: 'Zap', tint: { h: 320, name: 'fuchsia' } },
    ],
  },

  /* ---------------------------------------------- Votre façon de voyager */
  {
    id: 'foodImportance',
    chapter: 2,
    question: 'Quelle place pour la cuisine ?',
    subtitle: 'Plus elle compte, plus la gastronomie pèse dans le calcul.',
    type: 'scale',
    tintWeight: 0.3,
    scale: [
      { label: 'Du carburant', hint: 'Manger est une formalité' },
      { label: 'Simple et bon', hint: 'Un repas correct me suffit' },
      { label: 'Curieux', hint: 'J’aime goûter aux plats locaux', tint: { h: 60, name: 'miel' } },
      { label: 'Gourmand', hint: 'La table est un pilier du voyage', tint: { h: 40, name: 'épices' } },
      { label: 'Foodie absolu', hint: 'Je choisis ma destination pour ce qu’on y mange', tint: { h: 25, name: 'piment' } },
    ],
  },
  {
    id: 'cuisines',
    chapter: 2,
    question: 'Quelles saveurs vous font saliver ?',
    subtitle: 'Jusqu’à 3 choix.',
    type: 'multi',
    min: 1,
    max: 3,
    tintWeight: 0.35,
    options: [
      { id: 'spicy', label: 'Épicé & parfumé', hint: 'Currys, piments, épices', icon: 'Flame', tint: { h: 30, name: 'piment' } },
      { id: 'mediterranean', label: 'Méditerranéen', hint: 'Huile d’olive, mezzés, grillades', icon: 'Salad', tint: { h: 110, name: 'olive' } },
      { id: 'asian', label: 'Asiatique & umami', hint: 'Ramen, dim sum, wok', icon: 'Soup', tint: { h: 20, name: 'laque' } },
      { id: 'latin', label: 'Latino', hint: 'Tacos, ceviche, empanadas', icon: 'Citrus', tint: { h: 85, name: 'citron vert' } },
      { id: 'seafood', label: 'Poissons & fruits de mer', hint: 'Iodé, grillé, ultra-frais', icon: 'Fish', tint: { h: 200, name: 'iode' } },
      { id: 'terroir', label: 'Terroir & vins', hint: 'Fromages, mijotés, grands crus', icon: 'Wine', tint: { h: 355, name: 'bordeaux' } },
      { id: 'streetfood', label: 'Street-food', hint: 'Marchés de nuit, échoppes, stands', icon: 'Sandwich', tint: { h: 50, name: 'ambre' } },
      { id: 'veggie', label: 'Végétarien facile', hint: 'Je ne mange pas ou peu de viande', icon: 'Leaf', tint: { h: 135, name: 'feuille' } },
    ],
  },
  {
    id: 'lodging',
    chapter: 2,
    question: 'Où aimez-vous dormir ?',
    subtitle: 'Cela fixe aussi le niveau de dépenses sur place.',
    type: 'single',
    tintWeight: 0.4,
    options: [
      { id: 'homestay', label: 'Chez l’habitant', hint: 'Maisons d’hôtes, guesthouses, auberges', icon: 'Home', tint: { h: 45, name: 'argile' } },
      { id: 'boutique', label: 'Hôtels de charme', hint: 'Adresses à taille humaine, de caractère', icon: 'Hotel', tint: { h: 30, name: 'terracotta' } },
      { id: 'apartment', label: 'Location indépendante', hint: 'Appartement ou maison, on vit comme ici', icon: 'Key' },
      { id: 'eco', label: 'Lodges & nature', hint: 'Écolodges, cabanes, camps de brousse', icon: 'TentTree', tint: { h: 145, name: 'mousse' } },
      { id: 'camping', label: 'Van, camping, refuges', hint: 'Dormir dehors, le budget au minimum', icon: 'Caravan', tint: { h: 120, name: 'lichen' } },
      { id: 'luxury', label: 'Luxe & resorts', hint: 'Palaces, villas sur pilotis, spa', icon: 'Crown', tint: { h: 75, name: 'or' } },
    ],
  },
  {
    id: 'budget',
    chapter: 2,
    question: 'Quel budget par personne ?',
    subtitle: 'Tout compris : vols, hébergement, repas et activités, pour toute la durée du voyage.',
    type: 'single',
    options: [
      { id: 'b700', label: 'Moins de 700 €', hint: 'Petit budget, on voyage malin', icon: 'Coins' },
      { id: 'b1300', label: '700 à 1 300 €', hint: 'Raisonnable', icon: 'Coins' },
      { id: 'b2200', label: '1 300 à 2 200 €', hint: 'Confortable', icon: 'Wallet' },
      { id: 'b3500', label: '2 200 à 3 500 €', hint: 'Généreux', icon: 'Wallet' },
      { id: 'b6000', label: '3 500 à 6 000 €', hint: 'Haut de gamme', icon: 'Gem' },
      { id: 'unlimited', label: 'Sans limite', hint: 'Le budget n’est pas un critère', icon: 'Crown' },
    ],
  },
  {
    id: 'flightMax',
    chapter: 2,
    question: 'Combien d’heures de trajet acceptez-vous ?',
    subtitle: 'Temps de vol estimé, escales comprises, depuis votre aéroport.',
    type: 'single',
    options: [
      { id: 'h3', label: 'Moins de 3 h', hint: 'Voisins proches, parfois accessibles en train', icon: 'Clock' },
      { id: 'h5', label: 'Jusqu’à 5 h', hint: 'Toute l’Europe, le Maghreb, les Canaries', icon: 'Plane' },
      { id: 'h8', label: 'Jusqu’à 8 h', hint: 'Moyen-Orient, Afrique de l’Ouest, New York', icon: 'Plane' },
      { id: 'h12', label: 'Jusqu’à 12 h', hint: 'Asie du Sud-Est, Afrique australe, Amériques', icon: 'Globe2' },
      { id: 'any', label: 'Aucune limite', hint: 'Le bout du monde ne me fait pas peur', icon: 'Globe' },
    ],
  },
  {
    id: 'zones',
    chapter: 2,
    question: 'Quelles régions du monde ?',
    subtitle: 'Sélectionnez celles qui vous tentent, ou laissez le monde entier ouvert.',
    type: 'multi',
    min: 1,
    max: 7,
    tintWeight: 0.3,
    options: [
      { id: 'all', label: 'Le monde entier', hint: 'Surprenez-moi', icon: 'Globe', exclusive: true },
      { id: 'europe', label: 'Europe', hint: 'Y compris Turquie et Caucase', icon: 'Landmark', tint: { h: 250, name: 'ardoise' } },
      { id: 'mena', label: 'Afrique du Nord & Moyen-Orient', hint: 'Maroc, Égypte, Jordanie, Oman…', icon: 'Sunset', tint: { h: 60, name: 'ocre' } },
      { id: 'africa', label: 'Afrique & océan Indien', hint: 'Safaris, Réunion, Maurice…', icon: 'PawPrint', tint: { h: 80, name: 'savane' } },
      { id: 'asia', label: 'Asie', hint: 'Du Japon aux Maldives', icon: 'Flower2', tint: { h: 20, name: 'laque' } },
      { id: 'oceania', label: 'Océanie & Pacifique', hint: 'Australie, Nouvelle-Zélande, Polynésie', icon: 'Shell', tint: { h: 195, name: 'lagon' } },
      { id: 'north_america', label: 'Amérique du Nord', hint: 'États-Unis, Canada', icon: 'Building2', tint: { h: 230, name: 'horizon' } },
      { id: 'latin_america', label: 'Amérique latine & Caraïbes', hint: 'Du Mexique à la Patagonie', icon: 'Citrus', tint: { h: 150, name: 'jungle' } },
    ],
  },
  {
    id: 'constraints',
    chapter: 2,
    question: 'Des critères éliminatoires ?',
    subtitle: 'Facultatif. Les destinations qui ne les respectent pas sont fortement pénalisées.',
    type: 'multi',
    min: 0,
    max: 8,
    optional: true,
    options: [
      { id: 'safety', label: 'Sécurité maximale', hint: 'Seulement des pays très sûrs', icon: 'ShieldCheck' },
      { id: 'no_visa', label: 'Pas de visa', hint: 'Aucune formalité à l’entrée', icon: 'Stamp' },
      { id: 'no_malaria', label: 'Pas de paludisme', hint: 'Aucune zone à risque', icon: 'Bug' },
      { id: 'jetlag', label: 'Peu de décalage horaire', hint: '3 heures au maximum', icon: 'Clock' },
      { id: 'no_altitude', label: 'Pas de haute altitude', hint: 'Rien au-dessus de 2 500 m', icon: 'MountainSnow' },
      { id: 'car_free', label: 'Sans voiture', hint: 'Tout faire en transports ou à pied', icon: 'TramFront' },
      { id: 'french', label: 'On y parle français', hint: 'Pouvoir se débrouiller en français', icon: 'Languages' },
      { id: 'wifi', label: 'Connexion fiable', hint: 'Indispensable pour travailler', icon: 'Wifi' },
    ],
  },

  /* ----------------------------------------------------------- L’essentiel */
  {
    id: 'vibes',
    chapter: 3,
    question: 'Quelle émotion cherchez-vous ?',
    subtitle: 'Jusqu’à 2 choix : ce qui fera que ce voyage restera gravé.',
    type: 'multi',
    min: 1,
    max: 2,
    tintWeight: 1,
    options: [
      { id: 'serenity', label: 'Sérénité', hint: 'Ralentir, décrocher, respirer', icon: 'Feather', tint: { h: 190, name: 'lagon' } },
      { id: 'wonder', label: 'Émerveillement', hint: 'Des paysages qui coupent le souffle', icon: 'Eye', tint: { h: 155, name: 'jade' } },
      { id: 'culture_shock', label: 'Dépaysement', hint: 'Un autre monde, d’autres codes', icon: 'Compass', tint: { h: 30, name: 'safran' } },
      { id: 'romance', label: 'Romantisme', hint: 'Couchers de soleil, dîners à deux', icon: 'Heart', tint: { h: 355, name: 'rose' } },
      { id: 'adrenaline', label: 'Adrénaline', hint: 'Défis, frissons, grands espaces', icon: 'Zap', tint: { h: 25, name: 'braise' } },
      { id: 'festive', label: 'Fête', hint: 'Musique, rencontres, nuits blanches', icon: 'PartyPopper', tint: { h: 320, name: 'fuchsia' } },
      { id: 'gourmet', label: 'Gourmandise', hint: 'Un voyage par les papilles', icon: 'UtensilsCrossed', tint: { h: 45, name: 'épices' } },
      { id: 'learn', label: 'Comprendre', hint: 'Histoire, cultures, rencontres', icon: 'BookOpen', tint: { h: 265, name: 'encre' } },
    ],
  },
  {
    id: 'priorities',
    chapter: 3,
    question: 'Qu’est-ce qui compte le plus ?',
    subtitle: 'Jusqu’à 3 choix. Ces critères pèseront deux fois plus lourd dans le classement.',
    type: 'multi',
    min: 1,
    max: 3,
    options: [
      { id: 'weather', label: 'La météo', hint: 'Le bon temps à mes dates', icon: 'Sun' },
      { id: 'budget', label: 'Le budget', hint: 'Ne pas dépasser mon enveloppe', icon: 'Wallet' },
      { id: 'scenery', label: 'Les paysages', hint: 'Des décors à la hauteur', icon: 'Mountain' },
      { id: 'activities', label: 'Les activités', hint: 'Faire ce que j’aime sur place', icon: 'Footprints' },
      { id: 'culture', label: 'La culture', hint: 'Sites, histoire, traditions', icon: 'Landmark' },
      { id: 'food', label: 'La cuisine', hint: 'Bien manger, et beaucoup', icon: 'UtensilsCrossed' },
      { id: 'calm', label: 'La tranquillité', hint: 'Éviter la foule', icon: 'Feather' },
      { id: 'exotic', label: 'Le dépaysement', hint: 'Changer vraiment d’air', icon: 'Compass' },
      { id: 'easy', label: 'La facilité', hint: 'Trajet court, organisation simple', icon: 'Plane' },
    ],
  },
  {
    id: 'notes',
    chapter: 3,
    question: 'Une envie particulière ?',
    subtitle: 'Facultatif. Écrivez librement : les mots-clés reconnus (volcans, plongée, vin, aurores, pas de foule…) comptent dans le calcul.',
    type: 'text',
    optional: true,
    placeholder: 'Ex. : je rêve de voir des baleines et des volcans, j’adore le café, pas de grandes villes…',
  },
];

export const TOTAL_STEPS = QUIZ_STEPS.length;

/** Ready-made profiles for a quick look at the results. */
export const PRESETS: { title: string; subtitle: string; answers: QuizAnswers }[] = [
  {
    title: 'Lagon & farniente',
    subtitle: 'Soleil d’hiver, eau turquoise, zéro effort',
    answers: {
      origin: 'paris', companion: 'couple', duration: 'two_weeks', when: [0, 1], pace: 'lazy',
      climate: ['scorching', 'hot'], landscapes: ['beach', 'island'], activities: ['diving', 'relax', 'wellness'],
      culture: ['none'], exotic: 3, crowd: 'calm', foodImportance: 3, cuisines: ['seafood', 'spicy'],
      lodging: 'boutique', budget: 'b3500', flightMax: 'any', zones: ['all'], constraints: [],
      vibes: ['serenity', 'romance'], priorities: ['weather', 'scenery'], notes: '',
    },
  },
  {
    title: 'Grands espaces',
    subtitle: 'Treks, glaciers et nuits sous les étoiles',
    answers: {
      origin: 'paris', companion: 'friends', duration: 'two_weeks', when: [6, 7], pace: 'intense',
      climate: ['cool', 'mild'], landscapes: ['mountain', 'lake', 'snow', 'volcano'], activities: ['hiking', 'adventure', 'roadtrip', 'sky'],
      culture: ['none'], exotic: 2, crowd: 'wild', foodImportance: 2, cuisines: ['terroir'],
      lodging: 'camping', budget: 'b3500', flightMax: 'any', zones: ['all'], constraints: [],
      vibes: ['wonder', 'adrenaline'], priorities: ['scenery', 'activities'], notes: 'volcans, glaciers',
    },
  },
  {
    title: 'Week-end culture',
    subtitle: 'Musées, ruelles et bonnes tables, à moins de 3 h',
    answers: {
      origin: 'paris', companion: 'couple', duration: 'long_weekend', when: [9], pace: 'active',
      climate: ['mild', 'hot'], landscapes: ['heritage', 'city'], activities: ['markets', 'wine', 'nightlife'],
      culture: ['art', 'architecture', 'history'], exotic: 2, crowd: 'balanced', foodImportance: 5, cuisines: ['mediterranean', 'terroir'],
      lodging: 'boutique', budget: 'b1300', flightMax: 'h3', zones: ['europe'], constraints: ['car_free'],
      vibes: ['gourmet', 'learn'], priorities: ['food', 'easy'], notes: '',
    },
  },
  {
    title: 'Grand voyage routard',
    subtitle: 'Un mois, petit budget, choc culturel',
    answers: {
      origin: 'paris', companion: 'solo', duration: 'month', when: 'flexible', pace: 'active',
      climate: ['hot', 'mild'], landscapes: ['jungle', 'mountain', 'heritage', 'beach'], activities: ['hiking', 'markets', 'diving'],
      culture: ['spiritual', 'traditions'], exotic: 5, crowd: 'calm', foodImportance: 4, cuisines: ['streetfood', 'spicy', 'asian'],
      lodging: 'homestay', budget: 'b2200', flightMax: 'any', zones: ['all'], constraints: [],
      vibes: ['culture_shock', 'wonder'], priorities: ['budget', 'exotic'], notes: '',
    },
  },
];
