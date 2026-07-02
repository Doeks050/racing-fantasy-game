"use client";

import { useState } from "react";
import { MARKET_GRID_COLUMNS, MarketEngine, type HydratedMarketListing } from "@/engine";
import { useGameStore } from "@/store/useGameStore";

const CELL_HEIGHT_PX = 36;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function listingSubtitle(listing: HydratedMarketListing) {
  if (listing.kind === "driver") {
    return "Driver";
  }

  return listing.item.brand ? `${listing.item.brand} · ${label(listing.item.type)}` : label(listing.item.type);
}

function getListingImagePath(listing: HydratedMarketListing) {
  return listing.kind === "car_part" ? listing.item.imagePath : undefined;
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

function MarketItemInfoSheet({
  listing,
  credits,
  onBuy,
  onClose,
}: {
  listing: HydratedMarketListing;
  credits: number;
  onBuy: (listingId: string) => void;
  onClose: () => void;
}) {
  const width = listing.isRotated ? listing.item.gridSize.height : listing.item.gridSize.width;
  const height = listing.isRotated ? listing.item.gridSize.width : listing.item.gridSize.height;
  const description = listing.kind === "car_part" ? listing.item.description : "Driver contract available through the Driver Agency.";
  const stats = listing.kind === "car_part" ? listing.item.stats : listing.item.stats;
  const canAfford = credits >= listing.price;
  const imagePath = getListingImagePath(listing);

  function handleBuy() {
    if (!canAfford) return;

    onBuy(listing.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-3 pb-3">
      <button className="absolute inset-0" aria-label="Close market item info" onClick={onClose} />

      <section className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-950 p-4 shadow-2xl shadow-black">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-zinc-700" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">{listing.trader.name}</p>
            <h3 className="mt-1 text-2xl font-black text-zinc-100">{listing.item.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{listingSubtitle(listing)} · {listing.item.rarity}</p>
          </div>

          <button onClick={onClose} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-zinc-300 active:scale-95">
            Close
          </button>
        </div>

        {imagePath && <div className="mt-4"><ItemImage imagePath={imagePath} alt={listing.item.name} large /></div>}

        <p className="mt-4 text-sm leading-6 text-zinc-300">{description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Price</p>
            <p className="font-black text-red-300">{listing.price}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Your Credits</p>
            <p className="font-black text-red-300">{credits}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-[10px] uppercase text-zinc-500">Grid</p>
            <p className="font-black text-red-300">{width}x{height}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(stats).map(([stat, value]) => (
            <StatPill key={stat} stat={stat} value={value ?? 0} />
          ))}
        </div>

        <button
          onClick={handleBuy}
          disabled={!canAfford}
          className={`mt-4 w-full rounded-md px-4 py-3 font-black active:scale-[0.98] ${canAfford ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-500"}`}
        >
          {canAfford ? `Buy for ${listing.price} credits` : "Not enough credits"}
        </button>
      </section>
    </div>
  );
}

export function MarketScreen() {
  const [infoListingId, setInfoListingId] = useState<string | null>(null);
  const gameState = useGameStore((store) => store.gameState);
  const setActiveMarketTrader = useGameStore((store) => store.setActiveMarketTrader);
  const buyMarketListing = useGameStore((store) => store.buyMarketListing);
  const traders = MarketEngine.getTraders();
  const activeTrader = MarketEngine.getActiveTrader(gameState);
  const listings = MarketEngine.getHydratedListingsForTrader(gameState, activeTrader.id);
  const rowCount = MarketEngine.getGridRowCount(listings);
  const infoListing = listings.find((listing) => listing.id === infoListingId) ?? null;

  return (
    <div className="grid gap-3 pb-4">
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Trader Market</p>
          <h2 className="mt-0.5 text-2xl font-black text-zinc-50">Market</h2>
        </div>
        <div className="rounded-md border border-yellow-500/30 bg-yellow-950/20 px-2 py-1 text-[10px] font-black text-yellow-300">
          ◉ {gameState.player.credits}
        </div>
      </div>

      <div className="grid grid-cols-4 overflow-hidden rounded-md border border-white/10 bg-black/40 shadow-lg shadow-black/20">
        {traders.map((trader) => {
          const isActive = trader.id === activeTrader.id;

          return (
            <button
              key={trader.id}
              onClick={() => {
                setInfoListingId(null);
                setActiveMarketTrader(trader.id);
              }}
              className={`h-9 border-b px-1.5 text-left active:scale-[0.98] ${
                isActive
                  ? "border-red-500 bg-red-950/15 text-zinc-100"
                  : "border-transparent bg-zinc-950/40 text-zinc-500"
              }`}
            >
              <p className="truncate text-[8px] font-black uppercase tracking-[0.12em]">{trader.categoryLabel}</p>
            </button>
          );
        })}
      </div>

      <section className="rounded-md border border-white/10 bg-zinc-950/85 p-2 shadow-lg shadow-black/20">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-red-400">{activeTrader.categoryLabel}</p>
            <h3 className="truncate text-sm font-black uppercase text-zinc-100">{activeTrader.name}</h3>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.12em] text-zinc-500">{listings.length} listings</p>
        </div>
        <p className="mt-1 truncate text-[10px] font-bold text-zinc-500">{activeTrader.description}</p>
      </section>

      <section className="rounded-lg border border-white/10 bg-zinc-950/85 p-2 shadow-lg shadow-black/25">
        <div
          className="relative grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${MARKET_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)`,
          }}
        >
          {Array.from({ length: MARKET_GRID_COLUMNS * rowCount }).map((_, index) => (
            <div
              key={`market-cell-${index}`}
              className="rounded-md border border-zinc-800/80 bg-zinc-950/50"
              style={{
                gridColumn: (index % MARKET_GRID_COLUMNS) + 1,
                gridRow: Math.floor(index / MARKET_GRID_COLUMNS) + 1,
              }}
            />
          ))}

          {listings.length === 0 && (
            <div className="pointer-events-none z-10 col-span-6 row-span-3 flex items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-4 text-center">
              <div>
                <p className="text-sm font-black text-zinc-300">No available listings</p>
                <p className="mt-1 text-xs text-zinc-500">This trader has nothing left to sell right now.</p>
              </div>
            </div>
          )}

          {listings.map((listing) => {
            const width = listing.isRotated ? listing.item.gridSize.height : listing.item.gridSize.width;
            const height = listing.isRotated ? listing.item.gridSize.width : listing.item.gridSize.height;
            const typeLabel = listingSubtitle(listing);
            const imagePath = getListingImagePath(listing);
            const showName = width > 1 || height > 1;
            const fallbackLabel = listing.kind === "driver" ? "DRV" : label(listing.item.type).slice(0, 3);

            return (
              <button
                key={listing.id}
                title={listing.item.name}
                onClick={() => setInfoListingId(listing.id)}
                className="relative z-20 overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 text-left shadow-lg transition-transform active:scale-[0.98]"
                style={{
                  gridColumn: `${listing.gridPosition.column + 1} / span ${width}`,
                  gridRow: `${listing.gridPosition.row + 1} / span ${height}`,
                }}
              >
                <ItemImage imagePath={imagePath} alt={listing.item.name} />
                {!imagePath && <ItemFallback value={fallbackLabel} />}
                {showName && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 px-1 py-0.5">
                    <div className="grid grid-cols-[1fr_auto] gap-1">
                      <p className="truncate text-[9px] font-bold leading-tight text-zinc-100">{listing.item.name}</p>
                      <p className="text-[8px] font-black text-red-300">{listing.price}</p>
                    </div>
                    <p className="truncate text-[8px] text-zinc-500">{typeLabel}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <p className="rounded-md border border-zinc-800 bg-black/35 p-2 text-[10px] font-bold text-zinc-500">
        Buy an item to remove that listing from the trader and add it as a separate non-stacked item.
      </p>

      {infoListing && (
        <MarketItemInfoSheet
          listing={infoListing}
          credits={gameState.player.credits}
          onBuy={buyMarketListing}
          onClose={() => setInfoListingId(null)}
        />
      )}
    </div>
  );
}
