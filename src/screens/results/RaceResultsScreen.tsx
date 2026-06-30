import { carParts, circuits, demoLoadout, drivers, teamMembers } from "@/data";
import { calculateRaceResult } from "@/systems";

export function RaceResultsScreen() {
  const result = calculateRaceResult({
    loadout: demoLoadout,
    circuit: circuits[0],
    drivers,
    parts: carParts,
    teamMembers,
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Race Results</h2>
      <div className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">{result.circuit.name}</p>
        <p className="mt-1 text-4xl font-black text-cyan-300">{result.totalTeamScore}</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="font-bold">Car 1</h3>
        <p className="text-sm text-zinc-400">{result.car1.driver?.name}</p>
        <p className="mt-2 text-2xl font-black">{result.car1.totalScore}</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="font-bold">Car 2</h3>
        <p className="text-sm text-zinc-400">{result.car2.driver?.name}</p>
        <p className="mt-2 text-2xl font-black">{result.car2.totalScore}</p>
      </div>
    </div>
  );
}
