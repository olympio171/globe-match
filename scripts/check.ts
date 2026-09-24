/**
 * `npm test` — validates every destination record, then runs traveller
 * profiles through the engine and checks the podium makes sense. A failure
 * here means either a data typo or a ranking regression.
 */
import { DESTINATIONS } from '../src/data/destinations/index.ts';
import images from '../src/data/images.json';
import { QUIZ_STEPS } from '../src/data/questions.ts';
import { recommend } from '../src/services/engine.ts';
import { BASE_KEYS, FEATURE_KEYS, type QuizAnswers } from '../src/types.ts';

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

/* ----------------------------------------------------------- data checks */

const ZONES = ['europe', 'mena', 'africa', 'asia', 'oceania', 'north_america', 'latin_america'];
const CUISINES = ['spicy', 'mediterranean', 'asian', 'terroir', 'seafood', 'streetfood', 'veggie', 'latin'];
const ids = new Set<string>();

console.log(`Données : ${DESTINATIONS.length} destinations`);
for (const d of DESTINATIONS) {
  const where = `[${d.id}]`;
  if (ids.has(d.id)) fail(`${where} identifiant en double`);
  ids.add(d.id);
  if (d.climate.t.length !== 12) fail(`${where} ${d.climate.t.length} températures au lieu de 12`);
  if (!/^[0-3]{12}$/.test(d.climate.r)) fail(`${where} pluie mal formée « ${d.climate.r} »`);
  if (!/^[01]{12}$/.test(d.climate.best)) fail(`${where} saison mal formée « ${d.climate.best} »`);
  if (!d.climate.best.includes('1')) fail(`${where} aucun mois recommandé`);
  for (const k of BASE_KEYS) if (typeof d.f[k] !== 'number') fail(`${where} trait « ${k} » manquant`);
  for (const [k, v] of Object.entries(d.f)) {
    if (!FEATURE_KEYS.includes(k as never)) fail(`${where} trait inconnu « ${k} »`);
    if (!Number.isInteger(v) || v < 0 || v > 5) fail(`${where} ${k}=${v} hors de 0–5`);
  }
  for (const e of d.experiences)
    for (const t of e.tags) if (!FEATURE_KEYS.includes(t)) fail(`${where} étiquette inconnue « ${t} » dans « ${e.title} »`);
  if (d.experiences.length < 5) fail(`${where} seulement ${d.experiences.length} expériences`);
  if (d.dishes.length < 3) fail(`${where} seulement ${d.dishes.length} plats`);
  if (!d.zones.length || d.zones.some((z) => !ZONES.includes(z))) fail(`${where} zones invalides`);
  if (d.cuisine.some((c) => !CUISINES.includes(c))) fail(`${where} cuisine invalide`);
  if (d.days[0] > d.days[1]) fail(`${where} durée incohérente`);
  if (d.cost <= 0) fail(`${where} coût invalide`);
  if (Math.abs(d.coords[0]) > 90 || Math.abs(d.coords[1]) > 180) fail(`${where} coordonnées invalides`);
  if (!(d.id in images)) console.log(`  · ${where} pas de photo (dégradé de secours)`);
}

const stepIds = QUIZ_STEPS.map((s) => s.id);
if (new Set(stepIds).size !== stepIds.length) fail('questions en double');

/* ------------------------------------------------------- ranking checks */

const BASE: QuizAnswers = {
  origin: 'paris', companion: 'couple', duration: 'two_weeks', pace: 'balanced',
  exotic: 3, crowd: 'balanced', foodImportance: 3, lodging: 'boutique',
  budget: 'b3500', flightMax: 'any', zones: ['all'], constraints: [], notes: '',
};

interface Scenario {
  name: string;
  answers: QuizAnswers;
  /** At least one of these must be on the podium. */
  expectAny: string[];
  /** Every podium entry must belong to this set, when given. */
  within?: string[];
  /** None of these may be on the podium. */
  never?: string[];
}

const EUROPE = DESTINATIONS.filter((d) => d.zones[0] === 'europe').map((d) => d.id);
const FRENCH = DESTINATIONS.filter((d) => d.french === 2).map((d) => d.id);

const SCENARIOS: Scenario[] = [
  {
    name: 'Plage tropicale en janvier',
    answers: { ...BASE, when: [0], pace: 'lazy', climate: ['scorching', 'hot'], landscapes: ['beach', 'island'], activities: ['diving', 'relax'], culture: ['none'], crowd: 'calm', vibes: ['serenity', 'romance'] },
    expectAny: ['maldives', 'seychelles', 'maurice', 'thailande-iles', 'zanzibar', 'palawan'],
    never: [...EUROPE, 'bali', 'polynesie', 'komodo'],
  },
  {
    name: 'Week-end culturel en octobre, moins de 3 h',
    answers: { ...BASE, duration: 'long_weekend', when: [9], pace: 'active', climate: ['mild', 'hot'], landscapes: ['heritage', 'city'], activities: ['markets', 'wine'], culture: ['art', 'architecture', 'history'], budget: 'b1300', flightMax: 'h3', zones: ['europe'], foodImportance: 5, priorities: ['food', 'easy'] },
    expectAny: ['rome', 'lisbonne', 'barcelone', 'toscane', 'andalousie', 'porto', 'prague', 'budapest'],
    within: EUROPE,
  },
  {
    name: 'Aurores et neige en février',
    answers: { ...BASE, duration: 'week', when: [1], climate: ['cold'], landscapes: ['snow', 'forest'], activities: ['sky', 'adventure'], culture: ['none'], crowd: 'calm', vibes: ['wonder'] },
    expectAny: ['laponie', 'islande', 'lofoten', 'alaska'],
    within: ['laponie', 'islande', 'lofoten', 'alaska', 'hokkaido', 'quebec', 'rocheuses', 'alpes-suisses', 'dolomites'],
  },
  {
    name: 'Grand safari en août',
    answers: { ...BASE, when: [7], climate: ['any'], landscapes: ['savanna'], activities: ['wildlife'], culture: ['none'], budget: 'b6000', lodging: 'eco', vibes: ['wonder'], priorities: ['activities'] },
    expectAny: ['tanzanie', 'botswana'],
    within: ['tanzanie', 'botswana', 'namibie', 'le-cap', 'sri-lanka', 'madagascar', 'borneo', 'galapagos', 'alaska', 'mongolie'],
  },
  {
    name: 'Routard en Asie un mois, petit budget',
    answers: { ...BASE, companion: 'solo', duration: 'month', when: [1], pace: 'active', climate: ['hot', 'mild'], landscapes: ['jungle', 'heritage', 'mountain'], activities: ['hiking', 'markets'], culture: ['spiritual', 'traditions'], exotic: 5, lodging: 'homestay', budget: 'b2200', zones: ['asia'], cuisines: ['streetfood', 'spicy'], priorities: ['budget'] },
    expectAny: ['vietnam', 'thailande-nord', 'luang-prabang', 'angkor', 'sri-lanka', 'rajasthan', 'kerala'],
    never: ['maldives', 'bhoutan', 'singapour', 'tokyo'],
  },
  {
    name: 'Famille, jeunes enfants, plage en été, sans paludisme, moins de 5 h',
    answers: { ...BASE, companion: 'family_young', when: [6, 7], climate: ['hot'], landscapes: ['beach'], activities: ['relax', 'diving'], culture: ['none'], flightMax: 'h5', constraints: ['no_malaria'], budget: 'b2200' },
    expectAny: ['majorque', 'crete', 'sardaigne', 'corse', 'cyclades', 'djerba', 'sicile', 'dalmatie'],
    never: ['tanzanie', 'zanzibar', 'madagascar', 'senegal'],
  },
  {
    name: 'Trek en haute montagne en octobre',
    answers: { ...BASE, companion: 'friends', duration: 'three_weeks', when: [9], pace: 'intense', climate: ['cool', 'mild'], landscapes: ['mountain', 'snow'], activities: ['hiking', 'adventure'], culture: ['spiritual'], lodging: 'homestay', budget: 'b3500', vibes: ['wonder', 'adrenaline'] },
    expectAny: ['nepal', 'bhoutan', 'cusco', 'patagonie'],
  },
  {
    name: 'Soleil d’hiver en français',
    answers: { ...BASE, when: [1], climate: ['hot', 'scorching'], landscapes: ['beach', 'volcano'], activities: ['hiking', 'diving'], culture: ['none'], constraints: ['french'] },
    expectAny: ['reunion', 'guadeloupe', 'maurice', 'nouvelle-caledonie', 'senegal'],
    within: FRENCH,
  },
  {
    name: 'Ski en février',
    answers: { ...BASE, duration: 'week', when: [1], climate: ['cold'], landscapes: ['snow', 'mountain'], activities: ['ski'], culture: ['none'], budget: 'b3500' },
    expectAny: ['alpes-suisses', 'dolomites', 'rocheuses', 'hokkaido'],
    within: ['alpes-suisses', 'dolomites', 'rocheuses', 'hokkaido', 'laponie', 'quebec', 'alaska', 'georgie'],
  },
  {
    name: 'Télétravail un mois, wifi indispensable',
    answers: { ...BASE, companion: 'nomad', duration: 'month', when: 'flexible', climate: ['mild', 'hot'], landscapes: ['city', 'beach'], activities: ['surf', 'nightlife'], culture: ['art'], lodging: 'apartment', budget: 'b3500', constraints: ['wifi'] },
    expectAny: ['lisbonne', 'madere', 'tenerife', 'bali', 'thailande-nord', 'barcelone', 'buenos-aires', 'colombie', 'seoul'],
  },
  {
    name: 'Depuis Montréal, une semaine au soleil en février',
    answers: { ...BASE, origin: 'montreal', duration: 'week', when: [1], climate: ['hot', 'scorching'], landscapes: ['beach'], activities: ['relax', 'diving'], culture: ['history'], flightMax: 'h5' },
    expectAny: ['yucatan', 'cuba', 'republique-dominicaine', 'guadeloupe'],
    within: ['yucatan', 'cuba', 'republique-dominicaine', 'guadeloupe', 'costa-rica', 'hawaii', 'californie', 'oaxaca'],
  },
  {
    name: 'Envie libre : volcans et baleines, pas de grandes villes',
    answers: { ...BASE, when: 'flexible', notes: 'Je rêve de volcans et de baleines, pas de grandes villes' },
    expectAny: ['acores', 'islande', 'hawaii', 'reunion', 'tenerife', 'galapagos', 'cap-vert'],
  },
];

for (const sc of SCENARIOS) {
  const rec = recommend(sc.answers);
  const podium = rec.podium.map((m) => m.dest.id);
  console.log(`\n${sc.name}`);
  console.log(`  podium : ${rec.podium.map((m) => `${m.dest.id} ${m.pct}%`).join(' · ')}`);
  console.log(`  ensuite : ${rec.alternatives.map((m) => `${m.dest.id} ${m.pct}%`).join(' · ')}`);
  if (!podium.some((id) => sc.expectAny.includes(id))) fail(`aucune de ${sc.expectAny.join(', ')} sur le podium`);
  if (sc.within) for (const id of podium) if (!sc.within.includes(id)) fail(`${id} ne devrait pas être sur le podium`);
  if (sc.never) for (const id of podium) if (sc.never.includes(id)) fail(`${id} est exclu pour ce profil`);
  if (new Set(rec.podium.map((m) => `${m.dest.country}|${m.dest.zones[0]}`)).size < rec.podium.length) fail('deux destinations du même pays sur le podium');
  for (const m of rec.podium) if (!m.reasons.length) fail(`${m.dest.id} sans aucune explication`);
}

console.log(failures ? `\n${failures} échec(s).` : '\nTout est bon.');
process.exit(failures ? 1 : 0);
