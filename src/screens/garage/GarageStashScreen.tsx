"use client";

import { useRef, useState } from "react";
import { GARAGE_GRID_COLUMNS, InventoryEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

const CELL_HEIGHT_PX = 58;
const GRID_GAP_PX = 4;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type DragState = {
  slotId: string;
  targetColumn: number;
  targetRow: number;
  isRotated: boolean;
  isValid: boolean;
  anchorColumn: number;
  anchorRow: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function GarageStashScreen() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const gameState = useGameStore((store) => store.gameState);
  const placeGarageSlot = useGameStore((store) => store.placeGarageSlot);
  const slots = InventoryEngine.getHydratedGarageSlots(gameState);
  const rowCount = InventoryEngine.getGridRowCount(slots);

  function getGridMetrics() {
    const grid = gridRef.current;

    if (!grid) {
      return null;
    }

    const rect = grid.getBoundingClientRect();
    const cellWidth = (rect.width - GRID_GAP_PX * (GARAGE_GRID_COLUMNS - 1)) / GARAGE_GRID_COLUMNS;

    return {
      rect,
      cellWidth,
      columnPitch: cellWidth + GRID_GAP_PX,
      rowPitch: CELL_HEIGHT_PX + GRID_GAP_PX,
    };
  }

  function getSlotVisualSize(slotId: string, isRotated: boolean) {
    const slot = slots.find((candidate) => candidate.slotId === slotId);

    if (!slot) {
      return { width: 1, height: 1 };
    }

    return isRotated
      ? { width: slot.item.gridSize.height, height: slot.item.gridSize.width }
      : slot.item.gridSize;
  }

  function buildDragState(slotId: string, clientX: number, clientY: number, anchorColumn: number, anchorRow: number) {
    const metrics = getGridMetrics();
    const slot = slots.find((candidate) => candidate.slotId === slotId);

    if (!metrics || !slot) {
      return null;
    }

    const rawColumn = Math.floor((clientX - metrics.rect.left) / metrics.columnPitch);
    const rawRow = Math.floor((clientY - metrics.rect.top) / metrics.rowPitch);
    const currentRotation = Boolean(slot.isRotated);
    const currentSize = getSlotVisualSize(slot.slotId, currentRotation);
    const currentColumn = Math.max(0, rawColumn - clamp(anchorColumn, 0, currentSize.width - 1));
    const currentRow = Math.max(0, rawRow - clamp(anchorRow, 0, currentSize.height - 1));
    const currentFits = InventoryEngine.canPlaceGarageSlot(gameState, {
      slotId,
      column: currentColumn,
      row: currentRow,
      isRotated: currentRotation,
    });

    if (currentFits) {
      return {
        slotId,
        targetColumn: currentColumn,
        targetRow: currentRow,
        isRotated: currentRotation,
        isValid: true,
        anchorColumn,
        anchorRow,
      } satisfies DragState;
    }

    const rotatedSize = getSlotVisualSize(slot.slotId, !currentRotation);
    const rotatedColumn = Math.max(0, rawColumn - clamp(anchorColumn, 0, rotatedSize.width - 1));
    const rotatedRow = Math.max(0, rawRow - clamp(anchorRow, 0, rotatedSize.height - 1));
    const rotatedFits = InventoryEngine.canPlaceGarageSlot(gameState, {
      slotId,
      column: rotatedColumn,
      row: rotatedRow,
      isRotated: !currentRotation,
    });

    return {
      slotId,
      targetColumn: rotatedFits ? rotatedColumn : currentColumn,
      targetRow: rotatedFits ? rotatedRow : currentRow,
      isRotated: rotatedFits ? !currentRotation : currentRotation,
      isValid: rotatedFits,
      anchorColumn,
      anchorRow,
    } satisfies DragState;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>, slotId: string) {
    const metrics = getGridMetrics();
    const slot = slots.find((candidate) => candidate.slotId === slotId);

    if (!metrics || !slot?.gridPosition) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedSlotId(slotId);

    const width = slot.isRotated ? slot.item.gridSize.height : slot.item.gridSize.width;
    const height = slot.isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;
    const rawColumn = Math.floor((event.clientX - metrics.rect.left) / metrics.columnPitch);
    const rawRow = Math.floor((event.clientY - metrics.rect.top) / metrics.rowPitch);
    const anchorColumn = clamp(rawColumn - slot.gridPosition.column, 0, width - 1);
    const anchorRow = clamp(rawRow - slot.gridPosition.row, 0, height - 1);

    setDragState({
      slotId,
      targetColumn: slot.gridPosition.column,
      targetRow: slot.gridPosition.row,
      isRotated: Boolean(slot.isRotated),
      isValid: true,
      anchorColumn,
      anchorRow,
    });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState) {
      return;
    }

    const nextDragState = buildDragState(
      dragState.slotId,
      event.clientX,
      event.clientY,
      dragState.anchorColumn,
      dragState.anchorRow,
    );

    if (nextDragState) {
      setDragState(nextDragState);
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (dragState.isValid) {
      placeGarageSlot({
        slotId: dragState.slotId,
        column: dragState.targetColumn,
        row: dragState.targetRow,
        isRotated: dragState.isRotated,
      });
    }

    setDragState(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Inventory Grid</p>
        <h2 className="mt-1 text-2xl font-black">Garage Stash</h2>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-2">
        <div
          ref={gridRef}
          className="relative grid touch-none gap-1"
          style={{
            gridTemplateColumns: `repeat(${GARAGE_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)`,
          }}
        >
          {Array.from({ length: GARAGE_GRID_COLUMNS * rowCount }).map((_, index) => (
            <div
              key={`cell-${index}`}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950/50"
              style={{
                gridColumn: (index % GARAGE_GRID_COLUMNS) + 1,
                gridRow: Math.floor(index / GARAGE_GRID_COLUMNS) + 1,
              }}
            />
          ))}

          {dragState && (
            <div
              className={`pointer-events-none z-10 rounded-xl border-2 border-dashed ${
                dragState.isValid ? "border-cyan-300 bg-cyan-400/10" : "border-red-400 bg-red-500/10"
              }`}
              style={{
                gridColumn: `${dragState.targetColumn + 1} / span ${getSlotVisualSize(dragState.slotId, dragState.isRotated).width}`,
                gridRow: `${dragState.targetRow + 1} / span ${getSlotVisualSize(dragState.slotId, dragState.isRotated).height}`,
              }}
            />
          )}

          {slots.map((slot) => {
            const isBeingDragged = dragState?.slotId === slot.slotId;
            const isRotated = isBeingDragged ? dragState.isRotated : Boolean(slot.isRotated);
            const width = isRotated ? slot.item.gridSize.height : slot.item.gridSize.width;
            const height = isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;
            const column = isBeingDragged ? dragState.targetColumn : slot.gridPosition?.column ?? 0;
            const row = isBeingDragged ? dragState.targetRow : slot.gridPosition?.row ?? 0;
            const isSelected = slot.slotId === selectedSlotId;

            return (
              <button
                key={slot.slotId}
                onPointerDown={(event) => handlePointerDown(event, slot.slotId)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragState(null)}
                className={`z-20 overflow-hidden rounded-xl border p-2 text-left shadow-lg transition-transform active:scale-[0.98] ${
                  isBeingDragged && dragState?.isValid === false
                    ? "border-red-400 bg-red-950/80"
                    : isSelected
                      ? "border-cyan-300 bg-cyan-950/80"
                      : "border-zinc-700 bg-zinc-950"
                }`}
                style={{
                  gridColumn: `${column + 1} / span ${width}`,
                  gridRow: `${row + 1} / span ${height}`,
                  opacity: isBeingDragged && dragState?.isValid === false ? 0.8 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] uppercase text-cyan-300">{slot.item.rarity}</p>
                  <p className="text-[10px] text-zinc-500">{width}x{height}</p>
                </div>
                <p className="mt-1 text-xs font-bold leading-tight text-zinc-100">{slot.item.name}</p>
                <p className="mt-1 text-[10px] text-zinc-500">{label(slot.item.type)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Drag items inside the grid. The preview turns cyan when the drop is valid and red when blocked. If the normal orientation does not fit, the item will auto-rotate when the rotated size fits.
        </p>
      </div>
    </div>
  );
}
