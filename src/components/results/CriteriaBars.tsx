import React from 'react';
import type { CriterionResult } from '../../types';

/**
 * The score, taken apart: each criterion’s satisfaction, with bar thickness
 * reflecting how much it weighed for this traveller.
 */
export const CriteriaBars: React.FC<{ criteria: CriterionResult[] }> = ({ criteria }) => {
  const merged = new Map<string, { label: string; s: number; w: number }>();
  for (const c of criteria) {
    const prev = merged.get(c.key);
    if (prev) {
      prev.s = (prev.s * prev.w + c.s * c.w) / (prev.w + c.w);
      prev.w += c.w;
    } else merged.set(c.key, { label: c.label, s: c.s, w: c.w });
  }
  const rows = [...merged.values()].sort((a, b) => b.w - a.w);
  const maxW = Math.max(...rows.map((r) => r.w));

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.label} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-muted">{row.label}</span>
          <span className="relative h-2.5 overflow-hidden rounded-full bg-surface-2">
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.round(row.s * 100)}%`,
                background: row.s >= 0.7 ? 'var(--accent)' : row.s >= 0.45 ? 'var(--accent-2)' : 'var(--warn)',
                opacity: 0.45 + 0.55 * (row.w / maxW),
              }}
            />
          </span>
          <span className="text-right font-semibold tabular">{Math.round(row.s * 100)}</span>
        </li>
      ))}
    </ul>
  );
};
