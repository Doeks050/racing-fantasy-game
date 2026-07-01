"use client";

import { useState } from "react";
import { circuits } from "@/data";
import type { Circuit } from "@/types";

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black text-zinc-100">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-black/35 px-3 py-2">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <span className="text-xs font-black text-zinc-200">{value}</span>
    </div>
  );
}

function SectorOverview({ sectorNumber, title, description }: { sectorNumber: number; title: string; description: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-400">Sector {sectorNumber}</p>
      <h4 className="mt-1 text-sm font-black text-zinc-100">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </section>
  );
}

const circuitDetails: Record<
  string,
  {
    archetype: string;
    summary: string;
    lengthKm: string;
    turns: number;
    fastestLapAllTime?: string;
    sectorTitles: [string, string, string];
    sectorDescriptions: [string, string, string];
  }
> = {
  circuit_1: {
    archetype: "Balanced / Technical Power",
    summary:
      "Een gebalanceerd fantasy circuit met lange snelle stukken, zware remzones en een technisch middenstuk. De baan is snel genoeg voor inhaalacties, maar technisch genoeg om slechte setups direct af te straffen.",
    lengthKm: "5.742km",
    turns: 16,
    fastestLapAllTime: undefined,
    sectorTitles: ["Main Straight & Upper Run", "Technical Core", "Lower Sweep & Final Return"],
    sectorDescriptions: [
      "Lange start/finish sectie, snelle bovenste run en een stevige remzone richting het technische deel.",
      "Het lastigste deel van de baan: korte bochten, richtingswissels en een smalle technische middensectie.",
      "Lange bochtbelasting, exit speed en de onderste run terug richting start/finish.",
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
        {circuits.map((circuit) => {
          const details = circuitDetails[circuit.id];

          return (
            <button
              key={circuit.id}
              onClick={() => onSelectCircuit(circuit.id)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
            >
              <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                <div>
                  <h3 className="text-lg font-black text-zinc-100">{circuit.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                    {details?.archetype ?? "Race Circuit"}
                  </p>
                </div>
                <span className="rounded-md bg-black/35 px-2 py-1 text-[10px] font-black text-red-300">Details</span>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Length {details?.lengthKm ?? "--"} · Turns {details?.turns ?? "--"} · Tyre wear {circuit.tyreWear}
              </p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-red-400">View circuit ›</p>
            </button>
          );
        })}
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
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Circuit Info</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-zinc-50">{circuit.name}</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          {details?.archetype ?? "Race Circuit"}
        </p>
        {details?.summary && <p className="mt-3 text-sm leading-6 text-zinc-400">{details.summary}</p>}
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatPill label="Length" value={details?.lengthKm ?? "--"} />
        <StatPill label="Turns" value={details?.turns ?? "--"} />
        <StatPill label="Laps" value={circuit.laps} />
        <StatPill label="Tyre Wear" value={circuit.tyreWear} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Fastest lap all-time</p>
        <p className="mt-2 text-2xl font-black text-zinc-100">{details?.fastestLapAllTime ?? "No lap recorded"}</p>
        <p className="mt-1 text-xs text-zinc-500">Wordt gevuld zodra er races op dit circuit gereden zijn.</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">General characteristics</h4>
        <div className="mt-3 grid gap-2">
          <InfoRow label="Overtaking" value={circuit.overtakingDifficulty} />
          <InfoRow label="Reliability stress" value={circuit.reliabilityStress} />
        </div>
      </section>

      <div className="grid gap-3">
        {circuit.sectors.map((_, index) => (
          <SectorOverview
            key={index}
            sectorNumber={index + 1}
            title={details?.sectorTitles[index] ?? `Sector ${index + 1}`}
            description={details?.sectorDescriptions[index] ?? "Sector overview"}
          />
        ))}
      </div>
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
