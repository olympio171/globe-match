import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's motion preference so animated screens can fall back to
 * plain cuts. Reads the value synchronously on mount and stays subscribed,
 * since the preference can be toggled while the app is open.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    setPrefersReduced(media.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
