import React from 'react';
import { DestinationRecommendation } from '../types';
import { Award } from 'lucide-react';

interface DestinationsComparisonProps {
  destinations: DestinationRecommendation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const DestinationsComparison: React.FC<DestinationsComparisonProps> = ({
  destinations,
  selectedId,
  onSelect,
}) => {
  const medals = ['01 • Résonance 1ère', '02 • Alternative', '03 • Pépite'];

  return (
    <div className="bg-[#030718]/85 border border-cyan-500/25 rounded-[32px] p-7 sm:p-9 text-white backdrop-blur-2xl overflow-x-auto shadow-[0_0_50px_rgba(0,0,0,0.7)]">
      <div className="mb-6">
        <h3 className="font-serif-title text-2xl font-normal text-white flex items-center gap-3 cosmic-glow-text">
          <Award className="w-6 h-6 text-cyan-400" />
          <span>Comparateur Stellaire des 3 Sanctuaires</span>
        </h3>
        <p className="text-xs sm:text-sm text-sky-200/60 font-light mt-1">
          Comparez les critères décisifs pour affiner votre choix final
        </p>
      </div>

      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[620px]">
        <thead>
          <tr className="border-b border-cyan-500/20">
            <th className="py-4 px-3 text-sky-200/50 font-medium w-1/4 uppercase tracking-wider text-[11px]">Critère</th>
            {destinations.map((dest, i) => (
              <th
                key={dest.id}
                className={`py-4 px-4 text-center w-1/4 rounded-t-2xl transition-colors ${
                  dest.id === selectedId
                    ? 'bg-cyan-500/20 text-cyan-200 border-t-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'text-white/80'
                }`}
              >
                <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-1">{medals[i]}</div>
                <div className="font-serif-title text-base sm:text-lg font-medium text-white">{dest.name}</div>
                <div className="text-[11px] text-sky-200/50 font-light">{dest.country}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 font-light">
          {/* Match Score */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Affinité globale</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center">
                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {dest.matchScore}% Match
                </span>
              </td>
            ))}
          </tr>

          {/* Estimated Budget */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Budget estimé (7j/pers.)</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center font-mono font-medium text-white">
                ~{dest.budget.totalEstimated7DaysPerPerson.toLocaleString()} €
              </td>
            ))}
          </tr>

          {/* Flight Time */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Temps de vol (Europe)</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center text-xs text-sky-100/80">
                {dest.flightTimeFromEurope}
              </td>
            ))}
          </tr>

          {/* Best Season */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Période optimale</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center text-xs text-sky-100/80">
                {dest.bestSeasons.join(' ou ')}
              </td>
            ))}
          </tr>

          {/* Vibe */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Atmosphère dominante</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center text-xs text-sky-100/90 italic">
                « {dest.vibe} »
              </td>
            ))}
          </tr>

          {/* Action Row */}
          <tr>
            <td className="py-4 px-3 text-sky-200/60 font-medium">Explorer le guide</td>
            {destinations.map((dest) => (
              <td key={dest.id} className="py-4 px-4 text-center">
                <button
                  id={`btn-select-compare-${dest.id}`}
                  onClick={() => onSelect(dest.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    dest.id === selectedId
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                      : 'bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/60 border border-cyan-400/30'
                  }`}
                >
                  {dest.id === selectedId ? 'Sélectionné' : 'Voir le guide'}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
