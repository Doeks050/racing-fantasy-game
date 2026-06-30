"use client";

import { useState } from "react";
import { GARAGE_GRID_COLUMNS, InventoryEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GarageStashScreen() {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const gameState = useGameStore((store) => store.gameState);
  const moveGarageSlot = useGameStore((store) => store.moveGarageSlot);
  const rotateGarageSlot = useGameStore((store) => store.rotateGarageSlot);
  const slots = InventoryEngine.getHydratedGarageSlots(gameState);
  const rowCount = InventoryEngine.getGridRowCount(slots);
  const selectedSlot = slots.find((slot) => slot.slotId === selectedSlotId) ?? null;

  function moveSelectedSlot(deltaColumn: number, deltaRow: number) {
    if (!selectedSlot?.gridPosition) {
      return;
    }

    moveGarageSlot({
      slotId: selectedSlot.slotId,
      column: selectedSlot.gridPosition.column + deltaColumn,
      row: selectedSlot.gridPosition.row + deltaRow,
    });
  }

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
            const isSelected = slot.slotId === selectedSlotId;

            return (
              <button
                key={slot.slotId}
                onClick={() => setSelectedSlotId(slot.slotId)}
                className={`overflow-hidden rounded-xl border p-2 text-left active:scale-[0.98] ${
                  isSelected
                    ? "border-cyan-300 bg-cyan-950/40"
                    : "border-zinc-700 bg-zinc-950"
                }`}
                style={{
                  gridColumn: `${column + 1} / span ${width}`,
                  gridRow: `${row + 1} / span ${height}`,
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] uppercase text-cyan-300">{slot.item.rarity}</p>
                  <p className="text-[10px] text-zinc-600">{width}x{height}</p>
                </div>
                <p className="mt-1 text-xs font-bold leading-tight text-zinc-100">{slot.item.name}</p>
                <p className="mt-1 text-[10px] text-zinc-500">{label(slot.item.type)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedSlot ? (
        <div className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Selected Item</p>
          <h3 className="mt-1 text-lg font-black">{selectedSlot.item.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Position: C{(selectedSlot.gridPosition?.column ?? 0) + 1} / R{(selectedSlot.gridPosition?.row ?? 0) + 1} · Rotation: {selectedSlot.isRotated ? "Rotated" : "Default"}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => moveSelectedSlot(0, -1)}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 font-bold text-zinc-100 active:scale-95"
            >
              Up
            </button>
            <button
              onClick={() => rotateGarageSlot({ slotId: selectedSlot.slotId })}
              className="rounded-2xl bg-cyan-400 px-3 py-3 font-black text-zinc-950 active:scale-95"
            >
              Rotate
            </button>
            <button
              onClick={() => moveSelectedSlot(0, 1)}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 font-bold text-zinc-100 active:scale-95"
            >
              Down
            </button>
            <button
              onClick={() => moveSelectedSlot(-1, 0)}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 font-bold text-zinc-100 active:scale-95"
            >
              Left
            </button>
            <button
              onClick={() => setSelectedSlotId(null)}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 font-bold text-zinc-400 active:scale-95"
            >
              Clear
            </button>
            <button
              onClick={() => moveSelectedSlot(1, 0)}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 font-bold text-zinc-100 active:scale-95"
            >
              Right
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            If an action would overlap another item or leave the grid, the engine blocks it.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Tap an item to select it. Then use Rotate or Move buttons to test the grid engine.
          </p>
        </div>
      )}
    </div>
  );
}
