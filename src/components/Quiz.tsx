import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CHAPTERS, QUIZ_STEPS, type QuizStep } from '../data/questions';
import { DESTINATIONS } from '../data/destinations';
import type { Mood } from '../theme/mood';
import type { QuizAnswers } from '../types';
import { OptionGrid } from './quiz/OptionGrid';
import { MonthPicker } from './quiz/MonthPicker';
import { ScalePicker } from './quiz/ScalePicker';
import { NotesInput } from './quiz/NotesInput';
import { LivePanel } from './quiz/LivePanel';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface QuizProps {
  stepIndex: number;
  answers: QuizAnswers;
  mood: Mood;
  strongMatches: number;
  onAnswer: (field: keyof QuizAnswers, value: unknown) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export function isStepAnswered(step: QuizStep, answers: QuizAnswers): boolean {
  const v = answers[step.id];
  if (step.optional) return true;
  switch (step.type) {
    case 'single':
      return typeof v === 'string' && v.length > 0;
    case 'multi':
      return Array.isArray(v) && v.length >= (step.min ?? 1);
    case 'months':
      return v === 'flexible' || (Array.isArray(v) && v.length > 0);
    case 'scale':
      return typeof v === 'number';
    default:
      return true;
  }
}

export const Quiz: React.FC<QuizProps> = ({ stepIndex, answers, mood, strongMatches, onAnswer, onNext, onPrev, onSubmit }) => {
  const step = QUIZ_STEPS[stepIndex];
  const reduced = usePrefersReducedMotion();
  const isLast = stepIndex === QUIZ_STEPS.length - 1;
  const valid = isStepAnswered(step, answers);
  const advanceTimer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const answeredCount = QUIZ_STEPS.filter((s) => answers[s.id] !== undefined && !s.optional).length;

  const chapterSteps = useMemo(
    () => CHAPTERS.map((_, c) => QUIZ_STEPS.map((s, i) => ({ s, i })).filter(({ s }) => s.chapter === c)),
    []
  );

  const goNext = useCallback(() => {
    window.clearTimeout(advanceTimer.current);
    if (!isStepAnswered(step, answers)) return;
    if (isLast) onSubmit();
    else onNext();
  }, [step, answers, isLast, onNext, onSubmit]);

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    return () => window.clearTimeout(advanceTimer.current);
  }, [stepIndex]);

  // Enter to continue, digits to pick an option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';
      if (e.key === 'Enter' && (!typing || e.metaKey || e.ctrlKey)) {
        // Navigation buttons keep their own Enter; on an option, Enter means “continue”
        // (Space still toggles it), as the hint in the footer promises.
        const role = target.getAttribute('role');
        if (target.tagName === 'BUTTON' && role !== 'radio' && role !== 'checkbox') return;
        e.preventDefault();
        goNext();
        return;
      }
      if (!typing && /^[1-9]$/.test(e.key) && step.options) {
        const option = step.options[Number(e.key) - 1];
        if (!option) return;
        if (step.type === 'single') select(option.id);
        else {
          const current = (answers[step.id] as string[] | undefined) ?? [];
          const next = current.includes(option.id) ? current.filter((x) => x !== option.id) : option.exclusive ? [option.id] : [...current.filter((x) => !step.options!.find((o) => o.id === x)?.exclusive), option.id];
          if (next.length <= (step.max ?? Infinity)) onAnswer(step.id, next);
        }
      }
      if (!typing && step.type === 'scale' && /^[1-5]$/.test(e.key)) onAnswer(step.id, Number(e.key));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /** Single choices advance on their own, after a beat to see the colour change. */
  const select = (id: string) => {
    onAnswer(step.id, id);
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (isLast) onSubmit();
      else onNext();
    }, reduced ? 150 : 520);
  };

  const renderInput = () => {
    const value = answers[step.id];
    switch (step.type) {
      case 'single':
        return (
          <OptionGrid
            name={step.question}
            options={step.options!}
            multiple={false}
            value={value as string | undefined}
            onChange={(v) => select(v as string)}
          />
        );
      case 'multi':
        return (
          <OptionGrid
            name={step.question}
            options={step.options!}
            multiple
            max={step.max}
            value={value as string[] | undefined}
            onChange={(v) => onAnswer(step.id, v)}
          />
        );
      case 'months':
        return <MonthPicker value={value as number[] | 'flexible' | undefined} onChange={(v) => onAnswer(step.id, v)} />;
      case 'scale':
        return <ScalePicker name={step.question} steps={step.scale!} value={value as number | undefined} onChange={(v) => onAnswer(step.id, v)} />;
      case 'text':
        return <NotesInput value={value as string | undefined} placeholder={step.placeholder} onChange={(v) => onAnswer(step.id, v)} />;
    }
  };

  const selectedCount = Array.isArray(answers[step.id]) ? (answers[step.id] as unknown[]).length : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      {/* Chapter progress */}
      <div className="mb-6 flex gap-2" aria-hidden="true">
        {chapterSteps.map((steps, c) => {
          const done = steps.filter(({ i }) => i < stepIndex).length;
          const current = steps.some(({ i }) => i === stepIndex);
          return (
            <div key={c} className="flex-1" style={{ flexGrow: steps.length }}>
              <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  animate={{ width: `${((done + (current ? 0.5 : 0)) / steps.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p className={`mt-2 hidden text-xs font-medium sm:block ${current ? 'text-ink' : 'text-muted'}`}>{CHAPTERS[c]}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-5 lg:hidden">
        <LivePanel mood={mood} strong={strongMatches} total={DESTINATIONS.length} answered={answeredCount} compact />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="card overflow-hidden" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-8"
            >
              <p className="eyebrow mb-3">
                <span className="tabular">
                  {String(stepIndex + 1).padStart(2, '0')} / {QUIZ_STEPS.length}
                </span>
                <span className="mx-2">·</span>
                {CHAPTERS[step.chapter]}
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-medium leading-tight outline-none sm:text-[2.6rem]">
                {step.question}
              </h1>
              <p className="mt-3 max-w-2xl text-muted">{step.subtitle}</p>
              {step.type === 'multi' && step.max && step.max < 8 && (
                <p className="mt-2 text-sm font-medium text-accent" aria-live="polite">
                  {selectedCount} / {step.max} sélectionné{selectedCount > 1 ? 's' : ''}
                </p>
              )}
              <div className="mt-7">{renderInput()}</div>
            </motion.div>
          </AnimatePresence>

          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-surface/90 px-5 py-4 backdrop-blur-md sm:px-8">
            <button type="button" onClick={onPrev} className="btn btn-ghost !px-4 !py-2.5 text-sm">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {stepIndex === 0 ? 'Accueil' : 'Retour'}
            </button>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted md:inline">Entrée ↵ pour continuer</span>
              <button type="button" onClick={goNext} disabled={!valid} className="btn btn-primary !px-6 !py-3">
                {isLast ? (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Voir mes destinations
                  </>
                ) : step.optional && !answers[step.id]?.toString().length ? (
                  <>
                    Passer
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="hidden lg:block">
          <LivePanel mood={mood} strong={strongMatches} total={DESTINATIONS.length} answered={answeredCount} />
        </div>
      </div>
    </div>
  );
};
