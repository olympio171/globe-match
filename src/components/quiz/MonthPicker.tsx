import React from 'react';
import { Shuffle } from 'lucide-react';
import { MONTHS, MONTHS_SHORT, MONTH_TINTS } from '../../data/questions';

interface MonthPickerProps {
  value: number[] | 'flexible' | undefined;
  onChange: (value: number[] | 'flexible') => void;
}

const SEASONS: { label: string; months: number[] }[] = [
  { label: 'Hiver', months: [11, 0, 1] },
  { label: 'Printemps', months: [2, 3, 4] },
  { label: 'Été', months: [5, 6, 7] },
  { label: 'Automne', months: [8, 9, 10] },
];

export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange }) => {
  const flexible = value === 'flexible';
  const months = Array.isArray(value) ? value : [];

  const toggle = (m: number) => {
    const next = months.includes(m) ? months.filter((x) => x !== m) : [...months, m].sort((a, b) => a - b);
    onChange(next);
  };

  const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6" role="group" aria-label="Mois de départ possibles">
        {MONTHS_SHORT.map((label, m) => {
          const on = months.includes(m);
          return (
            <button
              key={label}
              type="button"
              role="checkbox"
              aria-checked={on}
              aria-label={MONTHS[m]}
              onClick={() => toggle(m)}
              className={`relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border px-3.5 pb-3 pt-3.5 text-left transition-all duration-300 ${
                on ? 'border-accent bg-accent-soft' : 'border-line bg-surface/80 hover:-translate-y-0.5 hover:border-accent/50'
              }`}
            >
              <span className="font-display text-xl font-medium">{label}</span>
              <span
                className="h-1 w-full rounded-full transition-opacity"
                style={{ background: `oklch(0.7 0.13 ${MONTH_TINTS[m].h})`, opacity: on ? 1 : 0.45 }}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">Raccourcis :</span>
        {SEASONS.map((s) => {
          const on = sameSet(months, s.months);
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onChange(on ? [] : [...s.months].sort((a, b) => a - b))}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                on ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:bg-surface-2'
              }`}
            >
              {s.label}
            </button>
          );
        })}
        <button
          type="button"
          role="checkbox"
          aria-checked={flexible}
          onClick={() => onChange(flexible ? [] : 'flexible')}
          className={`ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            flexible ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:bg-surface-2'
          }`}
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Je suis flexible
        </button>
      </div>
      {flexible && (
        <p className="text-sm text-muted">
          Parfait : pour chaque destination, on retiendra le meilleur mois selon vos envies.
        </p>
      )}
    </div>
  );
};
