"use client";

import { useState } from "react";
import { circuits } from "@/data";
import type { Circuit } from "@/types";

function formatLapTime(ms: number) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

function formatSectorTime(ms: number) {
  return (ms / 1000).toFixed(3);
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black text-zinc-100">{value}</p>
    </div>
  );
}

function SectorCard({
  sectorNumber,
  title,
  description,
  timeMs,
  weights,
}: {
  sectorNumber: number;
  title: string;
  description: string;
  timeMs: number;
  weights: Circuit["sectors"][number];
}) {
  const orderedWeights = Object.entries(weights).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-400">Sector {sectorNumber}</p>
          <h4 className="mt-1 text-sm font-black text-zinc-100">{title}</h4>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 px-2 py-1 text-right">
          <p className="text-[8px] uppercase tracking-[0.12em] text-zinc-500">Ref</p>
          <p className="text-xs font-black text-red-300">{formatSectorTime(timeMs)}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5">
        {orderedWeights.map(([stat, weight]) => (
          <div key={stat} className="grid grid-cols-[1fr_38px] items-center gap-2 text-[10px]">
            <span className="truncate font-bold uppercase text-zinc-300">{stat}</span>
            <span className="text-right font-black text-zinc-500">{weight}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const circuitDetails: Record<
  string,
  {
    archetype: string;
    summary: string;
    sectorTitles: [string, string, string];
    sectorDescriptions: [string, string, string];
    gameplayNotes: string[];
  }
> = {
  circuit_1: {
    archetype: "Balanced / Technical Power",
    summary:
      "Een gebalanceerd fantasy circuit met lange snelle stukken, zware remzones en een technisch middenstuk. De baan beloont niet alleen top speed, maar ook braking, cornering, stability en tyre management.",
    sectorTitles: ["Main Straight & Upper Run", "Technical Core", "Lower Sweep & Final Return"],
    sectorDescriptions: [
      "Lange start/finish sectie, snelle bovenste run en een stevige remzone richting het technische deel.",
      "Het lastigste deel van de baan: korte bochten, richtingswissels en een smalle technische middensectie.",
      "Lange bochtbelasting, exit speed en de onderste run terug richting start/finish.",
    ],
    gameplayNotes: [
      "Starter teams verliezen vooral tijd in Sector 2 door gebrek aan cornering en stability.",
      "Sterke engines helpen in Sector 1 en Sector 3, maar winnen deze race niet alleen.",
      "Tyre management is belangrijk genoeg om race pace over meerdere ronden te beïnvloeden.",
      "Inhalen is redelijk mogelijk door de lange stukken, maar niet gratis.",
    ],
  },
};

function CircuitList({ onSelectCircuit }: { onSelectCircuit: (circuitId: string) => void }) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Race Calendar</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-50">Circuits</h2>
      </div>

      <div className="grid gap-2">
        {circuits.map((circuit) => (
          <button
            key={circuit.id}
            onClick={() => onSelectCircuit(circuit.id)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
          >
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div>
                <h3 className="text-lg font-black text-zinc-100">{circuit.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {circuit.country} {circuit.countryFlag}
                </p>
              </div>
              <span className="rounded-md bg-black/35 px-2 py-1 text-[10px] font-black text-red-300">
                {formatLapTime(circuit.referenceLapTimeMs)}
              </span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Tyre {circuit.tyreWear} · Reliability {circuit.reliabilityStress} · Overtaking {circuit.overtakingDifficulty} · Wet {circuit.wetChance}%
            </p>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-red-400">View details ›</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CircuitDetail({ circuit, onBack }: { circuit: Circuit; onBack: () => void }) {
  const details = circuitDetails[circuit.id];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <button
        onClick={onBack}
        className="w-fit rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-300 active:scale-[0.98]"
      >
        ← Back to circuits
      </button>

      <section className="rounded-3xl border border-red-500/30 bg-zinc-900 p-4 shadow-xl shadow-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Circuit Detail</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-zinc-50">{circuit.name}</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          {details?.archetype ?? "Race Circuit"}
        </p>
        {details?.summary && <p className="mt-3 text-sm leading-6 text-zinc-400">{details.summary}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatPill label="Ref Lap" value={formatLapTime(circuit.referenceLapTimeMs)} />
          <StatPill label="Laps" value={circuit.laps} />
          <StatPill label="Benchmark" value={circuit.benchmarkRating} />
          <StatPill label="Wet Chance" value={`${circuit.wetChance}%`} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatPill label="Tyre Wear" value={circuit.tyreWear} />
        <StatPill label="Reliability" value={circuit.reliabilityStress} />
        <StatPill label="Overtaking" value={circuit.overtakingDifficulty} />
        <StatPill label="Length" value="5.742km" />
      </section>

      <div className="grid gap-3">
        {circuit.sectors.map((sector, index) => (
          <SectorCard
            key={index}
            sectorNumber={index + 1}
            title={details?.sectorTitles[index] ?? `Sector ${index + 1}`}
            description={details?.sectorDescriptions[index] ?? "Sector profile"}
            timeMs={circuit.referenceSectorTimesMs[index]}
            weights={sector}
          />
        ))}
      </div>

      {details?.gameplayNotes && (
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">Gameplay Notes</h4>
          <div className="mt-3 grid gap-2">
            {details.gameplayNotes.map((note) => (
              <p key={note} className="rounded-lg bg-black/35 p-3 text-xs leading-5 text-zinc-400">
                {note}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function CircuitsScreen() {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>(null);
  const selectedCircuit = selectedCircuitId
    ? circuits.find((circuit) => circuit.id === selectedCircuitId)
    : undefined;

  if (!circuits.length) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-black">Circuits</h2>
        <p className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">No circuits available.</p>
      </div>
    );
  }

  if (selectedCircuit) {
    return <CircuitDetail circuit={selectedCircuit} onBack={() => setSelectedCircuitId(null)} />;
  }

  return <CircuitList onSelectCircuit={setSelectedCircuitId} />;
}
