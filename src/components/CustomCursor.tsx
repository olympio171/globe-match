import React, { useEffect, useRef, useState } from 'react';

type CursorMode = 'idle' | 'target' | 'text';

const IDLE_SIZE = 30;
const HOVER_PADDING = 8;

const INTERACTIVE_SELECTOR =
  'button, a, select, [role="button"], .cursor-pointer';

/**
 * Targeting-reticle cursor.
 *
 * Position is written straight to the DOM inside a single rAF loop; React
 * state is reserved for the discrete modes (idle / target / text), which
 * change at human speed rather than at frame rate.
 */
export const CustomCursor: React.FC = () => {
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const pointer = useRef({ x: -200, y: -200 });
  // Where the reticle wants to be: the pointer, or a snapped element box.
  const goal = useRef({ x: -200, y: -200, w: IDLE_SIZE, h: IDLE_SIZE, radius: 999 });
  // Where it currently is, eased toward the goal each frame.
  const current = useRef({ x: -200, y: -200, w: IDLE_SIZE, h: IDLE_SIZE });
  const hoveredEl = useRef<Element | null>(null);

  const [mode, setMode] = useState<CursorMode>('idle');
  const [pressed, setPressed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    setEnabled(true);
    // Only now is it safe to hide the native cursor.
    document.documentElement.classList.add('custom-cursor-active');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };

      // e.target is only guaranteed to be an EventTarget: a mousemove dispatched
      // on window or document has no .closest, which would throw here.
      const target = e.target instanceof Element ? (e.target as HTMLElement) : null;
      const interactive = target?.closest(INTERACTIVE_SELECTOR) ?? null;

      const isTextField = Boolean(
        target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.getAttribute('contenteditable') === 'true')
      );

      if (isTextField) {
        if (hoveredEl.current !== target) hoveredEl.current = target;
        goal.current = { x: e.clientX, y: e.clientY, w: 3, h: 22, radius: 2 };
        setMode('text');
        return;
      }

      if (interactive) {
        // Recompute the snap box only when the hovered element changes.
        if (hoveredEl.current !== interactive) {
          hoveredEl.current = interactive;
          setMode('target');
        }
        const rect = interactive.getBoundingClientRect();
        const radius = parseFloat(getComputedStyle(interactive).borderTopLeftRadius) || 8;
        goal.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: rect.width + HOVER_PADDING * 2,
          h: rect.height + HOVER_PADDING * 2,
          radius: radius + HOVER_PADDING,
        };
        return;
      }

      if (hoveredEl.current) {
        hoveredEl.current = null;
        setMode('idle');
      }
      goal.current = { x: e.clientX, y: e.clientY, w: IDLE_SIZE, h: IDLE_SIZE, radius: 999 };
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    // Keep the reticle glued to a button that moves or resizes under it.
    // Reads hoveredEl rather than `mode` so it never closes over stale state.
    const onScrollOrResize = () => {
      const el = hoveredEl.current;
      if (!el || !el.matches(INTERACTIVE_SELECTOR)) return;
      const rect = el.getBoundingClientRect();
      goal.current = {
        ...goal.current,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w: rect.width + HOVER_PADDING * 2,
        h: rect.height + HOVER_PADDING * 2,
      };
    };

    let frame = 0;
    const tick = () => {
      const ease = reducedMotion ? 1 : 0.22;
      const c = current.current;
      const g = goal.current;

      c.x += (g.x - c.x) * ease;
      c.y += (g.y - c.y) * ease;
      c.w += (g.w - c.w) * ease;
      c.h += (g.h - c.h) * ease;

      const reticle = reticleRef.current;
      if (reticle) {
        reticle.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`;
        reticle.style.width = `${c.w}px`;
        reticle.style.height = `${c.h}px`;
        reticle.style.borderRadius = `${g.radius}px`;
      }

      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${pointer.current.x}px, ${pointer.current.y}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('custom-cursor-active');
    };
    // Intentionally mounted once: everything that changes per frame lives in refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  const isTarget = mode === 'target';
  const isText = mode === 'text';

  const accent = isText ? '#c084fc' : isTarget ? '#67e8f9' : '#38bdf8';

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden select-none">
      {/* Reticle — snaps to and wraps whatever is being targeted */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 will-change-transform"
        style={{
          border: isText ? 'none' : `1px solid ${isTarget ? 'rgba(103,232,249,0.55)' : 'rgba(96,165,250,0.35)'}`,
          background: isText
            ? accent
            : isTarget
            ? 'rgba(6,182,212,0.07)'
            : 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 72%)',
          boxShadow: isTarget
            ? '0 0 22px rgba(56,189,248,0.35), inset 0 0 18px rgba(6,182,212,0.12)'
            : isText
            ? `0 0 12px ${accent}`
            : '0 0 12px rgba(56,189,248,0.28)',
          opacity: pressed ? 0.65 : 1,
          transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.15s ease',
        }}
      >
        {/* Corner brackets, hidden while the reticle is a text beam */}
        {!isText &&
          ([
            'top-0 left-0 border-t border-l rounded-tl-[3px]',
            'top-0 right-0 border-t border-r rounded-tr-[3px]',
            'bottom-0 left-0 border-b border-l rounded-bl-[3px]',
            'bottom-0 right-0 border-b border-r rounded-br-[3px]',
          ] as const).map((corner) => (
            <span
              key={corner}
              className={`absolute w-2.5 h-2.5 ${corner}`}
              style={{
                borderColor: accent,
                opacity: isTarget ? 1 : 0.55,
                transition: 'opacity 0.25s ease, border-color 0.25s ease',
              }}
            />
          ))}
      </div>

      {/* Precision core, tracking the pointer exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full will-change-transform"
        style={{
          width: isText ? 0 : pressed ? '4px' : '5px',
          height: isText ? 0 : pressed ? '4px' : '5px',
          backgroundColor: accent,
          boxShadow: `0 0 8px ${accent}, 0 0 16px rgba(99,102,241,0.7)`,
          transition: 'width 0.15s ease, height 0.15s ease, background-color 0.25s ease',
        }}
      />
    </div>
  );
};
