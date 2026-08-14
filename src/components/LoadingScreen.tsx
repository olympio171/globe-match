import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Check, AlertTriangle, MinusCircle, Loader2 } from 'lucide-react';
import { LoadingStep, LoadingStepState } from '../types';

interface LoadingScreenProps {
  /** Driven entirely by progress events streamed from the server. */
  steps: LoadingStep[];
}

/**
 * Share of the bar each step owns, roughly proportional to how long it really
 * takes: scoring is measured at ~0.1 s, the AI write-up at 12-20 s. Splitting
 * the bar in equal thirds made it jump 0 → 33 → 100 with a long dead pause.
 */
const STEP_WEIGHT: Record<string, number> = { scoring: 12, ai: 82, render: 6 };

/**
 * Easing time constant per step, tuned against measured runs so the bar sits
 * near the top of the active step's share by the time it typically completes —
 * otherwise the final hand-off still landed as one big jump.
 */
const STEP_ESTIMATE_MS: Record<string, number> = { scoring: 250, ai: 6500, render: 400 };

/** An active step creeps toward its share but is capped short of completing it. */
const ACTIVE_CEILING = 0.9;

const STATE_ICON: Record<LoadingStepState, React.ReactNode> = {
  pending: <div className="w-2 h-2 rounded-full bg-slate-600" />,
  active: <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />,
  done: <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />,
  skipped: <MinusCircle className="w-4 h-4 text-sky-300/50" />,
  failed: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

const STATE_TEXT: Record<LoadingStepState, string> = {
  pending: 'text-sky-200/35',
  active: 'text-white',
  done: 'text-sky-100/80',
  skipped: 'text-sky-200/45',
  failed: 'text-amber-200/85',
};

const isSettled = (state: LoadingStepState) =>
  state === 'done' || state === 'skipped' || state === 'failed';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ steps }) => {
  // When each step became active, so the easing below has a real reference.
  const activeSince = useRef<Record<string, number>>({});
  const [, forceTick] = useState(0);

  const hasActiveStep = steps.some((s) => s.state === 'active');

  for (const step of steps) {
    if (step.state === 'active' && !activeSince.current[step.id]) {
      activeSince.current[step.id] = Date.now();
    }
  }

  // Repaint while something is running so the bar keeps easing. This timer only
  // interpolates inside a step — it can never mark one finished.
  useEffect(() => {
    if (!hasActiveStep) return;
    const id = setInterval(() => forceTick((n) => n + 1), 120);
    return () => clearInterval(id);
  }, [hasActiveStep]);

  const totalWeight = steps.reduce((sum, s) => sum + (STEP_WEIGHT[s.id] ?? 100 / steps.length), 0);

  const progress = steps.reduce((sum, step) => {
    const weight = STEP_WEIGHT[step.id] ?? 100 / steps.length;
    if (isSettled(step.state)) return sum + weight;
    if (step.state !== 'active') return sum;

    const elapsed = Date.now() - (activeSince.current[step.id] ?? Date.now());
    const estimate = STEP_ESTIMATE_MS[step.id] ?? 5000;
    // Asymptotic: fast at first, never arrives. A step that runs long simply
    // slows down instead of pretending to be done.
    const eased = (1 - Math.exp(-elapsed / estimate)) * ACTIVE_CEILING;
    return sum + weight * eased;
  }, 0);

  const percent = Math.round((progress / totalWeight) * 100);
  const settled = steps.filter((s) => isSettled(s.state)).length;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden z-10">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto p-10 rounded-[36px] cosmic-glass shadow-[0_0_60px_rgba(6,182,212,0.25)] border border-cyan-400/30 hud-corners overflow-hidden">
        <div className="hud-scanline" />

        <div className="relative w-24 h-24 mx-auto mb-7">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="w-full h-full rounded-full border border-dashed border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)] border border-white/40">
              <Compass className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        <div className="hud-label mb-2">
          Étapes terminées {settled} / {steps.length}
        </div>
        <h3 className="font-serif-title text-2xl font-light text-white mb-7 cosmic-glow-text">
          Convergence des mondes...
        </h3>

        {/* The real pipeline. A step only leaves "pending" when the server says so. */}
        <ul className="text-left space-y-3.5 mb-7">
          {steps.map((step) => (
            <li key={step.id} className="flex items-start gap-3">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                {STATE_ICON[step.state]}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-medium transition-colors ${STATE_TEXT[step.state]}`}>
                  {step.label}
                </span>
                {step.detail && (
                  <span className="block font-mono-code text-[11px] text-cyan-300/60 mt-0.5 break-words">
                    {step.detail}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-900/80 border border-cyan-500/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${percent}%`, transition: 'width 220ms linear' }}
            />
          </div>
          <span className="font-mono-code text-[11px] text-cyan-300/70 tabular-nums w-9 text-right">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
};
