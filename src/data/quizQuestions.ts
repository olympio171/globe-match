import { QuizAnswers } from '../types';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  iconName?: string;
  badge?: string;
}

export interface QuizStepDef {
  id: string;
  categoryTitle: string;
  categoryNumber: number;
  totalCategories: number;
  question: string;
  subtitle: string;
  type: 'single' | 'multi' | 'slider' | 'tags' | 'text';
  field: keyof QuizAnswers;
  options?: QuizOption[];
  minSelect?: number;
  maxSelect?: number;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderLabels?: { [key: number]: string };
  placeholder?: string;
}

export const QUIZ_STEPS: QuizStepDef[] = [
  // 1. Profil de voyage & Compagnons
  {
    id: 'companion',
    categoryTitle: 'Profil & Compagnons',
    categoryNumber: 1,
    totalCategories: 6,
    question: 'Avec qui partez-vous pour cette aventure ?',
    subtitle: 'La composition de votre groupe influence grandement le type de destination idéale.',
    type: 'single',
    field: 'companion',
    options: [
      { id: 'solo', label: 'En Solo', description: 'Liberté absolue, introspection & rencontres spontanées', iconName: 'Compass' },
      { id: 'couple', label: 'En Couple', description: 'Romantisme, tête-à-tête, moments complices & charme', iconName: 'Heart' },
      { id: 'family', label: 'En Famille', description: 'Activités adaptées à tous, sécurité, logistique fluide', iconName: 'Users' },
      { id: 'friends', label: 'Entre Amis', description: 'Convivialité, fous rires, partage & soirées mémorables', iconName: 'Sparkles' },
      { id: 'digital_nomad', label: 'Digital Nomad', description: 'Mix travail & voyage, bonne connexion WiFi, cafés inspirants', iconName: 'Laptop' }
    ]
  },
  {
    id: 'duration',
    categoryTitle: 'Profil & Compagnons',
    categoryNumber: 1,
    totalCategories: 6,
    question: 'Quelle est la durée envisagée pour ce voyage ?',
    subtitle: 'Permet d’évaluer la distance raisonnable et le nombre d’étapes.',
    type: 'single',
    field: 'duration',
    options: [
      { id: 'weekend', label: 'Court séjour (4 à 5 jours)', description: 'Idéal pour un city-trip dépaysant ou une escapade nature', iconName: 'Clock' },
      { id: 'one_to_two_weeks', label: '1 à 2 semaines (7 à 14 jours)', description: 'Le format classique pour une immersion complète dans une région', iconName: 'Calendar' },
      { id: 'three_weeks_to_month', label: '3 à 4 semaines', description: 'Idéal pour un road-trip ou traverser un pays de part en part', iconName: 'Map' },
      { id: 'long_travel', label: 'Grand voyage (> 1 mois)', description: 'Aventure itinérante, lenteur et déconnexion profonde', iconName: 'Globe' }
    ]
  },
  {
    id: 'pace',
    categoryTitle: 'Profil & Compagnons',
    categoryNumber: 1,
    totalCategories: 6,
    question: 'Quel est votre rythme de voyage de prédilection ?',
    subtitle: 'Chacun sa façon de voyager : du repos total à la découverte non-stop.',
    type: 'single',
    field: 'pace',
    options: [
      { id: 'relaxation', label: 'Détente & Farniente (Slow Travel)', description: 'Pas de réveil, plage, spa, lecture et cafés en terrasse', iconName: 'Coffee' },
      { id: 'balanced', label: 'Équilibré (50% Découverte / 50% Repos)', description: 'Une belle visite le matin, après-midi détente au soleil', iconName: 'Sun' },
      { id: 'active_explorer', label: 'Explorateur Actif (Curiosité permanente)', description: 'Planning riche, changer de ville, voir un maximum de choses', iconName: 'Footprints' },
      { id: 'intense_adventure', label: 'Aventure & Dépassement 100%', description: 'Treks exigeants, levers aux aurores, hors des sentiers battus', iconName: 'Mountain' }
    ]
  },

  // 2. Climat, Nature & Environnement
  {
    id: 'climate',
    categoryTitle: 'Climat & Environnement',
    categoryNumber: 2,
    totalCategories: 6,
    question: 'Quelle météo vous fait instantanément rêver ?',
    subtitle: 'La météo idéale pour vous sentir parfaitement bien.',
    type: 'single',
    field: 'climate',
    options: [
      { id: 'tropical_warm', label: 'Chaleur tropicale & Soleil généreux', description: '25-32°C, eau turquoise, brise tiède sous les palmiers', iconName: 'SunMedium' },
      { id: 'temperate_mild', label: 'Climat tempéré & Doux', description: '18-24°C, idéal pour marcher sans souffrir de la chaleur', iconName: 'CloudSun' },
      { id: 'cool_mountain', label: 'Fraîcheur vivifiante & Air pur de montagne', description: '12-18°C, brumes mystiques, forêts alpines et lacs limpides', iconName: 'Wind' },
      { id: 'cold_snow', label: 'Magie de l’Hiver, Neige & Aurores boréales', description: 'Paysages enneigés féeriques, chalets cosy et cheminées', iconName: 'Snowflake' },
      { id: 'any', label: 'Peu importe le temps, l’expérience prime !', description: 'Prêt à m’adapter à n’importe quelle saison', iconName: 'Compass' }
    ]
  },
  {
    id: 'landscapes',
    categoryTitle: 'Climat & Environnement',
    categoryNumber: 2,
    totalCategories: 6,
    question: 'Quels décors naturels vous attirent le plus ?',
    subtitle: 'Sélectionnez jusqu’à 3 types de paysages favoris.',
    type: 'multi',
    field: 'landscapes',
    minSelect: 1,
    maxSelect: 3,
    options: [
      { id: 'beaches', label: 'Plages paradisiaques & Lagons', description: 'Sable blanc ou noir, récifs coralliens, criques secrètes', iconName: 'Palmtree' },
      { id: 'mountains', label: 'Montagnes majestueuses & Fjords', description: 'Pics vertigineux, vallées glaciaires, panoramas à couper le souffle', iconName: 'Mountain' },
      { id: 'forests', label: 'Forêts denses & Jungles sauvages', description: 'Canopée verdoyante, cascades cachées, biodiversité luxuriante', iconName: 'Trees' },
      { id: 'deserts', label: 'Déserts & Dunes dorées infinies', description: 'Ciels étoilés immenses, canyons ocres, oasis paisibles', iconName: 'Flame' },
      { id: 'historic_cities', label: 'Villes historiques & Ruelles pavées', description: 'Façades patinées par le temps, places animées, clochers anciens', iconName: 'Landmark' },
      { id: 'countryside', label: 'Campagne pittoresque & Vignobles', description: 'Collines douces, domaines viticoles, villages d’époque', iconName: 'Grape' }
    ]
  },
  {
    id: 'crowdPreference',
    categoryTitle: 'Climat & Environnement',
    categoryNumber: 2,
    totalCategories: 6,
    question: 'Quel est votre rapport aux autres touristes et à la foule ?',
    subtitle: 'Pour calibrer l’authenticité et la tranquillité de la destination.',
    type: 'single',
    field: 'crowdPreference',
    options: [
      { id: 'secret_hidden', label: 'Pépites secrètes & Hors des sentiers battus', description: 'Je fuis les foules, je cherche le silence et l’isolement paisible', iconName: 'EyeOff' },
      { id: 'balanced_mix', label: 'Équilibre : les grands classiques avec des échappées calmes', description: 'Voir les sites incontournables sans être oppressé en permanence', iconName: 'Scale' },
      { id: 'vibrant_lively', label: 'Lieux vibrants, animés et effervescents', description: 'J’adore l’énergie communicative des grandes métropoles et bazars', iconName: 'Zap' }
    ]
  },

  // 3. Culture & Patrimoine
  {
    id: 'culturalInterests',
    categoryTitle: 'Culture & Patrimoine',
    categoryNumber: 3,
    totalCategories: 6,
    question: 'Quels aspects culturels résonnent le plus en vous ?',
    subtitle: 'Choisissez vos plus grandes passions pour une immersion mémorable (1 à 3 choix).',
    type: 'multi',
    field: 'culturalInterests',
    minSelect: 1,
    maxSelect: 3,
    options: [
      { id: 'ancient_history', label: 'Histoire antique, Temples & Ruines', description: 'Cités perdues, pyramides, amphithéâtres et légendes millénaires', iconName: 'Castle' },
      { id: 'art_museums', label: 'Art, Musées & Galeries avant-gardistes', description: 'Chefs-d’œuvre de peinture, sculptures, art contemporain', iconName: 'Palette' },
      { id: 'local_traditions', label: 'Spiritualité & Rituels ancestraux', description: 'Cérémonies du thé, méditation, danses traditionnelles, artisanat', iconName: 'Flower2' },
      { id: 'music_festivals', label: 'Musique live & Festivals folkloriques', description: 'Jazz, flamenco, rythmes caribéens, concerts de rue', iconName: 'Music' },
      { id: 'architecture', label: 'Architecture remarquable & Design', description: 'Gratte-ciels futuristes, palais mauresques, maisons traditionnelles', iconName: 'Building2' },
      { id: 'crafts_markets', label: 'Souks, Marchés d’artisans & Brocantes', description: 'Tissages, poteries faites main, senteurs d’épices et négociation amicale', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'accommodationStyle',
    categoryTitle: 'Culture & Patrimoine',
    categoryNumber: 3,
    totalCategories: 6,
    question: 'Où préférez-vous poser vos valises le soir ?',
    subtitle: 'Le type de logement fait partie intégrante de la magie du séjour.',
    type: 'single',
    field: 'accommodationStyle',
    options: [
      { id: 'authentic_boutique', label: 'Hôtel boutique de charme ou Riad traditionnel', description: 'Architecture typique, décoration soignée, accueil chaleureux', iconName: 'Hotel' },
      { id: 'eco_lodge', label: 'Eco-lodge ou Cabane perchée dans la nature', description: 'Immersion totale en harmonie avec l’environnement naturel', iconName: 'Trees' },
      { id: 'homestay', label: 'Maison d’hôtes ou Nuit chez l’habitant', description: 'Partage du quotidien, échanges sincères et conseils précieux', iconName: 'Home' },
      { id: 'luxury_resort', label: 'Resort avec spa ou Grand Hôtel 5 étoiles', description: 'Service irréprochable, piscine à débordement, confort maximal', iconName: 'Crown' }
    ]
  },

  // 4. Gastronomie & Saveurs
  {
    id: 'foodImportance',
    categoryTitle: 'Gastronomie & Saveurs',
    categoryNumber: 4,
    totalCategories: 6,
    question: 'Quelle est la place de la gastronomie dans vos voyages ?',
    subtitle: 'Sur une échelle de 1 à 5, jusqu’où voyagez-vous avec vos papilles ?',
    type: 'slider',
    field: 'foodImportance',
    sliderMin: 1,
    sliderMax: 5,
    sliderStep: 1,
    sliderLabels: {
      1: 'Simple carburant pour la journée',
      2: 'Un bon repas simple suffit',
      3: 'J’apprécie goûter les plats locaux',
      4: 'La cuisine est un pilier de mon séjour',
      5: 'Véritable voyageur Gourmet / Foodie !'
    }
  },
  {
    id: 'foodFlavors',
    categoryTitle: 'Gastronomie & Saveurs',
    categoryNumber: 4,
    totalCategories: 6,
    question: 'Quelles saveurs culinaires vous font saliver ?',
    subtitle: 'Sélectionnez jusqu’à 3 univers gustatifs préférés.',
    type: 'multi',
    field: 'foodFlavors',
    minSelect: 1,
    maxSelect: 3,
    options: [
      { id: 'spicy_exotic', label: 'Épicé, Parfumé & Saveurs Exotiques', description: 'Currys onctueux, piments doux, citronnelle, lait de coco', iconName: 'Flame' },
      { id: 'mediterranean_fresh', label: 'Méditerranéen, Huile d’olive & Soleil', description: 'Légumes grillés, mezzés, poissons frais, herbes aromatiques', iconName: 'Salad' },
      { id: 'asian_sweet_savory', label: 'Asiatique : Ramen, Street-food & Umami', description: 'Bouillons fumants, dim sums, woks vivants, sauces caramélisées', iconName: 'Soup' },
      { id: 'comfort_traditional', label: 'Terroir généreux, Fromages & Vins fins', description: 'Plats mijotés mijotés avec amour, charcuteries, grands crus', iconName: 'Wine' },
      { id: 'seafood', label: 'Poissons ultra-frais & Fruits de mer', description: 'Ceviches acidulés, huîtres iodées, homards grillés en bord d’océan', iconName: 'Fish' }
    ]
  },

  // 5. Activités & Aventures
  {
    id: 'favoriteActivities',
    categoryTitle: 'Activités & Aventures',
    categoryNumber: 5,
    totalCategories: 6,
    question: 'Quelles activités illumineront vos journées de vacances ?',
    subtitle: 'Sélectionnez 1 à 3 activités que vous aimez pratiquer sur place.',
    type: 'multi',
    field: 'favoriteActivities',
    minSelect: 1,
    maxSelect: 3,
    options: [
      { id: 'hiking_outdoor', label: 'Randonnée, Parcs nationaux & Grands espaces', description: 'Sentiers panoramiques, cascades, forêts millénaires', iconName: 'Footprints' },
      { id: 'cultural_visits', label: 'Visites culturelles, Châteaux & Quartiers historiques', description: 'Comprendre l’histoire des lieux et observer l’architecture', iconName: 'Landmark' },
      { id: 'water_sports', label: 'Plongée, Snorkeling, Surf & Voile', description: 'Fonds marins colorés, glisse sur les vagues, baignades cristallines', iconName: 'Waves' },
      { id: 'wellness_spa', label: 'Spas, Sources chaudes, Yoga & Méditation', description: 'Massages réparateurs, bains thermaux, reconnexion intérieure', iconName: 'HeartHandshake' },
      { id: 'safari_wildlife', label: 'Observation des animaux sauvages & Safaris', description: 'Faune endémique dans son habitat naturel préservé', iconName: 'Cat' },
      { id: 'nightlife_shopping', label: 'Rooftops branchés, Marchés nocturnes & Shopping', description: 'Vie nocturne festive, boutiques de créateurs, concerts', iconName: 'Sparkles' }
    ]
  },
  {
    id: 'physicalIntensity',
    categoryTitle: 'Activités & Aventures',
    categoryNumber: 5,
    totalCategories: 6,
    question: 'Quel niveau d’effort physique souhaitez-vous fournir ?',
    subtitle: 'Du mode 100% repos sans fatigue jusqu’au défi sportif intense.',
    type: 'slider',
    field: 'physicalIntensity',
    sliderMin: 1,
    sliderMax: 5,
    sliderStep: 1,
    sliderLabels: {
      1: 'Effort zéro (transat, visites en minibus/bateau)',
      2: 'Balades tranquilles en ville et parcs plats',
      3: 'Marches modérées (6 à 10 km par jour)',
      4: 'Bonne endurance (randonnées de dénivelé régulières)',
      5: 'Défi sportif intense (treks techniques, escalade)'
    }
  },

  // 6. Budget, Géographie & Vibe
  {
    id: 'budgetTier',
    categoryTitle: 'Budget & Destination',
    categoryNumber: 6,
    totalCategories: 6,
    question: 'Quelle enveloppe budgétaire globale envisagez-vous ?',
    subtitle: 'Par personne tout compris (vols, hébergements, repas et activités pour ~7-10 jours).',
    type: 'single',
    field: 'budgetTier',
    options: [
      { id: 'backpacker', label: 'Budget Malin / Économique (< 850 €)', description: 'Guesthouses sympa, street-food délicieuse, transports locaux', iconName: 'Coins' },
      { id: 'moderate', label: 'Budget Équilibré (850 € - 1 800 €)', description: 'Bons hôtels 3-4*, petits restos de quartier, quelques belles activités', iconName: 'CreditCard' },
      { id: 'comfort', label: 'Confort & Plaisir (1 800 € - 3 500 €)', description: 'Beaux hôtels de charme, dégustations gastronomiques, guides privés', iconName: 'Gem' },
      { id: 'luxury', label: 'Haut de gamme / Sans compromis (> 3 500 €)', description: 'Lodges 5 étoiles exclusifs, transferts privés, expériences VIP', iconName: 'Crown' }
    ]
  },
  {
    id: 'flightMax',
    categoryTitle: 'Budget & Destination',
    categoryNumber: 6,
    totalCategories: 6,
    question: 'Combien d’heures de vol acceptez-vous de faire ?',
    subtitle: 'Depuis l’Europe de l’Ouest / Paris.',
    type: 'single',
    field: 'flightMax',
    options: [
      { id: 'short', label: 'Court-courrier (< 4 heures de vol)', description: 'Europe du Sud, Scandinavie, Maghreb, Canaries', iconName: 'PlaneTakeoff' },
      { id: 'medium', label: 'Moyen-courrier (4 à 8 heures de vol)', description: 'Moyen-Orient, Égypte, Islande, Sénégal, Cap-Vert', iconName: 'Plane' },
      { id: 'long', label: 'Long-courrier sans restriction (8 heures et +)', description: 'Asie, Amériques, Océanie, Afrique australe', iconName: 'Globe2' }
    ]
  },
  {
    id: 'travelSeason',
    categoryTitle: 'Budget & Destination',
    categoryNumber: 6,
    totalCategories: 6,
    question: 'À quelle saison prévoyez-vous de partir ?',
    subtitle: 'Permet de recommander des lieux à la météo optimale à cette période.',
    type: 'single',
    field: 'travelSeason',
    options: [
      { id: 'any', label: 'Toutes saisons / Flexible', description: 'Je planifierai mes dates selon la destination choisie', iconName: 'CalendarRange' },
      { id: 'spring', label: 'Printemps (Mars à Mai)', description: 'Floraisons, températures douces avant la haute saison', iconName: 'Flower' },
      { id: 'summer', label: 'Été (Juin à Août)', description: 'Longues journées ensoleillées, baignades et ambiance estivale', iconName: 'Sun' },
      { id: 'autumn', label: 'Automne (Septembre à Novembre)', description: 'Couleurs flamboyantes, vendanges, calme retrouvé', iconName: 'Leaf' },
      { id: 'winter', label: 'Hiver (Décembre à Février)', description: 'Partir au chaud sous les tropiques ou vivre la féerie blanche', iconName: 'Snowflake' }
    ]
  },
  {
    id: 'tripVibe',
    categoryTitle: 'Budget & Destination',
    categoryNumber: 6,
    totalCategories: 6,
    question: 'Quelle émotion et ambiance recherchez-vous avant tout ?',
    subtitle: 'La vibration qui rendra ce voyage inoubliable à votre retour.',
    type: 'single',
    field: 'tripVibe',
    options: [
      { id: 'disconnection', label: 'Sérénité & Déconnexion totale', description: 'Couper du stress quotidien, ralentir et retrouver la paix de l’esprit', iconName: 'Feather' },
      { id: 'cultural_shock', label: 'Choc culturel & Émerveillement', description: 'Dépaysement complet, traditions fascinantes, coutumes nouvelles', iconName: 'Sparkles' },
      { id: 'romance', label: 'Romantisme & Poésie intemporelle', description: 'Couchers de soleil dorés, ruelles secrètes, dîners aux chandelles', iconName: 'Heart' },
      { id: 'adrenaline', label: 'Aventure, Défi & Adrénaline', description: 'Sensations fortes, paysages sauvages et histoires palpitantes à raconter', iconName: 'Zap' },
      { id: 'festive', label: 'Convivialité, Fête & Joie de vivre', description: 'Accueil chaleureux des locaux, musique entraînante et verres partagés', iconName: 'Smile' }
    ]
  },
  {
    id: 'additionalNotes',
    categoryTitle: 'Budget & Destination',
    categoryNumber: 6,
    totalCategories: 6,
    question: 'Un souhait particulier ou une envie secrète ? (Optionnel)',
    subtitle: 'Exemple : "J’adore le bon café artisanal", "Je cherche des volcans actifs", "J’évite les pays avec humidité étouffante"...',
    type: 'text',
    field: 'additionalNotes',
    placeholder: 'Ex: Je rêve de voir des aurores boréales, j’adore la photographie animalière et je ne mange pas de viande...'
  }
];

export const DEFAULT_QUIZ_ANSWERS: QuizAnswers = {
  companion: 'couple',
  duration: 'one_to_two_weeks',
  pace: 'balanced',
  climate: 'temperate_mild',
  landscapes: ['historic_cities', 'mountains'],
  crowdPreference: 'balanced_mix',
  culturalInterests: ['ancient_history', 'art_museums'],
  accommodationStyle: 'authentic_boutique',
  foodImportance: 4,
  foodFlavors: ['mediterranean_fresh', 'comfort_traditional'],
  favoriteActivities: ['cultural_visits', 'hiking_outdoor'],
  physicalIntensity: 3,
  budgetTier: 'moderate',
  flightMax: 'medium',
  continentsPreferred: ['all'],
  travelSeason: 'spring',
  tripVibe: 'cultural_shock',
  additionalNotes: ''
};

export const QUICK_DEMO_PRESETS = [
  {
    title: 'Aventure Sauvage & Nature',
    subtitle: 'Grands espaces, volcans & aurores',
    answers: {
      companion: 'friends' as const,
      duration: 'one_to_two_weeks' as const,
      pace: 'intense_adventure' as const,
      climate: 'cool_mountain' as const,
      landscapes: ['mountains', 'forests', 'deserts'],
      crowdPreference: 'secret_hidden' as const,
      culturalInterests: ['local_traditions'],
      accommodationStyle: 'eco_lodge',
      foodImportance: 3,
      foodFlavors: ['comfort_traditional', 'seafood'],
      favoriteActivities: ['hiking_outdoor', 'water_sports'],
      physicalIntensity: 4,
      budgetTier: 'comfort' as const,
      flightMax: 'long' as const,
      continentsPreferred: ['all' as const],
      travelSeason: 'summer' as const,
      tripVibe: 'adrenaline',
      additionalNotes: 'Passionné de randonnées sauvages et de paysages lunaires'
    }
  },
  {
    title: 'Détente Éden Tropical & Plage',
    subtitle: 'Lagons turquoise, cocktails & farniente',
    answers: {
      companion: 'couple' as const,
      duration: 'one_to_two_weeks' as const,
      pace: 'relaxation' as const,
      climate: 'tropical_warm' as const,
      landscapes: ['beaches', 'forests'],
      crowdPreference: 'secret_hidden' as const,
      culturalInterests: ['local_traditions', 'crafts_markets'],
      accommodationStyle: 'luxury_resort',
      foodImportance: 4,
      foodFlavors: ['spicy_exotic', 'seafood'],
      favoriteActivities: ['wellness_spa', 'water_sports'],
      physicalIntensity: 1,
      budgetTier: 'comfort' as const,
      flightMax: 'long' as const,
      continentsPreferred: ['all' as const],
      travelSeason: 'winter' as const,
      tripVibe: 'disconnection',
      additionalNotes: 'Besoin absolu de repos au soleil dans un cadre idyllique'
    }
  },
  {
    title: 'Immersion Culturelle & Foodie',
    subtitle: 'Temples, gastronomie & ruelles d’époque',
    answers: {
      companion: 'solo' as const,
      duration: 'three_weeks_to_month' as const,
      pace: 'active_explorer' as const,
      climate: 'temperate_mild' as const,
      landscapes: ['historic_cities', 'countryside'],
      crowdPreference: 'balanced_mix' as const,
      culturalInterests: ['ancient_history', 'local_traditions', 'crafts_markets'],
      accommodationStyle: 'authentic_boutique',
      foodImportance: 5,
      foodFlavors: ['asian_sweet_savory', 'spicy_exotic'],
      favoriteActivities: ['cultural_visits', 'nightlife_shopping'],
      physicalIntensity: 3,
      budgetTier: 'moderate' as const,
      flightMax: 'long' as const,
      continentsPreferred: ['asia' as const],
      travelSeason: 'autumn' as const,
      tripVibe: 'cultural_shock',
      additionalNotes: 'Amoureux de la gastronomie et de traditions séculaires'
    }
  }
];
