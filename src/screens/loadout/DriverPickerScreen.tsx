import { drivers } from "@/data";
import type { Driver } from "@/types";

type DriverPickerScreenProps = {
  onBack: () => void;
  onSelectDriver: (driver: Driver) => void;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DriverPickerScreen({ onBack, onSelectDriver }: DriverPickerScreenProps) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="w-fit text-sm font-bold text-cyan-300">
        ← Back to Loadout
      </button>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Driver Picker</p>
        <h2 className="mt-1 text-2xl font-black">Select Driver</h2>
      </div>

      {drivers.map((driver) => (
        <button
          key={driver.id}
          onClick={() => onSelectDriver(driver)}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase text-cyan-300">{driver.rarity}</p>
              <h3 className="mt-1 text-lg font-bold">{driver.name}</h3>
            </div>
            <p className="text-sm font-bold text-zinc-300">{driver.value}</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(driver.stats).map(([stat, value]) => (
              <div key={stat} className="rounded-xl bg-zinc-950 p-2">
                <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
                <p className="text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
