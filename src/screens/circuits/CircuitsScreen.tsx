import { circuits } from "@/data";

export function CircuitsScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Circuits</h2>
      {circuits.map((circuit) => (
        <div key={circuit.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="text-lg font-bold">{circuit.name}</h3>
          <p className="text-sm text-zinc-400">{circuit.location}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Tyre wear {circuit.tyreWear} · Wet chance {circuit.wetChance}% · Overtaking difficulty {circuit.overtakingDifficulty}
          </p>
        </div>
      ))}
    </div>
  );
}
