import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, ArrowRight, Zap, Globe2, Utensils, SunMedium, Wallet } from 'lucide-react';
import { QUICK_DEMO_PRESETS, QUIZ_STEPS } from '../data/quizQuestions';
import { QuizAnswers } from '../types';
import { useMagnetic } from '../hooks/useMagnetic';

interface QuizHeroProps {
  onStartQuiz: () => void;
  onSelectPreset: (answers: QuizAnswers) => void;
}

export const QuizHero: React.FC<QuizHeroProps> = ({ onStartQuiz, onSelectPreset }) => {
  const magneticRef = useMagnetic<HTMLDivElement>(0.11);

  // Derived, never hardcoded: the copy used to claim 14 while the quiz had 17.
  const totalQuestions = QUIZ_STEPS.length;

  // Cards reveal one after another rather than all at once.
  const gridStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
  };

  const cardReveal = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Luminous Cosmic Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 text-xs font-medium uppercase tracking-[0.25em] mb-8 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] shimmer-badge"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Exploration Cosmique & Algorithme Prédictif</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.15] mb-6 cosmic-glow-text"
        >
          Révélez vos{' '}
          <span className="italic font-normal bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
            3 destinations idéales
          </span>{' '}
          dans le cosmos
        </motion.h1>

        {/* Subtitle with High Legibility */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-sky-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md"
        >
          À travers {totalQuestions} dimensions de voyage finement orchestrées, découvrez les sanctuaires terrestres qui résonnent avec votre âme d'explorateur.
        </motion.p>

        {/* Primary Action Button (Organic flowing pill with cosmic glow) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Wrapper owns the magnetic translate; the button owns its own scale */}
          <div ref={magneticRef} className="w-full sm:w-auto">
            <motion.button
              id="btn-hero-start"
              onClick={onStartQuiz}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative group w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 rounded-full text-base font-semibold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:via-sky-400 hover:to-indigo-500 text-white shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_65px_rgba(56,189,248,0.7)] transition-all cursor-pointer overflow-hidden border border-cyan-300/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Compass className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '16s' }} />
              <span className="tracking-wide">Lancer le grand quiz stellaire ({totalQuestions} questions)</span>
              <ArrowRight className="w-5 h-5 text-cyan-100 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Highlights with Cosmic Glass & Rounded Contours */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={gridStagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14 text-left"
        >
          <motion.div
            variants={cardReveal}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-[28px] cosmic-glass cosmic-glass-hover hud-corners"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <SunMedium className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="font-semibold text-sm text-white/95 mb-1">Climat & Décors</h3>
            <p className="text-xs text-sky-200/60 leading-relaxed font-light">Fjords arctiques, lagons d'azur, forêts boréales & déserts</p>
          </motion.div>

          <motion.div
            variants={cardReveal}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-[28px] cosmic-glass cosmic-glass-hover hud-corners"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Utensils className="w-5 h-5 text-sky-300" />
            </div>
            <h3 className="font-semibold text-sm text-white/95 mb-1">Gastronomie</h3>
            <p className="text-xs text-sky-200/60 leading-relaxed font-light">Haute gastronomie, étals de rue parfumés & saveurs authentiques</p>
          </motion.div>

          <motion.div
            variants={cardReveal}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-[28px] cosmic-glass cosmic-glass-hover hud-corners"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Globe2 className="w-5 h-5 text-indigo-300" />
            </div>
            <h3 className="font-semibold text-sm text-white/95 mb-1">Culture & Rituels</h3>
            <p className="text-xs text-sky-200/60 leading-relaxed font-light">Temples millénaires, trésors d’art & immersions locales</p>
          </motion.div>

          <motion.div
            variants={cardReveal}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-[28px] cosmic-glass cosmic-glass-hover hud-corners"
          >
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <Wallet className="w-5 h-5 text-violet-300" />
            </div>
            <h3 className="font-semibold text-sm text-white/95 mb-1">Budget & Vols</h3>
            <p className="text-xs text-sky-200/60 leading-relaxed font-light">Estimation complète vols directs, hébergements & activités</p>
          </motion.div>
        </motion.div>

        {/* Quick Demo Presets */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="border-t border-cyan-500/15 pt-10"
        >
          <div className="flex items-center justify-center gap-2 hud-label mb-5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profils préenregistrés</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {QUICK_DEMO_PRESETS.map((preset, index) => (
              <button
                key={index}
                id={`btn-preset-${index}`}
                onClick={() => onSelectPreset(preset.answers as QuizAnswers)}
                className="p-5 rounded-[24px] cosmic-glass cosmic-glass-hover hud-corners text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-white/90 group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-cyan-400/40 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-sky-200/50 font-light">
                  {preset.subtitle}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
