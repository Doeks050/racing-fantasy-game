import type { GaragePickerMode } from "@/types";
import { carParts, teamMembers } from "@/data";

type GaragePickerScreenProps = {
  mode: GaragePickerMode;
  onBack: () => void;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GaragePickerScreen({ mode, onBack }: GaragePickerScreenProps) {
  const title =
    mode.type === "car_part"
      ? `Select ${label(mode.slotType)}`
      : `Select ${label(mode.slotType)}`;

  const carPartItems =
    mode.type === "car_part"
      ? carParts.filter((part) => part.type === mode.slotType)
      : [];

  const teamItems =
    mode.type === "team_member"
      ? teamMembers.filter((member) => member.slotType === mode.slotType)
      : [];

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="w-fit text-sm font-bold text-cyan-300">
        ← Back to Loadout
      </button>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Garage Picker</p>
        <h2 className="mt-1 text-2xl font-black">{title}</h2>
      </div>

      {mode.type === "car_part" &&
        carPartItems.map((part) => (
          <button
            key={part.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-cyan-300">{part.rarity}</p>
                <h3 className="mt-1 text-lg font-bold">{part.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{part.description}</p>
              </div>
              <p className="text-sm font-bold text-zinc-300">{part.value}</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(part.stats).map(([stat, value]) => (
                <div key={stat} className="rounded-xl bg-zinc-950 p-2">
                  <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
                  <p className="text-sm font-bold">{value && value > 0 ? `+${value}` : value}</p>
                </div>
              ))}
            </div>
          </button>
        ))}

      {mode.type === "team_member" &&
        teamItems.map((member) => (
          <button
            key={member.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-cyan-300">{member.rarity}</p>
                <h3 className="mt-1 text-lg font-bold">{member.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{label(member.slotType)}</p>
              </div>
              <p className="text-sm font-bold text-zinc-300">{member.value}</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(member.stats).map(([stat, value]) => (
                <div key={stat} className="rounded-xl bg-zinc-950 p-2">
                  <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
                  <p className="text-sm font-bold">{value && value > 0 ? `+${value}` : value}</p>
                </div>
              ))}
            </div>
          </button>
        ))}

      {carPartItems.length === 0 && teamItems.length === 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">No compatible items found.</p>
        </div>
      )}
    </div>
  );
}
