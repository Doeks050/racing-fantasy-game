"use client";

import { useState } from "react";
import { circuits } from "@/data";
import type { Circuit } from "@/types";

type CircuitDetailContent = {
  archetype: string;
  lengthKm: string;
  turns: number;
  fastestLapAllTime?: string;
  layoutPath: string;
  sectorTitles: [string, string, string];
  sectorDescriptions: [string, string, string];
};

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

function CircuitCinematicPanel({ circuit, details }: { circuit: Circuit; details?: CircuitDetailContent }) {
  const layoutPath =
    details?.layoutPath ??
    "M58 132 L58 50 Q58 26 84 26 L222 26 Q256 26 264 58 Q271 83 246 95 L204 116 Q184 127 197 145 Q211 163 242 157 L268 152 Q291 147 291 120 L291 93 Q291 73 273 66 L240 54 Q219 47 200 62 L169 88 Q151 103 126 103 L91 103 Q72 103 66 120 Q63 128 58 132 Z";

  return (
    <section className="relative h-52 overflow-hidden rounded-3xl border border-red-500/30 bg-zinc-950 shadow-xl shadow-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(239,68,68,0.22),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,#18181b_0%,#09090b_54%,#111827_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute left-6 top-8 h-28 w-44 rotate-[-12deg] rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute bottom-8 right-2 h-24 w-40 rotate-[18deg] rounded-full bg-white/5 blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" role="img" aria-label={`${circuit.name} cinematic circuit image`}>
        <defs>
          <linearGradient id={`trackGradient-${circuit.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fafafa" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <path d={layoutPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        <path d={layoutPath} fill="none" stroke="rgba(0,0,0,0.62)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={layoutPath}
          fill="none"
          stroke={`url(#trackGradient-${circuit.id})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 14px rgba(239,68,68,0.45))" }}
        />
        <path d="M60 128 L60 100" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      </svg>

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">Circuit Image</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-zinc-50">{circuit.name}</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
          {details?.archetype ?? "Race Circuit"}
        </p>
      </div>
    </section>
  );
}

const circuitDetails: Record<string, CircuitDetailContent> = {
  circuit_1: {
    archetype: "Balanced / Technical Power",
    lengthKm: "5.742km",
    turns: 16,
    fastestLapAllTime: undefined,
    layoutPath:
      "M58 132 L58 50 Q58 26 84 26 L222 26 Q256 26 264 58 Q271 83 246 95 L204 116 Q184 127 197 145 Q211 163 242 157 L268 152 Q291 147 291 120 L291 93 Q291 73 273 66 L240 54 Q219 47 200 62 L169 88 Q151 103 126 103 L91 103 Q72 103 66 120 Q63 128 58 132 Z",
    sectorTitles: ["Main Straight & Upper Run", "Technical Core", "Lower Sweep & Final Return"],
    sectorDescriptions: [
      "Lange start/finish sectie, snelle bovenste run en een stevige remzone richting het technische deel.",
      "Korte bochten, richtingswissels en een smalle technische middensectie.",
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

      <CircuitCinematicPanel circuit={circuit} details={details} />

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
