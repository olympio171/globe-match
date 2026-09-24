import React from 'react';
import { Banknote, Bus, Clock, HeartPulse, Languages, Lightbulb, ShieldCheck, Stamp } from 'lucide-react';
import { ORIGINS } from '../../services/engine';
import type { Destination, Origin } from '../../types';

const SAFETY = ['', 'Prudence renforcée', 'Vigilance nécessaire', 'Sûr avec les précautions d’usage', 'Très sûr', 'Parmi les pays les plus sûrs'];
const FRENCH = ['Peu ou pas de français', 'Français compris dans les lieux touristiques', 'On y parle français'];

export const PracticalInfo: React.FC<{ dest: Destination; origin: Origin }> = ({ dest, origin }) => {
  const lag = dest.utc - ORIGINS[origin].utc;
  const hours = Math.floor(Math.abs(lag));
  const minutes = Math.round((Math.abs(lag) - hours) * 60);
  const lagText =
    lag === 0
      ? `Même heure qu’à ${ORIGINS[origin].city}.`
      : `${lag > 0 ? '+' : '−'}${hours} h${minutes ? ` ${minutes}` : ''} par rapport à ${ORIGINS[origin].city} (heure d’hiver).`;

  const items = [
    { icon: Stamp, label: 'Formalités', text: dest.practical.visa },
    { icon: Banknote, label: 'Argent', text: dest.practical.money },
    { icon: Languages, label: 'Langues', text: `${dest.practical.language} ${FRENCH[dest.french]}.` },
    { icon: Bus, label: 'Se déplacer', text: dest.practical.transport },
    { icon: Clock, label: 'Décalage horaire', text: lagText },
    { icon: ShieldCheck, label: 'Sécurité', text: `${SAFETY[dest.f.safety]}. Consultez les conseils aux voyageurs avant de partir.` },
    {
      icon: HeartPulse,
      label: 'Santé',
      text: [
        dest.malaria ? 'Zone de paludisme : traitement préventif à discuter avec un médecin.' : 'Pas de paludisme sur l’itinéraire classique.',
        dest.altitude ? 'Séjour en altitude : prévoyez une acclimatation.' : '',
      ]
        .filter(Boolean)
        .join(' '),
    },
  ];

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: ItemIcon, label, text }) => (
          <li key={label} className="flex gap-3 rounded-2xl bg-surface-2 p-4">
            <ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-5">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-semibold">Le conseil d’initié</p>
          <p className="mt-1 leading-relaxed">{dest.practical.tip}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Formalités indiquées pour un passeport français ou européen, à vérifier avant le départ sur diplomatie.gouv.fr.
      </p>
    </div>
  );
};
