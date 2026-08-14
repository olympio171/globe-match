import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { QuizHero } from './components/QuizHero';
import { QuizContainer } from './components/QuizContainer';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsView } from './components/ResultsView';
import { SavedFavoritesModal } from './components/SavedFavoritesModal';
import { CustomCursor } from './components/CustomCursor';
import { CosmicBackground } from './components/CosmicBackground';
import { QUIZ_STEPS, DEFAULT_QUIZ_ANSWERS } from './data/quizQuestions';
import {
  QuizAnswers,
  RecommendationResponse,
  DestinationRecommendation,
  ProgressEvent,
  LoadingStep,
} from './types';
import { calculateDestinationMatches } from './services/recommendationEngine';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

type AppScreen = 'hero' | 'quiz' | 'loading' | 'results';

/** The three stages the pipeline really has. Nothing here advances on a timer. */
const INITIAL_LOADING_STEPS: LoadingStep[] = [
  { id: 'scoring', label: 'Calcul des affinités', state: 'pending' },
  { id: 'ai', label: 'Rédaction personnalisée', state: 'pending' },
  { id: 'render', label: 'Préparation de vos fiches', state: 'pending' },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('hero');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ_ANSWERS);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_LOADING_STEPS);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [savedFavorites, setSavedFavorites] = useState<DestinationRecommendation[]>(() => {
    try {
      const stored = localStorage.getItem('globematch_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('globematch_favorites', JSON.stringify(savedFavorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [savedFavorites]);

  const handleStartQuiz = () => {
    setCurrentStepIndex(0);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (field: keyof QuizAnswers, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStepIndex < QUIZ_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const runRecommendationCalculation = async (finalAnswers: QuizAnswers) => {
    setLoadingSteps(INITIAL_LOADING_STEPS);
    setScreen('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const patch = (id: string, changes: Partial<LoadingStep>) =>
      setLoadingSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      });

      if (!response.ok || !response.body) {
        throw new Error('API server returned error status');
      }

      // Read the NDJSON progress stream. Every step below is driven by an event
      // the server actually emitted — nothing advances on a timer.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let payload: RecommendationResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const event: ProgressEvent = JSON.parse(line);

          switch (event.phase) {
            case 'scoring':
              patch('scoring', {
                state: 'active',
                detail: `${event.poolSize} destinations · ${event.criteria} critères`,
              });
              break;
            case 'scored':
              patch('scoring', { state: 'done', detail: `${event.kept} retenues · en tête : ${event.topName}` });
              break;
            case 'ai_start':
              patch('ai', { state: 'active', detail: event.model });
              break;
            case 'ai_fallback':
              patch('ai', {
                state: 'active',
                detail: `${event.from} indisponible (${event.status}) → ${event.to}`,
              });
              break;
            case 'ai_done':
              patch('ai', { state: 'done', detail: `rédigé par ${event.model}` });
              break;
            case 'ai_failed':
              patch('ai', {
                state: 'failed',
                detail: `IA indisponible (${event.status}) · textes curatés`,
              });
              break;
            case 'ai_skipped':
              patch('ai', { state: 'skipped', detail: 'aucune clé API · textes curatés' });
              break;
            case 'result':
              payload = event.payload;
              break;
          }
        }
      }

      if (!payload) throw new Error('Stream ended without a result');

      patch('render', { state: 'active' });
      setResults(payload);
      patch('render', { state: 'done' });
      setScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Backend API request failed or offline, calculating locally:', err);
      // Seamless local calculation fallback
      patch('scoring', { state: 'done', detail: 'calcul local (serveur injoignable)' });
      patch('ai', { state: 'skipped', detail: 'hors ligne · textes curatés' });
      setResults(calculateDestinationMatches(finalAnswers));
      setScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitQuiz = () => {
    runRecommendationCalculation(answers);
  };

  const handleSelectPreset = (presetAnswers: QuizAnswers) => {
    setAnswers(presetAnswers);
    runRecommendationCalculation(presetAnswers);
  };

  const handleRestart = () => {
    setAnswers(DEFAULT_QUIZ_ANSWERS);
    setCurrentStepIndex(0);
    setResults(null);
    setScreen('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditAnswers = () => {
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (destination: DestinationRecommendation) => {
    setSavedFavorites((prev) => {
      const exists = prev.some((d) => d.id === destination.id);
      if (exists) {
        return prev.filter((d) => d.id !== destination.id);
      } else {
        return [...prev, destination];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setSavedFavorites((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSelectSavedDestination = (dest: DestinationRecommendation) => {
    if (!results) {
      // Build dummy results container centered on this destination
      setResults({
        topDestinations: [dest],
        userProfileSummary: {
          archetypeTitle: 'Destination Favorite Sélectionnée',
          archetypeDesc: 'Fiche détaillée sauvegardée dans vos favoris.',
          dominantTraits: ['Coup de Cœur'],
        },
        generatedWithAi: false,
      });
    }
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Screens cross-fade instead of snapping. Collapses to a plain cut when the
  // user has asked for reduced motion. Both branches keep the same prop shape
  // so the object spreads cleanly into motion.div.
  const screenMotion = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.995 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 },
    exit: prefersReducedMotion ? {} : { opacity: 0, y: -16, scale: 0.995 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.42,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans antialiased relative overflow-x-hidden">
      {/* Spatial Blue Custom Cursor */}
      <CustomCursor />

      {/* Immersive Black Hole Footage Background */}
      <CosmicBackground />

      {/* Top Navigation */}
      <Navbar
        onRestart={handleRestart}
        savedDestinations={savedFavorites}
        onOpenSaved={() => setIsFavoritesOpen(true)}
        inResultsView={screen === 'results'}
      />

      {/* Main Screen Router */}
      <main className="flex-1 relative z-10">
        {/*
          popLayout, not "wait": under StrictMode's double mount the "wait"
          mode never receives the exiting screen's completion callback, so the
          outgoing screen stays on screen forever and navigation dead-ends.
          popLayout pops the exiting screen out of flow instead, which gives
          the same crossfade with no layout jump and no stuck state.
        */}
        <AnimatePresence mode="popLayout" initial={false}>
          {screen === 'hero' && (
            <motion.div key="hero" {...screenMotion}>
              <QuizHero
                onStartQuiz={handleStartQuiz}
                onSelectPreset={handleSelectPreset}
              />
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div key="quiz" {...screenMotion}>
              <QuizContainer
                currentStepIndex={currentStepIndex}
                answers={answers}
                onChangeAnswer={handleAnswerChange}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                onSubmit={handleSubmitQuiz}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

          {screen === 'loading' && (
            <motion.div key="loading" {...screenMotion}>
              <LoadingScreen steps={loadingSteps} />
            </motion.div>
          )}

          {screen === 'results' && results && (
            <motion.div key="results" {...screenMotion}>
              <ResultsView
                results={results}
                userAnswers={answers}
                onRestart={handleRestart}
                onEditAnswers={handleEditAnswers}
                savedDestinations={savedFavorites}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Saved Favorites Drawer/Modal */}
      <SavedFavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedDestinations={savedFavorites}
        onRemove={handleRemoveFavorite}
        onSelectDestination={handleSelectSavedDestination}
      />
    </div>
  );
}

