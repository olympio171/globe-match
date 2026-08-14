import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Info, ArrowRight } from 'lucide-react';
import { QuizStepDef } from '../data/quizQuestions';
import { QuizAnswers } from '../types';
import { HudGauge } from './HudGauge';

interface QuizStepViewProps {
  step: QuizStepDef;
  answers: QuizAnswers;
  onChange: (field: keyof QuizAnswers, value: any) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const QuizStepView: React.FC<QuizStepViewProps> = ({ step, answers, onChange }) => {
  const currentValue = answers[step.field];

  // 1. Single Choice (Immersive Cosmic Glass Option Rows)
  if (step.type === 'single' && step.options) {
    return (
      <div className="space-y-3.5">
        {step.options.map((option, idx) => {
          const isSelected = currentValue === option.id;
          const letter = OPTION_LETTERS[idx] || String(idx + 1);

          return (
            <motion.button
              key={option.id}
              id={`option-${step.id}-${option.id}`}
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onChange(step.field, option.id)}
              className={`relative w-full group flex items-center justify-between p-4 sm:p-5 pl-6 sm:pl-7 rounded-[22px] border transition-all text-left cursor-pointer backdrop-blur-2xl overflow-hidden ${
                isSelected
                  ? 'bg-cyan-500/[0.12] hud-active'
                  : 'bg-[#030718]/60 border-cyan-500/15 hover:bg-cyan-950/40 hover:border-cyan-400/45 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              }`}
            >
              {/* Luminous edge marking the engaged option */}
              <span
                className={`absolute left-0 inset-y-0 w-[3px] transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-300 via-sky-400 to-indigo-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]'
                    : 'bg-transparent group-hover:bg-cyan-400/25'
                }`}
              />

              <div className="flex items-center gap-4 min-w-0 pr-4">
                {/* Option Letter Token */}
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono-code font-bold flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                      : 'bg-white/5 text-cyan-200/50 border border-white/10 group-hover:text-cyan-300 group-hover:border-cyan-400/30'
                  }`}
                >
                  {letter}
                </span>

                <div className="min-w-0">
                  <span className={`text-base sm:text-lg block transition-colors ${isSelected ? 'font-semibold text-white cosmic-glow-text' : 'font-light text-sky-100/90 group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-xs text-sky-200/50 mt-0.5 leading-relaxed font-light line-clamp-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0 ml-2">
                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.9)]">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // 2. Multi-Select (Max items constraint)
  if (step.type === 'multi' && step.options) {
    const selectedList: string[] = Array.isArray(currentValue) ? currentValue : [];
    const maxSelect = step.maxSelect || 3;

    const handleToggle = (id: string) => {
      if (selectedList.includes(id)) {
        onChange(
          step.field,
          selectedList.filter((item) => item !== id)
        );
      } else {
        if (selectedList.length < maxSelect) {
          onChange(step.field, [...selectedList, id]);
        }
      }
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="hud-label">
            Sélection {step.minSelect || 1} à {maxSelect}
          </span>
          <span className="font-mono-code text-[11px] text-cyan-300 font-semibold px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 tabular-nums">
            {String(selectedList.length).padStart(2, '0')} / {String(maxSelect).padStart(2, '0')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {step.options.map((option, idx) => {
            const isSelected = selectedList.includes(option.id);
            const isMaxReached = !isSelected && selectedList.length >= maxSelect;
            const letter = OPTION_LETTERS[idx] || String(idx + 1);

            return (
              <motion.button
                key={option.id}
                id={`option-${step.id}-${option.id}`}
                type="button"
                whileHover={!isMaxReached ? { y: -2, scale: 1.01 } : undefined}
                whileTap={!isMaxReached ? { scale: 0.99 } : undefined}
                disabled={isMaxReached}
                onClick={() => handleToggle(option.id)}
                className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between text-left cursor-pointer backdrop-blur-2xl relative hud-corners ${
                  isSelected
                    ? 'bg-cyan-500/[0.12] hud-active'
                    : isMaxReached
                    ? 'bg-[#030718]/30 border-white/5 text-white/30 cursor-not-allowed opacity-35'
                    : 'bg-[#030718]/60 border-cyan-500/15 hover:bg-cyan-950/40 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono-code font-bold ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                        : 'bg-white/5 text-cyan-200/50'
                    }`}
                  >
                    {letter}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-cyan-400 border-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                        : 'border-cyan-500/30 bg-white/5'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm sm:text-base font-semibold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-sky-100/90'}`}>
                    {option.label}
                  </h4>
                  {option.description && (
                    <p className="text-xs text-sky-200/50 leading-relaxed font-light line-clamp-2">
                      {option.description}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Slider Step
  if (step.type === 'slider') {
    const val = typeof currentValue === 'number' ? currentValue : 3;
    const min = step.sliderMin || 1;
    const max = step.sliderMax || 5;
    const currentLabel = step.sliderLabels ? step.sliderLabels[val] : `${val} / ${max}`;

    return (
      <div className="max-w-xl mx-auto py-8 px-6 bg-[#030718]/70 border border-cyan-500/25 backdrop-blur-2xl rounded-[32px] shadow-[0_0_40px_rgba(0,0,0,0.6)] hud-corners">
        <div className="text-center mb-8">
          <HudGauge value={((val - min) / (max - min)) * 100} size={92} strokeWidth={4} className="mb-3">
            <span className="font-mono-code text-3xl font-bold text-cyan-300 cosmic-glow-text tabular-nums">
              {val}
            </span>
          </HudGauge>
          <h4 className="text-xl font-serif-title font-normal text-white mb-1 cosmic-glow-text">
            {currentLabel}
          </h4>
          <p className="hud-label">Intensité {min} — {max}</p>
        </div>

        {/* Range Input */}
        <div className="px-4 mb-8">
          <input
            id={`slider-${step.id}`}
            type="range"
            min={min}
            max={max}
            step={step.sliderStep || 1}
            value={val}
            onChange={(e) => onChange(step.field, parseInt(e.target.value, 10))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all shadow-inner"
          />

          {/* Scale ticks */}
          <div className="flex justify-between text-xs text-cyan-200/50 mt-3 px-1 font-mono-code">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
              <span
                key={num}
                className={num === val ? 'text-cyan-300 font-bold text-base cosmic-glow-text' : ''}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        {/* Descriptive Helper Box */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/20 text-xs text-sky-200/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span className="font-light leading-relaxed">
            {val <= 2
              ? 'Idéal si vous souhaitez une formule accessible, reposante et sans contrainte.'
              : val >= 4
              ? 'Idéal pour les explorateurs passionnés recherchant une immersion forte et personnalisée.'
              : 'Un juste équilibre parfait entre découverte et confort d’organisation.'}
          </span>
        </div>
      </div>
    );
  }

  // 4. Free text input
  if (step.type === 'text') {
    return (
      <div className="max-w-2xl mx-auto">
        <textarea
          id={`textarea-${step.id}`}
          rows={5}
          value={typeof currentValue === 'string' ? currentValue : ''}
          onChange={(e) => onChange(step.field, e.target.value)}
          placeholder={step.placeholder || 'Vos précisions ici...'}
          className="w-full p-5 rounded-[24px] bg-[#030718]/80 border border-cyan-500/25 text-white placeholder-sky-200/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-sm resize-none backdrop-blur-2xl shadow-inner"
        />
        <p className="text-xs text-sky-200/60 mt-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-light">
            Ces détails personnalisés seront directement analysés par l’IA pour affiner vos recommandations et votre itinéraire.
          </span>
        </p>
      </div>
    );
  }

  return null;
};
