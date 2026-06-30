"use client";

import { RewardEngine } from "@/engine/RewardEngine";
import { useGameStore } from "@/store/useGameStore";

export function UpgradesScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const chooseRewardDraftOption = useGameStore((store) => store.chooseRewardDraftOption);
  const rewardOptions = RewardEngine.getPendingRewardOptions(gameState);

  if (!gameState.race.isCompleted) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Reward Draft</p>
          <h2 className="mt-1 text-2xl font-black">Locked</h2>
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Reward Draft unlocks after the race weekend is completed. Confirm your loadout first, then complete the weekend.
          </p>
        </section>
      </div>
    );
  }

  if (rewardOptions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Reward Draft</p>
          <h2 className="mt-1 text-2xl font-black">Claimed</h2>
        </div>

        <section className="rounded-3xl border border-cyan-500/20 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            You already selected your race reward for this weekend.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Reward Draft</p>
        <h2 className="mt-1 text-2xl font-black">Choose 1 of 3</h2>
      </div>

      <section className="rounded-3xl border border-cyan-500/20 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Race weekend complete. Select one reward. The other two options will disappear.
        </p>
      </section>

      {rewardOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => chooseRewardDraftOption(option.id)}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{option.category}</p>
          <h3 className="mt-2 text-xl font-black text-zinc-100">{option.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{option.description}</p>
          <p className="mt-4 rounded-2xl bg-zinc-950 p-3 text-sm font-black text-cyan-300">
            {option.rewardText}
          </p>
        </button>
      ))}
    </div>
  );
}
