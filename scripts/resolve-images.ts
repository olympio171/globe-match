/**
 * Resolves a cover photo for every destination and writes src/data/images.json.
 *
 *   npm run images            # only destinations missing from images.json
 *   npm run images -- --all   # re-resolve everything
 *
 * For each destination it reads the lead image of its English Wikipedia
 * article (`wiki` field), keeps it only if it lives on Wikimedia Commons, then
 * records a 1280 px thumbnail URL with its author and licence for attribution.
 * `OVERRIDES` pins a specific Commons file when the lead image is a map, a
 * flag or simply a poor photo.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { DESTINATIONS } from '../src/data/destinations/index.ts';

const OUT = new URL('../src/data/images.json', import.meta.url);
const UA = 'GlobeMatch/2.0 (https://github.com/olympio171/globe-match; static travel quiz)';
const WIDTH = 1280;

/** Destination id → Commons file name, when the article's lead image won't do. */
const OVERRIDES: Record<string, string> = {
  'acores': "Miradouro da Boca do Inferno, Lagoa das Sete Cidades, ilha de São Miguel, Açores.JPG",
  'amsterdam': "Colorful windows and canal houses at blue hour with water reflection in Damrak Amsterdam Netherlands.jpg",
  'atacama': "Anfiteatro, Valle de la Luna, San Pedro de Atacama, Chile, 2016-02-01, DD 149.JPG",
  'barcelone': "Park Güell 02.jpg",
  'cap-vert': "Cape Verde Sal kitesurfing.jpg",
  'colombie': "Colombia, Cartagena, Plaza de la Aduana.jpg",
  'cuba': "Street in Trinidad, Cuba 2024.jpg",
  'djerba': "Abu Mesouar Guellala Djerba 02.jpg",
  'ecosse': "Eilean Donan at Dusk.jpg",
  'fidji': "Monuriki Island 20150108.jpg",
  'grande-barriere': "The heart reef, part of the Great Barrier Reef near Airlie Beach, Whitsunday Islands, Queensland.jpg",
  'guadeloupe': "Plage du Bourg St-Anne (2).jpg",
  'guatemala': "The morning after - Santa Catalina Arch, Antigua Guatemala, New Year 2024.jpg",
  'hawaii': "Na Pali Coast, Kauai, Hawaii.jpg",
  'ladakh': "Phyang Monastery 01.jpg",
  'laponie': "Snowy winter landscape - Riisitunturi National Park - Posio, Finland - 14 March 2016.jpg",
  'lisbonne': "Lissabon - Alfama - Largo Santa Luzia - Streetcar - 1.jpg",
  'madere': "Ponta de São Lourenço, Madeira, Portugal, 2019-05-28, DD 31.jpg",
  'majorque': "Strand 004 2017 11 10.jpg",
  'maldives': "Diamonds Thudufushi Beach and Water Villas, May 2017 -04.jpg",
  'nepal': "Mt. Annapurna Jpg 1.jpg",
  'nouvelle-caledonie': "Nouvelle-Calédonie - Île des Pins - baie d'Upi (13701148685).jpg",
  'nouvelle-orleans': "Bourbon St, French Quarter, New Orleans, USA2.jpg",
  'oman': "Canyon at Jebel Shams, Oman.jpg",
  'patagonie': "Towers of Paine - Torres del Paine National Park 13.jpg",
  'polynesie': "Bora Bora (16542797633).jpg",
  'reunion': "Cirque de Salazie (depuis le refuge de Belouve).jpg",
  'sardaigne': "Cala Goloritze o.jpg",
  'senegal': "Lac rose au Sénégal.jpg",
  'tanzanie': "Zebras Ngorongoro Crater.jpg",
  'zanzibar': "Nungwi,Zanzibar - panoramio.jpg",
};

interface ImageEntry {
  url: string;
  credit: string;
  source: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string): Promise<any> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`gave up on ${url}`);
}

/** File name as it appears in a Commons URL (still percent-encoded). */
function fileFromUrl(url: string): string | null {
  const m = url.match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  return m ? m[1] : null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function describeFile(file: string): Promise<ImageEntry | null> {
  const title = `File:${decodeURIComponent(file)}`;
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
    `&iiprop=url|size|extmetadata&iiurlwidth=${WIDTH}&titles=${encodeURIComponent(title)}`;
  const data = await getJson(api);
  const page: any = Object.values(data?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  if (!/\.(jpe?g|png|webp)$/i.test(title)) return null;

  const meta = info.extmetadata ?? {};
  const artist =
    stripHtml(meta.Artist?.value ?? '')
      .replace(/^this photo was taken by\s+/i, '')
      .replace(/\.\s.*$/, '') || 'Auteur inconnu';
  const licence = stripHtml(meta.LicenseShortName?.value ?? '') || 'Wikimedia Commons';
  const url: string = info.width > WIDTH ? info.thumburl : info.url;

  return {
    url,
    credit: `${artist.slice(0, 80)} · ${licence}`,
    source: info.descriptionurl,
  };
}

async function resolve(id: string, wiki: string): Promise<ImageEntry | null> {
  let file = OVERRIDES[id] ? encodeURIComponent(OVERRIDES[id].replace(/ /g, '_')) : null;
  if (!file) {
    const summary = await getJson(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki.replace(/ /g, '_'))}`
    );
    const src: string | undefined = summary?.originalimage?.source ?? summary?.thumbnail?.source;
    file = src ? fileFromUrl(src) : null;
  }
  if (!file) return null;
  return describeFile(file);
}

async function main() {
  const all = process.argv.includes('--all');
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7).split(',');
  let existing: Record<string, ImageEntry> = {};
  try {
    existing = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    // first run
  }

  const out: Record<string, ImageEntry> = {};
  const failures: string[] = [];

  for (const dest of DESTINATIONS) {
    const wanted = only ? only.includes(dest.id) : all || !existing[dest.id];
    if (!wanted && existing[dest.id]) {
      out[dest.id] = existing[dest.id];
      continue;
    }
    try {
      const entry = await resolve(dest.id, dest.wiki);
      if (entry) {
        let head = await fetch(entry.url, { method: 'HEAD', headers: { 'User-Agent': UA } });
        for (let attempt = 1; head.status === 429 && attempt < 5; attempt++) {
          await sleep(4000 * attempt);
          head = await fetch(entry.url, { method: 'HEAD', headers: { 'User-Agent': UA } });
        }
        if (!head.ok) throw new Error(`thumbnail ${head.status}`);
        out[dest.id] = entry;
        console.log(`✓ ${dest.id.padEnd(24)} ${decodeURIComponent(entry.source.split('File:')[1] ?? '')}`);
      } else {
        failures.push(dest.id);
        console.log(`✗ ${dest.id.padEnd(24)} no usable image on “${dest.wiki}”`);
      }
    } catch (err) {
      failures.push(dest.id);
      console.log(`✗ ${dest.id.padEnd(24)} ${(err as Error).message}`);
    }
    await sleep(150);
  }

  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\n${Object.keys(out).length}/${DESTINATIONS.length} images written.`);
  if (failures.length) console.log(`Missing: ${failures.join(', ')}`);
}

main();
