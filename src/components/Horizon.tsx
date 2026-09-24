import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Scene } from '../theme/mood';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const W = 1440;
const H = 360;

/** Deterministic PRNG so each scene keeps the same silhouette between renders. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];
const close = (d: string) => `${d} L${W},${H} L0,${H} Z`;
const line = (pts: Pt[]) => close(`M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`);

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`;
  }
  return close(d);
}

function wave(base: number, amp: number, length: number, phase: number): string {
  const pts: Pt[] = [];
  for (let x = 0; x <= W; x += length / 4) pts.push([x, base + Math.sin((x / length) * Math.PI * 2 + phase) * amp]);
  return smooth(pts);
}

function ridge(seed: number, base: number, spread: number, step: [number, number]): string {
  const r = rng(seed);
  const pts: Pt[] = [[0, base - r() * spread]];
  let x = 0;
  while (x < W) {
    x = Math.min(W, x + step[0] + r() * (step[1] - step[0]));
    const peak = pts.length % 2 === 1;
    pts.push([x, peak ? base - spread * (0.55 + r() * 0.45) : base - spread * r() * 0.3]);
  }
  return line(pts);
}

function bumps(seed: number, base: number, rMin: number, rMax: number): string {
  const r = rng(seed);
  let d = `M0,${base}`;
  let x = 0;
  while (x < W) {
    const rad = rMin + r() * (rMax - rMin);
    const nx = Math.min(W + rad, x + rad * 1.6);
    d += ` A${rad},${rad * (0.8 + r() * 0.3)} 0 0 1 ${nx.toFixed(1)},${base}`;
    x = nx;
  }
  return close(d);
}

function skyline(seed: number, base: number, hMin: number, hMax: number, wMin: number, wMax: number, domes = false): string {
  const r = rng(seed);
  let d = `M0,${base}`;
  let x = 0;
  while (x < W) {
    const w = wMin + r() * (wMax - wMin);
    const h = hMin + r() * (hMax - hMin);
    const top = base - h;
    d += ` L${x.toFixed(1)},${top.toFixed(1)}`;
    if (domes && r() > 0.55) {
      d += ` A${(w / 2).toFixed(1)},${(w / 2.4).toFixed(1)} 0 0 1 ${(x + w).toFixed(1)},${top.toFixed(1)}`;
    } else if (domes && r() > 0.7) {
      const mid = x + w / 2;
      d += ` L${(mid - 5).toFixed(1)},${top.toFixed(1)} L${(mid - 5).toFixed(1)},${(top - 70).toFixed(1)} L${mid.toFixed(1)},${(top - 88).toFixed(1)} L${(mid + 5).toFixed(1)},${(top - 70).toFixed(1)} L${(mid + 5).toFixed(1)},${top.toFixed(1)} L${(x + w).toFixed(1)},${top.toFixed(1)}`;
    } else {
      d += ` L${(x + w).toFixed(1)},${top.toFixed(1)}`;
    }
    d += ` L${(x + w).toFixed(1)},${base}`;
    x += w + r() * 10;
  }
  return close(d);
}

interface Layers {
  back: string;
  front: string;
  extra?: React.ReactNode;
}

function build(scene: Scene): Layers {
  switch (scene) {
    case 'sea':
      return {
        back: wave(262, 9, 260, 0.4),
        front: wave(296, 13, 190, 1.7),
        extra: <circle cx={1090} cy={228} r={46} style={{ fill: 'var(--glow-2)' }} opacity={0.75} />,
      };
    case 'peaks':
      return { back: ridge(7, 250, 170, [90, 170]), front: ridge(21, 318, 90, [70, 140]) };
    case 'fjord':
      return {
        back: line([[0, 60], [180, 90], [330, 190], [470, 262], [960, 262], [1090, 200], [1250, 110], [W, 70]]),
        front: wave(300, 4, 320, 0),
      };
    case 'canopy':
      return { back: bumps(3, 250, 34, 70), front: bumps(11, 305, 22, 44) };
    case 'dunes':
      return {
        back: smooth([[0, 230], [260, 180], [520, 238], [860, 170], [1180, 232], [W, 196]]),
        front: smooth([[0, 300], [300, 262], [640, 304], [980, 258], [1260, 300], [W, 280]]),
        extra: <circle cx={380} cy={176} r={40} style={{ fill: 'var(--glow-2)' }} opacity={0.75} />,
      };
    case 'volcano':
      return {
        back: smooth([[0, 270], [300, 250], [640, 272], [1000, 244], [W, 262]]),
        front: line([[0, 330], [420, 300], [700, 128], [760, 146], [820, 124], [1120, 300], [W, 322]]),
        extra: (
          <g style={{ fill: 'var(--scene-back)' }} opacity={0.8}>
            <circle cx={770} cy={96} r={24} />
            <circle cx={798} cy={72} r={30} />
            <circle cx={836} cy={50} r={36} />
          </g>
        ),
      };
    case 'skyline':
      return { back: skyline(5, 300, 90, 230, 36, 80), front: skyline(17, 336, 30, 110, 50, 110) };
    case 'domes':
      return { back: smooth([[0, 268], [480, 246], [960, 262], [W, 244]]), front: skyline(29, 330, 50, 120, 60, 130, true) };
    case 'hills':
      return {
        back: smooth([[0, 246], [320, 206], [640, 250], [980, 214], [1260, 246], [W, 226]]),
        front: smooth([[0, 312], [360, 276], [720, 310], [1080, 280], [W, 300]]),
        extra: (
          <g style={{ fill: 'var(--scene-front)' }}>
            {[980, 1004, 1030].map((x, i) => (
              <ellipse key={x} cx={x} cy={236 - i * 4} rx={9} ry={34 + i * 6} />
            ))}
          </g>
        ),
      };
    default:
      return { back: smooth([[0, 282], [480, 262], [960, 288], [W, 268]]), front: smooth([[0, 322], [720, 306], [W, 318]]) };
  }
}

/** The landscape silhouette along the bottom of the screen, redrawn per mood. */
export const Horizon: React.FC<{ scene: Scene }> = ({ scene }) => {
  const reduced = usePrefersReducedMotion();
  const layers = useMemo(() => build(scene), [scene]);

  return (
    <div className="absolute inset-x-0 bottom-0 h-[38vh] min-h-[200px] max-h-[380px]" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.svg
          key={scene}
          className="horizon absolute inset-0 h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMax slice"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: reduced ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {layers.extra}
          <path d={layers.back} style={{ fill: 'var(--scene-back)' }} />
          <path d={layers.front} style={{ fill: 'var(--scene-front)' }} />
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};
