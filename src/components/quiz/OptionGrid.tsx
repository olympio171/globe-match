import React from 'react';
import { Check } from 'lucide-react';
import type { QuizOption } from '../../data/questions';
import { Icon } from '../Icon';

interface OptionGridProps {
  name: string;
  options: QuizOption[];
  multiple: boolean;
  value: string | string[] | undefined;
  max?: number;
  onChange: (value: string | string[]) => void;
}

/**
 * Single-choice renders as a radio group, multi-choice as checkboxes.
 * The options themselves carry a hint of the colour they will give the page.
 */
export const OptionGrid: React.FC<OptionGridProps> = ({ name, options, multiple, value, max = Infinity, onChange }) => {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const full = multiple && selected.length >= max;
  const cols = options.length <= 8 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3';

  const toggle = (option: QuizOption) => {
    if (!multiple) {
      onChange(option.id);
      return;
    }
    if (selected.includes(option.id)) {
      onChange(selected.filter((id) => id !== option.id));
      return;
    }
    if (option.exclusive) {
      onChange([option.id]);
      return;
    }
    const withoutExclusive = selected.filter((id) => !options.find((o) => o.id === id)?.exclusive);
    if (withoutExclusive.length >= max) return;
    onChange([...withoutExclusive, option.id]);
  };

  return (
    <div role={multiple ? 'group' : 'radiogroup'} aria-label={name} className={`grid grid-cols-1 gap-2.5 ${cols}`}>
      {options.map((option, index) => {
        const isOn = selected.includes(option.id);
        const blocked = multiple && !isOn && full && !option.exclusive;
        const tintColor = option.tint ? `oklch(0.68 0.15 ${option.tint.h})` : 'var(--muted)';
        return (
          <button
            key={option.id}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={isOn}
            aria-disabled={blocked}
            onClick={() => !blocked && toggle(option)}
            className={`group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
              isOn
                ? 'border-accent bg-accent-soft shadow-[0_8px_24px_-16px_var(--accent)]'
                : blocked
                  ? 'border-line bg-surface/50 opacity-45'
                  : 'border-line bg-surface/80 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface'
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                isOn ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-muted group-hover:text-ink'
              }`}
            >
              <Icon name={option.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-snug">{option.label}</span>
              {option.hint && <span className="mt-0.5 block text-sm leading-snug text-muted">{option.hint}</span>}
            </span>
            <span className="flex shrink-0 flex-col items-end gap-2">
              <span
                className={`flex h-5 w-5 items-center justify-center border transition-all duration-300 ${multiple ? 'rounded-md' : 'rounded-full'} ${
                  isOn ? 'border-accent bg-accent text-accent-ink' : 'border-line'
                }`}
                aria-hidden="true"
              >
                {isOn && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              {option.tint && (
                <span
                  className="h-1.5 w-5 rounded-full opacity-70 transition-opacity group-hover:opacity-100"
                  style={{ background: tintColor }}
                  title={`Teinte : ${option.tint.name}`}
                  aria-hidden="true"
                />
              )}
            </span>
            {index < 9 && (
              <span className="sr-only">Raccourci clavier {index + 1}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
