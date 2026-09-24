import React, { useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { parseWishes } from '../../services/keywords';

interface NotesInputProps {
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
}

/** Free text, with the wishes the engine recognised shown live underneath. */
export const NotesInput: React.FC<NotesInputProps> = ({ value, placeholder, onChange }) => {
  const wishes = useMemo(() => parseWishes(value), [value]);
  return (
    <div>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={400}
        placeholder={placeholder}
        aria-label="Vos envies particulières"
        className="w-full resize-none rounded-3xl border border-line bg-surface/80 p-5 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex min-h-[2rem] flex-wrap items-center gap-2" aria-live="polite">
        {wishes.length ? (
          <>
            <span className="text-sm text-muted">Compris :</span>
            {wishes.map((w) => (
              <span key={w.key} className={`chip ${w.negated ? '!bg-surface-2' : ''}`}>
                {w.negated ? <Minus className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                {w.negated ? `éviter ${w.label}` : w.label}
              </span>
            ))}
          </>
        ) : (
          <span className="text-sm text-muted">Les mots-clés reconnus apparaîtront ici.</span>
        )}
      </div>
    </div>
  );
};
