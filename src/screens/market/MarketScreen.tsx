"use client";

import { useState } from "react";
import { MARKET_GRID_COLUMNS, MarketEngine, type HydratedMarketListing } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

const CELL_HEIGHT_PX = 58;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function listingTypeLabel(listing: HydratedMarketListing) {
  if (listing.kind === "driver") {
    return "Driver";
  }

  return label(listing.item.type);
}

function StatPill({ stat, value }: { stat: string; value: number }) {
  return (
    <div className="rounded-xl bg-zinc-950 p-2">
      <p className="text-[10px] uppercase text-zinc-500">{label(stat)}</p>
      <p className="text-sm font-bold text-zinc-100">{value > 0 ? `+${value}` : value}</p>
    </div>
  );
}

function MarketItemInfoSheet({ listing, onClose }: { listing: HydratedMarketListing; onClose: () => void }) {
  const width = listing.isRotated ? listing.item.gridSize.height : listing.item.gridSize.width;
  const height = listing.isRotated ? listing.item.gridSize.width : listing.item.gridSize.height;
  const description = listing.kind === "car_part" ? listing.item.description : "Driver contract available through the Driver Agency.";
  const stats = listing.kind === "car_part" ? listing.item.stats : listing.item.stats;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-3 pb-3">
      <button className="absolute inset-0" aria-label="Close market item info" onClick={onClose} />

      <section className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-zinc-950 p-4 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-zinc-700" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{listing.trader.name}</p>
            <h3 className="mt-1 text-2xl font-black text-zinc-100">{listing.item.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{listingTypeLabel(listing)} · {listing.item.rarity}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-zinc-300 active:scale-95"
          >
            Close
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-zinc-300">{description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Price</p>
            <p className="font-black text-cyan-300">{listing.price}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Stock</p>
            <p className="font-black text-cyan-300">{listing.stock}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Grid</p>
            <p className="font-black text-cyan-300">{width}x{height}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(stats).map(([stat, value]) => (
            <StatPill key={stat} stat={stat} value={value ?? 0} />
          ))}
        </div>

        <button className="mt-4 w-full rounded-2xl bg-cyan-400 px-4 py-4 font-black text-zinc-950 active:scale-[0.98]">
          Buy for {listing.price} credits
        </button>
      </section>
    </div>
  );
}

export function MarketScreen() {
  const [infoListingId, setInfoListingId] = useState<string | null>(null);
  const gameState = useGameStore((store) => store.gameState);
  const setActiveMarketTrader = useGameStore((store) => store.setActiveMarketTrader);
  const traders = MarketEngine.getTraders();
  const activeTrader = MarketEngine.getActiveTrader(gameState);
  const listings = MarketEngine.getHydratedListingsForTrader(gameState, activeTrader.id);
  const rowCount = MarketEngine.getGridRowCount(listings);
  const infoListing = listings.find((listing) => listing.id === infoListingId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Trader Market</p>
        <h2 className="mt-1 text-2xl font-black">Market</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {traders.map((trader) => {
          const isActive = trader.id === activeTrader.id;

          return (
            <button
              key={trader.id}
              onClick={() => {
                setInfoListingId(null);
                setActiveMarketTrader(trader.id);
              }}
              className={`rounded-2xl border p-3 text-left active:scale-[0.98] ${
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
            const typeLabel = listingTypeLabel(listing);

            return (
              <button
                key={listing.id}
                onClick={() => setInfoListingId(listing.id)}
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
                <p className="mt-1 text-[10px] text-zinc-500">{typeLabel}</p>
                <p className="mt-1 text-[10px] font-black text-cyan-300">{listing.price} cr</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400">
          Tap a market item to open info. Buy flow will be connected through MarketEngine, so purchases update credits and Garage Stash safely.
        </p>
      </div>

      {infoListing && <MarketItemInfoSheet listing={infoListing} onClose={() => setInfoListingId(null)} />}
    </div>
  );
}
