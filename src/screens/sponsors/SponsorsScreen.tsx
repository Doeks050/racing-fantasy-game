const sponsors = [
  "Finish in the Top 10",
  "Score points with both cars",
  "Finish 5 races in the Top 5",
];

export function SponsorsScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Sponsors</h2>
      {sponsors.map((sponsor) => (
        <button key={sponsor} className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4 text-left">
          <p className="text-xs uppercase text-cyan-300">Sponsor Challenge</p>
          <h3 className="mt-1 font-bold">{sponsor}</h3>
        </button>
      ))}
    </div>
  );
}
