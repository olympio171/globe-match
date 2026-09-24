import React from 'react';

interface ScalePickerProps {
  name: string;
  steps: { label: string; hint: string; tint?: { h: number } }[];
  value: number | undefined;
  onChange: (value: number) => void;
}

/** Five labelled steps; the chosen one reveals its description underneath. */
export const ScalePicker: React.FC<ScalePickerProps> = ({ name, steps, value, onChange }) => {
  const current = value ? steps[value - 1] : undefined;
  return (
    <div>
      <div role="radiogroup" aria-label={name} className="grid grid-cols-5 gap-1.5 rounded-3xl border border-line bg-surface/70 p-1.5">
        {steps.map((step, i) => {
          const v = i + 1;
          const on = value === v;
          const filled = value !== undefined && v <= value;
          return (
            <button
              key={step.label}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(v)}
              className={`flex min-h-[92px] flex-col items-center justify-between gap-2 rounded-[18px] px-1 py-3 text-center transition-all duration-300 ${
                on ? 'bg-accent text-accent-ink shadow-lg' : filled ? 'bg-accent-soft' : 'hover:bg-surface-2'
              }`}
            >
              <span className="font-display text-2xl font-medium tabular">{v}</span>
              <span className="text-[0.72rem] font-semibold leading-tight sm:text-xs">{step.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-center text-muted" aria-live="polite">
        {current ? current.hint : 'Choisissez un niveau de 1 à 5.'}
      </p>
    </div>
  );
};
