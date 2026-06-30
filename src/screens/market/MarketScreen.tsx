"use client";

import { MARKET_GRID_COLUMNS, MarketEngine } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

const CELL_HEIGHT_PX = 58;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MarketScreen() {
  const gameState = useGameStore((store) => store.gameState);
  const setActiveMarketTrader = useGameStore((store) => store.setActiveMarketTrader);
  const traders = MarketEngine.getTraders();
  const activeTrader = MarketEngine.getActiveTrader(gameState);
  const listings = MarketEngine.getHydratedListingsForTrader(gameState, activeTrader.id);
  const rowCount = MarketEngine.getGridRowCount(listings);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Trader Market</p>
        <h2 className="mt-1 text-2xl font-black">Market</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {traders.map((trader) => {
          const isActive = trader.id === activeTrader.id;

          return (
            <button
              key={trader.id}
              onClick={() => setActiveMarketTrader(trader.id)}
              className={`min-w-36 rounded-2xl border p-3 text-left active:scale-[0.98] ${
                isActive
                  ? "border-cyan-300 bg-cyan-950/50 text-cyan-100"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{trader.categoryLabel}</p>
              <h3 className="mt-1 text-sm font-black">{trader.name}</h3>
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-cyan-500/20 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{activeTrader.categoryLabel}</p>
        <h3 className="mt-1 text-xl font-black">{activeTrader.name}</h3>
        <p className="mt-2 text-sm text-zinc-400">{activeTrader.description}</p>
      </section>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-2">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${MARKET_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)`,
          }}
        >
          {Array.from({ length: MARKET_GRID_COLUMNS * rowCount }).map((_, index) => (
            <div
              key={`market-cell-${index}`}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950/50"
              style={{
                gridColumn: (index % MARKET_GRID_COLUMNS) + 1,
                gridRow: Math.floor(index / MARKET_GRID_COLUMNS) + 1,
              }}
            />
          ))}

          {listings.map((listing) => {
            const width = listing.isRotated ? listing.item.gridSize.height : listing.item.gridSize.width;
            const height = listing.isRotated ? listing.item.gridSize.width : listing.item.gridSize.height;

            return (
              <button
                key={listing.id}
                className="z-10 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-left shadow-lg active:scale-[0.98]"
                style={{
                  gridColumn: `${listing.gridPosition.column + 1} / span ${width}`,
                  gridRow: `${listing.gridPosition.row + 1} / span ${height}`,
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] uppercase text-cyan-300">{listing.item.rarity}</p>
                  <p className="text-[10px] text-zinc-500">x{listing.stock}</p>
                </div>
                <p className="mt-1 text-xs font-bold leading-tight text-zinc-100">{listing.item.name}</p>
                <p className="mt-1 text-[10px] text-zinc-500">{label(listing.item.type)}</p>
                <p className="mt-1 text-[10px] font-black text-cyan-300">{listing.price} cr</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Market uses the same 6-column grid concept as Garage Stash. Each trader owns categories of parts, so players shop by specialist instead of one flat market list.
        </p>
      </div>
    </div>
  );
}
