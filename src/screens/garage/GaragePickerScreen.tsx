"use client";

import { InventoryEngine, type HydratedGarageSlot } from "@/engine";
import { useGameStore } from "@/store/useGameStore";
import type { GaragePickerMode, TeamMember } from "@/types";

type GaragePickerScreenProps = {
  mode: GaragePickerMode;
  onBack: () => void;
  onSelectCarPartSlot: (slot: HydratedGarageSlot) => void;
  onSelectTeamMember: (member: TeamMember) => void;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function itemSubtitle(slot: HydratedGarageSlot) {
  return slot.item.brand ? `${slot.item.brand} · ${label(slot.item.type)}` : label(slot.item.type);
}

export function GaragePickerScreen({
  mode,
  onBack,
  onSelectCarPartSlot,
  onSelectTeamMember,
}: GaragePickerScreenProps) {
  const gameState = useGameStore((store) => store.gameState);
  const title = `Select ${label(mode.slotType)}`;
  const currentInventorySlotId =
    mode.type === "car_part"
      ? gameState.race.activeLoadout[mode.carId].parts[mode.slotType]
      : undefined;

  const carPartSlots =
    mode.type === "car_part"
      ? InventoryEngine.getCompatibleCarPartSlots(gameState, {
          slotType: mode.slotType,
          currentInventorySlotId,
        })
      : [];

  const teamItems =
    mode.type === "team_member"
      ? InventoryEngine.getCompatibleTeamMembers(gameState, mode.slotType)
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

      {carPartSlots.map((slot) => {
        const isCurrent = slot.slotId === currentInventorySlotId;

        return (
          <button
            key={slot.slotId}
            onClick={() => onSelectCarPartSlot(slot)}
            className={`rounded-3xl border p-4 text-left active:scale-[0.98] ${
              isCurrent
                ? "border-cyan-400 bg-cyan-950/30"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-cyan-300">{slot.item.rarity}</p>
                <h3 className="mt-1 text-lg font-bold">{slot.item.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{itemSubtitle(slot)}</p>
                <p className="mt-2 text-sm text-zinc-400">{slot.item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-300">{slot.item.value}</p>
                <p className="mt-1 text-[10px] uppercase text-zinc-500">{slot.slotId}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(slot.item.stats).map(([stat, value]) => (
                <div key={stat} className="rounded-xl bg-zinc-950 p-2">
                  <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
                  <p className="text-sm font-bold">{value && value > 0 ? `+${value}` : value}</p>
                </div>
              ))}
            </div>

            {isCurrent && (
              <p className="mt-3 rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                Currently equipped in this slot
              </p>
            )}
          </button>
        );
      })}

      {teamItems.map((member) => (
        <button
          key={member.id}
          onClick={() => onSelectTeamMember(member)}
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

      {carPartSlots.length === 0 && teamItems.length === 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">No compatible unused owned items found.</p>
        </div>
      )}
    </div>
  );
}
