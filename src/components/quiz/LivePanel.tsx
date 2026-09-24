import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Mood } from '../../theme/mood';

interface LivePanelProps {
  mood: Mood;
  strong: number;
  total: number;
  answered: number;
  compact?: boolean;
}

/**
 * Shows the traveller what their answers are doing: the palette they are
 * building, and how many destinations still fit really well.
 */
export const LivePanel: React.FC<LivePanelProps> = ({ mood, strong, total, answered, compact }) => {
  const swatches = mood.swatches.length ? mood.swatches : [{ h: 75, name: 'neutre' }];
  const neutral = !mood.swatches.length;

  if (compact) {
    return (
      <div className="card flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex -space-x-1" aria-hidden="true">
            {swatches.slice(0, 3).map((s) => (
              <span key={s.name} className="h-4 w-4 rounded-full border border-surface" style={{ background: neutral ? 'var(--line)' : `oklch(0.7 0.14 ${s.h})` }} />
            ))}
          </span>
          <span className="truncate text-sm font-medium">{neutral ? 'Palette neutre' : mood.name}</span>
        </div>
        <span className="shrink-0 text-sm text-muted">
          <strong className="tabular text-ink">{answered ? strong : total}</strong> {answered ? 'très compatibles' : 'destinations'}
        </span>
      </div>
    );
  }

  return (
    <aside className="card sticky top-6 space-y-7 p-6" aria-label="Votre voyage prend forme">
      <div>
        <p className="eyebrow mb-3">Votre palette</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={mood.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-display text-2xl font-medium leading-tight"
          >
            {neutral ? 'Page blanche' : mood.name}
          </motion.p>
        </AnimatePresence>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {swatches.map((s) => (
            <motion.span
              key={s.name}
              layout
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-9 flex-1 rounded-xl"
              style={{ background: neutral ? 'var(--surface-2)' : `oklch(0.72 0.14 ${s.h})` }}
              title={s.name}
            />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {neutral
            ? 'Encore neutre : vos réponses vont lui donner ses couleurs.'
            : 'Chaque réponse ajoute sa teinte. Le paysage en bas de l’écran suit vos décors.'}
        </p>
      </div>

      <div className="border-t border-line pt-6">
        <p className="eyebrow mb-2">Destinations très compatibles</p>
        <p className="flex items-baseline gap-2">
          <motion.span key={answered ? strong : total} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="font-display text-5xl font-medium tabular">
            {answered ? strong : total}
          </motion.span>
          <span className="text-muted">sur {total}</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${((answered ? strong : total) / total) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Recalculé à chaque réponse, avec la même méthode que le classement final.
        </p>
      </div>
    </aside>
  );
};
