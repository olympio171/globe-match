import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, X } from 'lucide-react';
import { destinationById } from '../data/destinations';
import { Cover } from './Cover';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface FavoritesProps {
  open: boolean;
  ids: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ open, ids, onClose, onRemove, onOpen }) => {
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const destinations = ids.map(destinationById).filter((d) => d !== undefined);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="favorites-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-bg shadow-2xl"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="favorites-title" className="font-display text-2xl font-medium">
                Mes favoris
              </h2>
              <button ref={closeRef} type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-2" aria-label="Fermer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {destinations.length === 0 ? (
                <div className="mt-16 text-center text-muted">
                  <Heart className="mx-auto mb-4 h-10 w-10 text-line" aria-hidden="true" />
                  <p>Aucun favori pour l’instant.</p>
                  <p className="mt-1 text-sm">Touchez le cœur d’une destination pour la garder ici.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {destinations.map((d) => (
                    <li key={d.id} className="card flex overflow-hidden">
                      <Cover dest={d} width={330} className="w-24 shrink-0" />
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-4">
                        <div>
                          <p className="text-xs text-muted">{d.country}</p>
                          <p className="font-semibold leading-snug">{d.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => onOpen(d.id)} className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                            Voir la fiche <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => onRemove(d.id)} className="ml-auto text-sm text-muted hover:text-ink">
                            Retirer
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
