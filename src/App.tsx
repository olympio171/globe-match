import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Ambient } from './components/Ambient';
import { Favorites } from './components/Favorites';
import { Header, type ThemePreference } from './components/Header';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { DestinationDetail } from './components/results/DestinationDetail';
import { destinationById } from './data/destinations';
import { QUIZ_STEPS } from './data/questions';
import { countStrongMatches, recommend } from './services/engine';
import { NEUTRAL_MOOD, moodFromAnswers, moodFromDestination } from './theme/mood';
import { useApplyMood } from './theme/useApplyMood';
import type { QuizAnswers } from './types';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

type Screen = 'home' | 'quiz' | 'results' | 'sheet';

const STORE = {
  answers: 'globematch:v2:answers',
  step: 'globematch:v2:step',
  favorites: 'globematch:v2:favorites',
  theme: 'globematch:v2:theme',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage full: the app still works, it just won't remember.
  }
}

/** Answers ⇄ URL-safe base64, so a results page can be shared as a link. */
function encodeAnswers(a: QuizAnswers): string {
  const bytes = new TextEncoder().encode(JSON.stringify(a));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeAnswers(s: string): QuizAnswers | null {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return parsed && typeof parsed === 'object' ? (parsed as QuizAnswers) : null;
  } catch {
    return null;
  }
}

const sharedAnswers = typeof window !== 'undefined' && window.location.hash.startsWith('#r=') ? decodeAnswers(window.location.hash.slice(3)) : null;

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [screen, setScreen] = useState<Screen>(sharedAnswers ? 'results' : 'home');
  const [answers, setAnswers] = useState<QuizAnswers>(() => sharedAnswers ?? load(STORE.answers, {}));
  const [step, setStep] = useState<number>(() => Math.min(load(STORE.step, 0), QUIZ_STEPS.length - 1));
  const [selectedId, setSelectedId] = useState<string>('');
  const [sheetId, setSheetId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => load(STORE.favorites, []));
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() => load(STORE.theme, 'auto'));

  useEffect(() => save(STORE.answers, answers), [answers]);
  useEffect(() => save(STORE.step, step), [step]);
  useEffect(() => save(STORE.favorites, favorites), [favorites]);
  useEffect(() => {
    save(STORE.theme, theme);
    if (theme === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  const rec = useMemo(() => (screen === 'results' ? recommend(answers) : null), [screen, answers]);
  const strongMatches = useMemo(() => (screen === 'quiz' ? countStrongMatches(answers) : 0), [screen, answers]);

  // Land on the leader whenever a fresh ranking appears.
  useEffect(() => {
    if (rec && !rec.ranking.some((m) => m.dest.id === selectedId)) setSelectedId(rec.podium[0].dest.id);
  }, [rec, selectedId]);

  const selectedDest = destinationById(screen === 'sheet' ? sheetId : selectedId);
  const mood = useMemo(() => {
    if ((screen === 'results' || screen === 'sheet') && selectedDest) return moodFromDestination(selectedDest);
    if (screen === 'quiz') return moodFromAnswers(answers);
    return NEUTRAL_MOOD;
  }, [screen, selectedDest, answers]);
  useApplyMood(mood);

  // Keep the address bar in sync: a results page is shareable as-is.
  const shareUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#r=${encodeAnswers(answers)}`, [answers]);
  useEffect(() => {
    const target = screen === 'results' ? `#r=${encodeAnswers(answers)}` : '';
    if (window.location.hash !== target) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${target}`);
    }
  }, [screen, answers]);

  useEffect(() => {
    document.title =
      screen === 'results' && rec
        ? `${rec.podium.map((m) => m.dest.name.split(',')[0]).join(' · ')} — GlobeMatch`
        : screen === 'quiz'
          ? `Question ${step + 1} — GlobeMatch`
          : 'GlobeMatch — Où partir, vraiment ?';
  }, [screen, step, rec]);

  const go = useCallback(
    (next: Screen) => {
      setScreen(next);
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  const onAnswer = useCallback((field: keyof QuizAnswers, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const restart = () => {
    setAnswers({});
    setStep(0);
    setSelectedId('');
    go('home');
  };

  const start = () => {
    setAnswers({});
    setStep(0);
    go('quiz');
  };

  const toggleFavorite = (id: string) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const openFavorite = (id: string) => {
    setFavoritesOpen(false);
    if (rec?.ranking.some((m) => m.dest.id === id) && screen === 'results') {
      setSelectedId(id);
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    setSheetId(id);
    go('sheet');
  };

  const hasProgress = Object.keys(answers).length > 0;
  const transition = {
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -10 },
    transition: { duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="relative min-h-screen">
      <Ambient scene={mood.scene} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <Header
        favorites={favorites.length}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onHome={() => go('home')}
        onRestart={restart}
        showRestart={screen !== 'home'}
        theme={theme}
        onCycleTheme={() => setTheme((t) => (t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto'))}
      />

      <main id="main" className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          {screen === 'home' && (
            <motion.div key="home" {...transition}>
              <Home
                onStart={start}
                onPreset={(a) => {
                  setAnswers(a);
                  setSelectedId('');
                  go('results');
                }}
                hasProgress={hasProgress}
                onResume={() => go('quiz')}
              />
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div key="quiz" {...transition}>
              <Quiz
                stepIndex={step}
                answers={answers}
                mood={mood}
                strongMatches={strongMatches}
                onAnswer={onAnswer}
                onNext={() => {
                  setStep((s) => Math.min(s + 1, QUIZ_STEPS.length - 1));
                  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
                }}
                onPrev={() => {
                  if (step === 0) go('home');
                  else setStep((s) => s - 1);
                }}
                onSubmit={() => {
                  setSelectedId('');
                  go('results');
                }}
              />
            </motion.div>
          )}

          {screen === 'results' && rec && (
            <motion.div key="results" {...transition}>
              <Results
                rec={rec}
                answers={answers}
                selectedId={selectedId || rec.podium[0].dest.id}
                onSelect={setSelectedId}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onEdit={() => {
                  setStep(0);
                  go('quiz');
                }}
                onRestart={restart}
                shareUrl={shareUrl}
              />
            </motion.div>
          )}

          {screen === 'sheet' && selectedDest && (
            <motion.div key={`sheet-${sheetId}`} {...transition} className="mx-auto max-w-6xl space-y-6 px-4 pb-32 pt-4 sm:px-6">
              <button type="button" onClick={() => go(hasProgress ? 'results' : 'home')} className="btn btn-ghost !py-2.5 text-sm">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {hasProgress ? 'Mes résultats' : 'Accueil'}
              </button>
              <DestinationDetail
                dest={selectedDest}
                answers={answers}
                saved={favorites.includes(selectedDest.id)}
                onToggleSave={() => toggleFavorite(selectedDest.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Favorites
        open={favoritesOpen}
        ids={favorites}
        onClose={() => setFavoritesOpen(false)}
        onRemove={(id) => setFavorites((f) => f.filter((x) => x !== id))}
        onOpen={openFavorite}
      />
    </div>
  );
}
