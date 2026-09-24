import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CalendarHeart, Check, Clock, Heart, MapPin, Plane, UtensilsCrossed, Wallet } from 'lucide-react';
import { MONTHS } from '../../data/questions';
import { DURATION_DAYS, estimateCost, estimateFlight } from '../../services/engine';
import { CUISINE_LABELS, euros, hoursLabel } from '../../services/labels';
import type { Destination, MatchResult, QuizAnswers } from '../../types';
import { Cover } from '../Cover';
import { BudgetSimulator } from './BudgetSimulator';
import { ClimateChart } from './ClimateChart';
import { CriteriaBars } from './CriteriaBars';
import { ItineraryView } from './ItineraryView';
import { PracticalInfo } from './PracticalInfo';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type Tab = 'why' | 'plan' | 'budget' | 'food' | 'practical';

const TABS: { id: Tab; label: string }[] = [
  { id: 'why', label: 'Pourquoi vous' },
  { id: 'plan', label: 'Itinéraire' },
  { id: 'budget', label: 'Budget' },
  { id: 'food', label: 'Saveurs' },
  { id: 'practical', label: 'Pratique' },
];

interface DestinationDetailProps {
  dest: Destination;
  match?: MatchResult;
  answers: QuizAnswers;
  rank?: number;
  saved: boolean;
  onToggleSave: () => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({ dest, match, answers, rank, saved, onToggleSave }) => {
  const [tab, setTab] = useState<Tab>('why');
  const reduced = usePrefersReducedMotion();
  const origin = answers.origin ?? 'paris';
  const days = DURATION_DAYS[answers.duration ?? 'week'];
  const flight = estimateFlight(dest, origin);
  const cost = match?.cost ?? estimateCost(dest, answers, flight, days);
  const wanted = Array.isArray(answers.when) && answers.when.length ? answers.when : [...Array(12).keys()];
  const bestMonth = match?.month ?? dest.climate.best.indexOf('1');

  useEffect(() => setTab('why'), [dest.id]);

  const stats = [
    { icon: CalendarHeart, label: match ? 'Mois idéal pour vous' : 'Meilleure période', value: MONTHS[bestMonth] },
    { icon: Plane, label: 'Trajet', value: `${hoursLabel(flight.hours)} · ${flight.stops ? `${flight.stops} escale${flight.stops > 1 ? 's' : ''}` : 'direct'}` },
    { icon: Wallet, label: `Budget · ${cost.days} jours`, value: `~${euros(cost.total)} / pers.` },
    { icon: Clock, label: 'Durée conseillée', value: `${dest.days[0]} à ${dest.days[1]} jours` },
  ];

  return (
    <article className="card overflow-hidden" aria-labelledby={`dest-${dest.id}`}>
      <div className="relative">
        <Cover dest={dest} width={1280} className="h-[340px] sm:h-[440px]" showCredit eager />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 text-white sm:p-8">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white/85">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {dest.country}
              {rank !== undefined && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs backdrop-blur-sm">n° {rank + 1}</span>}
            </p>
            <h2 id={`dest-${dest.id}`} className="font-display text-4xl font-medium leading-none sm:text-6xl">
              {dest.name}
            </h2>
            <p className="mt-3 text-base text-white/90 sm:text-lg">{dest.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            {match && (
              <div className="rounded-2xl bg-white/15 px-4 py-2.5 text-center backdrop-blur-md">
                <p className="font-display text-4xl font-medium leading-none tabular">{match.pct}<span className="text-xl">%</span></p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-white/80">affinité</p>
              </div>
            )}
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25"
              aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`h-5 w-5 ${saved ? 'fill-white' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px border-b border-line bg-line lg:grid-cols-4">
        {stats.map(({ icon: StatIcon, label, value }) => (
          <div key={label} className="bg-surface p-4 sm:p-5">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <StatIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-1 font-semibold tabular">{value}</dd>
          </div>
        ))}
      </dl>

      <div role="tablist" aria-label="Détails de la destination" className="scrollbar-none flex gap-1 overflow-x-auto border-b border-line px-3 sm:px-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`relative shrink-0 px-3.5 py-4 text-sm font-semibold transition-colors ${tab === t.id ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {t.label}
            {tab === t.id && <motion.span layoutId="tab-underline" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${dest.id}-${tab}`}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="p-5 sm:p-8"
        >
          {tab === 'why' && (
            <div className="space-y-10">
              <p className="max-w-3xl text-lg leading-relaxed">{dest.summary}</p>

              {match && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-surface-2 p-5">
                    <h3 className="mb-3 font-semibold">Ce qui colle avec vos réponses</h3>
                    <ul className="space-y-2.5">
                      {match.reasons.map((r) => (
                        <li key={r} className="flex gap-2.5 text-[0.95rem] leading-snug">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-line p-5">
                    <h3 className="mb-3 font-semibold">À savoir</h3>
                    {match.caveats.length ? (
                      <ul className="space-y-2.5">
                        {match.caveats.map((c) => (
                          <li key={c} className="flex gap-2.5 text-[0.95rem] leading-snug">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">Aucun point de friction avec vos critères.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-10 lg:grid-cols-2">
                <section>
                  <h3 className="mb-4 font-display text-2xl font-medium">Le climat, mois par mois</h3>
                  <ClimateChart dest={dest} wanted={wanted} chosen={bestMonth} />
                </section>
                {match && (
                  <section>
                    <h3 className="mb-1 font-display text-2xl font-medium">Le score, critère par critère</h3>
                    <p className="mb-4 text-sm text-muted">Barres plus foncées : les critères qui comptent le plus pour vous.</p>
                    <CriteriaBars criteria={match.criteria} />
                  </section>
                )}
              </div>

              <section>
                <h3 className="mb-4 font-display text-2xl font-medium">Les incontournables</h3>
                <ul className="grid gap-3 md:grid-cols-3">
                  {dest.experiences.slice(0, 3).map((e, i) => (
                    <li key={e.title} className="rounded-2xl bg-surface-2 p-5">
                      <span className="font-display text-3xl text-accent">0{i + 1}</span>
                      <p className="mt-2 font-semibold">{e.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{e.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {tab === 'plan' && <ItineraryView dest={dest} answers={answers} days={days} />}

          {tab === 'budget' && <BudgetSimulator dest={dest} answers={answers} days={days} />}

          {tab === 'food' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-accent" aria-hidden="true" />
                <span className="font-medium">Cuisine</span>
                {dest.cuisine.map((c) => (
                  <span key={c} className="chip">
                    {CUISINE_LABELS[c]}
                  </span>
                ))}
                <span className="ml-auto text-sm text-muted">
                  Réputation gastronomique : <strong className="text-ink">{dest.f.food} / 5</strong>
                </span>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {dest.dishes.map((dish, i) => (
                  <li key={dish} className="flex items-center gap-4 rounded-2xl bg-surface-2 p-5">
                    <span className="font-display text-3xl text-accent/60 tabular">{i + 1}</span>
                    <span className="font-medium">{dish}</span>
                  </li>
                ))}
              </ul>
              {dest.experiences.filter((e) => e.tags.includes('food') || e.tags.includes('markets') || e.tags.includes('wine')).slice(0, 2).map((e) => (
                <p key={e.title} className="rounded-2xl border border-line p-5 leading-relaxed">
                  <strong>{e.title}.</strong> <span className="text-muted">{e.text}</span>
                </p>
              ))}
            </div>
          )}

          {tab === 'practical' && <PracticalInfo dest={dest} origin={origin} />}
        </motion.div>
      </AnimatePresence>
    </article>
  );
};
