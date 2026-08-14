import React from 'react';
import { Compass, Bookmark, RotateCcw } from 'lucide-react';
import { DestinationRecommendation } from '../types';

interface NavbarProps {
  onRestart: () => void;
  savedDestinations: DestinationRecommendation[];
  onOpenSaved: () => void;
  inResultsView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRestart,
  savedDestinations,
  onOpenSaved,
  inResultsView = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#020617]/70 backdrop-blur-2xl border-b border-cyan-500/15 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="btn-nav-brand"
          onClick={onRestart}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all border border-cyan-300/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white/95">
                GLOBEMATCH <span className="font-light text-cyan-300">COSMOS</span>
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/50 font-normal tracking-wide hidden sm:block">
              Calculateur d'affinité voyage multicritères
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {inResultsView && (
            <button
              id="btn-nav-restart"
              onClick={onRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-200 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nouveau Quiz</span>
            </button>
          )}

          <button
            id="btn-nav-saved"
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/40 hover:bg-cyan-900/60 text-white border border-cyan-400/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-300" />
            <span>Favoris</span>
            {savedDestinations.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {savedDestinations.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
