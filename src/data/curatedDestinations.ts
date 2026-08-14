import { DestinationRecommendation } from '../types';

export interface CuratedDestination extends DestinationRecommendation {
  attributes: {
    budgetTiers: string[];
    pace: string[];
    climates: string[];
    landscapes: string[];
    crowd: string[];
    companions: string[];
    culturalTags: string[];
    foodFlavors: string[];
    foodImportanceMin: number;
    activities: string[];
    physicalIntensityRange: [number, number];
    flightCategory: 'short' | 'medium' | 'long';
    continentTag: string;
    seasons: string[];
    vibes: string[];
  };
}

export const CURATED_DESTINATIONS: CuratedDestination[] = [
  {
    id: 'kyoto-japan',
    name: 'Kyoto & Vallée de Nara',
    country: 'Japon',
    continent: 'Asie',
    region: 'Kansai',
    matchScore: 98,
    tagline: 'L’âme millénaire du Japon entre temples dorés, bambouseraies et gastronomie kaiseki',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Patrimoine Mondial UNESCO', 'Paradis des Foodies', 'Sérénité & Rituels', 'Super Sécurisé'],
    whyPerfect: 'Kyoto allie harmonieusement la spiritualité des sanctuaires shinto, la perfection esthétique des jardins zen et une immersion culinaire raffinée, idéale pour un voyage culturel et contemplatif.',
    summary: 'Ancienne capitale impériale, Kyoto abrite plus de 2000 temples et sanctuaires, des ruelles de geishas préservées à Gion, et une tradition du thé et de la haute cuisine portée à son apogée.',
    bestSeasons: ['Printemps (Cerisiers en fleur)', 'Automne (Érables rouges Koyo)'],
    weatherExpected: 'Tempéré doux au printemps et en automne (15°C à 22°C), parfait pour flâner à pied ou à vélo.',
    flightTimeFromEurope: '~13h (Vol direct Tokyo/Osaka + Shinkansen 1h15)',
    idealDuration: '10 à 14 jours (avec excursions Nara & Uji)',
    vibe: 'Contemplative, poétique, raffinée et profondément ressourçante',
    highlights: [
      'Traversée mystique des 10 000 torii vermillon du sanctuaire Fushimi Inari au petit matin',
      'Cérémonie du thé authentique dans une maison de bois centenaire de Gion',
      'Promenade enchanteresse dans la forêt de bambous géants d’Arashiyama et temple Tenryu-ji'
    ],
    gastronomy: {
      mustTryDishes: ['Kaiseki Ryori (haute cuisine de saison)', 'Ramen au bouillon de canard', 'Matcha Uji & Wagashi (douceurs artisanales)', 'Yuba (peau de tofu soyeuse)'],
      specialtyDesc: 'Une cuisine axée sur la pureté des goûts locaux de saison, la vaisselle en céramique travaillée et l’équilibre des 5 saveurs.',
      foodieSpot: 'Marché Nishiki surnommé la "cuisine de Kyoto" et ses échoppes de brochettes grillées minute'
    },
    budget: {
      currency: 'JPY (Yen)',
      flightEstimatePerPerson: 780,
      lodgingPerNight: 110,
      foodPerDayPerPerson: 45,
      activitiesPerDayPerPerson: 25,
      totalEstimated7DaysPerPerson: 1850,
      budgetTip: 'Prenez le pass de train régional JR West Kansai et achetez les délicieux bentos de gare (Ekiben) pour vos déjeuners.'
    },
    itinerary: [
      {
        day: 1,
        title: 'L’Aube Mystique à Fushimi Inari & Le Cœur de Gion',
        morning: 'Arrivée matinale à Fushimi Inari pour gravir le mont à travers les torii rouges sans la foule.',
        afternoon: 'Balade le long du canal Shirakawa et découverte des ruelles traditionnelles de Gion.',
        evening: 'Dîner dégustation de soba artisanales dans une échoppe cachée près de Pontocho.',
        highlight: 'La lumière dorée du crépuscule filtrant sur les lanternes de bois de Pontocho'
      },
      {
        day: 2,
        title: 'L’Éclat du Pavillon d’Or & La Sérénité Zen',
        morning: 'Visite contemplative du Kinkaku-ji (Pavillon d’Or) reflété dans son étang miroir.',
        afternoon: 'Méditation face au jardin de pierres ratissées du temple Ryoan-ji et sanctuaire Kitano Tenmangu.',
        evening: 'Dégustation d’un bouillon ramen réconfortant dans le quartier de Kawaramachi.',
        highlight: 'Le contraste éblouissant de l’or pur entouré par une nature impeccablement taillée'
      },
      {
        day: 3,
        title: 'Arashiyama : Bambouseraie & Rencontre avec les macaques',
        morning: 'Immersion sous les bambous géants bruissant au vent et visite du temple Tenryu-ji.',
        afternoon: 'Traversée du pont Togetsukyo et ascension de la colline aux singes Iwatayama.',
        evening: 'Bain relaxant dans un onsen thermal traditionnel avec vue sur la rivière Oi.',
        highlight: 'La sérénité absolue du jardin paysager de Tenryu-ji avec la montagne en toile de fond'
      },
      {
        day: 4,
        title: 'Excursion à Nara & Les Biches Sacrées',
        morning: 'Trajet en train vers Nara, visite de l’immense Bouddha en bronze du Todai-ji.',
        afternoon: 'Marche dans le parc aux cerfs shika sacrés et visite du sanctuaire Kasuga Taisha aux mille lanternes.',
        evening: 'Retour à Kyoto et dîner de brochettes yakitori au feu de bois.',
        highlight: 'L’incroyable charpente en bois du Todai-ji, l’un des plus grands édifices en bois au monde'
      },
      {
        day: 5,
        title: 'Le Chemin de la Philosophie & Le Pavillon d’Argent',
        morning: 'Flânerie le long du canal bordé d’arbres du Chemin de la Philosophie jusqu’au Ginkaku-ji.',
        afternoon: 'Shopping d’artisanat (céramiques Kiyomizu-yaki, thés grands crus) à Higashiyama.',
        evening: 'Dîner gastronomique d’adieu dans un ryokan traditionnel avec tatamis et futons.',
        highlight: 'La vue plongeante sur la ville depuis la terrasse en bois suspendue du temple Kiyomizu-dera'
      }
    ],
    practicalTips: {
      visa: 'Exemption de visa court séjour touristique pour les ressortissants UE / Suisse / Canada',
      currency: 'Yen japonais (JPY) - De nombreux petits commerces préfèrent encore les espèces',
      languages: 'Japonais (anglais parlé dans les gares et hôtels, signalétique bilingue)',
      safetyLevel: 'Exceptionnel (l’un des pays les plus sûrs au monde)',
      localTransport: 'Réseau de bus et métros dense, vélos de location parfaits pour les quartiers plats',
      insiderSecret: 'Réveillez-vous à 6h30 pour visiter Kiyomizu-dera : vous aurez le balcon de bois pour vous seul !'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort', 'luxury'],
      pace: ['balanced', 'active_explorer'],
      climates: ['temperate_mild'],
      landscapes: ['historic_cities', 'countryside', 'mountains'],
      crowd: ['balanced_mix', 'vibrant_lively'],
      companions: ['solo', 'couple', 'family', 'friends'],
      culturalTags: ['ancient_history', 'art_museums', 'local_traditions', 'architecture', 'crafts_markets'],
      foodFlavors: ['asian_sweet_savory', 'comfort_traditional'],
      foodImportanceMin: 3,
      activities: ['cultural_visits', 'wellness_spa', 'nightlife_shopping'],
      physicalIntensityRange: [2, 3],
      flightCategory: 'long',
      continentTag: 'asia',
      seasons: ['spring', 'autumn'],
      vibes: ['cultural_shock', 'disconnection', 'romance']
    }
  },
  {
    id: 'oaxaca-mexico',
    name: 'Oaxaca de Juárez & Côte Pacifique',
    country: 'Mexique',
    continent: 'Amériques',
    region: 'Oaxaca',
    matchScore: 96,
    tagline: 'Capitale gastronomique du Mexique, artisanat zapotèque vibrant et pyramides sacrées',
    coverImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Cuisine Reine du Monde', 'Art & Couleurs Baroques', 'Ruines Zapotèques', 'Super Convivial'],
    whyPerfect: 'Oaxaca est le cœur battant des traditions mexicaines : des ruelles coloniales colorées aux 7 variétés de moles épicés, en passant par les distilleries de mezcal ancestral.',
    summary: 'Niché dans une vallée entourée de sierras, Oaxaca offre un condensé d’artisanat d’art, de marchés bouillonnants, de sites archéologiques précolombiens majeurs et d’une chaleur humaine exceptionnelle.',
    bestSeasons: ['Automne (Fête des Morts)', 'Hiver (Décembre à Février)', 'Printemps'],
    weatherExpected: 'Ensoleillé et tempéré toute l’année (22°C à 28°C le jour, nuits fraîches vivifiantes).',
    flightTimeFromEurope: '~13h (Vol direct Mexico City + correspondance interne 1h)',
    idealDuration: '10 à 15 jours (avec séjour vers Puerto Escondido)',
    vibe: 'Chaleureuse, colorée, gourmande, festive et mystique',
    highlights: [
      'Exploration au lever du soleil de l’ancienne cité zapotèque de Monte Albán au sommet de la montagne',
      'Dégustation des 7 moles oaxaqueños et du chocolat chaud à la cannelle au marché 20 de Noviembre',
      'Excursion aux cascades pétrifiées spectaculaires de Hierve el Agua avec piscines naturelles'
    ],
    gastronomy: {
      mustTryDishes: ['Tlayudas croustillantes au quesillo', 'Mole negro au chocolat & piments séchés', 'Tacos de chapulines (sauterelles grillées à la lime)', 'Mezcal artisanal tob义la'],
      specialtyDesc: 'Classée au patrimoine immatériel de l’UNESCO, la cuisine oaxaquienne est l’une des plus complexes et savoureuses de la planète.',
      foodieSpot: 'Le marché de Tlacolula le dimanche, l’un des plus anciens marchés indigènes d’Amérique'
    },
    budget: {
      currency: 'MXN (Peso mexicain)',
      flightEstimatePerPerson: 720,
      lodgingPerNight: 65,
      foodPerDayPerPerson: 25,
      activitiesPerDayPerPerson: 20,
      totalEstimated7DaysPerPerson: 1350,
      budgetTip: 'Mangez dans les Comedores des marchés locaux : festin gargantuesque et authentique pour moins de 6€ par personne.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée au Zócalo & Église Santo Domingo',
        morning: 'Installation dans un hôtel colonial aux patios fleuris et premier café de la Sierra Madre.',
        afternoon: 'Visite de l’église baroque Santo Domingo et du magnifique jardin ethnobotanique.',
        evening: 'Dîner sur une terrasse panoramique dominant la place du Zócalo animée par les mariachis.',
        highlight: 'La façade sculptée dorée à la feuille d’or de Santo Domingo à la tombée de la nuit'
      },
      {
        day: 2,
        title: 'Monte Albán & Les Villages d’Artisans',
        morning: 'Ascension matinale de Monte Albán, vue à 360° sur toute la vallée d’Oaxaca.',
        afternoon: 'Visite des ateliers de poterie noire de San Bartolo Coyotepec et des Alebrijes en bois peint d’Arrazola.',
        evening: 'Dégustation initiatique de mezcal chez un mezcalier indépendant.',
        highlight: 'L’immensité de la Grande Place de Monte Albán chargée d’énergie précolombienne'
      },
      {
        day: 3,
        title: 'Hierve el Agua & L’Arbre Géant de Tule',
        morning: 'Baignade dans les vasques turquoise de Hierve el Agua au bord de la falaise vertigineuse.',
        afternoon: 'Arrêt sous le tronc millénaire de l’Árbol del Tule (le plus gros diamètre d’arbre au monde).',
        evening: 'Festin de Tlayudas et guacamole frais au marché Benito Juárez.',
        highlight: 'La vue plongeante depuis les piscines naturelles d’eau minérale sur les canyons sauvages'
      },
      {
        day: 4,
        title: 'Teotitlán del Valle & Teintures Naturelles',
        morning: 'Rencontre avec les maîtres tisserands zapotèques utilisant la cochenille et l’indigo naturel.',
        afternoon: 'Visite des ruines aux mosaïques de pierre de Mitla, la cité des morts.',
        evening: 'Dîner gastronomique au restaurant Criollo d’Enrique Olvera.',
        highlight: 'Voir la laine brute se teinter instantanément en écarlate vif grâce aux pigments naturels'
      },
      {
        day: 5,
        title: 'Marchés d’Épices, Chocolat & Festivités',
        morning: 'Atelier de confection de chocolat traditionnel à la pierre de metate.',
        afternoon: 'Dernier shopping d’artisanat textile et poteries dans les galeries indépendantes de Jalatlaco.',
        evening: 'Concert de musique traditionnelle en plein air et toast au mezcal.',
        highlight: 'Les ruelles pavées de Jalatlaco aux fresques murales multicolores sous les fanions de papier découpé'
      }
    ],
    practicalTips: {
      visa: 'Formulaire FMM touristique gratuit fourni à l’arrivée pour les citoyens UE/Canada/Suisse',
      currency: 'Peso Mexicain (MXN) - Distributeurs automatiques fiables dans le centre-ville',
      languages: 'Espagnol (nombreuses langues indigènes zapotèques et mixtèques parlées)',
      safetyLevel: 'Oaxaca est l’un des États les plus sûrs et paisibles du Mexique',
      localTransport: 'Taxis partagés (Colectivos) très économiques et marche à pied idéale dans le centre historique',
      insiderSecret: 'Commandez votre chocolat chaud "con agua" (à l’eau) plutôt qu’au lait : c’est la recette zapotèque originale qui décuple les arômes de cacao !'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate', 'comfort'],
      pace: ['balanced', 'active_explorer'],
      climates: ['temperate_mild', 'tropical_warm'],
      landscapes: ['historic_cities', 'mountains', 'countryside'],
      crowd: ['balanced_mix'],
      companions: ['solo', 'couple', 'friends', 'digital_nomad'],
      culturalTags: ['ancient_history', 'local_traditions', 'crafts_markets', 'music_festivals'],
      foodFlavors: ['spicy_exotic', 'comfort_traditional'],
      foodImportanceMin: 4,
      activities: ['cultural_visits', 'nightlife_shopping', 'hiking_outdoor'],
      physicalIntensityRange: [2, 3],
      flightCategory: 'long',
      continentTag: 'americas',
      seasons: ['autumn', 'winter', 'spring'],
      vibes: ['cultural_shock', 'festive', 'romance']
    }
  },
  {
    id: 'reykjavik-iceland',
    name: 'Islande : Fjords, Glaciers & Aurores',
    country: 'Islande',
    continent: 'Europe',
    region: 'Cercle d’Or & Sud Sauvage',
    matchScore: 95,
    tagline: 'Terre de glace et de feu, cascades tonitruantes et bains chauds géothermiques',
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Nature Brute & Volcans', 'Aurores Boréales', 'Bains Géothermaux', 'Aventure Hors Norme'],
    whyPerfect: 'L’Islande est le sanctuaire ultime des grands espaces préservés : geysers jaillissants, plages de sable noir basaltique et lagons glaciaires scintillants.',
    summary: 'Une île où la terre continue de naître sous vos yeux. Idéale pour les amoureux de panoramas dramatiques, de randonnées vivifiantes et de bains dans des sources chaudes naturelles fumantes.',
    bestSeasons: ['Automne/Hiver (Aurores boréales & Neige)', 'Été (Soleil de minuit & Pistes intérieures)'],
    weatherExpected: 'Climat frais océanique (10-15°C en été, -2 à 3°C en hiver). Vêtements coupe-vent et multicouches indispensables.',
    flightTimeFromEurope: '~3h30 (Vols directs depuis Paris, Londres, Francfort)',
    idealDuration: '7 à 10 jours pour la côte Sud et le Cercle d’Or',
    vibe: 'Grandiose, sauvage, régénérante et féerique',
    highlights: [
      'Marche sur la plage de sable noir de Reynisfjara et ses orgues basaltiques monumentaux',
      'Navigation en zodiac entre les icebergs bleus flottants de la lagune de Jökulsárlón',
      'Bain relaxant dans les eaux laiteuses et riches en silice du Blue Lagoon ou Sky Lagoon'
    ],
    gastronomy: {
      mustTryDishes: ['Soupe d’agneau islandais (Kjötsúpa)', 'Omble chevalier et saumon sauvage grillé', 'Pain de seigle cuit dans le sable volcanique chaud (Rúgbrauð)', 'Skyr crémeux aux myrtilles sauvages'],
      specialtyDesc: 'Une cuisine nordique moderne épurée valorisant la fraîcheur absolue des poissons d’Atlantique Nord et des herbes arctiques.',
      foodieSpot: 'Hlemmur Mathöll à Reykjavik, halle gourmande conviviale avec cuisine locale inventive'
    },
    budget: {
      currency: 'ISK (Couronne islandaise)',
      flightEstimatePerPerson: 290,
      lodgingPerNight: 160,
      foodPerDayPerPerson: 60,
      activitiesPerDayPerPerson: 50,
      totalEstimated7DaysPerPerson: 2100,
      budgetTip: 'Faites vos courses au supermarché Bónus (logo petit cochon jaune) pour vos pique-niques de mi-journée sur les routes.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Reykjavik & Bains du Sky Lagoon',
        morning: 'Vol vers Keflavík, installation dans le centre design et coloré de Reykjavik.',
        afternoon: 'Balade vers l’église futuriste Hallgrímskirkja et le port Harpa.',
        evening: 'Rituel thermal en 7 étapes au Sky Lagoon avec vue infinie sur l’océan.',
        highlight: 'La vue à 360° sur toute la baie enneigée depuis la piscine à débordement chaude'
      },
      {
        day: 2,
        title: 'Le Mythique Cercle d’Or',
        morning: 'Visite de la faille tectonique de Thingvellir où se rencontrent l’Amérique et l’Eurasie.',
        afternoon: 'Spectacle du geyser Strokkur qui jaillit à 20 mètres toutes les 6 minutes, puis cascade Gullfoss.',
        evening: 'Nuit en chalet avec terrasse et observation du ciel à la recherche d’aurores boréales.',
        highlight: 'Le rugissement colossal de la double cascade de Gullfoss'
      },
      {
        day: 3,
        title: 'Cascades Majeures & Plages Noires de Vik',
        morning: 'Passage sous le rideau d’eau de Seljalandsfoss et découverte de la majestueuse Skógafoss.',
        afternoon: 'Marche le long des falaises de Dyrhólaey et plage de sable noir de Reynisfjara.',
        evening: 'Dégustation d’un filet de truite arctique au coin du feu dans une auberge de Vik.',
        highlight: 'Le contraste saisissant du sable noir d’encre contre l’écume blanche de l’Atlantique'
      },
      {
        day: 4,
        title: 'Glaciers Éternels & Diamants de Glace',
        morning: 'Randonnée guidée avec crampons sur la langue glaciaire de Sólheimajökull.',
        afternoon: 'Émerveillement devant les icebergs scintillants échoués sur Diamond Beach et Jökulsárlón.',
        evening: 'Dîner réconfortant de soupe d’agneau islandaise.',
        highlight: 'Toucher les blocs de glace pure millénaire translucides comme du cristal sur le sable noir'
      },
      {
        day: 5,
        title: 'Retour le long de la Côte Sud & Boutiques de Laine',
        morning: 'Visite du village de pêcheurs d’Eyrarbakki et découverte des maisons de bois du XIXe.',
        afternoon: 'Arrêt à Hveragerði pour tremper les pieds dans une rivière naturellement chaude.',
        evening: 'Dernier verre de bière artisanale islandaise dans un pub animé de la rue Laugavegur.',
        highlight: 'La baignade au milieu des fumerolles dans la vallée géothermique de Reykjadalur'
      }
    ],
    practicalTips: {
      visa: 'Espace Schengen : Carte d’identité ou passeport européen valide suffisant',
      currency: 'Couronne islandaise (ISK) - Le pays est 100% sans espèces (CB et paiement sans contact acceptés partout)',
      languages: 'Islandais (anglais parlé couramment et avec fluidité par la totalité de la population)',
      safetyLevel: 'Pays n°1 mondial au classement de la paix et de la sécurité',
      localTransport: 'Location d’un véhicule 4x4 ou SUV vivement recommandée pour une autonomie totale',
      insiderSecret: 'Téléchargez l’application "Vedur" et "Aurora Alerts" pour surveiller la météo en direct et les indices de nébulosité des aurores !'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['active_explorer', 'intense_adventure'],
      climates: ['cool_mountain', 'cold_snow', 'any'],
      landscapes: ['mountains', 'deserts', 'beaches'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['solo', 'couple', 'friends'],
      culturalTags: ['architecture', 'local_traditions'],
      foodFlavors: ['seafood', 'comfort_traditional'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'wellness_spa', 'water_sports'],
      physicalIntensityRange: [3, 5],
      flightCategory: 'short',
      continentTag: 'europe',
      seasons: ['summer', 'autumn', 'winter'],
      vibes: ['adrenaline', 'disconnection', 'romance']
    }
  },
  {
    id: 'cape-town-south-africa',
    name: 'Le Cap, Vignobles & Péninsule Sauvage',
    country: 'Afrique du Sud',
    continent: 'Afrique',
    region: 'Cap-Occidental',
    matchScore: 94,
    tagline: 'Rencontre spectaculaire entre deux océans, montagnes mythiques et vignobles d’exception',
    coverImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Paysages Pharaoniques', 'Grands Vins & Gastronomie', 'Manchots & Faune', 'Super Rapport Qualité/Prix'],
    whyPerfect: 'Cape Town offre une diversité de paysages unique au monde : la Table Mountain qui plonge dans l’océan, des manchots en liberté sur la plage de Boulders, et les routes des vins de Stellenbosch.',
    summary: 'Une des plus belles villes côtières de la planète, réputée pour sa créativité artistique, ses marchés fermiers d’exception, son histoire émouvante et son accès immédiat à une nature grandiose.',
    bestSeasons: ['Automne/Hiver austral (Octobre à Avril = Été au Cap)'],
    weatherExpected: 'Méditerranéen chaud et ensoleillé (24°C à 30°C de novembre à mars), brise océanique vivifiante.',
    flightTimeFromEurope: '~11h30 (Même fuseau horaire que l’Europe : aucun jet-lag !)',
    idealDuration: '10 à 14 jours (avec safari privé dans le Karoo ou Garden Route)',
    vibe: 'Cosmopolite, grandiose, épicurienne, ensoleillée et vibrante',
    highlights: [
      'Ascension en téléphérique tournant au sommet plat de Table Mountain au coucher du soleil',
      'Observation des colonies de manchots du Cap se dandinant sur le sable blanc de Boulders Beach',
      'Dégustation de Pinotage et déjeuners gastronomiques dans les domaines historiques de Franschhoek'
    ],
    gastronomy: {
      mustTryDishes: ['Braai traditionnel (barbecue sud-africain au bois)', 'Bobotie aux épices douces et amandes', 'Poissons Kingklip et huîtres fraîches de Knysna', 'Vins de Chenin Blanc & Pinotage médaillés'],
      specialtyDesc: 'Une scène culinaire d’envergure mondiale mêlant influences hollandaises, malaises du Cap, françaises et africaines.',
      foodieSpot: 'The Old Biscuit Mill le samedi matin à Woodstock pour ses stands de chefs locaux inventifs'
    },
    budget: {
      currency: 'ZAR (Rand sud-africain)',
      flightEstimatePerPerson: 650,
      lodgingPerNight: 85,
      foodPerDayPerPerson: 30,
      activitiesPerDayPerPerson: 30,
      totalEstimated7DaysPerPerson: 1550,
      budgetTip: 'Le taux de change est très avantageux pour les voyageurs européens : les restaurants étoilés et les dégustations de vins sont à une fraction des prix européens.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Table Mountain & Quartier Coloré de Bo-Kaap',
        morning: 'Téléphérique pour Table Mountain et panorama saisissant sur les deux océans.',
        afternoon: 'Balade à pied dans les ruelles pavées aux façades pastel de Bo-Kaap.',
        evening: 'Dîner de fruits de mer sur le V&A Waterfront animé.',
        highlight: 'La vue vertigineuse sur toute la péninsule depuis le plateau de Table Mountain'
      },
      {
        day: 2,
        title: 'La Route Panoramique du Cap de Bonne-Espérance',
        morning: 'Trajet sur Chapman’s Peak Drive, l’une des plus spectaculaires routes côtières au monde.',
        afternoon: 'Randonnée au Cap de Bonne-Espérance et arrêt avec les manchots à Boulders Beach.',
        evening: 'Cocktail face au coucher de soleil sur les plages de sable de Camps Bay.',
        highlight: 'Se tenir à la pointe mythique du continent africain balayée par les embruns'
      },
      {
        day: 3,
        title: 'La Vallée des Vins de Stellenbosch & Franschhoek',
        morning: 'Route vers les vignobles entourés de montagnes spectaculaires.',
        afternoon: 'Balade dans le tramway des vins de Franschhoek et dégustation de crus renommés.',
        evening: 'Dîner gastronomique dans un domaine viticole sous les chênes centenaires.',
        highlight: 'Le contraste entre l’architecture Cape Dutch d’un blanc éclatant et les vignes verdoyantes'
      },
      {
        day: 4,
        title: 'Jardin Botanique de Kirstenbosch & Lion’s Head',
        morning: 'Marche sur la passerelle aérienne suspendue "Boomslang" au milieu de la flore unique des Fynbos.',
        afternoon: 'Visite du musée d’art contemporain Zeitz MOCAA dans les anciens silos à grains géants.',
        evening: 'Ascension de Lion’s Head à la pleine lune.',
        highlight: 'L’architecture intérieure magistrale du Zeitz MOCAA sculptée dans le béton'
      },
      {
        day: 5,
        title: 'Surf à Muizenberg & Marchés Fermiers',
        morning: 'Initiation au surf le long des cabines de bain multicolores de Muizenberg.',
        afternoon: 'Shopping créatif dans les boutiques d’artisanat d’art de Kalk Bay.',
        evening: 'Grand Braai convivial avec vue sur l’océan Atlantique.',
        highlight: 'L’ambiance décontractée et bohème des villages de pêcheurs de False Bay'
      }
    ],
    practicalTips: {
      visa: 'Séjour touristique sans visa jusqu’à 90 jours (passeport avec au moins 2 pages vierges)',
      currency: 'Rand sud-africain (ZAR) - Cartes bancaires acceptées absolument partout',
      languages: 'Anglais (langue officielle des affaires et du tourisme), Afrikaans, Xhosa',
      safetyLevel: 'Très bon dans les quartiers touristiques (City Bowl, Camps Bay, Waterfront, Vignes) en respectant les règles classiques de nuit',
      localTransport: 'Application Uber omniprésente, ultra-rapide, très sécurisée et très peu chère',
      insiderSecret: 'Prenez la route de Chapman’s Peak en fin d’après-midi : la lumière rasante sur les falaises de granit rouge est absolument inoubliable !'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort', 'luxury'],
      pace: ['balanced', 'active_explorer'],
      climates: ['temperate_mild', 'tropical_warm'],
      landscapes: ['mountains', 'beaches', 'countryside', 'historic_cities'],
      crowd: ['balanced_mix', 'vibrant_lively'],
      companions: ['solo', 'couple', 'friends', 'family'],
      culturalTags: ['art_museums', 'architecture', 'music_festivals', 'crafts_markets'],
      foodFlavors: ['comfort_traditional', 'seafood', 'spicy_exotic'],
      foodImportanceMin: 4,
      activities: ['hiking_outdoor', 'water_sports', 'safari_wildlife', 'nightlife_shopping'],
      physicalIntensityRange: [2, 4],
      flightCategory: 'long',
      continentTag: 'africa',
      seasons: ['winter', 'autumn', 'spring'],
      vibes: ['adrenaline', 'festive', 'romance', 'disconnection']
    }
  },
  {
    id: 'amalfi-italy',
    name: 'Côte Amalfitaine & Île de Capri',
    country: 'Italie',
    continent: 'Europe',
    region: 'Campanie',
    matchScore: 93,
    tagline: 'Falaises vertigineuses sur la Méditerranée, citronniers en terrasse et Dolce Vita absolue',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Dolce Vita & Romantisme', 'Villages Suspendus', 'Cuisine Italienne Reine', 'Panoramas Maritimes'],
    whyPerfect: 'Positano, Amalfi et Ravello incarnent l’élégance méditerranéenne par excellence : falaises fleuries de bougainvilliers, déjeuners de pâtes aux palourdes et couchers de soleil dorés.',
    summary: 'Classée au patrimoine de l’UNESCO, la côte Amalfitaine serpente entre mer turquoise et montagnes escarpées. Idéale pour les amoureux de gastronomie raffinée, de villages pastel et de balades en bateau.',
    bestSeasons: ['Printemps (Mai à Juin)', 'Automne (Septembre à Octobre)'],
    weatherExpected: 'Méditerranéen chaud et très lumineux (22°C à 27°C au printemps et début d’automne).',
    flightTimeFromEurope: '~2h15 (Vol direct Naples + transfert voiture/ferry 1h)',
    idealDuration: '5 à 8 jours',
    vibe: 'Romantique, épicurienne, glamour et élégante',
    highlights: [
      'Vue aérienne époustouflante depuis la terrasse de l’Infini de la Villa Cimbrone à Ravello',
      'Randonnée mythique sur le Sentier des Dieux (Sentiero degli Dei) dominant la mer d’azur',
      'Journée en bateau privé autour des Faraglioni de Capri et baignade dans les grottes marines'
    ],
    gastronomy: {
      mustTryDishes: ['Scialatielli ai frutti di mare (pâtes fraîches aux fruits de mer)', 'Mozzarella di Bufala Campana AOP', 'Delizia al Limone (gâteau moelleux au citron d’Amalfi)', 'Limoncello artisanal glacé'],
      specialtyDesc: 'L’essence même de la cuisine du sud de l’Italie : citrons géants parfumés Sfusato Amalfitano, huile d’olive dorée et poissons du jour.',
      foodieSpot: 'Trattoria da Adolfo accessible uniquement en bateau sur la petite crique de Laurito'
    },
    budget: {
      currency: 'EUR (€)',
      flightEstimatePerPerson: 180,
      lodgingPerNight: 150,
      foodPerDayPerPerson: 55,
      activitiesPerDayPerPerson: 40,
      totalEstimated7DaysPerPerson: 1750,
      budgetTip: 'Privilégiez les ferries maritimes plutôt que les taxis côtiers : plus rapides, aucune circulation, et vue magique depuis la mer pour 10€ par trajet.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Positano & Découverte des Ruelles en Cascade',
        morning: 'Arrivée par bateau à Positano, vue sur les maisons pastel accrochées à la falaise.',
        afternoon: 'Flânerie dans les boutiques de lin blanc et de sandales en cuir sur mesure.',
        evening: 'Apéritif Spritz face à la mer et dîner de poisson frais sur la plage.',
        highlight: 'L’illumination féerique du village de Positano qui s’allume comme une crèche dans la nuit'
      },
      {
        day: 2,
        title: 'Ravello : Entre Ciel et Mer',
        morning: 'Montée vers les hauteurs calmes et aristocratiques du village de Ravello.',
        afternoon: 'Visite des jardins luxuriants de la Villa Rufolo et de la Villa Cimbrone.',
        evening: 'Concert de musique classique en plein air suspendu au-dessus de la mer.',
        highlight: 'La terrasse de l’Infini ornée de bustes en marbre blanc dominant le bleu cobalt'
      },
      {
        day: 3,
        title: 'Le Sentier des Dieux & Furore',
        morning: 'Randonnée le long des crêtes panoramiques du Sentiero degli Dei depuis Bomerano.',
        afternoon: 'Descente vers le spectaculaire fjord caché de Furore et baignade.',
        evening: 'Dégustation de vins locaux DOC Costa d’Amalfi et mozzarella grillée dans des feuilles de citronnier.',
        highlight: 'Le panorama à 180° embrassant toute la côte jusqu’à l’île de Capri'
      },
      {
        day: 4,
        title: 'Capri & Les Faraglioni',
        morning: 'Traversée en ferry matinal vers Capri et ascension en télésiège au Mont Solaro.',
        afternoon: 'Promenade dans les jardins d’Auguste et tour de l’île en gozzo traditionnel.',
        evening: 'Retour à Amalfi et dîner sur la place de la cathédrale Saint-André.',
        highlight: 'Passer en bateau sous l’arche naturelle immense des rochers Faraglioni'
      },
      {
        day: 5,
        title: 'Amalfi Historique & Vergers de Citronniers',
        morning: 'Visite du cloître du Paradis et de la monumentale cathédrale arabo-normande d’Amalfi.',
        afternoon: 'Visite guidée d’un verger de citronniers en terrasse avec dégustation de limoncello.',
        evening: 'Dernier dîner romantique aux chandelles sur une terrasse privée.',
        highlight: 'L’arôme envoûtant des fleurs de citronniers sous la chaleur douce de fin d’après-midi'
      }
    ],
    practicalTips: {
      visa: 'Union Européenne : Carte d’identité valide',
      currency: 'Euro (€)',
      languages: 'Italien (anglais et français parlés dans le secteur hôtelier)',
      safetyLevel: 'Excellente sécurité sur l’ensemble de la côte',
      localTransport: 'Privilégiez les ferries (Travelmar) pour éviter les embouteillages de la route côtière',
      insiderSecret: 'Logez à Praiano ou Ravello plutôt qu’à Positano : beaucoup plus calme, plus authentique, et le soleil s’y couche plus tard !'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['relaxation', 'balanced'],
      climates: ['temperate_mild', 'tropical_warm'],
      landscapes: ['historic_cities', 'beaches', 'mountains'],
      crowd: ['balanced_mix', 'vibrant_lively'],
      companions: ['couple', 'friends'],
      culturalTags: ['ancient_history', 'art_museums', 'architecture'],
      foodFlavors: ['mediterranean_fresh', 'seafood', 'comfort_traditional'],
      foodImportanceMin: 4,
      activities: ['cultural_visits', 'water_sports', 'wellness_spa'],
      physicalIntensityRange: [1, 3],
      flightCategory: 'short',
      continentTag: 'europe',
      seasons: ['spring', 'summer', 'autumn'],
      vibes: ['romance', 'disconnection', 'festive']
    }
  },
  {
    id: 'luang-prabang-laos',
    name: 'Luang Prabang & Fleuve Mékong',
    country: 'Laos',
    continent: 'Asie',
    region: 'Haut-Mékong',
    matchScore: 92,
    tagline: 'Cité royale bouddhiste au bord du Mékong, cascades turquoise et douceur de vivre',
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Sérénité Bouddhiste', 'Pépite Préservée', 'Cascades Féeriques', 'Voyage Éco-Responsable'],
    whyPerfect: 'Luang Prabang est l’un des joyaux les plus paisibles d’Asie du Sud-Est : architecture coloniale française mêlée aux temples dorés laotiens, aurores silencieuses et cascades de Kuang Si.',
    summary: 'Lovée au confluent du Mékong et de la rivière Nam Khan, cette ancienne capitale royale invite à ralentir : aumône matinale des moines, croisières au couchant et marchés nocturnes artisanaux.',
    bestSeasons: ['Automne / Hiver (Novembre à Février - Saison sèche et fraîche)'],
    weatherExpected: 'Chaleur agréable et journées ensoleillées (24°C à 28°C le jour, soirées fraîches à 16°C).',
    flightTimeFromEurope: '~14h (Via Bangkok ou Hanoï)',
    idealDuration: '7 à 10 jours',
    vibe: 'Paisible, spirituelle, bienveillante et poétique',
    highlights: [
      'Baignade dans les bassins naturels étagés couleur turquoise des cascades de Kuang Si',
      'Cérémonie du Tak Bat (aumône des moines en robe safran) au lever du jour dans le silence',
      'Croisière lente au crépuscule sur le Mékong sauvage bordé de collines de jungle'
    ],
    gastronomy: {
      mustTryDishes: ['Laap (salade d’herbes fraîches, citron vert et viande émincée)', 'Khao Jee (sandwich baguette à la laotienne)', 'Khao Soi laotien aux nouilles de riz et porc mijoté', 'Riz gluant traditionnel dans son panier tressé'],
      specialtyDesc: 'Une cuisine fraîche et aromatique parfumée à la coriandre, menthe, citronnelle et pâte de piment séché Jaew Bong.',
      foodieSpot: 'Le marché du matin (Morning Market) pour ses galettes de coco chaudes Khao Nom Krok'
    },
    budget: {
      currency: 'LAK (Kip laotien)',
      flightEstimatePerPerson: 750,
      lodgingPerNight: 45,
      foodPerDayPerPerson: 18,
      activitiesPerDayPerPerson: 15,
      totalEstimated7DaysPerPerson: 1190,
      budgetTip: 'Le coût de la vie sur place est extrêmement doux : vous pouvez séjourner dans de superbes villas coloniales pour un prix très modéré.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée & Mont Phousi au Crépuscule',
        morning: 'Arrivée et installation dans une maison d’hôtes en bois de teck au bord du fleuve.',
        afternoon: 'Visite du temple Wat Xieng Thong et de sa fresque de l’arbre de vie en mosaïques de verre.',
        evening: 'Ascension des 328 marches du Mont Phousi pour admirer le coucher de soleil sur le Mékong.',
        highlight: 'La lumière dorée sur les toits superposés des monastères depuis le sommet du mont'
      },
      {
        day: 2,
        title: 'Les Cascades Turquoise de Kuang Si',
        morning: 'Départ tôt pour les chutes de Kuang Si et baignade dans les piscines naturelles cristallines.',
        afternoon: 'Visite du sanctuaire de protection des ours de lune (Free the Bears).',
        evening: 'Dîner de spécialités laotiennes au restaurant Tamarind.',
        highlight: 'La couleur bleu laiteux surnaturelle de l’eau au milieu de la forêt tropicale'
      },
      {
        day: 3,
        title: 'Grottes de Pak Ou & Village du Papier Saa',
        morning: 'Embarquement sur une pirogue en bois pour remonter le Mékong jusqu’aux grottes sacrées aux 4000 bouddhas.',
        afternoon: 'Arrêt au village d’artisans de Ban Xang Khong (tissages de soie et papier artisanal aux fleurs séchées).',
        evening: 'Flânerie sous les lampions rouges du marché de nuit artisanal.',
        highlight: 'Le silence apaisant de la navigation fluviale entre les falaises karstiques'
      },
      {
        day: 4,
        title: 'Immersion Rurale & Atelier de Riziculture',
        morning: 'Journée d’initiation dans une ferme communautaire écologique (Living Land Farm).',
        afternoon: 'Massage traditionnel laotien aux herbes chaudes dans un spa de bambou.',
        evening: 'Cocktail au bord de la rivière Nam Khan éclairée aux bougies.',
        highlight: 'Partager le repas traditionnel préparé avec les agriculteurs locaux'
      },
      {
        day: 5,
        title: 'Cérémonie du Baci & Éveil Spirituel',
        morning: 'Réveil à 5h30 pour observer le cortège silencieux des moines dans la brume matinale.',
        afternoon: 'Participation à une cérémonie traditionnelle de vœux du Baci avec les aînés du village.',
        evening: 'Dernier verre sur un bateau-ponton au fil de l’eau.',
        highlight: 'Les fils de coton blanc bénis noués autour du poignet en signe de protection et d’amitié'
      }
    ],
    practicalTips: {
      visa: 'E-Visa en ligne ou Visa à l’arrivée (35-40 USD en espèces)',
      currency: 'Kip laotien (LAK) - Ayez quelques dollars US neufs en réserve pour les formalités',
      languages: 'Lao (français historique parlé par certains aînés, anglais dans le tourisme)',
      safetyLevel: 'Très haut niveau de sécurité et bienveillance remarquable de la population',
      localTransport: 'Vélos de ville gratuits dans la plupart des guesthouses, marche à pied agréable',
      insiderSecret: 'Respectez scrupuleusement la cérémonie du Tak Bat en vous tenant à distance respectueuse sans flash photo pour préserver la ferveur spirituelle.'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate'],
      pace: ['relaxation', 'balanced'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['forests', 'historic_cities', 'mountains'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['solo', 'couple', 'digital_nomad'],
      culturalTags: ['local_traditions', 'ancient_history', 'crafts_markets', 'architecture'],
      foodFlavors: ['spicy_exotic', 'asian_sweet_savory'],
      foodImportanceMin: 3,
      activities: ['cultural_visits', 'wellness_spa', 'water_sports'],
      physicalIntensityRange: [1, 2],
      flightCategory: 'long',
      continentTag: 'asia',
      seasons: ['winter', 'autumn', 'spring'],
      vibes: ['disconnection', 'cultural_shock', 'romance']
    }
  },
  {
    id: 'cusco-peru',
    name: 'Cusco, Vallée Sacrée & Machu Picchu',
    country: 'Pérou',
    continent: 'Amériques',
    region: 'Andes péruviennes',
    matchScore: 95,
    tagline: 'Cœur de l’Empire Inca, citadelles de pierre suspendues dans les nuages et textiles quechuas',
    coverImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Merveille du Monde', 'Histoire Millénaire', 'Trek & Randonnée Mythique', 'Hautes Montagnes'],
    whyPerfect: 'Pour les passionnés de civilisations disparues et de paysages andins vertigineux : ruelles incas pavées de Cusco, terrasses de sel de Maras et citadelle du Machu Picchu.',
    summary: 'Perchée à 3400 mètres d’altitude, Cusco allie fondations incas massives et églises baroques espagnoles, entourée de sommets enneigés et de vallées fertiles peuplées de lamas et d’alpagas.',
    bestSeasons: ['Saison sèche (Mai à Octobre - Ciel bleu immaculé)'],
    weatherExpected: 'Frais et ensoleillé en journée (18°C à 20°C), nuits froides andines (2°C à 5°C).',
    flightTimeFromEurope: '~14h (Vol vers Lima + vol intérieur 1h15)',
    idealDuration: '10 à 14 jours',
    vibe: 'Mystique, grandiose, aventureuse et chargée d’histoire',
    highlights: [
      'Arrivée matinale à la porte du Soleil (Inti Punku) dominant la cité perdue du Machu Picchu',
      'Salines étagées de Maras composées de plus de 3000 bassins blancs ancestraux',
      'Randonnée vers la spectaculaire Montagne Arc-en-Ciel (Vinicunca) aux 7 couleurs minérales'
    ],
    gastronomy: {
      mustTryDishes: ['Ceviche andin à la truite de lac et maïs grillé', 'Lomo Saltado (bœuf sauté au wok à la péruvienne)', 'Causa Rellena aux pommes de terre multicolores', 'Pisco Sour traditionnel au citron vert'],
      specialtyDesc: 'Le Pérou compte plus de 3000 variétés de pommes de terre indigènes et est élu meilleure destination culinaire du monde.',
      foodieSpot: 'Marché San Pedro à Cusco pour ses jus de fruits tropicaux frais pressés minute'
    },
    budget: {
      currency: 'PEN (Sol péruvien)',
      flightEstimatePerPerson: 790,
      lodgingPerNight: 55,
      foodPerDayPerPerson: 22,
      activitiesPerDayPerPerson: 45,
      totalEstimated7DaysPerPerson: 1480,
      budgetTip: 'Prenez le train panoramique PeruRail Expedition plutôt que l’Hiram Bingham pour bénéficier des mêmes paysages à un tiers du tarif.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Acclimatation à Cusco & Quartier San Blas',
        morning: 'Arrivée en douceur, tisane de feuilles de coca pour s’adapter à l’altitude.',
        afternoon: 'Balade dans les ruelles pavées d’artistes de San Blas et observation de la pierre aux 12 angles.',
        evening: 'Dîner de spécialités andines au restaurant Cicciolina.',
        highlight: 'La précision millimétrique des blocs de pierre taillés par les bâtisseurs incas'
      },
      {
        day: 2,
        title: 'Forteresse de Sacsayhuamán & Ruines Hautes',
        morning: 'Visite de l’impressionnante forteresse mégalithique de Sacsayhuamán dominant la ville.',
        afternoon: 'Exploration du temple du soleil Coricancha sur lequel a été bâtie l’église Santo Domingo.',
        evening: 'Concert de musique traditionnelle andine aux flûtes de pan (quena et zampoña).',
        highlight: 'La taille monumentale des blocs de pierre pesant plus de 100 tonnes'
      },
      {
        day: 3,
        title: 'Vallée Sacrée : Maras, Moray & Ollantaytambo',
        morning: 'Découverte des terrasses circulaires concentriques de Moray (laboratoire agricole inca).',
        afternoon: 'Vue saisissante sur les salines de Maras creusées à flanc de montagne.',
        evening: 'Nuit dans le village inca vivant d’Ollantaytambo et départ du train pour Aguas Calientes.',
        highlight: 'Le spectacle géométrique hypnotisant des milliers de miroirs d’eau salée de Maras'
      },
      {
        day: 4,
        title: 'Le Sanctuaire du Machu Picchu',
        morning: 'Entrée dès l’aube au Machu Picchu pour voir les brumes se dissiper sur le Huayna Picchu.',
        afternoon: 'Visite guidée détaillée des quartiers royaux, du temple du Condor et de l’Intihuatana.',
        evening: 'Retour en train panoramique à travers la vallée luxuriante.',
        highlight: 'L’émotion indescriptible au premier regard posé sur la citadelle émergeant des nuages'
      },
      {
        day: 5,
        title: 'La Montagne Arc-en-Ciel (Vinicunca)',
        morning: 'Ascension matinale vers le col à 5000m face aux strates minérales colorées de Vinicunca.',
        afternoon: 'Rencontre avec les éleveurs de lamas en tenue traditionnelle tissée main.',
        evening: 'Dernier festin péruvien à Cusco et toast au Pisco Sour.',
        highlight: 'Le panorama irréel des rayures turquoise, ocre et magenta sculptées par le temps'
      }
    ],
    practicalTips: {
      visa: 'Exemption de visa pour séjours touristiques de moins de 90 jours',
      currency: 'Sol péruvien (PEN) - Les dollars US sont également acceptés pour les excursions',
      languages: 'Espagnol et Quechua (anglais dans les agences et hôtels)',
      safetyLevel: 'Bonne sécurité dans les zones touristiques de Cusco et de la Vallée Sacrée',
      localTransport: 'Trains PeruRail/Inca Rail vers le Machu Picchu, chauffeurs privés très abordables',
      insiderSecret: 'Passez les 2 premières nuits dans la Vallée Sacrée (Ollantaytambo ou Urubamba, 2800m) avant de dormir à Cusco (3400m) : cela facilite grandement l’acclimatation !'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort'],
      pace: ['active_explorer', 'intense_adventure'],
      climates: ['cool_mountain', 'temperate_mild'],
      landscapes: ['mountains', 'historic_cities', 'countryside'],
      crowd: ['balanced_mix'],
      companions: ['solo', 'couple', 'friends'],
      culturalTags: ['ancient_history', 'local_traditions', 'crafts_markets', 'architecture'],
      foodFlavors: ['comfort_traditional', 'spicy_exotic'],
      foodImportanceMin: 3,
      activities: ['hiking_outdoor', 'cultural_visits'],
      physicalIntensityRange: [3, 5],
      flightCategory: 'long',
      continentTag: 'americas',
      seasons: ['spring', 'summer', 'autumn'],
      vibes: ['cultural_shock', 'adrenaline', 'disconnection']
    }
  },
  {
    id: 'banff-canada',
    name: 'Parc National de Banff & Lacs Glaciaires',
    country: 'Canada',
    continent: 'Amériques',
    region: 'Rocheuses canadiennes (Alberta)',
    matchScore: 94,
    tagline: 'Lacs turquoise émeraude, forêts boréales immenses et faune sauvage des Rocheuses',
    coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Grands Espaces Sauvages', 'Lacs Émeraude Légendaires', 'Faune Boréale & Ours', 'Aventure Rando'],
    whyPerfect: 'Pour respirer l’air pur des Rocheuses : canoë rouge sur le lac Moraine, cascades de glace, chalets en rondins et observation des élans et grizzlys.',
    summary: 'Le plus ancien parc national du Canada, sanctuaire de montagnes acérées aux sommets enneigés se reflétant dans des eaux glaciaires d’une pureté irréelle.',
    bestSeasons: ['Été (Juillet à Septembre pour les lacs dégelés)', 'Hiver (Décembre à Mars pour le ski féerique)'],
    weatherExpected: 'Été vivifiant et ensoleillé (18°C à 24°C), nuits fraîches vivifiantes de montagne.',
    flightTimeFromEurope: '~9h30 (Vol direct Calgary + 1h15 de route)',
    idealDuration: '7 à 10 jours',
    vibe: 'Grandiose, vivifiante, pure et aventureuse',
    highlights: [
      'Canoë au lever du soleil sur les eaux turquoise phosphorescentes du lac Moraine',
      'Route spectaculaire de la promenade des Glaciers (Icefields Parkway) et champ de glace Columbia',
      'Détente dans les sources thermales chaudes naturelles de Banff Upper Hot Springs'
    ],
    gastronomy: {
      mustTryDishes: ['Bison braisé au sirop d’érable et myrtilles sauvages', 'Saumon sauvage du Pacifique fumé au bois de cèdre', 'Poutine gourmande au fromage en grains artisanal', 'Tarte aux baies de Saskatoon'],
      specialtyDesc: 'Une cuisine montagnarde généreuse et raffinée sublimant les gibiers nobles, baies boréales et truites des rivières alpines.',
      foodieSpot: 'The Grizzly House à Banff pour ses fondues traditionnelles au coin du feu de bois'
    },
    budget: {
      currency: 'CAD (Dollar canadien)',
      flightEstimatePerPerson: 580,
      lodgingPerNight: 140,
      foodPerDayPerPerson: 48,
      activitiesPerDayPerPerson: 35,
      totalEstimated7DaysPerPerson: 1890,
      budgetTip: 'Achetez le "Pass Découverte Parcs Canada" familial si vous visitez Banff et Jasper : il est rentabilisé dès le 4e jour.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Banff & Vue du Mont Norquay',
        morning: 'Arrivée depuis Calgary, installation dans un lodge en bois bordé de sapins.',
        afternoon: 'Balade le long des chutes de la rivière Bow et découverte du village alpin de Banff.',
        evening: 'Détente dans les bains thermaux chauds de Banff Upper Hot Springs face aux cimes enneigées.',
        highlight: 'La vapeur chaude des thermes montant vers les étoiles au milieu des sapins géants'
      },
      {
        day: 2,
        title: 'L’Émeraude du Lac Louise & Randonnée Agnes',
        morning: 'Arrivée matinale au mythique Lac Louise avant l’affluence.',
        afternoon: 'Randonnée jusqu’au refuge de thé rustique du Lac Agnes perché au-dessus du glacier.',
        evening: 'Dîner réconfortant de filet de truite grillée et tarte aux myrtilles.',
        highlight: 'Prendre le thé chaud sur la terrasse en bois du refuge entouré de falaises de glace'
      },
      {
        day: 3,
        title: 'Le Sanctuaire du Lac Moraine & Vallée des Dix Pics',
        morning: 'Navigation en canoë sur le Lac Moraine dans la Vallée des Dix Pics.',
        afternoon: 'Randonnée dans la vallée des Mélèzes (Larch Valley) avec vue panoramique.',
        evening: 'Feu de camp et guimauves grillées sous la voûte céleste des Rocheuses.',
        highlight: 'La couleur bleu turquoise électrique de l’eau créée par la farine de roche glaciaire'
      },
      {
        day: 4,
        title: 'La Promenade des Glaciers (Icefields Parkway)',
        morning: 'Parcours de l’une des plus belles routes du monde jalonnée de glaciers suspendus.',
        afternoon: 'Arrêt au Lac Peyto en forme de tête de loup et marche sur le glacier Athabasca.',
        evening: 'Observation de la faune sauvage (mouflons, caribous, cerfs) en fin de journée.',
        highlight: 'Le belvédère du Lac Peyto dévoilant une vue plongeante d’une beauté cinématographique'
      },
      {
        day: 5,
        title: 'Canyon Johnston & Retour Paisible',
        morning: 'Marche sur les passerelles suspendues à l’intérieur des gorges du Canyon Johnston.',
        afternoon: 'Dernier shopping d’artisanat autochtone et produits à l’érable à Banff.',
        evening: 'Grand dîner de clôture dans un restaurant gastronomique de gibier.',
        highlight: 'Les cascades bouillonnantes se jetant dans les piscines naturelles d’encre émeraude'
      }
    ],
    practicalTips: {
      visa: 'Autorisation de Voyage Électronique (AVE / eTA) requise en ligne (quelques euros)',
      currency: 'Dollar canadien (CAD) - Cartes bancaires acceptées partout',
      languages: 'Anglais et Français (langues officielles)',
      safetyLevel: 'Sécurité totale (respecter les consignes de sécurité anti-ours avec spray au poivre en randonnée)',
      localTransport: 'Location de voiture indispensable pour explorer les parcs en toute liberté',
      insiderSecret: 'Réservez la navette Parks Canada pour le Lac Moraine plusieurs semaines à l’avance, l’accès en voiture privée y étant restreint pour protéger l’environnement !'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['active_explorer', 'intense_adventure'],
      climates: ['cool_mountain', 'temperate_mild'],
      landscapes: ['mountains', 'forests'],
      crowd: ['balanced_mix', 'secret_hidden'],
      companions: ['couple', 'family', 'friends'],
      culturalTags: ['local_traditions'],
      foodFlavors: ['comfort_traditional', 'seafood'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'wellness_spa', 'water_sports', 'safari_wildlife'],
      physicalIntensityRange: [3, 4],
      flightCategory: 'long',
      continentTag: 'americas',
      seasons: ['summer', 'autumn'],
      vibes: ['disconnection', 'adrenaline', 'romance']
    }
  },
  {
    id: 'rajasthan-india',
    name: 'Palais du Rajasthan : Jaipur & Udaipur',
    country: 'Inde',
    continent: 'Asie',
    region: 'Rajasthan',
    matchScore: 93,
    tagline: 'Palais des Maharajas sur les lacs, forteresses dorées et festival de couleurs éclatantes',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Palais de Conte de Fées', 'Choc Visuel & Épices', 'Histoire Princière', 'Artisanat d’Or'],
    whyPerfect: 'Pour vivre l’expérience des contes des Mille et Une Nuits : palais flottants sur le lac Pichola à Udaipur, façades roses de Jaipur et bazars d’étoffes et d’épices.',
    summary: 'La terre des rois (Raja-sthan) offre une immersion sensorielle incomparable : forteresses d’ambre dominant le désert, nuits dans des havélis princières et accueil d’une générosité émouvante.',
    bestSeasons: ['Automne/Hiver (Octobre à Mars - Climat doux et ensoleillé)'],
    weatherExpected: 'Sec, ensoleillé et très doux (22°C à 27°C le jour, soirées fraîches à 14°C).',
    flightTimeFromEurope: '~8h30 (Vol direct New Delhi + train ou court vol interne)',
    idealDuration: '10 à 15 jours',
    vibe: 'Fascinante, somptueuse, colorée, spirituelle et vibrante',
    highlights: [
      'Croisière en bateau au coucher du soleil sur le lac Pichola face au Taj Lake Palace d’Udaipur',
      'Visite du Palais des Vents (Hawa Mahal) et de la forteresse d’Amber à Jaipur',
      'Séjour inoubliable dans un palais royal réhabilité en maison d’hôtes patrimoniale'
    ],
    gastronomy: {
      mustTryDishes: ['Dal Baati Churma (pain cuit au feu de bois avec lentilles épicées et ghee)', 'Laal Maas (curry royal d’agneau aux piments doux de Mathania)', 'Lassi onctueux au safran et cardamome', 'Gulab Jamun tiède parfumé à l’eau de rose'],
      specialtyDesc: 'Une gastronomie princière héritée des cours royales mogholes, réputée pour ses sauces au safran, noix de cajou, cardamome et pains tandoori cuits minute.',
      foodieSpot: 'Lassiwala sur MI Road à Jaipur, servant les meilleurs lassis dans des pots en terre cuite depuis 1944'
    },
    budget: {
      currency: 'INR (Roupie indienne)',
      flightEstimatePerPerson: 590,
      lodgingPerNight: 50,
      foodPerDayPerPerson: 18,
      activitiesPerDayPerPerson: 20,
      totalEstimated7DaysPerPerson: 1150,
      budgetTip: 'Engagez un chauffeur privé anglophone pour l’ensemble du circuit : c’est très abordable, extrêmement confortable et permet de s’arrêter dans des villages oubliés.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Jaipur : La Cité Rose & Hawa Mahal',
        morning: 'Arrivée à Jaipur, contemplation de la façade en dentelle de grès rose du Palais des Vents.',
        afternoon: 'Visite du City Palace et de l’observatoire astronomique géant Jantar Mantar (UNESCO).',
        evening: 'Dîner sur un toit-terrasse surplombant les remparts illuminés de la vieille ville.',
        highlight: 'La finesse des 953 petites fenêtres sculptées du Hawa Mahal à la lueur dorée du matin'
      },
      {
        day: 2,
        title: 'Le Fort d’Amber & Le Palais sur l’Eau',
        morning: 'Ascension vers la monumentale forteresse d’Amber et visite du palais des miroirs (Sheesh Mahal).',
        afternoon: 'Arrêt photo devant le Jal Mahal, palais semblant flotter au milieu des eaux du lac Man Sagar.',
        evening: 'Exploration des bazars de Johari (bijoux traditionnels et soieries imprimées au tampon de bois).',
        highlight: 'La réflexion infinie d’une seule flamme de bougie dans les milliers de miroirs du Sheesh Mahal'
      },
      {
        day: 3,
        title: 'Traversée vers Udaipur la Cité Blanche',
        morning: 'Route à travers les collines des Aravalli, arrêt au temple jaïn de Ranakpur aux 1444 piliers de marbre.',
        afternoon: 'Arrivée à Udaipur, la Venise de l’Orient, lovée au bord de son lac étincelant.',
        evening: 'Dîner aux chandelles au bord de l’eau au son de la cithare indienne.',
        highlight: 'L’incroyable sculpture en marbre blanc de Ranakpur où aucun pilier n’est identique'
      },
      {
        day: 4,
        title: 'City Palace d’Udaipur & Croisière sur le Lac Pichola',
        morning: 'Visite des appartements royaux du City Palace et ses balcons de mosaïques de paons.',
        afternoon: 'Balade dans les ruelles blanchies à la chaux et jardins de Saheliyon-ki-Bari.',
        evening: 'Croisière privée au coucher du soleil autour de l’île de Jag Mandir.',
        highlight: 'Le reflet féerique des palais de marbre blanc scintillant sur les eaux calmes du lac au crépuscule'
      },
      {
        day: 5,
        title: 'Spectacle de Danse Traditionnelle & Départ',
        morning: 'Atelier d’initiation à la peinture miniature moghole avec un maître artisan.',
        afternoon: 'Spectacle de danses folkloriques Dharohar au manoir de Bagore-ki-Haveli.',
        evening: 'Dernier festin royal Thali composé d’une quinzaine de mets délicats.',
        highlight: 'La virtuosité des danseuses rajasthanies portant 9 pots de terre en équilibre sur la tête'
      }
    ],
    practicalTips: {
      visa: 'E-Tourist Visa en ligne très simple à obtenir en 48h',
      currency: 'Roupie indienne (INR) - Nombreux distributeurs fiables dans les villes',
      languages: 'Hindi et Anglais (très largement parlé dans l’ensemble du pays)',
      safetyLevel: 'Région très accueillante et touristique, chaleureuse et sécurisée',
      localTransport: 'Chauffeur privé avec voiture climatisée recommandé pour les trajets interurbains',
      insiderSecret: 'Dormez au moins une nuit dans un "Heritage Hotel" (palais ou fort seigneurial reconverti) : l’immersion dans l’histoire des Maharajas y est magique !'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate', 'comfort'],
      pace: ['balanced', 'active_explorer'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['historic_cities', 'deserts', 'countryside'],
      crowd: ['vibrant_lively', 'balanced_mix'],
      companions: ['solo', 'couple', 'friends'],
      culturalTags: ['ancient_history', 'architecture', 'crafts_markets', 'local_traditions', 'music_festivals'],
      foodFlavors: ['spicy_exotic', 'comfort_traditional'],
      foodImportanceMin: 3,
      activities: ['cultural_visits', 'nightlife_shopping', 'wellness_spa'],
      physicalIntensityRange: [2, 3],
      flightCategory: 'long',
      continentTag: 'asia',
      seasons: ['autumn', 'winter', 'spring'],
      vibes: ['cultural_shock', 'romance', 'festive']
    }
  },
  {
    id: 'zanzibar-tanzania',
    name: 'Zanzibar & Forêt d’Épices',
    country: 'Tanzanie',
    continent: 'Afrique',
    region: 'Océan Indien',
    matchScore: 91,
    tagline: 'Sable blanc comme de la farine, boutres à voile triangulaire et ruelles parfumées de Stone Town',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Plages Éden Tropical', 'Culture Swahilie & Épices', 'Snorkeling Coraux', 'Déconnexion Totale'],
    whyPerfect: 'Pour combiner détente absolue sur des plages de rêve et découverte culturelle : ruelles historiques de Stone Town (UNESCO), plantations de clou de girofle et vanille, et lagons turquoise.',
    summary: 'L’île aux épices flotte dans l’océan Indien au large de la Tanzanie. Un carrefour millénaire entre cultures africaine, arabe, indienne et perse.',
    bestSeasons: ['Hiver (Décembre à Mars)' , 'Été/Automne (Juin à Octobre)'],
    weatherExpected: 'Tropical chaud et ensoleillé (28°C à 32°C), eau de mer à 28°C.',
    flightTimeFromEurope: '~10h (Vol vers Dar es Salaam ou vol direct saisonnier)',
    idealDuration: '7 à 10 jours',
    vibe: 'Solaire, exotique, relaxante, métissée et envoûtante',
    highlights: [
      'Promenade dans le dédale des ruelles pavées et portes en bois sculpté de Stone Town',
      'Excursion en bateau traditionnel en bois vers l’atoll de Mnemba pour nager avec les dauphins',
      'Visite d’une ferme d’épices biologique avec dégustation de vanille fraîche, cannelle et noix de muscade'
    ],
    gastronomy: {
      mustTryDishes: ['Zanzibar Pizza croustillante préparée sur plaque chaude', 'Curry de poulpe au lait de coco frais', 'Biryani swahili parfumé aux clous de girofle', 'Jus de canne à sucre pressé au gingembre et citron vert'],
      specialtyDesc: 'Une cuisine métissée swahilie-omanaise généreuse en poissons du large, lait de coco crémeux et épices fraîchement cueillies.',
      foodieSpot: 'Marché nocturne de Forodhani Gardens au bord de l’eau à la tombée de la nuit'
    },
    budget: {
      currency: 'TZS (Shilling tanzanien) / USD',
      flightEstimatePerPerson: 690,
      lodgingPerNight: 75,
      foodPerDayPerPerson: 25,
      activitiesPerDayPerPerson: 30,
      totalEstimated7DaysPerPerson: 1450,
      budgetTip: 'Négociez directement avec les capitaines locaux de boutres (Dhow) à Nungwi pour vos sorties snorkeling plutôt que par les grands hôtels.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Stone Town : Ruelles Historiques & Portes Sculptées',
        morning: 'Arrivée à Stone Town, installation dans un ancien palais marchand restauré.',
        afternoon: 'Visite de la Maison des Merveilles, de l’ancien marché aux esclaves et de la maison natale de Freddie Mercury.',
        evening: 'Dîner de fruits de mer grillés au marché de rue de Forodhani Gardens au coucher du soleil.',
        highlight: 'L’odeur envoûtante de girofle et de cardamome flottant dans les ruelles pavées'
      },
      {
        day: 2,
        title: 'La Route des Épices & Prison Island',
        morning: 'Visite sensorielle d’une plantation d’épices (cannelle, muscade, poivre, vanille).',
        afternoon: 'Traversée en bateau vers Prison Island pour observer les tortues géantes d’Aldabra centenaires.',
        evening: 'Route vers les plages de sable blanc du nord (Nungwi / Kendwa).',
        highlight: 'Voir les fleurs de vanille fécondées à la main et goûter la cannelle brute extraite de l’écorce'
      },
      {
        day: 3,
        title: 'Atoll de Mnemba : Snorkeling & Dauphins',
        morning: 'Départ en boutre traditionnel vers les récifs coralliens protégés de l’atoll de Mnemba.',
        afternoon: 'Snorkeling au milieu des poissons clowns, tortues marines et bancs de coraux multicolores.',
        evening: 'Barbecue de homards et poissons grillés sur le sable les pieds dans l’eau.',
        highlight: 'Nager dans une eau cristalline d’une transparence absolue au-dessus des coraux'
      },
      {
        day: 4,
        title: 'Forêt de Jozani & Singes Colobes Rouges',
        morning: 'Promenade dans la forêt tropicale de Jozani à la recherche des singes colobes rouges endémiques.',
        afternoon: 'Marche sur les passerelles de bois au-dessus de la mangrove sauvage.',
        evening: 'Dîner au célèbre restaurant "The Rock" perché sur un rocher au milieu des vagues à Michamvi.',
        highlight: 'Observer les petits colobes rouges sautant agilement d’arbre en arbre à quelques mètres'
      },
      {
        day: 5,
        title: 'Journée Farniente & Coucher de Soleil en Boutre',
        morning: 'Matinée farniente sur les transats de Kendwa où la marée ne se retire jamais.',
        afternoon: 'Massage traditionnel aux huiles essentielles de coco et d’ylang-ylang.',
        evening: 'Croisière finale au coucher du soleil toutes voiles déployées avec musique acoustique Taarab.',
        highlight: 'La silhouette majestueuse de la voile blanche du boutre se détachant sur le disque solaire orange'
      }
    ],
    practicalTips: {
      visa: 'E-Visa tanzanien en ligne (50 USD) très rapide',
      currency: 'Shilling tanzanien (TZS) et Dollars US (billets imprimés après 2013)',
      languages: 'Swahili et Anglais (très répandu)',
      safetyLevel: 'Île très paisible et accueillante envers les voyageurs',
      localTransport: 'Taxis officiels ou transferts organisés, marche facile le long des plages',
      insiderSecret: 'Pour pouvoir vous baigner à toute heure sans subir les grandes marées de la côte Est, logez sur les plages de Kendwa ou Nungwi au Nord-Ouest !'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort'],
      pace: ['relaxation', 'balanced'],
      climates: ['tropical_warm'],
      landscapes: ['beaches', 'forests', 'historic_cities'],
      crowd: ['balanced_mix', 'secret_hidden'],
      companions: ['couple', 'friends', 'solo', 'family'],
      culturalTags: ['local_traditions', 'ancient_history', 'crafts_markets', 'music_festivals'],
      foodFlavors: ['spicy_exotic', 'seafood'],
      foodImportanceMin: 3,
      activities: ['water_sports', 'wellness_spa', 'cultural_visits'],
      physicalIntensityRange: [1, 2],
      flightCategory: 'long',
      continentTag: 'africa',
      seasons: ['winter', 'summer', 'autumn'],
      vibes: ['disconnection', 'romance', 'cultural_shock']
    }
  },
  {
    id: 'petra-wadi-rum-jordan',
    name: 'Jordanie : Pétra, Wadi Rum & Mer Morte',
    country: 'Jordanie',
    continent: 'Moyen-Orient',
    region: 'Désert du Sud & Pétra',
    matchScore: 94,
    tagline: 'Cités nabatéennes sculptées dans le grès rose et bivouacs bédouins sous les étoiles du désert',
    coverImage: 'https://images.unsplash.com/photo-1579606032822-68c34f664ee6?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Merveille du Monde', 'Désert Rouge Mythique', 'Flottaison Mer Morte', 'Hospitalité Bédouine'],
    whyPerfect: 'Une aventure légendaire à portée de vol moyen-courrier : la découverte magique du Trésor de Pétra au débouché du Siq et les paysages martiens de Lawrence d’Arabie dans le Wadi Rum.',
    summary: 'La Jordanie conjugue sites archéologiques d’envergure mondiale, immersion bédouine authentique et flottaison insolite dans les eaux hyper-salées de la Mer Morte.',
    bestSeasons: ['Printemps (Mars à Mai)', 'Automne (Septembre à Novembre)'],
    weatherExpected: 'Sec et très ensoleillé (22°C à 27°C le jour, nuits étoilées fraîches dans le désert).',
    flightTimeFromEurope: '~4h45 (Vols directs Amman depuis Paris, Bruxelles, Genève)',
    idealDuration: '8 à 10 jours',
    vibe: 'Mythique, aventurière, chaleureuse et spectaculaire',
    highlights: [
      'Apparition du Trésor (Al-Khazneh) au bout de la gorge étroite du Siq illuminée par le soleil',
      'Nuit sous une tente bédouine dans les dunes rouges du Wadi Rum et dîner traditionnel Zarb',
      'Flotter sans effort en lisant un livre dans les eaux chargées en minéraux de la Mer Morte'
    ],
    gastronomy: {
      mustTryDishes: ['Mansaf traditionnel (agneau mijoté dans une sauce de yaourt fermenté jameed)', 'Mezzés variés (moutabal d’aubergine fumée, houmous onctueux, falafels dorés)', 'Zarb (festin bédouin cuit sous le sable dans des braises)', 'Thé noir bédouin à la sauge sauvage et cardamome'],
      specialtyDesc: 'Une cuisine levantine généreuse célébrant l’huile d’olive de première pression, les herbes sauvages du désert et les viandes délicatement épicées.',
      foodieSpot: 'Restaurant Sufra sur Rainbow Street à Amman pour ses plats traditionnels dans une villa des années 1930'
    },
    budget: {
      currency: 'JOD (Dinar jordanien)',
      flightEstimatePerPerson: 380,
      lodgingPerNight: 80,
      foodPerDayPerPerson: 28,
      activitiesPerDayPerPerson: 40,
      totalEstimated7DaysPerPerson: 1420,
      budgetTip: 'Achetez le "Jordan Pass" en ligne avant de partir : il inclut le visa d’entrée ainsi que l’accès complet à Pétra et à 40 autres sites majeurs.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Amman & La Cité Romaine de Jerash',
        morning: 'Arrivée à Amman, route vers la cité gréco-romaine de Jerash et sa place ovale monumentale.',
        afternoon: 'Visite de la citadelle d’Amman et du théâtre romain au coucher du soleil.',
        evening: 'Dîner de mezzés savoureux sur Rainbow Street.',
        highlight: 'La grandeur intacte de la colonnade romaine de Jerash'
      },
      {
        day: 2,
        title: 'La Route des Rois & Arrivée à Pétra',
        morning: 'Parcours le long de la légendaire Route des Rois et mosaïque de Madaba.',
        afternoon: 'Vue panoramique depuis le Mont Nébo et descente vers la vallée de Pétra (Wadi Musa).',
        evening: 'Spectacle nocturne féerique "Pétra by Night" à la lueur de 1500 bougies.',
        highlight: 'L’apparition de la façade du Trésor éclairée uniquement par les flammes des bougies'
      },
      {
        day: 3,
        title: 'Exploration Complète de la Cité Rose de Pétra',
        morning: 'Marche dans le canyon du Siq et contemplation du Trésor à la première heure.',
        afternoon: 'Ascension des 850 marches vers le monumental Monastère (Ad-Deir) taillé dans la roche.',
        evening: 'Thé avec les bédouins locaux sur les hauteurs avec vue sur la vallée.',
        highlight: 'La façade colossale du Monastère Ad-Deir nichée au sommet de la montagne déserte'
      },
      {
        day: 4,
        title: 'Le Désert Rouge du Wadi Rum en 4x4',
        morning: 'Route vers le désert du Wadi Rum et excursion en 4x4 entre les arches rocheuses naturelles.',
        afternoon: 'Randonnée sur les dunes rouges de sable fin et coucher de soleil flamboyant.',
        evening: 'Dîner traditionnel Zarb sorti des braises sous le sable et astronomie sous la voie lactée.',
        highlight: 'Le silence infini du désert sous l’une des plus belles voûtes étoilées de la Terre'
      },
      {
        day: 5,
        title: 'Flottaison sur la Mer Morte & Bains de Boue',
        morning: 'Remontée vers le point le plus bas de la Terre (-430 mètres sous le niveau de la mer).',
        afternoon: 'Bain de boue régénérant et expérience unique de flottaison sur l’eau salée.',
        evening: 'Dernier cocktail au soleil couchant face aux collines de Judée.',
        highlight: 'La sensation extraordinaire d’apesanteur totale sur les eaux denses et bienfaisantes'
      }
    ],
    practicalTips: {
      visa: 'Jordan Pass (acheté en ligne) exonère des frais de visa si séjour > 3 nuits',
      currency: 'Dinar jordanien (JOD) - 1 JOD ≈ 1,30 EUR',
      languages: 'Arabe (anglais parlé très couramment dans tout le secteur touristique)',
      safetyLevel: 'La Jordanie est un havre de paix réputé pour son hospitalité légendaire',
      localTransport: 'Location de voiture très facile avec des routes en excellent état et bien signalées',
      insiderSecret: 'Montez au Monastère de Pétra vers 14h30 : le soleil éclaire directement la façade de grès et la plupart des groupes sont déjà repartis !'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort'],
      pace: ['active_explorer', 'balanced'],
      climates: ['temperate_mild', 'tropical_warm'],
      landscapes: ['deserts', 'historic_cities', 'mountains'],
      crowd: ['balanced_mix', 'secret_hidden'],
      companions: ['couple', 'friends', 'solo', 'family'],
      culturalTags: ['ancient_history', 'local_traditions', 'architecture', 'crafts_markets'],
      foodFlavors: ['mediterranean_fresh', 'comfort_traditional'],
      foodImportanceMin: 3,
      activities: ['hiking_outdoor', 'cultural_visits', 'wellness_spa'],
      physicalIntensityRange: [2, 4],
      flightCategory: 'medium',
      continentTag: 'middle_east',
      seasons: ['spring', 'autumn'],
      vibes: ['cultural_shock', 'adrenaline', 'romance']
    }
  },
  {
    id: 'azores-portugal',
    name: 'Les Açores : São Miguel & Lacs Volcaniques',
    country: 'Portugal',
    continent: 'Europe',
    region: 'Archipel Atlantique',
    matchScore: 94,
    tagline: 'L’Hawaï européen : cratères émeraude, cascades dans la brume et baleines en liberté',
    coverImage: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Sanctuaire Nature Sauvage', 'Sources Chaudes & Caldeiras', 'Observation des Cétacés', 'Randonnées Vertes'],
    whyPerfect: 'Une destination nature préservée à seulement 4h de vol : lacs jumeaux bleu et vert de Sete Cidades, bains thermaux en pleine jungle et plantations de thé uniques en Europe.',
    summary: 'Cet archipel volcanique au milieu de l’Atlantique est un paradis éco-touristique : hortensias sauvages par milliers, fumerolles géothermiques et villages côtiers paisibles.',
    bestSeasons: ['Printemps / Été / Automne (Mai à Octobre - Floraison maximale)'],
    weatherExpected: 'Océanique doux toute l’année (18°C à 24°C en été), microclimats changeants poétiques.',
    flightTimeFromEurope: '~4h (Vols directs Lisbonne ou Paris/Porto vers Ponta Delgada)',
    idealDuration: '7 à 10 jours',
    vibe: 'Paisible, vivifiante, sauvage, verte et ressourçante',
    highlights: [
      'Panorama surréaliste sur les lacs jumeaux de Sete Cidades depuis le belvédère de Vista do Rei',
      'Bain relaxant dans les eaux ferrugineuses à 38°C du parc botanique luxuriant de Terra Nostra à Furnas',
      'Sortie en mer éco-responsable pour observer dauphins et cachalots dans leur sanctuaire marin'
    ],
    gastronomy: {
      mustTryDishes: ['Cozido das Furnas (ragoût mijoté 6 heures sous terre dans la chaleur volcanique)', 'Steak de bœuf açorien élevé en plein air aux piments doux', 'Fromage artisanal crémeux de São Jorge', 'Ananas doux bio des Açores mûri en serre'],
      specialtyDesc: 'Des produits d’une fraîcheur exceptionnelle : poissons de l’Atlantique, viandes tendres d’estive et thés verts de la plus ancienne plantation d’Europe (Gorreana).',
      foodieSpot: 'Restaurant Tony’s à Furnas pour déguster le véritable Cozido traditionnel'
    },
    budget: {
      currency: 'EUR (€)',
      flightEstimatePerPerson: 220,
      lodgingPerNight: 75,
      foodPerDayPerPerson: 30,
      activitiesPerDayPerPerson: 25,
      totalEstimated7DaysPerPerson: 1180,
      budgetTip: 'Les Açores font partie du Portugal : les prix des repas et des cafés restent parmi les plus abordables d’Europe occidentale.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Ponta Delgada & Histoire Insulaire',
        morning: 'Arrivée à São Miguel, promenade devant les portes de la ville en pierre volcanique.',
        afternoon: 'Visite des serres d’ananas traditionnelles de Fajã de Baixo.',
        evening: 'Dîner de thon frais grillé et vin blanc des Açores sur la marina.',
        highlight: 'L’architecture élégante en basalte noir et chaux blanche de Ponta Delgada'
      },
      {
        day: 2,
        title: 'Le Cratère Géant de Sete Cidades',
        morning: 'Randonnée le long des crêtes dominant la Lagoa Verde et la Lagoa Azul.',
        afternoon: 'Arrêt au belvédère de Boca do Inferno et descente au bord des rives du lac.',
        evening: 'Baignade dans la piscine naturelle d’eau de mer chauffée par une source sous-marine à Ponta da Ferraria.',
        highlight: 'La vue saisissante depuis Boca do Inferno sur 4 lacs volcaniques étagés'
      },
      {
        day: 3,
        title: 'Furnas : Magie Volcanique & Bains Thermaux',
        morning: 'Observation des fumerolles bouillonnantes et extraction du Cozido des cavités du sol.',
        afternoon: 'Bain chaud relaxant dans le bassin ocre du parc botanique centenaire de Terra Nostra.',
        evening: 'Dégustation du Cozido das Furnas et tisanes locales.',
        highlight: 'Nager dans une eau thermale à 38°C au milieu des fougères arborescentes géantes'
      },
      {
        day: 4,
        title: 'Plantation de Thé Gorreana & Lagoa do Fogo',
        morning: 'Visite de l’unique plantation de thé d’Europe (Chá Gorreana) en terrasses face à l’océan.',
        afternoon: 'Randonnée vers le lac sauvage et immaculé de la Lagoa do Fogo.',
        evening: 'Bain aux cascades chaudes de Caldeira Velha dissimulées sous la végétation tropicale.',
        highlight: 'La cueillette du thé vert face aux vagues azur de l’Atlantique'
      },
      {
        day: 5,
        title: 'Rencontre avec les Cachalots & Nordeste Sauvage',
        morning: 'Expédition marine en semi-rigide avec des biologistes marins pour observer les cétacés.',
        afternoon: 'Route panoramique vers les falaises fleuries et moulins à eau de Nordeste.',
        evening: 'Dernier toast au vin de Pico et dégustation de fromage de São Jorge.',
        highlight: 'Le souffle puissant d’un cachalot émergeant à la surface de l’eau'
      }
    ],
    practicalTips: {
      visa: 'Union Européenne : Carte nationale d’identité valide',
      currency: 'Euro (€)',
      languages: 'Portugais (anglais très bien compris partout)',
      safetyLevel: 'Sécurité totale et atmosphère insulaire extrêmement paisible',
      localTransport: 'Location d’une petite voiture vivement conseillée pour accéder aux départs de randonnées',
      insiderSecret: 'Prévoyez un maillot de bain foncé pour les thermes de Terra Nostra, l’eau naturellement riche en fer pouvant colorer temporairement les tissus clairs !'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate', 'comfort'],
      pace: ['balanced', 'relaxation', 'active_explorer'],
      climates: ['temperate_mild'],
      landscapes: ['mountains', 'forests', 'beaches', 'countryside'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['couple', 'solo', 'family', 'friends'],
      culturalTags: ['local_traditions', 'architecture'],
      foodFlavors: ['seafood', 'comfort_traditional'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'wellness_spa', 'safari_wildlife', 'water_sports'],
      physicalIntensityRange: [2, 3],
      flightCategory: 'short',
      continentTag: 'europe',
      seasons: ['spring', 'summer', 'autumn'],
      vibes: ['disconnection', 'romance', 'adrenaline']
    }
  },
  {
    id: 'queenstown-new-zealand',
    name: 'Nouvelle-Zélande : Queenstown & Fjords de Milford',
    country: 'Nouvelle-Zélande',
    continent: 'Océanie',
    region: 'Île du Sud',
    matchScore: 96,
    tagline: 'Capitale mondiale de l’aventure, fjords vertigineux et paysages de la Terre du Milieu',
    coverImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Aventure Extrême & Nature', 'Fjords Monumentaux', 'Terre du Milieu', 'Lacs Alpins Purs'],
    whyPerfect: 'Le voyage d’une vie pour les amoureux de nature grandiose et de sensations pures : navigation sous les cascades de Milford Sound, vignobles de Central Otago et randonnées alpines légendaires.',
    summary: 'Nichée au bord du lac Wakatipu et encadrée par la chaîne des Remarkables, Queenstown est la Mecque des sports de plein air au cœur de paysages naturels parmi les plus purs et spectaculaires au monde.',
    bestSeasons: ['Été austral (Décembre à Mars)', 'Automne (Avril à Mai pour les couleurs dorées)'],
    weatherExpected: 'Été doux et vivifiant (18°C à 25°C), air montagnard pur et journées très longues.',
    flightTimeFromEurope: '~24h (Vol long-courrier avec escale Singapour/Dubaï)',
    idealDuration: '2 à 3 semaines',
    vibe: 'Épique, vivifiante, spectaculaire, sportive et chaleureuse',
    highlights: [
      'Croisière sous les falaises de 1200m et les chutes rugissantes de Milford Sound',
      'Vue panoramique sur le lac Wakatipu et les Remarkables depuis le sommet de la Skyline Gondola',
      'Randonnée sur le mythique sentier de Routeburn Track à travers les forêts de hêtres moussus'
    ],
    gastronomy: {
      mustTryDishes: ['Agneau fermier rôti au romarin et miel de Manuka', 'Burgers gourmets légendaires de Fergburger', 'Saumon sauvage des fjords du mont Cook', 'Vins de Pinot Noir réputés de Central Otago'],
      specialtyDesc: 'Une cuisine de terroir moderne valorisant les élevages durables en plein air, les fruits de mer sauvages et les vignobles d’altitude.',
      foodieSpot: 'Fergburger à Queenstown, réputé pour faire les meilleurs burgers de l’hémisphère sud'
    },
    budget: {
      currency: 'NZD (Dollar néo-zélandais)',
      flightEstimatePerPerson: 1250,
      lodgingPerNight: 120,
      foodPerDayPerPerson: 45,
      activitiesPerDayPerPerson: 60,
      totalEstimated7DaysPerPerson: 2550,
      budgetTip: 'Louez un campervan ou un van aménagé : c’est le moyen roi de voyager en Nouvelle-Zélande pour dormir face aux plus beaux panoramas du monde en toute liberté.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Queenstown & Lac Wakatipu',
        morning: 'Arrivée spectaculaire en avion entre les crêtes des Remarkables.',
        afternoon: 'Balade sur les rives du lac Wakatipu et montée en télécabine à Bob’s Peak.',
        evening: 'Dégustation d’un burger au Fergburger face au lac scintillant.',
        highlight: 'Le coucher de soleil embrasant les falaises déchiquetées des Remarkables'
      },
      {
        day: 2,
        title: 'Excursion Mythique à Milford Sound',
        morning: 'Traversée de la spectaculaire route alpine de Milford Road et tunnel Homer.',
        afternoon: 'Croisière dans le fjord au milieu des phoques à fourrure et dauphins.',
        evening: 'Retour à Te Anau et dîner de saumon alpin au coin du feu.',
        highlight: 'Passer en bateau sous la douche revigorante de la cascade Stirling haute de 150 mètres'
      },
      {
        day: 3,
        title: 'Route des Vins de Gibbston Valley & Canyons',
        morning: 'Visite des vignobles de Central Otago et dégustation de Pinot Noir primé.',
        afternoon: 'Balade dans le village historique de chercheurs d’or d’Arrowtown.',
        evening: 'Bain relaxant dans les jacuzzis privés perchés sur la falaise aux Onsen Hot Pools.',
        highlight: 'Le panorama depuis son bain thermal fumant sur les eaux turquoise de la rivière Shotover'
      },
      {
        day: 4,
        title: 'Glenorchy & Randonnée Routeburn Track',
        morning: 'Route panoramique longeant le lac vers Glenorchy (décors du Seigneur des Anneaux).',
        afternoon: 'Randonnée sur une portion de la Routeburn Track parmi les cascades et fougères géantes.',
        evening: 'Dîner réconfortant dans un pub de pionniers à Glenorchy.',
        highlight: 'L’immensité sauvage et la pureté totale de la vallée de la Dart River'
      },
      {
        day: 5,
        title: 'Aventure en Jetboat & Départ Mémorable',
        morning: 'Sensations fortes en Shotover Jet dans les gorges étroites de la rivière canyon.',
        afternoon: 'Dernier shopping de tricots en laine mérinos et miel de Manuka sauvage.',
        evening: 'Grand dîner gastronomique de clôture surplombant la baie.',
        highlight: 'Les slaloms millimétrés du bateau hydrojet rasant les parois rocheuses polies'
      }
    ],
    practicalTips: {
      visa: 'NZeTA (Autorisation de voyage électronique) requise en ligne avant le départ',
      currency: 'Dollar néo-zélandais (NZD) - Cartes de paiement acceptées absolument partout',
      languages: 'Anglais et Maori',
      safetyLevel: 'L’un des pays les plus sûrs, accueillants et civilisés au monde',
      localTransport: 'Voiture ou van aménagé indispensable pour explorer l’île du Sud',
      insiderSecret: 'Réservez votre créneau aux Onsen Hot Pools au coucher du soleil au moins 2 mois à l’avance : c’est l’une des expériences les plus prisées de l’île !'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['active_explorer', 'intense_adventure'],
      climates: ['temperate_mild', 'cool_mountain'],
      landscapes: ['mountains', 'forests', 'beaches', 'countryside'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['couple', 'friends', 'solo', 'family'],
      culturalTags: ['local_traditions'],
      foodFlavors: ['comfort_traditional', 'seafood'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'water_sports', 'wellness_spa', 'safari_wildlife'],
      physicalIntensityRange: [3, 5],
      flightCategory: 'long',
      continentTag: 'oceania',
      seasons: ['winter', 'spring', 'autumn'],
      vibes: ['adrenaline', 'disconnection', 'romance']
    }
  },
  {
    id: 'costa-rica-pura-vida',
    name: 'La Fortuna & Manuel Antonio',
    country: 'Costa Rica',
    continent: 'Amériques',
    region: 'Amérique Centrale',
    matchScore: 97,
    tagline: 'Le sanctuaire mondial de la biodiversité entre volcans fumants, canopées luxuriantes et plages sauvages du Pacifique',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Écotourisme d’Excellence', 'Faune Sauvage & Paresseux', 'Paradis Vert & Cascades', 'Pura Vida'],
    whyPerfect: 'Le Costa Rica est l’éden absolu pour les amoureux de nature intacte, combinant observation rapprochée de la faune sauvage (toucans, singes capucins, paresseux), sources thermales volcaniques et détente balnéaire.',
    summary: 'Pionnier mondial de la protection environnementale, le pays abrite 5% de la biodiversité planétaire. De la silhouette imposante du volcan Arenal aux anses turquoise du parc national Manuel Antonio, chaque journée est une immersion vivifiante.',
    bestSeasons: ['Hiver & Printemps (Saison sèche de décembre à avril)', 'Juillet-Août (Saison verte luxuriante)'],
    weatherExpected: 'Climat tropical chaud (26°C à 31°C sur les côtes, 20°C à 25°C en altitude près des volcans).',
    flightTimeFromEurope: '~11h30 (Vols directs ou 1 escale vers San José)',
    idealDuration: '10 à 15 jours (Boucle Arenal, Monteverde et côte Pacifique)',
    vibe: 'Écologique, tonique, chaleureuse et connectée à la terre',
    highlights: [
      'Marche sur les ponts suspendus dans la brume de la forêt tropicale avec un guide naturaliste',
      'Bain relaxant dans les sources thermales naturelles chauffées par le volcan Arenal en soirée',
      'Baignade sur les plages de sable blanc du parc Manuel Antonio côtoyant les iguanes et capucins'
    ],
    gastronomy: {
      mustTryDishes: ['Casado traditionnel (riz, haricots noirs, bananes plantains caramélisées et poisson frais)', 'Gallo Pinto au petit-déjeuner avec sauce Lizano', 'Ceviche de corvina au jus de citron vert et coriandre', 'Café d’altitude de la vallée de Tarrazú'],
      specialtyDesc: 'Une cuisine saine, fraîche et nourrie par les terroirs tropicaux et les deux océans.',
      foodieSpot: 'Les "Sodas" locales traditionnelles pour déguster des jus de fruits tropicaux pressés minute (maracuja, mangue, papaye)'
    },
    budget: {
      currency: 'USD & Colones (CRC)',
      flightEstimatePerPerson: 750,
      lodgingPerNight: 95,
      foodPerDayPerPerson: 35,
      activitiesPerDayPerPerson: 40,
      totalEstimated7DaysPerPerson: 1680,
      budgetTip: 'Louez un 4x4 compact pour être totalement autonome et privilégiez les parcs nationaux publics aux réserves privées onéreuses.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à San José & Route vers La Fortuna',
        morning: 'Atterrissage à San José et prise en main du véhicule tout-terrain.',
        afternoon: 'Traversée des plantations de café et arrivée au pied du majestueux volcan Arenal.',
        evening: 'Dîner aux chandelles dans un écolodge en lisière de forêt.',
        highlight: 'La première vue dégagée sur le cône parfait du volcan Arenal'
      },
      {
        day: 2,
        title: 'Ponts Suspendus & Cascades de La Fortuna',
        morning: 'Randonnée matinale sur les ponts suspendus à 40 mètres au-dessus de la canopée pour observer les toucans.',
        afternoon: 'Descente des 500 marches vers la cascade turquoise rugissante de La Fortuna pour une baignade rafraîchissante.',
        evening: 'Bains thermaux volcaniques naturels éclairés aux flambeaux.',
        highlight: 'La brume féerique flottant au ras de la cime des arbres géants'
      },
      {
        day: 3,
        title: 'Forêt de Nuages de Monteverde',
        morning: 'Route panoramique longeant le lac Arenal vers les forêts d’altitude de Monteverde.',
        afternoon: 'Exploration guidée à la recherche du mythique Quetzal resplendissant.',
        evening: 'Visita nocturna (marche de nuit) pour surprendre les grenouilles aux yeux rouges et tatous.',
        highlight: 'L’incroyable concert sonore de la jungle à la tombée de la nuit'
      },
      {
        day: 4,
        title: 'Parc National Manuel Antonio & Océan Pacifique',
        morning: 'Descente vers la côte Pacifique et entrée matinale au parc Manuel Antonio.',
        afternoon: 'Sentier du Mirador suivi de farniente sur la plage de Playa Espadilla Sur.',
        evening: 'Cocktail de fruits frais au coucher de soleil flamboyant sur l’océan.',
        highlight: 'Les familles de paresseux grimpant paisiblement juste au-dessus des serviettes de plage'
      },
      {
        day: 5,
        title: 'Kayak dans les Mangroves & Retour Pura Vida',
        morning: 'Balade silencieuse en kayak dans la mangrove protégée de l’île Damas.',
        afternoon: 'Dégustation d’un ceviche frais les pieds dans le sable.',
        evening: 'Dernière nuit bercée par le chant des vagues et de la forêt tropicale.',
        highlight: 'Le vol gracieux d’un groupe de hérons cendrés au ras de l’eau calme'
      }
    ],
    practicalTips: {
      visa: 'Pas de visa requis pour les ressortissants de l’UE / Suisses / Canadiens (séjour jusqu’à 90 jours)',
      currency: 'Colón costaricien (CRC) et Dollar US (USD) acceptés partout',
      languages: 'Espagnol (et Anglais parlé couramment dans le secteur touristique)',
      safetyLevel: 'Le pays le plus stable et pacifique d’Amérique Centrale (surnommé la Suisse d’Amérique)',
      localTransport: 'Location d’un 4x4 recommandée pour accéder aux parcs et pistes secondaires',
      insiderSecret: 'Entrez dans les parcs nationaux dès l’ouverture à 7h du matin : c’est le moment où les animaux sont les plus actifs et avant l’arrivée des groupes.'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort', 'luxury'],
      pace: ['balanced', 'active_explorer', 'intense_adventure'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['forests', 'beaches', 'mountains'],
      crowd: ['balanced_mix', 'secret_hidden'],
      companions: ['couple', 'family', 'friends', 'solo'],
      culturalTags: ['local_traditions'],
      foodFlavors: ['comfort_traditional', 'seafood'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'safari_wildlife', 'water_sports', 'wellness_spa'],
      physicalIntensityRange: [2, 4],
      flightCategory: 'long',
      continentTag: 'americas',
      seasons: ['winter', 'spring', 'summer'],
      vibes: ['disconnection', 'adrenaline', 'romance']
    }
  },
  {
    id: 'lofoten-norway',
    name: 'Îles Lofoten & Fjords Arctiques',
    country: 'Norvège',
    continent: 'Europe',
    region: 'Scandinavie & Arctique',
    matchScore: 96,
    tagline: 'Des pics alpins acérés jaillissant d’une mer turquoise, cabanes de pêcheurs rorbuer et danses d’aurores boréales',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Nature Pure & Sauvage', 'Aurores & Soleil de Minuit', 'Randonnées Panoramiques', 'Sérénité Nordique'],
    whyPerfect: 'Les Lofoten offrent des contrastes visuels uniques au monde : montagnes granitiques tombant à pic dans les eaux cristallines, plages de sable blanc arctique et villages traditionnels peints en rouge ocre.',
    summary: 'Situé au-delà du cercle polaire arctique, cet archipel légendaire fascine les photographes et randonneurs du monde entier par sa lumière boréale changeante et son atmosphère maritime préservée.',
    bestSeasons: ['Été (Juin à Août pour le Soleil de Minuit et randonnées)', 'Automne-Hiver (Septembre à Mars pour les Aurores Boréales)'],
    weatherExpected: 'Frais et revigorant en été (12°C à 18°C), climat océanique étonnamment doux en hiver grâce au Gulf Stream (-2°C à 4°C).',
    flightTimeFromEurope: '~5h30 (Vol Oslo + vol intérieur vers Bodø ou Leknes/Evenes)',
    idealDuration: '7 à 10 jours en road-trip le long de la route panoramique E10',
    vibe: 'Sauvage, grandiose, purifiante et spectaculaire',
    highlights: [
      'Ascension panoramique de Reinebringen offrant la vue iconique à 360° sur le fjord de Reine',
      'Nuit dans un authentique rorbu en bois rouge sur pilotis au son du clapotis de l’eau',
      'Observation féerique des aurores boréales dansant au-dessus des plages vierges d’Uttakleiv ou Haukland'
    ],
    gastronomy: {
      mustTryDishes: ['Skrei (cabillaud arctique frais cuisiné minute)', 'Saumon sauvage fumé au bois de hêtre', 'Soupe crémeuse de poissons Fiskesuppe', 'Gaufres norvégiennes au fromage brun caramélisé (Brunost)'],
      specialtyDesc: 'Une gastronomie maritime de pêche durable d’une fraîcheur exceptionnelle.',
      foodieSpot: 'Les restaurants intimistes d’Henningsvær installés dans d’anciennes usines de salaison réhabilitées'
    },
    budget: {
      currency: 'Couronne norvégienne (NOK)',
      flightEstimatePerPerson: 420,
      lodgingPerNight: 160,
      foodPerDayPerPerson: 65,
      activitiesPerDayPerPerson: 30,
      totalEstimated7DaysPerPerson: 1950,
      budgetTip: 'Cuisinez les poissons frais directement dans votre cabane rorbu équipée et profitez de l’accès totalement gratuit à tous les sentiers de randonnée.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Svolvær & Village d’Artistes d’Henningsvær',
        morning: 'Arrivée à l’aéroport et prise de votre voiture le long de la route panoramique E10.',
        afternoon: 'Découverte d’Henningsvær, la "Venise des Lofoten", et son célèbre terrain de football sur îlot rocheux.',
        evening: 'Dîner de morue fraîche dans un bistrot du port éclairé aux bougies.',
        highlight: 'La lumière dorée de fin d’après-midi sur les séchoirs à poissons traditionnels'
      },
      {
        day: 2,
        title: 'Plages Sauvages de Haukland & Randonnée de Mannen',
        morning: 'Balade vivifiante sur la plage de sable blanc et eau turquoise de Haukland.',
        afternoon: 'Ascension accessible du sommet de Mannen pour un panorama vertigineux sur deux baies opposées.',
        evening: 'Sauna scandinave traditionnel face au fjord avec plongeon rafraîchissant dans l’océan.',
        highlight: 'Le contraste irréel entre sable blanc digne des tropiques et pics rocheux enneigés'
      },
      {
        day: 3,
        title: 'L’Époustouflant Fjord de Reine & Reinebringen',
        morning: 'Route vers le sud de l’archipel et installation dans un rorbu historique à Reine.',
        afternoon: 'Montée des marches de pierre du mont Reinebringen pour contempler la carte postale mythique des Lofoten.',
        evening: 'Dégustation d’une chaudrée de poisson maison au bord de l’eau.',
        highlight: 'La vue imprenable depuis la crête rocheuse embrassant l’ensemble des îlots reliés par des ponts'
      },
      {
        day: 4,
        title: 'Le Bout du Monde : Village de Å & Kayak de Mer',
        morning: 'Visite du village de pêcheurs le plus au sud, nommé simplement "Å".',
        afternoon: 'Sortie en kayak de mer entre les îlots rocheux à la rencontre des aigles de mer et phoques.',
        evening: 'Chasse nocturne aux aurores boréales (en hiver) ou veillée sous le soleil de minuit (en été).',
        highlight: 'Le silence absolu brisé uniquement par le passage majestueux d’un pygargue à queue blanche'
      },
      {
        day: 5,
        title: 'Musée Viking de Borg & Derniers Panoramas',
        morning: 'Visite de la plus grande maison de chef viking jamais reconstituée à Borg.',
        afternoon: 'Dernière halte photo sur les ponts suspendus de Fredvang.',
        evening: 'Vol retour avec des souvenirs d’immensité plein la tête.',
        highlight: 'Le banquet traditionnel viking avec hydromel artisanal'
      }
    ],
    practicalTips: {
      visa: 'Carte d’identité ou passeport européen en cours de validité (Espace Schengen)',
      currency: 'Couronne norvégienne (NOK) - Paiement par carte/smartphone généralisé partout (zéro cash nécessaire)',
      languages: 'Norvégien et Anglais parlé couramment par 100% de la population',
      safetyLevel: 'Niveau de sécurité maximal',
      localTransport: 'Voiture de location indispensable pour être libre sur les routes insulaires',
      insiderSecret: 'Téléchargez l’application "My Aurora Forecast" en saison hivernale pour être alerté en temps réel du pic d’activité géomagnétique au-dessus de votre position.'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['balanced', 'active_explorer', 'intense_adventure'],
      climates: ['cool_mountain', 'cold_snow', 'temperate_mild'],
      landscapes: ['mountains', 'beaches', 'countryside'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['couple', 'friends', 'solo', 'family'],
      culturalTags: ['local_traditions', 'ancient_history'],
      foodFlavors: ['seafood', 'comfort_traditional'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'water_sports', 'wellness_spa', 'safari_wildlife'],
      physicalIntensityRange: [2, 5],
      flightCategory: 'medium',
      continentTag: 'europe',
      seasons: ['summer', 'winter', 'autumn', 'spring'],
      vibes: ['disconnection', 'romance', 'adrenaline']
    }
  },
  {
    id: 'cyclades-greece',
    name: 'Santorin & Naxos (Cyclades)',
    country: 'Grèce',
    continent: 'Europe',
    region: 'Mer Égée',
    matchScore: 95,
    tagline: 'Villages d’albâtre aux dômes bleus, criques cristallines, couchers de soleil mythiques et gastronomie égéenne',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Couchers de Soleil Mythiques', 'Romantisme & Dolce Vita', 'Cuisine Égéenne & Huile d’Olive', 'Court-Courrier Idéal'],
    whyPerfect: 'Le duo parfait : la vue spectaculaire sur la caldeira volcanique de Santorin pour la féerie romantique, complétée par l’authenticité des villages de marbre et les plages infinies de Naxos.',
    summary: 'Baignées par la lumière éblouissante de la mer Égée, les îles des Cyclades incarnent l’art de vivre méditerranéen : tavernes les pieds dans le sable, ruelles blanchies à la chaux et histoire antique millénaire.',
    bestSeasons: ['Printemps (Mai-Juin pour la douceur et les fleurs)', 'Arrière-saison (Septembre-Octobre pour la mer chaude sans la foule)'],
    weatherExpected: 'Ensoleillement garanti, ciel d’azur limpide et brise marine agréable (24°C à 29°C).',
    flightTimeFromEurope: '~3h15 (Vols directs fréquents depuis Paris/Genève/Bruxelles vers Santorin)',
    idealDuration: '7 à 10 jours (3 nuits Santorin + 4 nuits Naxos en ferry rapide)',
    vibe: 'Solaire, romantique, épicurienne et chaleureuse',
    highlights: [
      'Randonnée spectaculaire le long de la crête de la caldeira de Fira jusqu’au village d’Oia',
      'Dîner en terrasse privée face au coucher de soleil flamboyant sur les falaises de lave rouge et noire',
      'Traversée des oliveraies et villages de montagne traditionnels de Naxos (Apiranthos, Halki)'
    ],
    gastronomy: {
      mustTryDishes: ['Poulpe grillé mariné à l’huile d’olive et origan', 'Salade grecque aux tomates cerises gorgées de soleil et féta AOP', 'Tomatokeftedes (beignets de tomates et menthe de Santorin)', 'Vin blanc minéral Assyrtiko élevé sur sol volcanique'],
      specialtyDesc: 'Des produits bruts d’une qualité incomparable : fromages locaux Graviera de Naxos, câpres sauvages et poissons du jour.',
      foodieSpot: 'Les tavernes familiales du petit port d’Amoudi où les tables touchent directement l’eau turquoise'
    },
    budget: {
      currency: 'EUR (€)',
      flightEstimatePerPerson: 250,
      lodgingPerNight: 130,
      foodPerDayPerPerson: 45,
      activitiesPerDayPerPerson: 25,
      totalEstimated7DaysPerPerson: 1480,
      budgetTip: 'Logez à Imerovigli plutôt qu’à Oia pour le même panorama magique à prix plus doux, et prenez le ferry classique pour relier Naxos.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Santorin & Premiers Pas sur la Caldeira',
        morning: 'Arrivée à l’aéroport de Thira et installation dans une suite troglodyte avec vue plongeante sur le volcan.',
        afternoon: 'Flânerie dans les ruelles pavées de Firostefani et Imerovigli.',
        evening: 'Premier verre de vin blanc volcanique Assyrtiko face au coucher de soleil sur la mer Égée.',
        highlight: 'Le vertige sublime des 300 mètres de falaise plongeant dans le bleu profond de la caldeira'
      },
      {
        day: 2,
        title: 'Randonnée de la Caldeira & Coucher de Soleil d’Oia',
        morning: 'Marche matinale panoramique de 10 km longeant la crête volcanique.',
        afternoon: 'Exploration des moulins à vent et boutiques d’artisanat d’Oia.',
        evening: 'Dîner de fruits de mer les pieds dans l’eau dans la baie d’Amoudi.',
        highlight: 'La lumière dorée caressant les dômes bleus d’Oia à l’heure crépusculaire'
      },
      {
        day: 3,
        title: 'Ferry vers Naxos & Cité Médiévale du Kastro',
        morning: 'Courte traversée en ferry rapide (40 min) vers l’île préservée de Naxos.',
        afternoon: 'Visite de la porte antique monumentale Portara d’Apollon et des ruelles vénitiennes du Kastro.',
        evening: 'Dégustation des fromages et liqueurs de cédrat (Kitron) dans une taverne familiale.',
        highlight: 'Le coucher de soleil encadré à travers l’immense arche de marbre antique du temple d’Apollon'
      },
      {
        day: 4,
        title: 'Plages Sauvages & Villages de Marbre',
        morning: 'Baignade dans les eaux cristallines et dunes de sable fin de Plaka.',
        afternoon: 'Excursion dans les montagnes centrales vers le village en marbre poli d’Apiranthos.',
        evening: 'Dîner champêtre sous une treille de vigne avec gigot d’agneau confit aux herbes de montagne.',
        highlight: 'La convivialité et les généreuses portions offertes par les hôtes locaux'
      },
      {
        day: 5,
        title: 'Croisière en Voilier vers les Petites Cyclades',
        morning: 'Embarquement sur un voilier traditionnel pour nager dans des criques secrètes inaccessibles par la terre.',
        afternoon: 'Plongée avec masque et tuba dans les grottes marines de Rina.',
        evening: 'Dernière soirée douce au son de la musique acoustique traditionnelle grecque.',
        highlight: 'L’eau turquoise d’une clarté absolue semblable à une piscine naturelle'
      }
    ],
    practicalTips: {
      visa: 'Carte d’identité ou passeport européen en cours de validité (Union Européenne)',
      currency: 'Euro (EUR)',
      languages: 'Grec et Anglais parlé partout',
      safetyLevel: 'Excellent niveau de sécurité',
      localTransport: 'Location d’un petit véhicule ou quad idéale pour rayonner sur les îles',
      insiderSecret: 'Faites la randonnée de la caldeira très tôt le matin (départ 7h30) : vous aurez le sentier entièrement pour vous dans une lumière douce sans chaleur.'
    },
    attributes: {
      budgetTiers: ['moderate', 'comfort', 'luxury'],
      pace: ['relaxation', 'balanced', 'active_explorer'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['beaches', 'historic_cities', 'countryside'],
      crowd: ['balanced_mix', 'vibrant_lively', 'secret_hidden'],
      companions: ['couple', 'friends', 'family', 'solo'],
      culturalTags: ['ancient_history', 'architecture', 'local_traditions'],
      foodFlavors: ['mediterranean_fresh', 'seafood'],
      foodImportanceMin: 3,
      activities: ['water_sports', 'cultural_visits', 'wellness_spa', 'nightlife_shopping'],
      physicalIntensityRange: [1, 3],
      flightCategory: 'short',
      continentTag: 'europe',
      seasons: ['spring', 'summer', 'autumn'],
      vibes: ['romance', 'disconnection', 'festive']
    }
  },
  {
    id: 'vietnam-halong-hoian',
    name: 'Baie d’Ha Long & Cité Ancienne de Hội An',
    country: 'Vietnam',
    continent: 'Asie',
    region: 'Asie du Sud-Est',
    matchScore: 97,
    tagline: 'Croisière féerique au milieu des pains de sucre karstiques et ruelles aux mille lanternes de soie',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Patrimoine Mondial UNESCO', 'Street-Food Sublime & Économique', 'Atmosphère Magique aux Lanternes', 'Accueil Inoubliable'],
    whyPerfect: 'Le Vietnam combine le spectacle grandiose de paysages maritimes classés à l’UNESCO avec le charme poétique d’un patrimoine architectural préservé et l’une des cuisines de rue les plus parfumées et fraîches du globe.',
    summary: 'Des eaux émeraude parsemées de milliers d’îlots calcaires de la baie de Lan Ha / Ha Long jusqu’au port marchand historique de Hội An illuminé par des centaines de lampions flottants sur la rivière Thu Bồn.',
    bestSeasons: ['Printemps (Mars à Mai pour le ciel dégagé et les températures douces)', 'Automne (Octobre à Décembre)'],
    weatherExpected: 'Climat subtropical agréable (22°C à 28°C), propice aux croisières et aux balades à vélo.',
    flightTimeFromEurope: '~12h (Vols directs ou 1 escale vers Hanoï ou Danang)',
    idealDuration: '10 à 14 jours (Combiné Hanoï, Baie de Lan Ha et Hội An)',
    vibe: 'Poétique, chaleureuse, gourmande et culturellement captivante',
    highlights: [
      'Nuit à bord d’une jonque traditionnelle en bois au cœur d’une crique isolée de la baie de Lan Ha',
      'Balade crépusculaire en barque à Hội An en déposant une lanterne votive sur l’eau miroitante',
      'Balade à vélo à travers les rizières verdoyantes et le village maraîcher biologique de Tra Que'
    ],
    gastronomy: {
      mustTryDishes: ['Phở parfumé au bœuf et herbes fraîches', 'Bánh Mì croustillant à la citronnelle et pâté artisanal', 'Cao Lầu traditionnel aux nouilles fermes et porc mariné de Hội An', 'Café aux œufs (Egg Coffee) crémeux et caramélisé'],
      specialtyDesc: 'L’art du contraste parfait : croustillant, fondant, herbes aromatiques fraîches cueillies le matin et bouillons mijotés 12 heures.',
      foodieSpot: 'Le marché de nuit de Hội An et les étals de rue où chaque chef prépare sa recette de famille depuis des générations'
    },
    budget: {
      currency: 'Dong vietnamien (VND)',
      flightEstimatePerPerson: 720,
      lodgingPerNight: 55,
      foodPerDayPerPerson: 20,
      activitiesPerDayPerPerson: 25,
      totalEstimated7DaysPerPerson: 1290,
      budgetTip: 'Le coût de la vie sur place est exceptionnellement doux : vous pouvez vous régaler de street food étoilée pour moins de 4€ par repas et loger dans des boutique-hôtels de grand charme avec piscine pour 50€/nuit.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Hanoï & Quartier des 36 Corporations',
        morning: 'Arrivée dans la capitale effervescente et balade autour du lac Hoan Kiem.',
        afternoon: 'Exploration en cyclo-pousse des ruelles historiques du Vieux Quartier bordées d’arbres centenaires.',
        evening: 'Dégustation du célèbre Bún Chả et café glacé vietnamien.',
        highlight: 'La vie trépidante sur les trottoirs et les odeurs envoûtantes d’anis étoilé et de coriandre'
      },
      {
        day: 2,
        title: 'Embarquement pour la Baie d’Ha Long & Lan Ha',
        morning: 'Transfert vers le port et embarquement sur une jonque de charme.',
        afternoon: 'Navigation silencieuse au milieu des falaises karstiques monumentales et séance de kayak dans une lagune cachée.',
        evening: 'Dîner de fruits de mer sur le pont supérieur sous la voûte étoilée.',
        highlight: 'Le coucher de soleil teignant les pitons rocheux de reflets pourpres et or'
      },
      {
        day: 3,
        title: 'Tai-Chi au Lever du Jour & Vol vers Hội An',
        morning: 'Séance de Tai-Chi sur le pont au lever du soleil dans le brouillard matinal mystique.',
        afternoon: 'Débarquement et court vol intérieur vers Da Nang, puis transfert vers Hội An.',
        evening: 'Première découverte de la vieille ville piétonne illuminée de milliers de lanternes en soie multicolores.',
        highlight: 'Le spectacle féerique des lampions illuminant les façades jaunes coloniales'
      },
      {
        day: 4,
        title: 'Vieille Ville de Hội An & Atelier de Cuisine',
        morning: 'Visite guidée du pont-pagode japonais, des maisons communales chinoises et des ateliers de tailleurs sur mesure.',
        afternoon: 'Balade à vélo le long des rizières et cours de cuisine avec un chef local.',
        evening: 'Balade en barque traditionnelle sur la rivière Thu Bồn.',
        highlight: 'La dégustation de vos propres rouleaux de printemps confectionnés à partir d’herbes cueillies le matin même'
      },
      {
        day: 5,
        title: 'Plage d’An Bang & Détente Coco',
        morning: 'Matinée farniente sur la plage de sable doré d’An Bang face à la mer de Chine méridionale.',
        afternoon: 'Massage traditionnel aux herbes aromatiques et dernier shopping d’artisanat.',
        evening: 'Grand festin de dégustation des spécialités régionales avant le départ.',
        highlight: 'La sérénité d’un coucher de soleil face à la mer bordée de palmiers'
      }
    ],
    practicalTips: {
      visa: 'Exemption de visa jusqu’à 45 jours pour les ressortissants français, italiens, espagnols, allemands',
      currency: 'Dong vietnamien (VND) - Les distributeurs et paiements par carte sont faciles dans les villes',
      languages: 'Vietnamien et Anglais courant dans les hôtels et restaurants',
      safetyLevel: 'L’un des pays les plus sûrs et accueillants d’Asie',
      localTransport: 'Vélos pour les villes historiques, chauffeurs privés ou Grab (équivalent Uber très économique)',
      insiderSecret: 'Faites-vous confectionner un costume ou une robe sur mesure à Hội An : les maîtres tailleurs réalisent des pièces de qualité en soie en moins de 24h à des tarifs imbattables.'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate', 'comfort'],
      pace: ['relaxation', 'balanced', 'active_explorer'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['beaches', 'historic_cities', 'countryside', 'forests'],
      crowd: ['balanced_mix', 'vibrant_lively', 'secret_hidden'],
      companions: ['couple', 'friends', 'solo', 'family', 'digital_nomad'],
      culturalTags: ['ancient_history', 'architecture', 'crafts_markets', 'local_traditions'],
      foodFlavors: ['asian_sweet_savory', 'spicy_exotic', 'seafood'],
      foodImportanceMin: 4,
      activities: ['cultural_visits', 'water_sports', 'wellness_spa', 'hiking_outdoor'],
      physicalIntensityRange: [1, 3],
      flightCategory: 'long',
      continentTag: 'asia',
      seasons: ['winter', 'spring', 'autumn'],
      vibes: ['cultural_shock', 'romance', 'disconnection']
    }
  },
  {
    id: 'patagonia-torres-del-paine',
    name: 'Patagonie & Torres del Paine',
    country: 'Chili & Argentine',
    continent: 'Amériques',
    region: 'Grand Sud Patagonien',
    matchScore: 98,
    tagline: 'Le bout du monde : tours de granit monumentales, glaciers titanesques et steppes sauvages peuplées de guanacos',
    coverImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Trek Mythique Mondial', 'Glaciers & Parois Légendaires', 'Déconnexion Extrême', 'Faune Australe'],
    whyPerfect: 'Pour les esprits aventuriers qui rêvent d’espaces infinis et de pureté minérale : la Patagonie offre l’une des natures les plus dramatiques et préservées de la planète Terre.',
    summary: 'Aux confins du continent sud-américain, le parc national Torres del Paine dresse ses cornes de granit au-dessus de lacs turquoise laiteux alimentés par le champ de glace Sud, dans une atmosphère de bout du monde.',
    bestSeasons: ['Été austral (Décembre à Mars pour les journées longues et le climat plus clément)'],
    weatherExpected: 'Climat subpolaire changeant : soleil éclatant, vents puissants et air pur vivifiant (10°C à 18°C).',
    flightTimeFromEurope: '~16h (Vol Santiago ou Buenos Aires + vol intérieur vers Punta Arenas ou Puerto Natales)',
    idealDuration: '10 à 14 jours (Circuit W ou combiné El Calafate Perito Moreno & Torres del Paine)',
    vibe: 'Épique, sauvage, puissante et profondément émouvante',
    highlights: [
      'Arrivée au belvédère Base Las Torres face aux trois aiguilles de granit vertigineuses et leur lagon turquoise',
      'Navigation en bateau au pied du glacier Grey au milieu des icebergs bleus flottants',
      'Observation des condors des Andes planant au-dessus des troupeaux de guanacos dans la pampa'
    ],
    gastronomy: {
      mustTryDishes: ['Cordero al palo (agneau de Patagonie rôti lentement au feu de bois)', 'Centaura (crabe royal géant des fjords austraux)', 'Calafate Berry Pie (baie locale dont la légende dit que quiconque en mange reviendra en Patagonie)', 'Vin rouge Carmenère chilien'],
      specialtyDesc: 'Une cuisine de pionniers réconfortante et généreuse autour de grillades au feu de bois et de produits de la mer australe.',
      foodieSpot: 'Les auberges et estancias traditionnelles tenues par les gauchos au milieu des plaines'
    },
    budget: {
      currency: 'Peso chilien (CLP) / Dollar US (USD)',
      flightEstimatePerPerson: 950,
      lodgingPerNight: 140,
      foodPerDayPerPerson: 50,
      activitiesPerDayPerPerson: 45,
      totalEstimated7DaysPerPerson: 2150,
      budgetTip: 'Réservez les refuges du parc Torres del Paine au moins 6 mois à l’avance pour éviter les tarifs de dernière minute, ou optez pour le bivouac équipé en tente dôme.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Puerto Natales & Entrée dans la Pampa Patagonienne',
        morning: 'Arrivée à Puerto Natales, charmante bourgade portuaire aux maisons de tôle colorées.',
        afternoon: 'Préparation du matériel de randonnée et briefing météo face au fjord Última Esperanza.',
        evening: 'Dîner de crabe royal frais arrosé d’un Pisco Sour maison.',
        highlight: 'La vue sur les montagnes enneigées se reflétant dans les eaux calmes du fjord'
      },
      {
        day: 2,
        title: 'Arrivée dans le Parc Torres del Paine & Salto Grande',
        morning: 'Traversée de la steppe patagonienne et entrée dans le parc national avec vue sur les Cuernos.',
        afternoon: 'Courte randonnée vers la cascade rugissante du Salto Grande et le mirador des Cuernos.',
        evening: 'Installation dans un écolodge en bois avec vue panoramique sur le massif.',
        highlight: 'La puissance brute du vent patagonien et la couleur turquoise électrique de l’eau du lac Pehoe'
      },
      {
        day: 3,
        title: 'Ascension Mythique vers la Base Las Torres',
        morning: 'Départ matinal pour la randonnée reine traversant la vallée de l’Ascencio.',
        afternoon: 'Passage de la moraine glaciaire et révélation du lagon turquoise dominé par les trois tours de granit de 2800 m.',
        evening: 'Retour au camp et repas chaud réconfortant partagé avec des trekkeurs du monde entier.',
        highlight: 'L’émotion saisissante face à la démesure des parois verticales dressées vers le ciel'
      },
      {
        day: 4,
        title: 'Glacier Grey & navigation entre les Icebergs',
        morning: 'Randonnée le long du lac Grey bordé de forêts de hêtres austraux (Lenga).',
        afternoon: 'Navigation en catamaran tout près de la falaise de glace bleue haute de 30 mètres du glacier Grey.',
        evening: 'Dégustation d’un verre de whisky rafraîchi avec un glaçon millénaire du glacier.',
        highlight: 'Le craquement assourdissant des blocs de glace se détachant dans le lac'
      },
      {
        day: 5,
        title: 'Estancia Gaucha & Retour Vers le Nord',
        morning: 'Immersion dans une estancia historique à la rencontre des gauchos et démonstration de tonte de moutons.',
        afternoon: 'Dernière séance photo avec les hardes de guanacos sauvages.',
        evening: 'Célébration autour d’un grand asado traditionnel au feu de bois.',
        highlight: 'La transmission chaleureuse des traditions équestres par les gauchos patagons'
      }
    ],
    practicalTips: {
      visa: 'Pas de visa requis pour les ressortissants de l’UE / Suisses / Canadiens (jusqu’à 90 jours)',
      currency: 'Peso chilien (CLP) et Peso argentin (ARS) - Cartes bancaires acceptées dans les villes principales',
      languages: 'Espagnol et Anglais dans les parcs',
      safetyLevel: 'Très haut niveau de sécurité dans tout le sud chilien et argentin',
      localTransport: 'Bus réguliers ou 4x4 de location depuis Puerto Natales / Punta Arenas',
      insiderSecret: 'Adoptez la règle des 3 couches techniques (respirante, thermique, coupe-vent/imperméable) car en Patagonie, vous pouvez vivre les 4 saisons en une seule journée !'
    },
    attributes: {
      budgetTiers: ['comfort', 'luxury'],
      pace: ['active_explorer', 'intense_adventure'],
      climates: ['cool_mountain', 'cold_snow', 'temperate_mild'],
      landscapes: ['mountains', 'forests', 'countryside'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['friends', 'couple', 'solo'],
      culturalTags: ['local_traditions'],
      foodFlavors: ['comfort_traditional', 'seafood'],
      foodImportanceMin: 2,
      activities: ['hiking_outdoor', 'safari_wildlife', 'wellness_spa'],
      physicalIntensityRange: [3, 5],
      flightCategory: 'long',
      continentTag: 'americas',
      seasons: ['winter', 'spring', 'autumn'],
      vibes: ['adrenaline', 'disconnection']
    }
  },
  {
    id: 'marrakech-sahara-morocco',
    name: 'Marrakech & Dunes de Merzouga',
    country: 'Maroc',
    continent: 'Afrique',
    region: 'Maghreb & Sahara',
    matchScore: 96,
    tagline: 'L’effervescence des souks parfumés, la fraîcheur des riads d’artisanat et la magie d’une nuit sous la voie lactée saharienne',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Dépaysement Express (<3h30 de vol)', 'Hospitalité & Riads de Charme', 'Bivouac Étoilé dans les Dunes', 'Saveurs & Épices Subtiles'],
    whyPerfect: 'À seulement 3 heures de vol de l’Europe, le Maroc offre un choc culturel et sensoriel total : médinas vibrantes, palais ciselés de zelliges, traversée grandiose du Haut-Atlas et silence absolu des grandes dunes du Sahara.',
    summary: 'De la place Jemaa el-Fna vibrante de musiciens et conteurs jusqu’à l’Erg Chebbi et ses dunes de sable ocre doré hautes de 150 mètres, ce voyage tisse un pont intemporel entre raffinement oriental et grands espaces désertiques.',
    bestSeasons: ['Automne (Octobre à Décembre)', 'Printemps (Mars à Mai pour la floraison des vallées de l’Atlas)'],
    weatherExpected: 'Ensoleillement généreux, journées douces et chaudes (22°C à 28°C) avec nuits fraîches et étoilées dans le désert.',
    flightTimeFromEurope: '~3h15 (Vols directs très fréquents et abordables vers Marrakech)',
    idealDuration: '6 à 9 jours (Combiné Marrakech, Vallée du Dadès et Bivouac à Merzouga)',
    vibe: 'Envoûtante, chaleureuse, épicée et hors du temps',
    highlights: [
      'Nuit sous une tente berbère de luxe au sommet des dunes dorées de l’Erg Chebbi bercée par les chants gnaouas',
      'Flânerie dans le jardin Majorelle bleu cobalt et visite du musée Yves Saint Laurent',
      'Traversée de la route des Mille Kasbahs et exploration de la forteresse de terre cuite d’Aït Ben Haddou'
    ],
    gastronomy: {
      mustTryDishes: ['Tajine d’agneau fondant aux pruneaux caramélisés et amandes grillées', 'Couscous royal aux sept légumes du jardin', 'Pastilla croustillante au pigeon ou poulet parfumée à la cannelle et fleur d’oranger', 'Thé à la menthe fraîche servi selon la tradition d’hospitalité'],
      specialtyDesc: 'Une des plus grandes cuisines du monde : subtile harmonie entre épices douces (safran de Taliouine, ras-el-hanout), herbes fraîches et cuissons lentes à l’étouffée.',
      foodieSpot: 'Les cours intérieures secrètes des riads historiques où l’on dîne au milieu des orangers et bougies flottantes'
    },
    budget: {
      currency: 'Dirham marocain (MAD)',
      flightEstimatePerPerson: 180,
      lodgingPerNight: 75,
      foodPerDayPerPerson: 25,
      activitiesPerDayPerPerson: 25,
      totalEstimated7DaysPerPerson: 980,
      budgetTip: 'Négociez toujours avec le sourire dans les souks, privilégiez les riads tenus par des familles locales et dégustez les jus d’oranges pressés minute sur la place pour 1€.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Marrakech & Magie de Jemaa el-Fna',
        morning: 'Arrivée à l’aéroport de Marrakech Menara et installation dans un riad d’époque de la médina.',
        afternoon: 'Promenade dans les ruelles du souk des épices et des teinturiers.',
        evening: 'Dîner sur un toit-terrasse surplombant le spectacle vivant de la place Jemaa el-Fna à la lueur des lampions.',
        highlight: 'L’envoûtement des senteurs de fleur d’oranger, de cuir et de cumin flottant dans l’air du soir'
      },
      {
        day: 2,
        title: 'Palais Bahia & Jardin Majorelle',
        morning: 'Visite des chefs-d’œuvre d’architecture hispano-mauresque du Palais de la Bahia et des Tombeaux Saadiens.',
        afternoon: 'Pause fraîcheur dans la bambouseraie et les allées de cactus du Jardin Majorelle.',
        evening: 'Rituel purifiant du hammam traditionnel au savon noir et massage à l’huile d’argan pure.',
        highlight: 'L’intensité du bleu Majorelle éclatant sous le soleil marocain'
      },
      {
        day: 3,
        title: 'Traversée du Haut-Atlas & Forteresse d’Aït Ben Haddou',
        morning: 'Départ en 4x4 par le spectaculaire col du Tichka culminant à 2260 mètres d’altitude.',
        afternoon: 'Exploration à pied du Ksar d’Aït Ben Haddou, célèbre cité fortifiée classée à l’UNESCO.',
        evening: 'Nuit dans une maison d’hôtes de la vallée des roses face aux gorges rocheuses.',
        highlight: 'La terre ocre rougeoyante contrastant avec le vert émeraude des palmeraies'
      },
      {
        day: 4,
        title: 'Gorges du Todra & Bivouac Royal dans le Sahara',
        morning: 'Passage impressionnant entre les parois vertigineuses de 300 mètres des gorges du Todra.',
        afternoon: 'Arrivée à Merzouga et caravane de dromadaires au coucher du soleil jusqu’au cœur des dunes de l’Erg Chebbi.',
        evening: 'Dîner sous la voûte céleste et soirée musicale autour du feu de camp bédouin.',
        highlight: 'L’incroyable clarté de la Voie Lactée dans le silence absolu du désert'
      },
      {
        day: 5,
        title: 'Lever de Soleil sur les Dunes & Retour Sérénité',
        morning: 'Ascension matinale de la grande crête de sable pour assister au lever de soleil doré sur l’horizon saharien.',
        afternoon: 'Retour paisible vers Marrakech en traversant la vallée du Drâa et ses oasis.',
        evening: 'Dernier thé à la menthe et pâtisseries aux amandes (cornes de gazelle).',
        highlight: 'La première lueur rose et orangée embrasant la mer de sable ondulant'
      }
    ],
    practicalTips: {
      visa: 'Passeport en cours de validité (pas de visa pour les séjours touristiques de moins de 90 jours)',
      currency: 'Dirham marocain (MAD) - Espèces indispensables dans les souks et pourboires',
      languages: 'Arabe, Berbère et Français parlé couramment par la grande majorité',
      safetyLevel: 'Très bon niveau de sécurité avec une police touristique attentive',
      localTransport: 'Chauffeur privé 4x4 ou circuit organisé idéal pour l’excursion désert',
      insiderSecret: 'Montez au sommet de la terrasse du café de France sur la place Jemaa el-Fna vers 17h45 pour voir toute la ville s’illuminer au moment précis de l’appel à la prière du coucher de soleil.'
    },
    attributes: {
      budgetTiers: ['backpacker', 'moderate', 'comfort', 'luxury'],
      pace: ['balanced', 'active_explorer'],
      climates: ['tropical_warm', 'temperate_mild'],
      landscapes: ['deserts', 'historic_cities', 'mountains'],
      crowd: ['vibrant_lively', 'balanced_mix', 'secret_hidden'],
      companions: ['couple', 'friends', 'family', 'solo'],
      culturalTags: ['architecture', 'crafts_markets', 'local_traditions', 'ancient_history'],
      foodFlavors: ['spicy_exotic', 'comfort_traditional', 'mediterranean_fresh'],
      foodImportanceMin: 3,
      activities: ['cultural_visits', 'wellness_spa', 'nightlife_shopping', 'safari_wildlife'],
      physicalIntensityRange: [1, 3],
      flightCategory: 'short',
      continentTag: 'africa',
      seasons: ['autumn', 'spring', 'winter'],
      vibes: ['cultural_shock', 'romance', 'disconnection']
    }
  },
  {
    id: 'polynesia-bora-moorea',
    name: 'Bora Bora & Moorea',
    country: 'Polynésie Française',
    continent: 'Océanie',
    region: 'Pacifique Sud',
    matchScore: 99,
    tagline: 'Le lagon le plus étincelant de la planète, bungalows sur pilotis, raies mantas et pics volcaniques tropicaux',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    matchBadges: ['Le Plus Beau Lagon du Monde', 'Paradis Romantique Absolu', 'Plongée & Raies Pastenagues', 'Luxe & Sérénité Totale'],
    whyPerfect: 'L’incarnation ultime du voyage de rêve : une palette infinie de bleus turquoise, une eau à 29°C habitée par une faune marine inoffensive et l’hospitalité légendaire du peuple ma’ohi au parfum de fleur de tiaré.',
    summary: 'Joyaux de l’archipel de la Société, Moorea séduit par ses baies majestueuses (Cook et Opunohu) et ses jardins d’ananas, tandis que Bora Bora déploie son lagon mythique gardé par la silhouette impériale du mont Otemanu.',
    bestSeasons: ['Mai à Octobre (Saison sèche avec alizés doux et excellente visibilité sous-marine)'],
    weatherExpected: 'Climat tropical idyllique : chaleur tempérée par les alizés (26°C à 30°C) et eau cristalline à 28°C toute l’année.',
    flightTimeFromEurope: '~22h (Vol Paris - Papeete avec escale technique Los Angeles/San Francisco + court vol Air Tahiti)',
    idealDuration: '12 à 18 jours (Tahiti, Moorea et Bora Bora)',
    vibe: 'Paradisique, romantique, exclusive et profondément apaisante',
    highlights: [
      'Nage avec masque et tuba aux côtés des raies pastenagues douces et des requins à pointes noires dans une eau translucide',
      'Petit-déjeuner livré en pirogue fleurie directement sur la terrasse de votre villa sur pilotis',
      'Tour de l’île de Moorea en quad à travers les crêtes volcaniques et dégustation de jus d’ananas frais à l’usine de jus de fruits'
    ],
    gastronomy: {
      mustTryDishes: ['Poisson cru à la tahitienne (thon rouge mariné au jus de citron vert et lait de coco frais)', 'Po’e banane cuit au four traditionnel avec vanille de Taha’a', 'Mahi-mahi grillé avec sauce vanille Bourbon', 'Fruits de la passion et ananas Queen de Moorea gorgés de sucre'],
      specialtyDesc: 'La fraîcheur absolue des poissons pélagiques du Pacifique associée à la douceur du lait de coco pressé minute et à la vanille parfumée.',
      foodieSpot: 'Les "Roulottes" conviviales de bord de lagon pour déguster un poisson cru géant les pieds dans le sable chaud'
    },
    budget: {
      currency: 'Franc Pacifique (XPF) rattaché à l’Euro',
      flightEstimatePerPerson: 1350,
      lodgingPerNight: 240,
      foodPerDayPerPerson: 60,
      activitiesPerDayPerPerson: 60,
      totalEstimated7DaysPerPerson: 3250,
      budgetTip: 'Combinez quelques nuits en pension de famille traditionnelle (Fare) sur Moorea avec un séjour d’exception en resort sur pilotis à Bora Bora pour équilibrer le budget tout en vivant une immersion locale authentique.'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Tahiti & Traversée vers Moorea',
        morning: 'Accueil traditionnel à l’aéroport de Tahiti-Faa’a avec collier de fleurs de tiaré fraîches.',
        afternoon: 'Traversée de 30 minutes en ferry rapide vers l’île sœur de Moorea aux crêtes découpées.',
        evening: 'Cocktail Mai Tai face au coucher de soleil sur l’océan Pacifique.',
        highlight: 'L’enivrante senteur naturelle de fleur de tiaré qui vous enveloppe dès la descente de l’avion'
      },
      {
        day: 2,
        title: 'Lagoon Safari & Rencontre avec les Raies à Moorea',
        morning: 'Excursion en pirogue à moteur dans le lagon pour nager dans 1m20 d’eau avec les raies et poissons-clowns.',
        afternoon: 'Pique-nique de poisson cru préparé devant vous sur un motu (îlot de sable blanc privé).',
        evening: 'Dîner sous les étoiles au son du ukulélé traditionnel.',
        highlight: 'La caresse douce des raies pastenagues glissant contre l’eau turquoise'
      },
      {
        day: 3,
        title: 'Le Belvédère de Moorea & Vol vers Bora Bora',
        morning: 'Montée au belvédère panoramique embrassant la baie de Cook, la baie d’Opunohu et le mont Rotui.',
        afternoon: 'Court vol panoramique de 45 minutes vers l’aéroport de Bora Bora situé directement sur un îlot du récif.',
        evening: 'Transfert en bateau navette vers votre bungalow sur pilotis et premier bain direct depuis votre ponton.',
        highlight: 'Le spectacle aérien de l’atoll de Bora Bora depuis le hublot de l’avion avec son dégradé de bleus'
      },
      {
        day: 4,
        title: 'Le Lagon Sacré de Bora Bora & Mont Otemanu',
        morning: 'Tour guidé en bateau écologique autour du mont volcanique Otemanu aux falaises vertigineuses.',
        afternoon: 'Plongée libre dans le jardin de corail multicolore abritant anémones et bénitiers géants.',
        evening: 'Dîner gastronomique polynésien les pieds dans l’eau avec spectacle de danse du feu traditionnelle.',
        highlight: 'L’incroyable clarté de l’eau où la visibilité dépasse souvent les 40 mètres'
      },
      {
        day: 5,
        title: 'Sérénité au Motu & Souvenirs Éternels',
        morning: 'Massage relaxant en duo au monoï traditionnel dans un spa ouvert sur le lagon.',
        afternoon: 'Dernier shopping d’une véritable perle noire de culture de Tahiti certifiée.',
        evening: 'Coucher de soleil inoubliable teignant le mont Otemanu de reflets pourpres et dorés.',
        highlight: 'Le sentiment d’avoir touché du doigt le plus beau paradis terrestre'
      }
    ],
    practicalTips: {
      visa: 'Territoire français : simple carte d’identité ou passeport pour les citoyens français/UE (autorisation ESTA nécessaire pour le transit par les USA)',
      currency: 'Franc Pacifique (XPF - taux fixe : 1€ = 119,33 XPF)',
      languages: 'Français et Reo Tahiti (langue tahitienne)',
      safetyLevel: 'Sécurité totale et accueil d’une générosité exceptionnelle',
      localTransport: 'Vélos, scooters ou bateaux navettes des hôtels entre les motus et l’île principale',
      insiderSecret: 'Lors de la réservation de votre vol intérieur Tahiti-Bora Bora, asseyez-vous à gauche de l’appareil à l’aller (et à droite au retour) pour bénéficier de la vue aérienne la plus mythique sur le lagon au moment de l’atterrissage !'
    },
    attributes: {
      budgetTiers: ['luxury', 'comfort'],
      pace: ['relaxation', 'balanced'],
      climates: ['tropical_warm'],
      landscapes: ['beaches', 'mountains', 'forests'],
      crowd: ['secret_hidden', 'balanced_mix'],
      companions: ['couple', 'friends', 'family', 'solo'],
      culturalTags: ['local_traditions'],
      foodFlavors: ['seafood', 'asian_sweet_savory', 'comfort_traditional'],
      foodImportanceMin: 3,
      activities: ['water_sports', 'wellness_spa', 'safari_wildlife', 'cultural_visits'],
      physicalIntensityRange: [1, 2],
      flightCategory: 'long',
      continentTag: 'oceania',
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      vibes: ['romance', 'disconnection']
    }
  }
];


