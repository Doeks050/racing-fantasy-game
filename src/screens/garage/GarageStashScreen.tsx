"use client";

import { GARAGE_GRID_COLUMNS, InventoryEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GarageStashScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const slots = InventoryEngine.getHydratedGarageSlots(gameState);
  const rowCount = InventoryEngine.getGridRowCount(slots);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Inventory Grid</p>
        <h2 className="mt-1 text-2xl font-black">Garage Stash</h2>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-2">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GARAGE_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowCount}, 58px)`,
          }}
        >
          {slots.map((slot) => {
            const width = slot.isRotated ? slot.item.gridSize.height : slot.item.gridSize.width;
            const height = slot.isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;
            const column = slot.gridPosition?.column ?? 0;
            const row = slot.gridPosition?.row ?? 0;

            return (
              <button
                key={slot.slotId}
                className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-left active:scale-[0.98]"
                style={{
                  gridColumn: `${column + 1} / span ${width}`,
                  gridRow: `${row + 1} / span ${height}`,
                }}
              >
                <p className="text-[10px] uppercase text-cyan-300">{slot.item.rarity}</p>
                <p className="mt-1 text-xs font-bold leading-tight text-zinc-100">{slot.item.name}</p>
                <p className="mt-1 text-[10px] text-zinc-500">{label(slot.item.type)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Items shown here now come from <span className="text-cyan-300">GameState.garage.inventorySlots</span>.
        </p>
      </div>
    </div>
  );
}
