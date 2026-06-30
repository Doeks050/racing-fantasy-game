import { carParts } from "@/data";

export function GarageStashScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black">Garage Stash</h2>
      <div className="grid grid-cols-6 gap-1 rounded-3xl border border-zinc-800 bg-zinc-900 p-2">
        {carParts.map((part) => (
          <div
            key={part.id}
            className="col-span-2 min-h-24 rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-[10px]"
          >
            <p className="font-bold text-zinc-100">{part.name}</p>
            <p className="mt-1 text-zinc-500">{part.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
