import React from 'react';
import { MONTHS, MONTHS_SHORT } from '../../data/questions';
import type { Destination } from '../../types';

interface ClimateChartProps {
  dest: Destination;
  /** Months the traveller can leave in (all when flexible). */
  wanted: number[];
  /** Month the score was computed for. */
  chosen: number;
}

const RAIN_LABEL = ['sec', 'quelques averses', 'pluvieux', 'saison des pluies'];

/** Temperature as a colour: icy blue through green to deep orange. */
function tempHue(t: number): number {
  const stops: [number, number][] = [[-15, 260], [0, 235], [12, 190], [20, 130], [26, 75], [32, 45], [40, 25]];
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [t1, h1] = stops[i];
    const [t0, h0] = stops[i - 1];
    if (t <= t1) return h0 + ((t - t0) / (t1 - t0)) * (h1 - h0);
  }
  return stops[stops.length - 1][1];
}

/** Twelve months of daytime highs and rain, with the traveller’s months marked. */
export const ClimateChart: React.FC<ClimateChartProps> = ({ dest, wanted, chosen }) => {
  const { t, r, best } = dest.climate;
  const lo = Math.min(-5, ...t);
  const hi = Math.max(35, ...t);

  return (
    <figure>
      <div className="flex h-44 items-end gap-1 sm:gap-1.5" role="img" aria-label={`Températures moyennes à ${dest.name}, de ${Math.min(...t)} à ${Math.max(...t)} °C`}>
        {t.map((temp, m) => {
          const height = 18 + ((temp - lo) / (hi - lo)) * 82;
          const isWanted = wanted.includes(m);
          const isChosen = m === chosen;
          return (
            <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className={`text-[0.7rem] font-semibold tabular ${isChosen ? 'text-ink' : 'text-muted'}`}>{Math.round(temp)}°</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${isChosen ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''}`}
                style={{
                  height: `${height}%`,
                  background: `oklch(${isWanted ? 0.7 : 0.8} ${isWanted ? 0.13 : 0.06} ${tempHue(temp)})`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-1.5">
        {MONTHS_SHORT.map((label, m) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="flex h-3 items-end gap-[2px]" title={`${MONTHS[m]} : ${RAIN_LABEL[Number(r[m])]}`} aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className={`w-[3px] rounded-full ${i < Number(r[m]) ? 'bg-accent-2' : 'bg-line'}`} style={{ height: 4 + i * 3 }} />
              ))}
            </span>
            <span className={`text-[0.68rem] ${wanted.includes(m) ? 'font-semibold text-ink' : 'text-muted'}`}>{label}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${best[m] === '1' ? 'bg-good' : 'bg-transparent'}`} aria-hidden="true" />
          </div>
        ))}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span>Températures maximales moyennes</span>
        <span className="flex items-center gap-1.5">
          <span className="flex items-end gap-[2px]" aria-hidden="true">
            <span className="h-1 w-[3px] rounded-full bg-accent-2" />
            <span className="h-[7px] w-[3px] rounded-full bg-accent-2" />
          </span>
          pluie
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-good" aria-hidden="true" /> meilleure saison
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm ring-2 ring-accent" aria-hidden="true" /> mois retenu pour vous
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>Climat mois par mois</caption>
        <tbody>
          {MONTHS.map((name, m) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{t[m]} °C</td>
              <td>{RAIN_LABEL[Number(r[m])]}</td>
              <td>{best[m] === '1' ? 'meilleure saison' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};
