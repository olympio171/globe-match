import type { Destination, DestinationImage } from '../../types';
import images from '../images.json';
import { AFRICA_MIDDLE_EAST } from './africa-middle-east';
import { AMERICAS } from './americas';
import { ASIA } from './asia';
import { EUROPE_NORTH } from './europe-north';
import { EUROPE_SOUTH } from './europe-south';
import { OCEANIA } from './oceania';

export const DESTINATIONS: Destination[] = [
  ...EUROPE_NORTH,
  ...EUROPE_SOUTH,
  ...AFRICA_MIDDLE_EAST,
  ...ASIA,
  ...OCEANIA,
  ...AMERICAS,
];

const BY_ID = new Map(DESTINATIONS.map((d) => [d.id, d]));

export function destinationById(id: string): Destination | undefined {
  return BY_ID.get(id);
}

const IMAGES = images as Record<string, DestinationImage>;

/**
 * Cover photo resolved at build time by `npm run images` from the
 * destination's Wikipedia article. Missing entries fall back to a gradient.
 */
export function imageFor(id: string): DestinationImage | undefined {
  return IMAGES[id];
}

/**
 * Commons only serves a fixed set of thumbnail widths to hotlinks (anything
 * else is rejected), so the width is restricted to those steps.
 */
export function imageAtWidth(image: DestinationImage, width: 330 | 500 | 960 | 1280): string {
  return image.url.replace(/\/\d+px-/, `/${width}px-`);
}
