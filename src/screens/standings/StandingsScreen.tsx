const standings = [
  ["Apex Syndicate", 184],
  ["Neon Vector", 171],
  ["Coldline Racing", 148],
  ["Vortex Union", 132],
];

export function StandingsScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Standings</h2>
      {standings.map(([team, points], index) => (
        <div key={team} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <p className="text-xs text-zinc-500">P{index + 1}</p>
            <h3 className="font-bold">{team}</h3>
          </div>
          <p className="text-xl font-black text-cyan-300">{points}</p>
        </div>
      ))}
    </div>
  );
}
