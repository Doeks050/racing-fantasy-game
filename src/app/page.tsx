import { carParts, circuits, demoLoadout, drivers, teamMembers } from "@/data";
import { calculateRaceResult } from "@/systems";

export default function Home() {
  const result = calculateRaceResult({
    loadout: demoLoadout,
    circuit: circuits[0],
    drivers,
    parts: carParts,
    teamMembers,
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100">
      <section className="mx-auto flex max-w-md flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Racing Fantasy Game
          </p>
          <h1 className="mt-2 text-3xl font-bold">Race Simulation Test</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Circuit: {result.circuit.name}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Total Team Score</p>
          <p className="mt-1 text-4xl font-bold text-cyan-300">
            {result.totalTeamScore}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold">Car 1</h2>
          <p className="text-sm text-zinc-400">
            Driver: {result.car1.driver?.name}
          </p>
          <p className="mt-2 text-2xl font-bold">{result.car1.totalScore}</p>
          <p className="mt-2 text-xs text-zinc-500">
            S1 {result.car1.sectorScores[0]} · S2 {result.car1.sectorScores[1]} ·
            S3 {result.car1.sectorScores[2]}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold">Car 2</h2>
          <p className="text-sm text-zinc-400">
            Driver: {result.car2.driver?.name}
          </p>
          <p className="mt-2 text-2xl font-bold">{result.car2.totalScore}</p>
          <p className="mt-2 text-xs text-zinc-500">
            S1 {result.car2.sectorScores[0]} · S2 {result.car2.sectorScores[1]} ·
            S3 {result.car2.sectorScores[2]}
          </p>
        </div>
      </section>
    </main>
  );
}
