import { carParts, marketListings, marketTraders } from "@/data";
import type { CarPart, MarketListing, MarketTrader } from "@/types";
import type { GameState } from "./GameState";

export const MARKET_GRID_COLUMNS = 6;
export const MARKET_MIN_ROWS = 6;

export type HydratedMarketListing = MarketListing & {
  trader: MarketTrader;
  item: CarPart;
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
    const activeListingIds = state.economy.marketListingIds.length
      ? state.economy.marketListingIds
      : marketListings.map((listing) => listing.id);

    return marketListings
      .filter((listing) => activeListingIds.includes(listing.id))
      .filter((listing) => listing.traderId === resolvedTraderId)
      .map((listing) => {
        const trader = marketTraders.find((candidate) => candidate.id === listing.traderId);
        const item = carParts.find((candidate) => candidate.id === listing.itemId);

        if (!trader || !item) {
          return undefined;
        }

        return {
          ...listing,
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
};
