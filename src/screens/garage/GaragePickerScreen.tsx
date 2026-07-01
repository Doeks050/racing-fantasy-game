"use client";

import { GARAGE_GRID_COLUMNS, GARAGE_PICKER_MIN_ROWS, InventoryEngine, type HydratedGarageSlot } from "@/engine";
import { useGameStore } from "@/store/useGameStore";
import type { GaragePickerMode, TeamMember } from "@/types";

const CELL_HEIGHT_PX = 36;

type GaragePickerScreenProps = {
  mode: GaragePickerMode;
  onBack: () => void;
  onSelectCarPartSlot: (slot: HydratedGarageSlot) => void;
  onRemoveCarPart: () => void;
  onSelectTeamMember: (member: TeamMember) => void;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function itemSubtitle(slot: HydratedGarageSlot) {
  return slot.item.brand ? `${slot.item.brand} · ${label(slot.item.type)}` : label(slot.item.type);
}

function ItemThumb({ imagePath, alt }: { imagePath?: string; alt: string }) {
  if (!imagePath) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-1 opacity-90">
      <img src={imagePath} alt={alt} className="max-h-full max-w-full object-contain" draggable={false} />
    </div>
  );
}

function ItemFallback({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-1">
      <span className="truncate text-[9px] font-black uppercase text-zinc-500">{label}</span>
    </div>
  );
}

export function GaragePickerScreen({
  mode,
  onBack,
  onSelectCarPartSlot,
  onRemoveCarPart,
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
        })
      : [];

  const rowCount = InventoryEngine.getGridRowCount(carPartSlots, GARAGE_PICKER_MIN_ROWS);

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
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          {mode.type === "car_part" ? "Garage Stash Picker" : "Garage Picker"}
        </p>
        <h2 className="mt-1 text-2xl font-black">{title}</h2>
        {mode.type === "car_part" && (
          <p className="mt-1 text-sm text-zinc-500">
            Choose a compatible loose part from your stash grid.
          </p>
        )}
      </div>

      {mode.type === "car_part" && currentInventorySlotId && (
        <button
          onClick={onRemoveCarPart}
          className="rounded-3xl border border-red-900/60 bg-red-950/20 p-4 text-left active:scale-[0.98]"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-red-300">Mounted Part</p>
          <h3 className="mt-1 text-lg font-black text-zinc-100">Remove from car</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Demount this part and move it back into Garage Stash.
          </p>
        </button>
      )}

      {mode.type === "car_part" && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-2">
          <div
            className="relative grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${GARAGE_GRID_COLUMNS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)`,
            }}
          >
            {Array.from({ length: GARAGE_GRID_COLUMNS * rowCount }).map((_, index) => (
              <div
                key={`cell-${index}`}
                className="rounded-md border border-zinc-800/80 bg-zinc-950/50"
                style={{
                  gridColumn: (index % GARAGE_GRID_COLUMNS) + 1,
                  gridRow: Math.floor(index / GARAGE_GRID_COLUMNS) + 1,
                }}
              />
            ))}

            {carPartSlots.length === 0 && (
              <div className="pointer-events-none z-10 col-span-10 row-span-3 flex items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-4 text-center">
                <div>
                  <p className="text-sm font-black text-zinc-300">No compatible stash parts</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Remove the mounted part first or buy a compatible part in the market.
                  </p>
                </div>
              </div>
            )}

            {carPartSlots.map((slot) => {
              const isRotated = Boolean(slot.isRotated);
              const width = isRotated ? slot.item.gridSize.height : slot.item.gridSize.width;
              const height = isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;
              const column = slot.gridPosition?.column ?? 0;
              const row = slot.gridPosition?.row ?? 0;
              const showName = width > 1 || height > 1;

              return (
                <button
                  key={slot.slotId}
                  onClick={() => onSelectCarPartSlot(slot)}
                  title={slot.item.name}
                  className="relative z-20 overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 text-left shadow-lg active:scale-[0.98]"
                  style={{
                    gridColumn: `${column + 1} / span ${width}`,
                    gridRow: `${row + 1} / span ${height}`,
                  }}
                >
                  <ItemThumb imagePath={slot.item.imagePath} alt={slot.item.name} />
                  {!slot.item.imagePath && <ItemFallback label={label(slot.item.type).slice(0, 3)} />}
                  {showName && (
                    <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/65 px-1 py-0.5">
                      <p className="truncate text-[9px] font-bold leading-tight text-zinc-100">{slot.item.name}</p>
                      <p className="truncate text-[8px] text-zinc-500">{itemSubtitle(slot)}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

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

      {mode.type === "team_member" && teamItems.length === 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">No compatible owned team members found.</p>
        </div>
      )}
    </div>
  );
}
