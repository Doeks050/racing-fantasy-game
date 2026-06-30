"use client";

import { LoadoutEngine, RaceEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

export function RaceResultsScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const validation = LoadoutEngine.validateRaceLoadout(gameState);
  const result = RaceEngine.calculateCurrentRaceResult(gameState);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Race Results</h2>

      {!validation.isReady && (
        <section className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-4">
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

      <div className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">{result.circuit.name}</p>
        <p className="mt-1 text-4xl font-black text-cyan-300">{result.totalTeamScore}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {validation.isReady ? "Official race score" : "Preview score"}
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="font-bold">Car 1</h3>
        <p className="text-sm text-zinc-400">{result.car1.driver?.name ?? "No driver"}</p>
        <p className="mt-2 text-2xl font-black">{result.car1.totalScore}</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="font-bold">Car 2</h3>
        <p className="text-sm text-zinc-400">{result.car2.driver?.name ?? "No driver"}</p>
        <p className="mt-2 text-2xl font-black">{result.car2.totalScore}</p>
      </div>
    </div>
  );
}
