import { carParts, drivers, marketListings, marketTraders } from "@/data";
import type { CarPart, Driver, GridSize, MarketListing, MarketTrader } from "@/types";
import type { GameInventorySlot, GameState } from "./GameState";

export const MARKET_GRID_COLUMNS = 6;
export const MARKET_MIN_ROWS = 6;
const GARAGE_GRID_COLUMNS = 10;
const GARAGE_SCAN_ROWS = 60;

type HydratedCarPartListing = MarketListing & {
  kind: "car_part";
  trader: MarketTrader;
  item: CarPart;
};

type HydratedDriverListing = MarketListing & {
  kind: "driver";
  trader: MarketTrader;
  item: Driver;
};

export type HydratedMarketListing = HydratedCarPartListing | HydratedDriverListing;

type GridRect = {
  column: number;
  row: number;
  width: number;
  height: number;
};

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

function getDefaultTraderId() {
  return marketTraders[0]?.id ?? "";
}

function getActiveListingIds(state: GameState) {
  return state.economy.marketListingIds.length
    ? state.economy.marketListingIds
    : marketListings.map((listing) => listing.id);
}

function doRectanglesOverlap(a: GridRect, b: GridRect) {
  return !(
    a.column + a.width <= b.column ||
    b.column + b.width <= a.column ||
    a.row + a.height <= b.row ||
    b.row + b.height <= a.row
  );
}

function getGarageSlotItem(slot: GameInventorySlot) {
  return carParts.find((part) => part.id === slot.entityId);
}

function getGarageSlotSize(slot: GameInventorySlot, item: CarPart): GridSize {
  return slot.isRotated
    ? { width: item.gridSize.height, height: item.gridSize.width }
    : item.gridSize;
}

function canPlaceGarageItem(state: GameState, params: { column: number; row: number; size: GridSize }) {
  const movingRect: GridRect = {
    column: params.column,
    row: params.row,
    width: params.size.width,
    height: params.size.height,
  };

  if (
    movingRect.column < 0 ||
    movingRect.row < 0 ||
    movingRect.column + movingRect.width > GARAGE_GRID_COLUMNS
  ) {
    return false;
  }

  return state.garage.inventorySlots.every((slot) => {
    if (!slot.gridPosition) {
      return true;
    }

    const item = getGarageSlotItem(slot);

    if (!item) {
      return true;
    }

    const size = getGarageSlotSize(slot, item);
    const rect: GridRect = {
      column: slot.gridPosition.column,
      row: slot.gridPosition.row,
      width: size.width,
      height: size.height,
    };

    return !doRectanglesOverlap(movingRect, rect);
  });
}

function findFirstGaragePosition(state: GameState, item: CarPart) {
  for (let row = 0; row < GARAGE_SCAN_ROWS; row += 1) {
    for (let column = 0; column < GARAGE_GRID_COLUMNS; column += 1) {
      if (canPlaceGarageItem(state, { column, row, size: item.gridSize })) {
        return { column, row, isRotated: false };
      }

      const rotatedSize = { width: item.gridSize.height, height: item.gridSize.width };

      if (canPlaceGarageItem(state, { column, row, size: rotatedSize })) {
        return { column, row, isRotated: true };
      }
    }
  }

  return null;
}

function createInventorySlotId(listingId: string) {
  return `slot_${listingId}_${Date.now()}`;
}

export const MarketEngine = {
  getTraders(): MarketTrader[] {
    return marketTraders;
  },

  getActiveTrader(state: GameState): MarketTrader {
    return (
      marketTraders.find((trader) => trader.id === state.economy.activeMarketTraderId) ??
      marketTraders[0]
    );
  },

  setActiveTrader(state: GameState, traderId: string): GameState {
    const traderExists = marketTraders.some((trader) => trader.id === traderId);

    if (!traderExists) {
      return state;
    }

    return touch({
      ...state,
      economy: {
        ...state.economy,
        activeMarketTraderId: traderId,
      },
    });
  },

  getHydratedListingsForTrader(state: GameState, traderId = state.economy.activeMarketTraderId): HydratedMarketListing[] {
    const resolvedTraderId = traderId || getDefaultTraderId();
    const activeListingIds = getActiveListingIds(state);

    return marketListings
      .filter((listing) => activeListingIds.includes(listing.id))
      .filter((listing) => listing.traderId === resolvedTraderId)
      .filter((listing) => listing.kind !== "driver" || !state.garage.ownedDriverIds.includes(listing.itemId))
      .map((listing) => {
        const trader = marketTraders.find((candidate) => candidate.id === listing.traderId);

        if (!trader) {
          return undefined;
        }

        if (listing.kind === "driver") {
          const item = drivers.find((candidate) => candidate.id === listing.itemId);

          if (!item) {
            return undefined;
          }

          return {
            ...listing,
            kind: "driver" as const,
            trader,
            item,
          };
        }

        const item = carParts.find((candidate) => candidate.id === listing.itemId);

        if (!item) {
          return undefined;
        }

        return {
          ...listing,
          kind: "car_part" as const,
          trader,
          item,
        };
      })
      .filter((listing): listing is HydratedMarketListing => Boolean(listing));
  },

  getGridRowCount(listings: HydratedMarketListing[]): number {
    const occupiedRows = listings.reduce((maxRow, listing) => {
      const height = listing.isRotated ? listing.item.gridSize.width : listing.item.gridSize.height;
      return Math.max(maxRow, listing.gridPosition.row + height);
    }, 0);

    return Math.max(MARKET_MIN_ROWS, occupiedRows + 2);
  },

  buyListing(state: GameState, listingId: string): GameState {
    const activeListingIds = getActiveListingIds(state);
    const listing = marketListings.find((candidate) => candidate.id === listingId);

    if (!listing || !activeListingIds.includes(listingId) || state.player.credits < listing.price) {
      return state;
    }

    const nextEconomy = {
      ...state.economy,
      marketListingIds: activeListingIds.filter((id) => id !== listingId),
    };

    if (listing.kind === "driver") {
      if (state.garage.ownedDriverIds.includes(listing.itemId)) {
        return state;
      }

      return touch({
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits - listing.price,
        },
        garage: {
          ...state.garage,
          ownedDriverIds: [...state.garage.ownedDriverIds, listing.itemId],
        },
        economy: nextEconomy,
      });
    }

    const item = carParts.find((candidate) => candidate.id === listing.itemId);

    if (!item) {
      return state;
    }

    const position = findFirstGaragePosition(state, item);

    if (!position) {
      return state;
    }

    const inventorySlot: GameInventorySlot = {
      slotId: createInventorySlotId(listing.id),
      entityId: item.id,
      quantity: 1,
      gridPosition: {
        column: position.column,
        row: position.row,
      },
      isRotated: position.isRotated,
    };

    return touch({
      ...state,
      player: {
        ...state.player,
        credits: state.player.credits - listing.price,
      },
      garage: {
        ...state.garage,
        inventorySlots: [...state.garage.inventorySlots, inventorySlot],
        ownedPartIds: state.garage.ownedPartIds.includes(item.id)
          ? state.garage.ownedPartIds
          : [...state.garage.ownedPartIds, item.id],
      },
      economy: nextEconomy,
    });
  },
};
