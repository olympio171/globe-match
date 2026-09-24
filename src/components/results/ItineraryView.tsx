import React, { useMemo } from 'react';
import { buildItinerary } from '../../services/itinerary';
import { FEATURE_SHORT } from '../../services/labels';
import type { Destination, QuizAnswers } from '../../types';

interface ItineraryViewProps {
  dest: Destination;
  answers: QuizAnswers;
  days: number;
}

const PACE_LABEL = { lazy: 'farniente', slow: 'tranquille', balanced: 'équilibré', active: 'actif', intense: 'intense' } as const;

export const ItineraryView: React.FC<ItineraryViewProps> = ({ dest, answers, days }) => {
  const plan = useMemo(() => buildItinerary(dest, answers, days), [dest, answers, days]);
  const pace = PACE_LABEL[answers.pace ?? 'balanced'];

  return (
    <div>
      <p className="mb-6 max-w-2xl text-muted">
        {days} jours à un rythme {pace}, en commençant par ce qui correspond le mieux à vos envies. Les étapes suivent un ordre
        logique sur place ; à ajuster selon vos dates.
      </p>
      <ol className="relative space-y-3 border-l border-line pl-6">
        {plan.blocks.map((b, i) => {
          const muted = b.kind === 'arrival' || b.kind === 'departure' || b.kind === 'free';
          return (
            <li key={`${b.from}-${i}`} className="relative">
              <span
                className={`absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-surface ${muted ? 'bg-line' : b.kind === 'extension' ? 'bg-accent-2' : 'bg-accent'}`}
                aria-hidden="true"
              />
              <div className={`rounded-2xl p-4 ${muted ? '' : 'bg-surface-2'}`}>
                <p className="eyebrow mb-1">
                  {b.from === b.to ? `Jour ${b.from}` : `Jours ${b.from} à ${b.to}`}
                </p>
                <p className={`font-semibold ${muted ? 'text-muted' : ''}`}>{b.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{b.text}</p>
                {b.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {b.tags
                      .filter((t) => FEATURE_SHORT[t])
                      .slice(0, 3)
                      .map((t) => (
                        <span key={t} className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-muted">
                          {FEATURE_SHORT[t]}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {plan.later.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-5">
          <p className="mb-3 font-semibold">Avec quelques jours de plus</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {plan.later.map((e) => (
              <li key={e.title} className="text-sm">
                <span className="font-medium">{e.title}</span>
                <span className="text-muted"> — {e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
