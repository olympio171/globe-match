import React from 'react';
import { CalendarHeart, Check, Plane, Wallet } from 'lucide-react';
import { MONTHS } from '../../data/questions';
import { euros, hoursLabel } from '../../services/labels';
import type { MatchResult } from '../../types';
import { Cover } from '../Cover';

interface PodiumCardProps {
  match: MatchResult;
  rank: number;
  selected: boolean;
  onSelect: () => void;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({ match, rank, selected, onSelect }) => {
  const { dest } = match;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`card group flex h-full flex-col overflow-hidden text-left transition-all duration-500 ${
        selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : 'hover:-translate-y-1'
      }`}
    >
      <div className="relative">
        <Cover dest={dest} width={960} className={rank === 0 ? 'h-64 sm:h-72' : 'h-56'} eager={rank === 0} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 font-display text-lg font-semibold text-black">
          {rank + 1}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1.5 font-display text-xl font-medium text-white backdrop-blur-md tabular">
          {match.pct}
          <span className="text-sm">%</span>
        </span>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-sm text-white/85">{dest.country}</p>
          <h3 className="font-display text-2xl font-medium leading-tight sm:text-[1.7rem]">{dest.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <ul className="space-y-2">
          {match.reasons.slice(0, 2).map((r) => (
            <li key={r} className="flex gap-2 text-sm leading-snug">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-4 text-xs">
          <div>
            <dt className="flex items-center gap-1 text-muted"><CalendarHeart className="h-3.5 w-3.5" aria-hidden="true" />Quand</dt>
            <dd className="mt-0.5 font-semibold">{MONTHS[match.month]}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-muted"><Plane className="h-3.5 w-3.5" aria-hidden="true" />Trajet</dt>
            <dd className="mt-0.5 font-semibold tabular">{hoursLabel(match.flightHours)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-muted"><Wallet className="h-3.5 w-3.5" aria-hidden="true" />Budget</dt>
            <dd className="mt-0.5 font-semibold tabular">~{euros(match.cost.total)}</dd>
          </div>
        </dl>
      </div>
    </button>
  );
};
