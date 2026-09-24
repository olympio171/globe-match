import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calculator, Palette, Route } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { PRESETS, TOTAL_STEPS } from '../data/questions';
import { moodFromAnswers } from '../theme/mood';
import type { QuizAnswers } from '../types';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface HomeProps {
  onStart: () => void;
  onPreset: (answers: QuizAnswers) => void;
  hasProgress: boolean;
  onResume: () => void;
}

const STEPS = [
  {
    icon: Palette,
    title: 'Vous répondez',
    text: 'Climat, décors, rythme, budget, critères éliminatoires… À chaque réponse, la page prend les couleurs de votre voyage.',
  },
  {
    icon: Calculator,
    title: 'On calcule vraiment',
    text: 'Météo réelle à vos dates, prix vols compris, temps de trajet, saison idéale et plus de 40 critères par destination.',
  },
  {
    icon: Route,
    title: 'Vous choisissez',
    text: 'Trois destinations expliquées point par point, un itinéraire à votre rythme, un budget simulé et d’autres pistes.',
  },
];

export const Home: React.FC<HomeProps> = ({ onStart, onPreset, hasProgress, onResume }) => {
  const reduced = usePrefersReducedMotion();
  const names = useMemo(() => [...DESTINATIONS].sort(() => 0.5 - Math.random()).map((d) => d.name.split(',')[0].split(' & ')[0]), []);
  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-16">
      <motion.p className="eyebrow mb-6" {...rise(0)}>
        Quiz voyage · {DESTINATIONS.length} destinations · {TOTAL_STEPS} questions
      </motion.p>

      <motion.h1 className="font-display max-w-4xl text-[clamp(2.8rem,8vw,6.2rem)] font-medium leading-[0.98]" {...rise(0.08)}>
        Où partir, <em className="font-normal italic text-accent">vraiment</em>&nbsp;?
      </motion.h1>

      <motion.p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl" {...rise(0.16)}>
        Répondez à quelques questions : l’interface se colore peu à peu de vos envies, puis un algorithme croise la
        météo mois par mois, votre budget réel et le temps de trajet pour trouver les trois destinations qui vous
        ressemblent.
      </motion.p>

      <motion.div className="mt-10 flex flex-wrap items-center gap-3" {...rise(0.24)}>
        <button type="button" onClick={onStart} className="btn btn-primary !px-7 !py-4 text-base">
          {hasProgress ? 'Recommencer à zéro' : 'Commencer'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
        {hasProgress && (
          <button type="button" onClick={onResume} className="btn btn-ghost !px-6 !py-4 text-base">
            Reprendre là où j’en étais
          </button>
        )}
        <span className="text-sm text-muted">Environ 4 minutes · rien n’est envoyé nulle part</span>
      </motion.div>

      <motion.ol className="mt-20 grid gap-4 sm:grid-cols-3" {...rise(0.32)}>
        {STEPS.map(({ icon: StepIcon, title, text }, i) => (
          <li key={title} className="card p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                <StepIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-3xl text-line">0{i + 1}</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">{title}</h2>
            <p className="text-[0.95rem] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </motion.ol>

      <motion.section className="mt-16" {...rise(0.4)} aria-labelledby="presets-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 id="presets-title" className="font-display text-2xl font-medium sm:text-3xl">
            Pas le temps ? Essayez un profil express
          </h2>
          <p className="text-sm text-muted">Chaque profil a déjà sa palette.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((preset) => {
            const mood = moodFromAnswers(preset.answers);
            return (
              <button
                key={preset.title}
                type="button"
                onClick={() => onPreset(preset.answers)}
                className="card group flex flex-col items-start gap-4 p-5 text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex -space-x-1.5" aria-hidden="true">
                  {mood.swatches.slice(0, 4).map((s) => (
                    <span
                      key={s.name}
                      className="h-6 w-6 rounded-full border-2 border-surface"
                      style={{ background: `oklch(0.7 0.14 ${s.h})` }}
                    />
                  ))}
                </span>
                <span>
                  <span className="block font-semibold">{preset.title}</span>
                  <span className="mt-1 block text-sm leading-snug text-muted">{preset.subtitle}</span>
                </span>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-accent">
                  Voir les résultats
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </motion.section>

      <div className="relative mt-20 overflow-hidden" aria-hidden="true">
        <div className="marquee gap-8 whitespace-nowrap font-display text-2xl italic text-muted/70">
          {[...names, ...names].map((n, i) => (
            <span key={i} className="flex items-center gap-8">
              {n}
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
