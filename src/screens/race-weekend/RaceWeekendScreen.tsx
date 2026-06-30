"use client";

import { LoadoutEngine, RaceWeekendEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

export function RaceWeekendScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const confirmRaceLoadout = useGameStore((store) => store.confirmRaceLoadout);
  const completeRaceWeekend = useGameStore((store) => store.completeRaceWeekend);
  const validation = LoadoutEngine.validateRaceLoadout(gameState);
  const canConfirm = RaceWeekendEngine.canConfirm(gameState);
  const canComplete = RaceWeekendEngine.canComplete(gameState);
  const statusLabel = RaceWeekendEngine.getStatusLabel(gameState);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Race Weekend</p>
        <h2 className="mt-1 text-2xl font-black">Neon Harbor GP</h2>
      </div>

      <section className="rounded-3xl border border-cyan-500/20 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Weekend Status</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-zinc-950 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Status</p>
            <p className="mt-1 text-lg font-black text-zinc-100">{statusLabel}</p>
          </div>
          <div className="rounded-2xl bg-zinc-950 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Deadline</p>
            <p className="mt-1 text-lg font-black text-zinc-100">{gameState.race.deadlineLabel}</p>
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border p-4 ${validation.isReady ? "border-cyan-500/30 bg-cyan-950/20" : "border-amber-500/30 bg-amber-950/20"}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Ready Check</p>
            <h3 className="mt-1 text-xl font-black text-zinc-100">
              {validation.isReady ? "Loadout Ready" : "Loadout Not Ready"}
            </h3>
          </div>
          <p className="rounded-2xl bg-zinc-950 px-3 py-2 text-sm font-black text-cyan-300">
            {validation.filledSlots}/{validation.totalSlots}
          </p>
        </div>

        {!validation.isReady && (
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
        )}
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Race Entry</p>
        <h3 className="mt-1 text-xl font-black text-zinc-100">
          {gameState.race.isSubmitted ? "Loadout Confirmed" : "Confirm Race Loadout"}
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          {gameState.race.isSubmitted
            ? "Your race loadout snapshot has been saved for this weekend."
            : "Confirming stores a race-weekend snapshot of your current loadout."}
        </p>

        {gameState.race.submittedAt && (
          <p className="mt-3 rounded-2xl bg-zinc-950 p-3 text-xs text-zinc-400">
            Confirmed at: {new Date(gameState.race.submittedAt).toLocaleString()}
          </p>
        )}

        <button
          onClick={confirmRaceLoadout}
          disabled={!canConfirm}
          className={`mt-4 w-full rounded-2xl px-4 py-4 font-black active:scale-[0.98] ${
            canConfirm
              ? "bg-cyan-400 text-zinc-950"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {gameState.race.isSubmitted
            ? "Already Confirmed"
            : validation.isReady
              ? "Confirm Loadout"
              : "Complete Loadout First"}
        </button>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Race Simulation</p>
        <h3 className="mt-1 text-xl font-black text-zinc-100">
          {gameState.race.isCompleted ? "Race Completed" : "Complete Race Weekend"}
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          {gameState.race.isCompleted
            ? "The race is finished. Reward Draft is now available."
            : "Complete the race weekend after confirming your loadout. This creates the reward draft."}
        </p>

        {gameState.race.completedAt && (
          <p className="mt-3 rounded-2xl bg-zinc-950 p-3 text-xs text-zinc-400">
            Completed at: {new Date(gameState.race.completedAt).toLocaleString()}
          </p>
        )}

        <button
          onClick={completeRaceWeekend}
          disabled={!canComplete}
          className={`mt-4 w-full rounded-2xl px-4 py-4 font-black active:scale-[0.98] ${
            canComplete
              ? "bg-cyan-400 text-zinc-950"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {gameState.race.isCompleted
            ? "Race Already Completed"
            : gameState.race.isSubmitted
              ? "Complete Weekend"
              : "Confirm Loadout First"}
        </button>
      </section>
    </div>
  );
}
