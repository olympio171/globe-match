import React, { useState } from 'react';
import { Plane, Hotel, Utensils, Ticket, Users, Calendar, Wallet, Sparkles } from 'lucide-react';
import { BudgetBreakdown } from '../types';

interface BudgetCalculatorProps {
  budget: BudgetBreakdown;
  destinationName: string;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ budget, destinationName }) => {
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);

  // Calculations
  const totalFlights = budget.flightEstimatePerPerson * travelers;
  // Shared rooms: 2 travelers per room typically
  const roomsNeeded = Math.ceil(travelers / 2);
  const totalLodging = budget.lodgingPerNight * roomsNeeded * (days - 1);
  const totalFood = budget.foodPerDayPerPerson * travelers * days;
  const totalActivities = budget.activitiesPerDayPerPerson * travelers * days;
  const totalGrand = totalFlights + totalLodging + totalFood + totalActivities;
  const totalPerPerson = Math.round(totalGrand / travelers);

  return (
    <div className="bg-[#030718]/85 border border-cyan-500/25 rounded-[32px] p-7 sm:p-8 text-white backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-cyan-500/15">
        <div>
          <h3 className="font-serif-title text-2xl font-normal text-white flex items-center gap-3 cosmic-glow-text">
            <Wallet className="w-6 h-6 text-cyan-400" />
            <span>Simulateur de Budget Stellaire</span>
          </h3>
          <p className="text-xs sm:text-sm text-sky-200/60 font-light mt-1">
            Ajustez la durée et l'équipage pour {destinationName}
          </p>
        </div>

        {/* Total Grand Pill */}
        <div className="bg-cyan-950/60 border border-cyan-400/35 rounded-3xl px-6 py-4 text-right backdrop-blur-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <div className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-0.5">
            Estimation Totale ({days}j / {travelers} pers.)
          </div>
          <div className="text-3xl font-mono font-bold text-white cosmic-glow-text">
            {totalGrand.toLocaleString()} €{' '}
            <span className="text-xs text-sky-200/60 font-normal font-sans">
              ({totalPerPerson.toLocaleString()} € / pers.)
            </span>
          </div>
        </div>
      </div>

      {/* Sliders for Days & Travelers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-[#020617]/70 p-5 rounded-[24px] border border-cyan-500/15">
          <div className="flex justify-between items-center text-xs font-semibold mb-3">
            <span className="text-sky-200/80 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Durée de l'expédition</span>
            </span>
            <span className="text-cyan-300 font-mono font-bold text-base">{days} jours</span>
          </div>
          <input
            type="range"
            min={4}
            max={21}
            step={1}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
        </div>

        <div className="bg-[#020617]/70 p-5 rounded-[24px] border border-cyan-500/15">
          <div className="flex justify-between items-center text-xs font-semibold mb-3">
            <span className="text-sky-200/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Membres de l'équipage</span>
            </span>
            <span className="text-sky-300 font-mono font-bold text-base">{travelers} pers.</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
        </div>
      </div>

      {/* 4 Cost Pillars Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-[24px] bg-[#020617]/70 border border-cyan-500/15 text-left">
          <div className="flex items-center gap-2 text-sky-200/60 text-xs mb-1.5 font-medium">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span>Vols A/R</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {totalFlights.toLocaleString()} €
          </div>
          <div className="text-[11px] text-sky-200/40 font-mono mt-0.5">
            ~{budget.flightEstimatePerPerson} € / pers.
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#020617]/70 border border-cyan-500/15 text-left">
          <div className="flex items-center gap-2 text-sky-200/60 text-xs mb-1.5 font-medium">
            <Hotel className="w-4 h-4 text-sky-400" />
            <span>Hébergement</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {totalLodging.toLocaleString()} €
          </div>
          <div className="text-[11px] text-sky-200/40 font-mono mt-0.5">
            ~{budget.lodgingPerNight} € / nuit
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#020617]/70 border border-cyan-500/15 text-left">
          <div className="flex items-center gap-2 text-sky-200/60 text-xs mb-1.5 font-medium">
            <Utensils className="w-4 h-4 text-cyan-300" />
            <span>Repas & Dégustations</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {totalFood.toLocaleString()} €
          </div>
          <div className="text-[11px] text-sky-200/40 font-mono mt-0.5">
            ~{budget.foodPerDayPerPerson} € / jour
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#020617]/70 border border-cyan-500/15 text-left">
          <div className="flex items-center gap-2 text-sky-200/60 text-xs mb-1.5 font-medium">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>Activités & Visites</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {totalActivities.toLocaleString()} €
          </div>
          <div className="text-[11px] text-sky-200/40 font-mono mt-0.5">
            ~{budget.activitiesPerDayPerPerson} € / jour
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-400/20 text-xs text-sky-200/70 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span className="font-light">
          Les estimations incluent les billets d'avion réguliers, hébergements de qualité et activités phares recommandées.
        </span>
      </div>
    </div>
  );
};
