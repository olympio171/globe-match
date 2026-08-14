import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, Clock, RotateCcw, ShieldCheck } from 'lucide-react';
import { QUIZ_STEPS } from '../data/quizQuestions';
import { QuizAnswers } from '../types';
import { QuizStepView } from './QuizStepView';
import { HudGauge } from './HudGauge';

interface QuizContainerProps {
  currentStepIndex: number;
  answers: QuizAnswers;
  onChangeAnswer: (field: keyof QuizAnswers, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onRestart: () => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  currentStepIndex,
  answers,
  onChangeAnswer,
  onNext,
  onPrev,
  onSubmit,
  onRestart,
}) => {
  const currentStep = QUIZ_STEPS[currentStepIndex];
  const totalSteps = QUIZ_STEPS.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Validation: Check if current step has a valid value
  const isStepValid = (): boolean => {
    const val = answers[currentStep.field];
    if (currentStep.type === 'single') {
      return typeof val === 'string' && val.length > 0;
    }
    if (currentStep.type === 'multi') {
      const min = currentStep.minSelect || 1;
      return Array.isArray(val) && val.length >= min;
    }
    if (currentStep.type === 'slider') {
      return typeof val === 'number';
    }
    if (currentStep.type === 'text') {
      return true;
    }
    return true;
  };

  // Keyboard shortcut listener for Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't advance the quiz hidden behind an open dialog.
      if (document.querySelector('[role="dialog"]')) return;

      if (e.key === 'Enter' && !e.shiftKey && currentStep.type !== 'text') {
        if (isStepValid()) {
          if (isLastStep) {
            onSubmit();
          } else {
            onNext();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, answers, isLastStep]);

  // Format step count with leading zeros (e.g. 08/14)
  const formattedStepIndex = String(currentStepIndex + 1).padStart(2, '0');
  const formattedTotalSteps = String(totalSteps).padStart(2, '0');

  // Estimated remaining minutes
  const remainingMinutes = Math.max(1, Math.ceil((totalSteps - currentStepIndex) * 0.35));

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between text-white relative z-10">
      {/* Navigation console header */}
      <div className="px-4 sm:px-8 lg:px-12 pt-6 pb-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="hud-label">Secteur d'analyse</span>
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-medium text-white/90 tracking-wide">
                {currentStep.categoryTitle}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 font-mono-code text-[11px] text-sky-200/45">
                <Clock className="w-3.5 h-3.5 text-cyan-400/70" />
                T–{remainingMinutes} MIN
              </span>
            </div>
            <div className="hud-rule w-40 sm:w-56" />
          </div>

          {/* Orbital progress readout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="hud-label">Harmonie</span>
              <span className="font-mono-code text-sm text-cyan-300 font-semibold tabular-nums">
                {String(progressPercent).padStart(3, '0')}%
              </span>
            </div>

            <HudGauge value={progressPercent} size={68} strokeWidth={3}>
              <span className="font-mono-code text-lg font-bold text-cyan-300 tabular-nums cosmic-glow-text">
                {formattedStepIndex}
              </span>
              <span className="font-mono-code text-[9px] text-cyan-400/40 mt-0.5 tabular-nums">
                /{formattedTotalSteps}
              </span>
            </HudGauge>
          </div>
        </div>
      </div>

      {/* Main Centered Content (Clean, immersive & spoiler-free with glassmorphism) */}
      <div className="flex-1 px-4 sm:px-8 py-6 flex flex-col justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 sm:p-10 rounded-[36px] cosmic-glass hud-corners overflow-hidden"
            >
              {/* Instrument sweep across the module */}
              <div className="hud-scanline" />

              <div className="text-center sm:text-left mb-8">
                <div className="hud-label mb-3">
                  Requête {formattedStepIndex} — {currentStep.categoryTitle}
                </div>
                <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-light leading-tight text-white mb-3 cosmic-glow-text">
                  {currentStep.question}
                </h1>

                {currentStep.subtitle && (
                  <p className="text-sm sm:text-base text-sky-100/70 leading-relaxed font-light">
                    {currentStep.subtitle}
                  </p>
                )}
              </div>

              {/* Step Input Controls */}
              <QuizStepView
                step={currentStep}
                answers={answers}
                onChange={onChangeAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Sticky Action Footer */}
      <footer className="relative z-10 px-4 sm:px-8 lg:px-12 py-5 border-t border-cyan-500/15 bg-[#020617]/75 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            {!isFirstStep ? (
              <button
                id="btn-quiz-prev"
                type="button"
                onClick={onPrev}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <button
                id="btn-quiz-cancel"
                type="button"
                onClick={onRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex text-xs text-sky-300/40 font-light items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400/80" />
              Calcul final dévoilé à la fin
            </span>

            {isLastStep ? (
              <button
                id="btn-quiz-submit"
                type="button"
                disabled={!isStepValid()}
                onClick={onSubmit}
                className={`flex items-center gap-3 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl transition-all cursor-pointer ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-white shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:shadow-[0_0_55px_rgba(6,182,212,0.9)] hover:scale-[1.03] active:scale-[0.98] border border-cyan-200/50'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>Révéler mes 3 destinations idéales</span>
              </button>
            ) : (
              <button
                id="btn-quiz-next"
                type="button"
                disabled={!isStepValid()}
                onClick={onNext}
                className={`flex items-center gap-2.5 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all cursor-pointer ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-[1.03] active:scale-[0.98] border border-cyan-300/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
