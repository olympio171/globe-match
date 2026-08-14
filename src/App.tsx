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
import { CURATED_DESTINATIONS } from './data/curatedDestinations';
import {
  QuizAnswers,
  RecommendationResponse,
  DestinationRecommendation,
  LoadingStep,
} from './types';
import { calculateDestinationMatches } from './services/recommendationEngine';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

type AppScreen = 'hero' | 'quiz' | 'loading' | 'results';

/** The two stages the pipeline really has. Nothing here advances on a timer. */
const INITIAL_LOADING_STEPS: LoadingStep[] = [
  { id: 'scoring', label: 'Calcul des affinités', state: 'pending' },
  { id: 'covers', label: 'Chargement des visuels', state: 'pending' },
];

/**
 * Resolves once every image has settled, and reports how many actually loaded.
 * Never rejects: a destination whose photo is unreachable must not block the
 * results, it just shows up a moment later.
 */
function preloadImages(urls: string[]): Promise<number> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        })
    )
  ).then((results) => results.filter(Boolean).length);
}

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

    // 1. Scoring runs entirely in the browser — no network, no API key.
    patch('scoring', {
      state: 'active',
      detail: `${CURATED_DESTINATIONS.length} destinations · ${QUIZ_STEPS.length} critères`,
    });
    const computed = calculateDestinationMatches(finalAnswers);
    patch('scoring', {
      state: 'done',
      detail: `${computed.topDestinations.length} retenues · en tête : ${computed.topDestinations[0]?.name ?? ''}`,
    });

    // 2. Preloading the three cover images is the only genuine wait left, and
    //    doing it here means the results page opens without images popping in.
    patch('covers', { state: 'active', detail: `${computed.topDestinations.length} visuels` });
    const loaded = await preloadImages(computed.topDestinations.map((d) => d.coverImage));
    patch('covers', {
      state: loaded === computed.topDestinations.length ? 'done' : 'failed',
      detail:
        loaded === computed.topDestinations.length
          ? `${loaded} visuels prêts`
          : `${loaded}/${computed.topDestinations.length} chargés · les autres suivront`,
    });

    setResults(computed);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

