"use client";

import { LoadoutEngine, RaceEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

function formatRaceTime(ms: number) {
  if (!ms) {
    return "--:--.---";
  }

  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

function formatSectorTime(ms: number) {
  if (!ms) {
    return "--.---";
  }

  return (ms / 1000).toFixed(3);
}

function TimingCard({
  title,
  driverName,
  totalScore,
  sectorTimesMs,
  sectorRatings,
  lapTimeMs,
  projectedRaceTimeMs,
}: {
  title: string;
  driverName: string;
  totalScore: number;
  sectorTimesMs: [number, number, number];
  sectorRatings: [number, number, number];
  lapTimeMs: number;
  projectedRaceTimeMs: number;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-zinc-100">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{driverName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Perf</p>
          <p className="text-lg font-black text-cyan-300">{totalScore}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-zinc-950 p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Projected lap</p>
        <p className="mt-1 text-3xl font-black text-cyan-300">{formatRaceTime(lapTimeMs)}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {sectorTimesMs.map((sectorTimeMs, index) => (
          <div key={index} className="rounded-xl bg-zinc-950 p-2">
            <p className="text-[10px] uppercase text-zinc-500">S{index + 1}</p>
            <p className="mt-1 text-sm font-black text-zinc-100">{formatSectorTime(sectorTimeMs)}</p>
            <p className="mt-1 text-[10px] text-zinc-500">rating {sectorRatings[index]}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-zinc-950 p-3">
        <p className="text-[10px] uppercase text-zinc-500">Projected race time</p>
        <p className="mt-1 text-sm font-black text-zinc-100">{formatRaceTime(projectedRaceTimeMs)}</p>
      </div>
    </section>
  );
}

export function RaceResultsScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const validation = LoadoutEngine.validateRaceLoadout(gameState);
  const result = RaceEngine.calculateCurrentRaceResult(gameState);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Timing Model v1</p>
        <h2 className="mt-1 text-2xl font-black">Race Results</h2>
      </div>

      {!validation.isReady && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Not Race Ready</p>
          <h3 className="mt-1 text-xl font-black text-zinc-100">
            Loadout incomplete: {validation.filledSlots}/{validation.totalSlots}
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Results below are only a preview. A complete race weekend needs 2 drivers, 16 car parts and 5 team slots.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {validation.missing.slice(0, 8).map((item) => (
              <span key={item} className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200">
                {item}
              </span>
            ))}
            {validation.missing.length > 8 && (
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">
                +{validation.missing.length - 8} more
              </span>
            )}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-cyan-500/30 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">{result.circuit.name}</p>
        <p className="mt-1 text-4xl font-black text-cyan-300">
          {formatRaceTime(Math.min(result.car1.lapTimeMs || Infinity, result.car2.lapTimeMs || Infinity))}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {validation.isReady ? "Official projected best lap" : "Preview projected best lap"}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-zinc-950 p-2">
            <p className="text-[10px] uppercase text-zinc-500">Reference</p>
            <p className="font-black text-zinc-100">{formatRaceTime(result.circuit.referenceLapTimeMs)}</p>
          </div>
          <div className="rounded-xl bg-zinc-950 p-2">
            <p className="text-[10px] uppercase text-zinc-500">Benchmark</p>
            <p className="font-black text-zinc-100">{result.circuit.benchmarkRating}</p>
          </div>
          <div className="rounded-xl bg-zinc-950 p-2">
            <p className="text-[10px] uppercase text-zinc-500">Laps</p>
            <p className="font-black text-zinc-100">{result.circuit.laps}</p>
          </div>
        </div>
      </section>

      <TimingCard
        title="Car 1"
        driverName={result.car1.driver?.name ?? "No driver"}
        totalScore={result.car1.totalScore}
        sectorTimesMs={result.car1.sectorTimesMs}
        sectorRatings={result.car1.sectorRatings}
        lapTimeMs={result.car1.lapTimeMs}
        projectedRaceTimeMs={result.car1.projectedRaceTimeMs}
      />

      <TimingCard
        title="Car 2"
        driverName={result.car2.driver?.name ?? "No driver"}
        totalScore={result.car2.totalScore}
        sectorTimesMs={result.car2.sectorTimesMs}
        sectorRatings={result.car2.sectorRatings}
        lapTimeMs={result.car2.lapTimeMs}
        projectedRaceTimeMs={result.car2.projectedRaceTimeMs}
      />
    </div>
  );
}
