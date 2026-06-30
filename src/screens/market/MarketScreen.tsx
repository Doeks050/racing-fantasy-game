import { carParts } from "@/data";

export function MarketScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Market</h2>
      {carParts.map((part) => (
        <div key={part.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="font-bold">{part.name}</h3>
          <p className="text-sm text-zinc-400">{part.description}</p>
          <p className="mt-2 text-cyan-300">{part.value} credits</p>
        </div>
      ))}
    </div>
  );
}
