import { carParts } from "@/data";

export function RewardDraftScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Reward Draft</h2>
      <p className="text-sm text-zinc-400">Choose 1 of 3 upgrades after the race weekend.</p>
      {carParts.slice(0, 3).map((part) => (
        <button key={part.id} className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4 text-left">
          <p className="text-xs uppercase text-cyan-300">{part.rarity}</p>
          <h3 className="mt-1 text-xl font-bold">{part.name}</h3>
          <p className="mt-2 text-sm text-zinc-400">{part.description}</p>
        </button>
      ))}
    </div>
  );
}
