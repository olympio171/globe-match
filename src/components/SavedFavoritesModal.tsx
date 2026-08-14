import React, { useEffect } from 'react';
import { Bookmark, X, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { DestinationRecommendation } from '../types';

interface SavedFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDestinations: DestinationRecommendation[];
  onRemove: (id: string) => void;
  onSelectDestination: (dest: DestinationRecommendation) => void;
}

export const SavedFavoritesModal: React.FC<SavedFavoritesModalProps> = ({
  isOpen,
  onClose,
  savedDestinations,
  onRemove,
  onSelectDestination,
}) => {
  // Declared before the early return so hook order stays stable.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vos destinations favorites"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#020617]/95 border border-cyan-500/30 rounded-[32px] w-full max-w-xl max-h-[85vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.3)] text-white overflow-hidden backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-normal text-white cosmic-glow-text">Vos Destinations Favorites</h3>
              <p className="text-xs text-sky-200/50 font-light">
                {savedDestinations.length} enregistrée(s) pour consultation
              </p>
            </div>
          </div>
          <button
            id="btn-close-favorites"
            onClick={onClose}
            className="p-2.5 rounded-full text-cyan-200/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedDestinations.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
              <p className="text-sm font-semibold text-white/80">Aucun favori pour le moment</p>
              <p className="text-xs text-sky-200/50 mt-1 font-light">
                Cliquez sur « Sauvegarder » sur une destination pour l’ajouter à vos favoris.
              </p>
            </div>
          ) : (
            savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="flex items-center justify-between gap-4 p-4 rounded-[22px] bg-[#030718]/80 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400/50 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif-title text-base text-white truncate group-hover:text-cyan-300 transition-colors font-medium">
                      {dest.name}
                    </h4>
                    <p className="text-xs text-sky-200/60 flex items-center gap-1.5 mt-0.5 font-light">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{dest.country}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-cyan-300 font-mono font-medium">~{dest.budget.totalEstimated7DaysPerPerson} €</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-open-fav-${dest.id}`}
                    onClick={() => {
                      onSelectDestination(dest);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <span>Voir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-delete-fav-${dest.id}`}
                    onClick={() => onRemove(dest.id)}
                    className="p-2.5 rounded-full text-white/40 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#020617]/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
