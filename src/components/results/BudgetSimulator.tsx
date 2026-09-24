import React, { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { BUDGET_CAP, estimateCost, estimateFlight } from '../../services/engine';
import { euros, hoursLabel } from '../../services/labels';
import type { Destination, Lodging, QuizAnswers } from '../../types';

interface BudgetSimulatorProps {
  dest: Destination;
  answers: QuizAnswers;
  days: number;
}

const LODGING_LABEL: Record<Lodging, string> = {
  camping: 'Van, camping, refuges',
  homestay: 'Chez l’habitant',
  apartment: 'Location indépendante',
  boutique: 'Hôtels de charme',
  eco: 'Lodges & nature',
  luxury: 'Luxe & resorts',
};

/** Rough split of daily spending, for the breakdown bars. */
const SPLIT = [
  { key: 'sleep', label: 'Hébergement', share: 0.45 },
  { key: 'food', label: 'Repas', share: 0.3 },
  { key: 'do', label: 'Activités & transports sur place', share: 0.25 },
];

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ dest, answers, days: initialDays }) => {
  const [days, setDays] = useState(initialDays);
  const [people, setPeople] = useState(answers.companion === 'solo' || answers.companion === 'nomad' ? 1 : answers.companion?.startsWith('family') ? 4 : 2);
  const [lodging, setLodging] = useState<Lodging>(answers.lodging ?? 'boutique');

  const flight = useMemo(() => estimateFlight(dest, answers.origin ?? 'paris'), [dest, answers.origin]);
  const cost = useMemo(() => estimateCost(dest, { ...answers, lodging }, flight, days), [dest, answers, lodging, flight, days]);
  const stay = cost.daily * days;
  const cap = answers.budget ? BUDGET_CAP[answers.budget] : Infinity;
  const perPerson = cost.total;
  const within = perPerson <= cap;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-6">
        <label className="block">
          <span className="mb-2 flex items-baseline justify-between">
            <span className="font-medium">Durée</span>
            <span className="font-display text-2xl tabular">{days} jours</span>
          </span>
          <input
            type="range"
            min={3}
            max={45}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full [accent-color:var(--accent)]"
          />
        </label>

        <div>
          <span className="mb-2 block font-medium">Voyageurs</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPeople((p) => Math.max(1, p - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:bg-surface-2" aria-label="Un voyageur de moins">
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="w-16 text-center font-display text-2xl tabular" aria-live="polite">
              {people}
            </span>
            <button type="button" onClick={() => setPeople((p) => Math.min(10, p + 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:bg-surface-2" aria-label="Un voyageur de plus">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block font-medium">Hébergement</span>
          <select
            value={lodging}
            onChange={(e) => setLodging(e.target.value as Lodging)}
            className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink focus:border-accent focus:outline-none"
          >
            {(Object.keys(LODGING_LABEL) as Lodging[]).map((l) => (
              <option key={l} value={l}>
                {LODGING_LABEL[l]}
              </option>
            ))}
          </select>
        </label>

        <p className="text-sm leading-relaxed text-muted">
          Vol aller-retour estimé depuis {answers.origin === 'montreal' ? 'Montréal' : 'Paris'} : {hoursLabel(flight.hours)} de trajet,
          {flight.stops === 0 ? ' en direct' : ` ${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}. Les prix sont des ordres de grandeur en
          moyenne saison ; ils varient fortement selon les dates et la réservation.
        </p>
      </div>

      <div className="rounded-3xl bg-surface-2 p-6">
        <p className="eyebrow">Par personne, vols compris</p>
        <p className="mt-1 font-display text-5xl font-medium tabular">{euros(perPerson)}</p>
        <p className="mt-1 text-muted">
          soit <strong className="text-ink tabular">{euros(perPerson * people)}</strong> pour {people} voyageur{people > 1 ? 's' : ''}
        </p>
        {Number.isFinite(cap) && (
          <p className={`mt-3 text-sm font-medium ${within ? 'text-good' : 'text-warn'}`}>
            {within ? `Dans votre budget de ${euros(cap)}` : `Au-dessus de votre budget de ${euros(cap)} · minimum ~${euros(cost.low)} en voyageant simplement`}
          </p>
        )}

        <ul className="mt-6 space-y-3">
          <li>
            <div className="mb-1 flex justify-between text-sm">
              <span>Vol aller-retour</span>
              <span className="font-semibold tabular">{euros(cost.flight)}</span>
            </div>
            <div className="h-2 rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent-2" style={{ width: `${(cost.flight / perPerson) * 100}%` }} />
            </div>
          </li>
          {SPLIT.map((part) => (
            <li key={part.key}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{part.label}</span>
                <span className="font-semibold tabular">{euros(stay * part.share)}</span>
              </div>
              <div className="h-2 rounded-full bg-surface">
                <div className="h-full rounded-full bg-accent" style={{ width: `${((stay * part.share) / perPerson) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          Sur place : environ <strong className="text-ink tabular">{euros(cost.daily)}</strong> par jour et par personne.
        </p>
      </div>
    </div>
  );
};
