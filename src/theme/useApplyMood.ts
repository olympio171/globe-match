import { useEffect, useRef } from 'react';
import type { Mood } from './mood';

/**
 * Pushes the mood into CSS custom properties on <html>. The properties are
 * registered with @property in index.css, so the browser interpolates them
 * and the whole palette glides from one mood to the next.
 *
 * Hues are unwrapped against the previous value so a change from 350° to 10°
 * travels 20° through red rather than 340° through every other colour.
 */
export function useApplyMood(mood: Mood) {
  const last = useRef({ h1: mood.h1, h2: mood.h2 });

  useEffect(() => {
    const unwrap = (prev: number, next: number) => {
      const delta = ((next - prev + 540) % 360) - 180;
      return prev + delta;
    };
    const h1 = mood.chroma === 0 ? last.current.h1 : unwrap(last.current.h1, mood.h1);
    const h2 = mood.chroma === 0 ? last.current.h2 : unwrap(last.current.h2, mood.h2);
    last.current = { h1, h2 };

    const root = document.documentElement.style;
    root.setProperty('--h1', h1.toFixed(1));
    root.setProperty('--h2', h2.toFixed(1));
    root.setProperty('--c', mood.chroma.toFixed(3));
    root.setProperty('--drift', `${Math.round(46 - mood.energy * 30)}s`);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      requestAnimationFrame(() => {
        const bg = getComputedStyle(document.body).backgroundColor;
        if (bg) meta.setAttribute('content', bg);
      });
    }
  }, [mood.h1, mood.h2, mood.chroma, mood.energy]);
}
