import type { Experience, FeatureKey } from '../../types';

/**
 * Compact experience literal: `x(title, text, 'hiking lake', 1)`.
 * Tags are space-separated feature keys; `npm test` rejects unknown ones.
 */
export function x(title: string, text: string, tags: string, days = 1): Experience {
  return { title, text, tags: tags.split(' ').filter(Boolean) as FeatureKey[], days };
}
