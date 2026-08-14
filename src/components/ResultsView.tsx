import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  SunMedium,
  Heart,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  Utensils,
  ShieldCheck,
  Compass,
  FileText,
  MessageSquare,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { DestinationRecommendation, RecommendationResponse, QuizAnswers } from '../types';
import { QUIZ_STEPS } from '../data/quizQuestions';
import { BudgetCalculator } from './BudgetCalculator';
import { DestinationsComparison } from './DestinationsComparison';
import { DestinationAiChat } from './DestinationAiChat';
import { HudGauge } from './HudGauge';

interface ResultsViewProps {
  results: RecommendationResponse;
  userAnswers: QuizAnswers;
  onRestart: () => void;
  onEditAnswers: () => void;
  savedDestinations: DestinationRecommendation[];
  onToggleSave: (dest: DestinationRecommendation) => void;
}

type TabType = 'overview' | 'itinerary' | 'budget' | 'gastronomy' | 'practical' | 'chat';

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  userAnswers,
  onRestart,
  onEditAnswers,
  savedDestinations,
  onToggleSave,
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(
    results.topDestinations[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const selectedDestination =
    results.topDestinations.find((d) => d.id === selectedDestinationId) ||
    results.topDestinations[0];

  const isSaved = savedDestinations.some((d) => d.id === selectedDestination?.id);

  // Trigger celebratory confetti on initial render
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#06b6d4', '#6366f1', '#a855f7', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] text-white py-10 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-[0.25em] mb-3 backdrop-blur-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Harmonisation Complète des Mondes</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-5xl font-light text-white tracking-tight cosmic-glow-text">
              Vos 3 Sanctuaires Cosmiques
            </h1>
            <p className="text-sm sm:text-base text-sky-200/70 font-light mt-1.5">
              Sélectionnés avec précision chirurgicale d’après vos {QUIZ_STEPS.length} critères de voyage.
            </p>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Provenance readout: says whether Gemini enriched these results
                or whether they come straight from the curated database. */}
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#030718]/70 border border-cyan-500/20 backdrop-blur-2xl">
              <span
                className={`w-2 h-2 rounded-full ${
                  results.generatedWithAi
                    ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]'
                    : 'bg-sky-500/40'
                }`}
              />
              <span className="hud-label">
                {results.generatedWithAi ? 'Analyse IA' : 'Base curatée'}
              </span>
            </div>

            <button
              id="btn-action-edit-answers"
              onClick={onEditAnswers}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/30 text-sky-100 hover:text-white transition-all cursor-pointer backdrop-blur-2xl shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modifier mes réponses</span>
            </button>
          </div>
        </div>

        {/* Traveler Profile Summary Banner */}
        <div className="p-8 sm:p-10 rounded-[36px] cosmic-glass shadow-[0_0_50px_rgba(6,182,212,0.2)] relative overflow-hidden border border-cyan-400/30">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase font-bold tracking-[0.25em] text-cyan-400 mb-2">
                Archétype Stellaire Révélé
              </div>
              <h2 className="font-serif-title text-2xl sm:text-4xl font-light text-white mb-2 cosmic-glow-text">
                « <span className="italic text-cyan-200">{results.userProfileSummary.archetypeTitle}</span> »
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/80 max-w-3xl leading-relaxed font-light">
                {results.userProfileSummary.archetypeDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {results.userProfileSummary.dominantTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-2xl"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The 3 Destinations Podium Cards */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
              Sélectionnez une destination pour explorer son guide complet :
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.topDestinations.map((dest, index) => {
              const isSelected = dest.id === selectedDestination.id;
              const medals = ['01 • Résonance 1ère', '02 • Alternative Majeure', '03 • Pépite Cosmique'];

              return (
                <button
                  key={dest.id}
                  id={`card-dest-${dest.id}`}
                  onClick={() => {
                    setSelectedDestinationId(dest.id);
                    setActiveTab('overview');
                  }}
                  className={`group relative rounded-[32px] overflow-hidden text-left border transition-all cursor-pointer flex flex-col justify-between backdrop-blur-2xl hud-corners ${
                    isSelected
                      ? 'bg-[#03071c]/90 scale-[1.03] hud-active'
                      : 'bg-[#030718]/60 hover:bg-cyan-950/30 border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={dest.coverImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

                    {/* Dossier reference */}
                    <div className="absolute top-3.5 left-3.5 px-3.5 py-1 rounded-full text-[10px] font-mono-code uppercase tracking-widest bg-black/80 text-white backdrop-blur-md border border-white/20">
                      {medals[index]}
                    </div>

                    {/* Affinity gauge */}
                    <div className="absolute top-2.5 right-2.5">
                      <HudGauge value={dest.matchScore} size={54} strokeWidth={3}>
                        <span className="font-mono-code text-sm font-bold text-cyan-200 tabular-nums drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]">
                          {dest.matchScore}
                        </span>
                      </HudGauge>
                    </div>

                    {/* Location Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4">
                      <div className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.country} • {dest.continent}</span>
                      </div>
                      <h4 className="font-serif-title text-2xl font-normal text-white leading-tight cosmic-glow-text">
                        {dest.name}
                      </h4>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-sky-100/70 line-clamp-2 leading-relaxed mb-4 font-light">
                      {dest.tagline}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dest.matchBadges.slice(0, 2).map((badge, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-200 border border-cyan-400/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Quick Stats Footer */}
                    <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs text-sky-200/60">
                      <span className="font-mono font-medium">~{dest.budget.totalEstimated7DaysPerPerson} € (7j)</span>
                      <span className={`font-bold flex items-center gap-1 text-xs uppercase tracking-wider ${isSelected ? 'text-cyan-300' : 'text-cyan-200/50 group-hover:text-white'}`}>
                        <span>{isSelected ? 'Exploration' : 'Explorer'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Destination Deep-Dive Details */}
        <div className="bg-[#020617]/85 border border-cyan-500/25 backdrop-blur-2xl rounded-[36px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Destination Hero Header */}
          <div className="relative h-80 sm:h-[420px] w-full overflow-hidden">
            <img
              src={selectedDestination.coverImage}
              alt={selectedDestination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />

            {/* Top Right Save Bookmark Button */}
            <div className="absolute top-6 right-6">
              <button
                id="btn-save-destination"
                onClick={() => onToggleSave(selectedDestination)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-2xl transition-all cursor-pointer shadow-xl ${
                  isSaved
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 border border-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.8)]'
                    : 'bg-black/70 hover:bg-black/90 text-white border border-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : 'text-cyan-300'}`} />
                <span>{isSaved ? 'Enregistré aux Favoris' : 'Sauvegarder'}</span>
              </button>
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1.5 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedDestination.region}, {selectedDestination.country}</span>
                  <span className="text-white/30">•</span>
                  <span>{selectedDestination.continent}</span>
                </div>
                <h2 className="font-serif-title text-4xl sm:text-6xl font-light text-white tracking-tight cosmic-glow-text">
                  {selectedDestination.name}
                </h2>
                <p className="text-base sm:text-lg text-sky-100/90 max-w-2xl mt-2 italic font-light drop-shadow-md">
                  « {selectedDestination.tagline} »
                </p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-4 bg-black/70 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl px-6 py-4 shadow-2xl hud-corners">
                <div className="text-right">
                  <div className="hud-label mb-1">Affinité</div>
                  <div className="font-mono-code text-[11px] text-sky-200/50">Cosmique</div>
                </div>
                <HudGauge value={selectedDestination.matchScore} size={82} strokeWidth={4}>
                  <span className="font-mono-code text-2xl font-bold text-cyan-300 cosmic-glow-text tabular-nums">
                    {selectedDestination.matchScore}
                  </span>
                  <span className="font-mono-code text-[9px] text-cyan-400/50 mt-0.5">%</span>
                </HudGauge>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Flowing pills with glowing selected state) */}
          <div className="border-b border-cyan-500/15 bg-black/50 px-4 sm:px-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max py-3.5">
              <button
                id="tab-btn-overview"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Aperçu & Affinité</span>
              </button>

              <button
                id="tab-btn-itinerary"
                onClick={() => setActiveTab('itinerary')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'itinerary'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Itinéraire 5 Jours</span>
              </button>

              <button
                id="tab-btn-budget"
                onClick={() => setActiveTab('budget')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Budget & Simulateur</span>
              </button>

              <button
                id="tab-btn-gastronomy"
                onClick={() => setActiveTab('gastronomy')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'gastronomy'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Gastronomie</span>
              </button>

              <button
                id="tab-btn-practical"
                onClick={() => setActiveTab('practical')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'practical'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Conseils & Formalités</span>
              </button>

              <button
                id="tab-btn-chat"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Assistant IA</span>
              </button>
            </div>
          </div>

          {/* Tab Content Container */}
          <div className="p-8 sm:p-10">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Why Perfect Box */}
                <div className="p-7 rounded-[28px] bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-widest mb-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Pourquoi cette destination est faite pour vous</span>
                  </div>
                  <p className="text-base sm:text-lg text-white/95 leading-relaxed font-light">
                    {selectedDestination.whyPerfect}
                  </p>
                </div>

                {/* Key Summary & Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-serif-title text-2xl font-normal text-white cosmic-glow-text">
                      Présentation générale
                    </h4>
                    <p className="text-sm sm:text-base text-sky-100/80 leading-relaxed font-light">
                      {selectedDestination.summary}
                    </p>

                    {/* Key Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedDestination.matchBadges.map((badge, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-200 border border-cyan-400/30"
                        >
                          ✓ {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#030718]/80 p-7 rounded-[28px] border border-cyan-500/20 space-y-4 text-sm backdrop-blur-2xl">
                    <div className="flex justify-between items-center py-2.5 border-b border-cyan-500/15">
                      <span className="text-sky-200/60 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Meilleure saison</span>
                      </span>
                      <span className="font-semibold text-white text-right">
                        {selectedDestination.bestSeasons.join(' ou ')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-cyan-500/15">
                      <span className="text-sky-200/60 flex items-center gap-2">
                        <SunMedium className="w-4 h-4 text-sky-400" />
                        <span>Météo attendue</span>
                      </span>
                      <span className="font-semibold text-white text-right">
                        {selectedDestination.weatherExpected}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-cyan-500/15">
                      <span className="text-sky-200/60 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>Temps de vol (Europe)</span>
                      </span>
                      <span className="font-semibold text-white text-right">
                        {selectedDestination.flightTimeFromEurope}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-sky-200/60 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-400" />
                        <span>Durée idéale</span>
                      </span>
                      <span className="font-semibold text-white text-right">
                        {selectedDestination.idealDuration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                <div>
                  <h4 className="font-serif-title text-2xl font-normal text-white mb-4 cosmic-glow-text">
                    Les 3 Expériences Incontournables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedDestination.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-[24px] bg-[#030718]/80 border border-cyan-500/20 text-sm text-sky-100 flex items-start gap-4 backdrop-blur-2xl hover:border-cyan-400/45 transition-all shadow-sm"
                      >
                        <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                          0{i + 1}
                        </span>
                        <span className="leading-relaxed font-light">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
                  <div>
                    <h4 className="font-serif-title text-2xl font-normal text-white cosmic-glow-text">
                      Proposition d’Itinéraire Idéal (5 Jours)
                    </h4>
                    <p className="text-xs sm:text-sm text-sky-200/60 font-light mt-0.5">
                      Un équilibre parfait entre découvertes majeures, contemplation et gastronomie
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedDestination.itinerary.map((dayItem) => (
                    <div
                      key={dayItem.day}
                      className="p-6 sm:p-7 rounded-[28px] bg-[#030718]/80 border border-cyan-500/20 hover:border-cyan-400/40 transition-all backdrop-blur-2xl shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                            Jour 0{dayItem.day}
                          </span>
                          <h5 className="font-semibold text-lg text-white">
                            {dayItem.title}
                          </h5>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-sky-100 mb-4">
                        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/15">
                          <span className="text-cyan-300 font-bold block mb-1 text-[11px] uppercase tracking-wider">Matin</span>
                          <span className="font-light leading-relaxed">{dayItem.morning}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/15">
                          <span className="text-sky-300 font-bold block mb-1 text-[11px] uppercase tracking-wider">Après-midi</span>
                          <span className="font-light leading-relaxed">{dayItem.afternoon}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/15">
                          <span className="text-indigo-300 font-bold block mb-1 text-[11px] uppercase tracking-wider">Soir</span>
                          <span className="font-light leading-relaxed">{dayItem.evening}</span>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-white bg-cyan-950/40 border border-cyan-400/25 px-5 py-3 rounded-2xl flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                        <span>
                          <strong className="text-cyan-300 font-semibold">Moment Fort :</strong>{' '}
                          <span className="font-light">{dayItem.highlight}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BUDGET */}
            {activeTab === 'budget' && (
              <BudgetCalculator
                budget={selectedDestination.budget}
                destinationName={selectedDestination.name}
              />
            )}

            {/* TAB 4: GASTRONOMY */}
            {activeTab === 'gastronomy' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif-title text-2xl font-normal text-white mb-2 cosmic-glow-text">
                    Culture Culinaire & Trésors Gourmands
                  </h4>
                  <p className="text-sm sm:text-base text-sky-100/80 leading-relaxed max-w-3xl font-light">
                    {selectedDestination.gastronomy.specialtyDesc}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-cyan-300 uppercase tracking-widest mb-3">
                    Spécialités Incontournables à Déguster
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDestination.gastronomy.mustTryDishes.map((dish, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-[22px] bg-[#030718]/80 border border-cyan-500/20 text-sm text-sky-100 flex items-start gap-3.5 backdrop-blur-2xl shadow-sm"
                      >
                        <Utensils className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="font-light leading-relaxed">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-[24px] bg-cyan-950/40 border border-cyan-400/25 text-sm text-white backdrop-blur-2xl shadow-sm">
                  <strong className="text-cyan-300 block mb-1 font-semibold">
                    Lieu / Expérience Gourmande Recommandée :
                  </strong>
                  <span className="font-light">{selectedDestination.gastronomy.foodieSpot}</span>
                </div>
              </div>
            )}

            {/* TAB 5: PRACTICAL TIPS */}
            {activeTab === 'practical' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif-title text-2xl font-normal text-white mb-2 cosmic-glow-text">
                    Conseils Pratiques & Formalités
                  </h4>
                  <p className="text-xs sm:text-sm text-sky-200/60 font-light">
                    Toutes les informations essentielles pour préparer sereinement votre voyage
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-6 rounded-[24px] bg-[#030718]/80 border border-cyan-500/20 backdrop-blur-2xl">
                    <span className="text-sky-200/50 block mb-1 text-[11px] uppercase tracking-wider font-semibold">Visa & Entrée</span>
                    <span className="font-medium text-white">{selectedDestination.practicalTips.visa}</span>
                  </div>

                  <div className="p-6 rounded-[24px] bg-[#030718]/80 border border-cyan-500/20 backdrop-blur-2xl">
                    <span className="text-sky-200/50 block mb-1 text-[11px] uppercase tracking-wider font-semibold">Monnaie & Paiement</span>
                    <span className="font-medium text-white">{selectedDestination.practicalTips.currency}</span>
                  </div>

                  <div className="p-6 rounded-[24px] bg-[#030718]/80 border border-cyan-500/20 backdrop-blur-2xl">
                    <span className="text-sky-200/50 block mb-1 text-[11px] uppercase tracking-wider font-semibold">Langues parlées</span>
                    <span className="font-medium text-white">{selectedDestination.practicalTips.languages}</span>
                  </div>

                  <div className="p-6 rounded-[24px] bg-[#030718]/80 border border-cyan-500/20 backdrop-blur-2xl">
                    <span className="text-sky-200/50 block mb-1 text-[11px] uppercase tracking-wider font-semibold">Transports sur place</span>
                    <span className="font-medium text-white">{selectedDestination.practicalTips.localTransport}</span>
                  </div>
                </div>

                {/* Secret Insider Tip */}
                <div className="p-7 rounded-[28px] bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-widest mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Secret d’Initié Exclusif</span>
                  </div>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-light">
                    {selectedDestination.practicalTips.insiderSecret}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: AI CHAT */}
            {activeTab === 'chat' && (
              <DestinationAiChat
                destination={selectedDestination}
                userAnswers={userAnswers}
              />
            )}
          </div>
        </div>

        {/* Side-by-side comparative table */}
        <DestinationsComparison
          destinations={results.topDestinations}
          selectedId={selectedDestination.id}
          onSelect={(id) => {
            setSelectedDestinationId(id);
            setActiveTab('overview');
          }}
        />

        {/* Bottom CTA to restart or re-test */}
        <div className="text-center pt-6 pb-12">
          <button
            id="btn-bottom-restart"
            onClick={onRestart}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-400/40 text-cyan-100 hover:text-white transition-all cursor-pointer backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)]"
          >
            <RotateCcw className="w-4 h-4 text-cyan-300" />
            <span>Refaire le grand quiz voyage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
