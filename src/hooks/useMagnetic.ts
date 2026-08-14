import { useEffect, useRef } from 'react';

/**
 * Pulls an element slightly toward the pointer when it comes within range.
 *
 * Apply the ref to a *wrapper* around the interactive element rather than the
 * element itself: this hook owns `transform`, so sharing the node with a
 * motion component's `whileHover` scale would make the two fight.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const settle = () => {
      frame = 0;
      if (!pending) return;
      el.style.transform = `translate3d(${pending.x}px, ${pending.y}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const reach = Math.max(rect.width, rect.height) * 0.75;

      const withinReach = Math.hypot(dx, dy) < reach;
      pending = withinReach ? { x: dx * strength, y: dy * strength } : { x: 0, y: 0 };

      if (!frame) frame = requestAnimationFrame(settle);
    };

    el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, [strength]);

  return ref;
}
