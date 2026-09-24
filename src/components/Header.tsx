import React from 'react';
import { Heart, Monitor, Moon, RotateCcw, Sun } from 'lucide-react';

export type ThemePreference = 'auto' | 'light' | 'dark';

interface HeaderProps {
  favorites: number;
  onOpenFavorites: () => void;
  onHome: () => void;
  onRestart: () => void;
  showRestart: boolean;
  theme: ThemePreference;
  onCycleTheme: () => void;
}

const THEME_LABEL: Record<ThemePreference, string> = {
  auto: 'Thème : automatique',
  light: 'Thème : clair',
  dark: 'Thème : sombre',
};

export const Header: React.FC<HeaderProps> = ({ favorites, onOpenFavorites, onHome, onRestart, showRestart, theme, onCycleTheme }) => {
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <button type="button" onClick={onHome} className="group flex items-center gap-2.5 rounded-full pr-2" aria-label="GlobeMatch, retour à l’accueil">
          <span
            className="relative h-8 w-8 rounded-full transition-transform duration-500 group-hover:rotate-45"
            style={{ background: 'conic-gradient(from 200deg, var(--accent), var(--accent-2), var(--accent))' }}
          >
            <span className="absolute inset-[5px] rounded-full bg-bg" />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">GlobeMatch</span>
        </button>

        <nav className="flex items-center gap-1.5">
          {showRestart && (
            <button type="button" onClick={onRestart} className="btn btn-ghost hidden !px-3.5 !py-2 text-sm sm:inline-flex">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Recommencer
            </button>
          )}
          <button
            type="button"
            onClick={onCycleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label={`${THEME_LABEL[theme]} — changer`}
            title={THEME_LABEL[theme]}
          >
            <ThemeIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onOpenFavorites}
            className="relative flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors hover:bg-surface-2"
            aria-label={`Mes favoris (${favorites})`}
          >
            <Heart className={`h-[18px] w-[18px] ${favorites ? 'fill-accent text-accent' : 'text-muted'}`} aria-hidden="true" />
            <span className="tabular">{favorites}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
