import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronDown, Link2, PencilLine, RotateCcw } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { QUIZ_STEPS } from '../data/questions';
import type { MatchResult, QuizAnswers, Recommendation } from '../types';
import { Cover } from './Cover';
import { Comparison } from './results/Comparison';
import { DestinationDetail } from './results/DestinationDetail';
import { PodiumCard } from './results/PodiumCard';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ResultsProps {
  rec: Recommendation;
  answers: QuizAnswers;
  selectedId: string;
  onSelect: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onEdit: () => void;
  onRestart: () => void;
  shareUrl: string;
}

export const Results: React.FC<ResultsProps> = ({ rec, answers, selectedId, onSelect, favorites, onToggleFavorite, onEdit, onRestart, shareUrl }) => {
  const reduced = usePrefersReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const rankIndex = rec.ranking.findIndex((m) => m.dest.id === selectedId);
  const selected: MatchResult = rec.ranking[rankIndex] ?? rec.podium[0];

  const pick = (id: string, scroll: boolean) => {
    onSelect(id);
    if (scroll) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mes destinations GlobeMatch', url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The user dismissed the share sheet, or the clipboard is unavailable.
    }
  };

  const appear = (i: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 pb-32 pt-4 sm:px-6">
      <motion.section {...appear(0)} className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Votre profil voyageur</p>
          <h1 className="font-display text-4xl font-medium leading-[1.02] sm:text-6xl">{rec.profile.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{rec.profile.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rec.profile.traits.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} className="btn btn-ghost !py-2.5 text-sm">
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            Modifier mes réponses
          </button>
          <button type="button" onClick={share} className="btn btn-ghost !py-2.5 text-sm">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
            {copied ? 'Lien copié' : 'Partager'}
          </button>
          <button type="button" onClick={onRestart} className="btn btn-ghost !py-2.5 text-sm sm:hidden">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Recommencer
          </button>
        </div>
      </motion.section>

      <section aria-labelledby="podium-title">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="podium-title" className="font-display text-3xl font-medium">
            Vos trois destinations
          </h2>
          <p className="text-sm text-muted">
            Sur {DESTINATIONS.length} destinations et {QUIZ_STEPS.length} questions · touchez une carte pour sa fiche
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {rec.podium.map((m, i) => (
            <motion.div key={m.dest.id} {...appear(i + 1)}>
              <PodiumCard match={m} rank={i} selected={m.dest.id === selected.dest.id} onSelect={() => pick(m.dest.id, true)} />
            </motion.div>
          ))}
        </div>
      </section>

      <div ref={detailRef} className="scroll-mt-6">
        <DestinationDetail
          dest={selected.dest}
          match={selected}
          answers={answers}
          rank={rankIndex >= 0 ? rankIndex : undefined}
          saved={favorites.includes(selected.dest.id)}
          onToggleSave={() => onToggleFavorite(selected.dest.id)}
        />
      </div>

      <section aria-labelledby="compare-title">
        <h2 id="compare-title" className="mb-5 font-display text-3xl font-medium">
          Côte à côte
        </h2>
        <Comparison matches={rec.podium} />
      </section>

      <section aria-labelledby="alt-title">
        <div className="mb-5">
          <h2 id="alt-title" className="font-display text-3xl font-medium">
            Aussi très compatibles
          </h2>
          <p className="mt-1 text-muted">D’autres pistes solides, choisies pour varier les horizons.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rec.alternatives.map((m) => (
            <button
              key={m.dest.id}
              type="button"
              onClick={() => pick(m.dest.id, true)}
              className={`card group flex overflow-hidden text-left transition-transform duration-300 hover:-translate-y-0.5 ${m.dest.id === selected.dest.id ? 'ring-2 ring-accent' : ''}`}
            >
              <Cover dest={m.dest} width={330} className="w-28 shrink-0 sm:w-32" />
              <div className="min-w-0 flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted">{m.dest.country}</p>
                    <p className="font-semibold leading-snug">{m.dest.name}</p>
                  </div>
                  <span className="font-display text-xl font-medium tabular">{m.pct}%</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted">{m.reasons[0] ?? m.dest.tagline}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button type="button" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll} className="btn btn-ghost !py-2.5 text-sm">
            <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} aria-hidden="true" />
            {showAll ? 'Masquer le classement' : `Voir le classement complet (${rec.ranking.length})`}
          </button>
          {showAll && (
            <ol className="card mt-4 divide-y divide-line">
              {rec.ranking.map((m, i) => (
                <li key={m.dest.id}>
                  <button type="button" onClick={() => pick(m.dest.id, true)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-surface-2">
                    <span className="w-7 text-right text-sm text-muted tabular">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-medium">{m.dest.name}</span>
                      <span className="text-muted"> · {m.dest.country}</span>
                    </span>
                    <span className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-surface-2 sm:block" aria-hidden="true">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${m.pct}%` }} />
                    </span>
                    <span className="w-12 text-right font-semibold tabular">{m.pct}%</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <details className="card group p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl font-medium">
          Comment le classement est calculé
          <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-5 grid gap-6 text-[0.95rem] leading-relaxed text-muted md:grid-cols-2">
          <p>
            Chaque destination est notée de 0 à 5 sur une quarantaine de traits (plages, randonnée, histoire, sécurité,
            affluence…) et décrite par sa météo réelle mois par mois : température maximale moyenne, pluie, meilleure
            saison. Pour chaque mois où vous pouvez partir, on mesure l’écart entre ce qu’elle offre et ce que vous avez
            demandé, puis on retient le meilleur mois.
          </p>
          <p>
            Les traits dépendent de la saison : pas de baignade par 18 °C, pas de ski sans neige, pas d’aurores sous le
            soleil de minuit. Le budget est calculé pour votre durée, vols compris, selon votre hébergement et vos
            compagnons. Les critères que vous avez mis en priorité comptent double ; vos critères éliminatoires, une
            limite de trajet ou un budget impossible font chuter la note.
          </p>
          <p>
            Le pourcentage est la part de vos attentes satisfaite, pondérée par l’importance de chaque critère. Pour
            varier les horizons, deux destinations d’un même pays ne se retrouvent sur le podium que si aucune
            alternative proche n’existe ailleurs.
          </p>
          <p>
            Tout est calculé dans votre navigateur : aucune réponse n’est envoyée. Photos : Wikimedia Commons (auteurs et
            licences indiqués sur chaque image). Les prix et formalités sont des ordres de grandeur, à vérifier avant de
            réserver.
          </p>
        </div>
      </details>

      <section className="card flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {rec.podium.map((m) => (
              <Cover key={m.dest.id} dest={m.dest} width={330} className="h-14 w-14 rounded-full border-2 border-surface" />
            ))}
          </div>
          <p className="max-w-md text-muted">Pas convaincu ? Changez une réponse : le classement se recalcule instantanément.</p>
        </div>
        <button type="button" onClick={onEdit} className="btn btn-primary">
          <PencilLine className="h-4 w-4" aria-hidden="true" />
          Ajuster mes réponses
        </button>
      </section>
    </div>
  );
};
