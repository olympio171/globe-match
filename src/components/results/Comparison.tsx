import React from 'react';
import { MONTHS } from '../../data/questions';
import { euros, hoursLabel } from '../../services/labels';
import type { MatchResult } from '../../types';

const dots = (n: number) => (
  <span className="inline-flex gap-1" aria-label={`${n} sur 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`h-2 w-2 rounded-full ${i < n ? 'bg-accent' : 'bg-line'}`} />
    ))}
  </span>
);

/** The podium side by side, on the facts that usually decide. */
export const Comparison: React.FC<{ matches: MatchResult[] }> = ({ matches }) => {
  const rows: { label: string; render: (m: MatchResult) => React.ReactNode }[] = [
    { label: 'Affinité', render: (m) => <strong className="font-display text-xl tabular">{m.pct} %</strong> },
    { label: 'Mois retenu', render: (m) => MONTHS[m.month] },
    { label: 'Température', render: (m) => `${Math.round(m.dest.climate.t[m.month])} °C` },
    { label: 'Trajet', render: (m) => `${hoursLabel(m.flightHours)}${m.stops ? ` · ${m.stops} escale${m.stops > 1 ? 's' : ''}` : ' · direct'}` },
    { label: 'Budget / pers.', render: (m) => `~${euros(m.cost.total)}` },
    { label: 'Sur place / jour', render: (m) => euros(m.cost.daily) },
    { label: 'Dépaysement', render: (m) => dots(m.dest.f.exotic) },
    { label: 'Affluence', render: (m) => dots(m.dest.f.crowds) },
    { label: 'Sécurité', render: (m) => dots(m.dest.f.safety) },
    { label: 'Gastronomie', render: (m) => dots(m.dest.f.food) },
  ];

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Comparaison des trois destinations</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="w-40 p-4 text-left font-medium text-muted">
              Comparatif
            </th>
            {matches.map((m, i) => (
              <th key={m.dest.id} scope="col" className="p-4 text-left">
                <span className="text-xs text-muted">n° {i + 1}</span>
                <span className="block font-display text-lg font-medium leading-tight">{m.dest.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-0">
              <th scope="row" className="p-4 text-left font-normal text-muted">
                {row.label}
              </th>
              {matches.map((m) => (
                <td key={m.dest.id} className="p-4 tabular">
                  {row.render(m)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
