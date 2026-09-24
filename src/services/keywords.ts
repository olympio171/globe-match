import type { FeatureKey } from '../types';

/**
 * Free-text wishes, turned into criteria. Each rule maps French wording to a
 * destination trait; a negation just before the match (“pas de”, “sans”,
 * “éviter”…) flips it, so “pas de grandes villes” penalises cities instead of
 * rewarding them.
 *
 * `quiet` and `cheap` are pseudo-traits the engine derives from crowd levels
 * and daily cost.
 */
export type NoteKey = FeatureKey | 'quiet' | 'cheap';

export interface DetectedWish {
  key: NoteKey;
  label: string;
  negated: boolean;
}

interface Rule {
  re: RegExp;
  key: NoteKey;
  label: string;
}

/** Phrases that already carry their own polarity: matched first, never negated. */
const PHRASES: Rule[] = [
  { re: /\b(pas|peu|moins) de (foule|monde|touristes)|sans (foule|touristes)|loin (de la foule|des touristes)|calme|tranquill|isol[ée]|au calme/g, key: 'quiet', label: 'le calme' },
  { re: /pas cher|petit budget|[ée]conomique|bon march[ée]|budget serr[ée]/g, key: 'cheap', label: 'un petit budget' },
];

const RULES: Rule[] = [
  { re: /volcan/g, key: 'volcano', label: 'les volcans' },
  { re: /plong[ée]|snorkel|masque et tuba|r[ée]cif|corail|coraux/g, key: 'diving', label: 'la plongée' },
  { re: /\bsurf|kite|glisse|vagues?\b/g, key: 'surf', label: 'le surf' },
  { re: /aurore|bor[ée]al/g, key: 'sky', label: 'les aurores' },
  { re: /[ée]toil|astronom|voie lact/g, key: 'sky', label: 'les ciels étoilés' },
  { re: /baleine|dauphin|tortue|requin|\braies?\b|manta|otarie|phoque/g, key: 'wildlife', label: 'la faune marine' },
  { re: /safari|lions?\b|[ée]l[ée]phant|girafe|animaux|faune|\bours\b|singe|orang|l[ée]murien|oiseau/g, key: 'wildlife', label: 'les animaux' },
  { re: /rando|trek|marcher|sentier|sommet/g, key: 'hiking', label: 'la randonnée' },
  { re: /montagne|alpin|himalaya|\bandes\b/g, key: 'mountain', label: 'la montagne' },
  { re: /\bski|poudreuse|snowboard/g, key: 'ski', label: 'le ski' },
  { re: /glacier|banquise|neige|iceberg/g, key: 'snow', label: 'la neige' },
  { re: /plage|sable|baignade|nager|se baigner/g, key: 'beach', label: 'la plage' },
  { re: /lagon|(?:^|[\s'(])[îi]les?(?![a-zà-ÿ])|archipel|[îi]lot/g, key: 'island', label: 'les îles' },
  { re: /\bvins?\b|vignoble|vigne|oenolog|œnolog|d[ée]gustation|whisky|mezcal/g, key: 'wine', label: 'le vin' },
  { re: /temple|monast[èe]re|spiritu|m[ée]dit|bouddh|pagode|mosqu[ée]e/g, key: 'spiritual', label: 'les temples' },
  { re: /mus[ée]e|galerie|peinture|\bart\b|artistique/g, key: 'art', label: 'l’art' },
  { re: /histoire|historique|ruine|antique|arch[ée]olog|pyramide|ch[âa]teau|romain|maya|inca/g, key: 'history', label: 'l’histoire' },
  { re: /architect|palais|cath[ée]drale/g, key: 'architecture', label: 'l’architecture' },
  { re: /f[êe]te|soir[ée]e|clubs?\b|\bbars?\b|vie nocturne|festival/g, key: 'nightlife', label: 'la fête' },
  { re: /musique|jazz|concert|danse|salsa|tango|flamenco/g, key: 'music', label: 'la musique' },
  { re: /d[ée]sert(?!e)|dune/g, key: 'desert', label: 'le désert' },
  { re: /jungle|for[êe]t tropicale|canop[ée]e/g, key: 'jungle', label: 'la jungle' },
  { re: /for[êe]t|\bbois\b|sapin/g, key: 'forest', label: 'la forêt' },
  { re: /\blacs?\b|fjord|cascade|rivi[èe]re|chute d/g, key: 'lake', label: 'les lacs et cascades' },
  { re: /road.?trip|en voiture|\bvan\b|camping.?car|la route/g, key: 'roadtrip', label: 'le road-trip' },
  { re: /march[ée]s?(?![a-zà-ÿ])|souk|bazar|shopping|artisanat/g, key: 'markets', label: 'les marchés' },
  { re: /\bspa\b|massage|hammam|onsen|thermal|thermes|sources? chaudes?|yoga|bien.?[êe]tre/g, key: 'wellness', label: 'le bien-être' },
  { re: /farniente|transat|repos|ne rien faire|bronzer/g, key: 'relax', label: 'le farniente' },
  { re: /aventure|adr[ée]naline|sensations? fortes?|parapente|rafting|saut|escalade|canyon/g, key: 'adventure', label: 'l’aventure' },
  { re: /bateau|voile|voilier|kayak|croisi[èe]re|catamaran|pirogue/g, key: 'boat', label: 'le bateau' },
  { re: /grandes? villes?|m[ée]tropole|urbain|gratte.?ciel|capitale/g, key: 'city', label: 'les grandes villes' },
  { re: /village|ruelle|vieille ville|m[ée]di[ée]val|patrimoine|pav[ée]/g, key: 'heritage', label: 'les vieilles pierres' },
  { re: /campagne|colline|rizi[èe]re/g, key: 'countryside', label: 'la campagne' },
  { re: /savane|steppe/g, key: 'savanna', label: 'la savane' },
  { re: /tradition|artisan|habitant|tribu|nomade|culture locale/g, key: 'traditions', label: 'les traditions' },
  { re: /romanti|lune de miel|amoureux|voyage de noces/g, key: 'romance', label: 'le romantisme' },
  { re: /enfant|b[ée]b[ée]|en famille/g, key: 'family', label: 'les enfants' },
  { re: /cuisine|gastronom|manger|foodie|street.?food|caf[ée](?![a-zà-ÿ])|restaurant/g, key: 'food', label: 'la cuisine' },
  { re: /luxe|palace|resort|pilotis/g, key: 'luxury', label: 'le luxe' },
  { re: /s[ée]curit|tr[èe]s s[ûu]r|sans danger/g, key: 'safety', label: 'la sécurité' },
];

const NEGATION = /(\bpas\b|\bsans\b|[ée]vit|\bni\b|d[ée]teste|horreur|\baucun|\bjamais|allergi|n'aime pas|marre)[^.,;!?]{0,22}$/;

/** Accent-insensitive lowercase, keeping positions stable for the lookbehind. */
function normalise(text: string): string {
  return text.toLowerCase().replace(/[’`]/g, "'");
}

export function parseWishes(text: string | undefined): DetectedWish[] {
  if (!text || !text.trim()) return [];
  let src = normalise(text);
  const found = new Map<string, DetectedWish>();

  for (const rule of PHRASES) {
    src = src.replace(rule.re, (match) => {
      if (!found.has(rule.key)) found.set(rule.key, { key: rule.key, label: rule.label, negated: false });
      return ' '.repeat(match.length);
    });
  }

  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.re.exec(src))) {
      const before = src.slice(Math.max(0, m.index - 30), m.index);
      if (!found.has(rule.key)) {
        found.set(rule.key, { key: rule.key, label: rule.label, negated: NEGATION.test(before) });
      }
      break;
    }
  }

  return [...found.values()].slice(0, 6);
}
