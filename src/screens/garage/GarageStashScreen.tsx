"use client";

import { useRef, useState, type PointerEvent } from "react";
import { GARAGE_GRID_COLUMNS, InventoryEngine, type HydratedGarageSlot } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

const CELL_HEIGHT_PX = 36;
const GRID_GAP_PX = 4;
const TAP_MOVE_THRESHOLD_PX = 8;

type DragState = {
  slotId: string;
  startX: number;
  startY: number;
  targetColumn: number;
  targetRow: number;
  isRotated: boolean;
  isValid: boolean;
  anchorColumn: number;
  anchorRow: number;
  didMove: boolean;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function itemSubtitle(slot: HydratedGarageSlot) {
  return slot.item.brand ? `${slot.item.brand} · ${label(slot.item.type)}` : label(slot.item.type);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function ItemImage({ imagePath, alt, large = false }: { imagePath?: string; alt: string; large?: boolean }) {
  if (!imagePath) {
    return null;
  }

  return (
    <div className={`${large ? "h-36" : "absolute inset-0"} flex items-center justify-center overflow-hidden rounded-md bg-black/25 p-1`}>
      <img src={imagePath} alt={alt} className="max-h-full max-w-full object-contain" draggable={false} />
    </div>
  );
}

function ItemFallback({ value }: { value: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-1">
      <span className="truncate text-[9px] font-black uppercase text-zinc-500">{value}</span>
    </div>
  );
}

function StatPill({ stat, value }: { stat: string; value: number }) {
  return (
    <div className="rounded-xl bg-zinc-950 p-2">
      <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
      <p className="text-sm font-bold text-zinc-100">{value > 0 ? `+${value}` : value}</p>
    </div>
  );
}

function ItemInfoSheet({ slot, onClose }: { slot: HydratedGarageSlot; onClose: () => void }) {
  const width = slot.isRotated ? slot.item.gridSize.height : slot.item.gridSize.width;
  const height = slot.isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-3 pb-3">
      <button className="absolute inset-0" aria-label="Close item info" onClick={onClose} />

      <section className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-zinc-950 p-4 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-zinc-700" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{slot.item.rarity}</p>
            <h3 className="mt-1 text-2xl font-black text-zinc-100">{slot.item.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{itemSubtitle(slot)}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-zinc-300 active:scale-95"
          >
            Close
          </button>
        </div>

        {slot.item.imagePath && (
          <div className="mt-4">
            <ItemImage imagePath={slot.item.imagePath} alt={slot.item.name} large />
          </div>
        )}

        <p className="mt-4 text-sm leading-6 text-zinc-300">{slot.item.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Value</p>
            <p className="font-black text-cyan-300">{slot.item.value}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Grid</p>
            <p className="font-black text-cyan-300">{width}x{height}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Rotation</p>
            <p className="font-black text-cyan-300">{slot.isRotated ? "Rotated" : "Default"}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(slot.item.stats).map(([stat, value]) => (
            <StatPill key={stat} stat={stat} value={value ?? 0} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function GarageStashScreen() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [infoSlotId, setInfoSlotId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const gameState = useGameStore((store) => store.gameState);
  const placeGarageSlot = useGameStore((store) => store.placeGarageSlot);
  const slots = InventoryEngine.getHydratedStashSlots(gameState);
  const rowCount = InventoryEngine.getGridRowCount(slots);
  const infoSlot = slots.find((slot) => slot.slotId === infoSlotId) ?? null;

  function getGridMetrics() {
    const grid = gridRef.current;

    if (!grid) {
      return null;
    }

    const rect = grid.getBoundingClientRect();
    const cellWidth = (rect.width - GRID_GAP_PX * (GARAGE_GRID_COLUMNS - 1)) / GARAGE_GRID_COLUMNS;

    return {
      rect,
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

  function buildDragState(
    slotId: string,
    clientX: number,
    clientY: number,
    anchorColumn: number,
    anchorRow: number,
    startX: number,
    startY: number,
  ) {
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
    const didMove = Math.hypot(clientX - startX, clientY - startY) > TAP_MOVE_THRESHOLD_PX;
    const currentFits = InventoryEngine.canPlaceGarageSlot(gameState, {
      slotId,
      column: currentColumn,
      row: currentRow,
      isRotated: currentRotation,
    });

    if (currentFits) {
      return {
        slotId,
        startX,
        startY,
        targetColumn: currentColumn,
        targetRow: currentRow,
        isRotated: currentRotation,
        isValid: true,
        anchorColumn,
        anchorRow,
        didMove,
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
      startX,
      startY,
      targetColumn: rotatedFits ? rotatedColumn : currentColumn,
      targetRow: rotatedFits ? rotatedRow : currentRow,
      isRotated: rotatedFits ? !currentRotation : currentRotation,
      isValid: rotatedFits,
      anchorColumn,
      anchorRow,
      didMove,
    } satisfies DragState;
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, slotId: string) {
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
      startX: event.clientX,
      startY: event.clientY,
      targetColumn: slot.gridPosition.column,
      targetRow: slot.gridPosition.row,
      isRotated: Boolean(slot.isRotated),
      isValid: true,
      anchorColumn,
      anchorRow,
      didMove: false,
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragState) {
      return;
    }

    const nextDragState = buildDragState(
      dragState.slotId,
      event.clientX,
      event.clientY,
      dragState.anchorColumn,
      dragState.anchorRow,
      dragState.startX,
      dragState.startY,
    );

    if (nextDragState) {
      setDragState(nextDragState);
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!dragState) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragState.didMove) {
      if (dragState.isValid) {
        placeGarageSlot({
          slotId: dragState.slotId,
          column: dragState.targetColumn,
          row: dragState.targetRow,
          isRotated: dragState.isRotated,
        });
      }
    } else {
      setInfoSlotId(dragState.slotId);
    }

    setDragState(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Storage Grid</p>
        <h2 className="mt-1 text-2xl font-black">Garage Stash</h2>
        <p className="mt-1 text-sm text-zinc-500">Equipped car parts are mounted on the cars and hidden from stash.</p>
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
              className="rounded-md border border-zinc-800/80 bg-zinc-950/50"
              style={{
                gridColumn: (index % GARAGE_GRID_COLUMNS) + 1,
                gridRow: Math.floor(index / GARAGE_GRID_COLUMNS) + 1,
              }}
            />
          ))}

          {slots.length === 0 && (
            <div className="pointer-events-none z-10 col-span-10 row-span-3 flex items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-4 text-center">
              <div>
                <p className="text-sm font-black text-zinc-300">Stash is empty</p>
                <p className="mt-1 text-xs text-zinc-500">All starter parts are currently mounted on your cars.</p>
              </div>
            </div>
          )}

          {dragState?.didMove && (
            <div
              className={`pointer-events-none z-10 rounded-md border-2 border-dashed ${
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
            const showName = width > 1 || height > 1;

            return (
              <button
                key={slot.slotId}
                title={slot.item.name}
                onPointerDown={(event) => handlePointerDown(event, slot.slotId)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragState(null)}
                className={`relative z-20 overflow-hidden rounded-md border text-left shadow-lg transition-transform active:scale-[0.98] ${
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
                <ItemImage imagePath={slot.item.imagePath} alt={slot.item.name} />
                {!slot.item.imagePath && <ItemFallback value={label(slot.item.type).slice(0, 3)} />}
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
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Tap a stored item to open details. Drag stored items inside the grid to move them. Mounted car parts are managed from Loadout.
        </p>
      </div>

      {infoSlot && <ItemInfoSheet slot={infoSlot} onClose={() => setInfoSlotId(null)} />}
    </div>
  );
}
