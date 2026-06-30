"use client";

import { create } from "zustand";
import { createInitialGameState, InventoryEngine, LoadoutEngine, MarketEngine, SaveEngine, type GameState } from "@/engine";
import type { CarPartType, TeamSlotType } from "@/types";

type CarId = "car1" | "car2";

type GameStore = {
  gameState: GameState;
  isLoadedFromSave: boolean;
  hydrateFromSave: () => void;
  saveGameState: () => void;
  clearSavedGameState: () => void;
  selectDriver: (params: { carId: CarId; driverId: string }) => void;
  equipCarPart: (params: { carId: CarId; slotType: CarPartType; inventorySlotId: string }) => void;
  equipTeamMember: (params: { slotType: TeamSlotType; memberId: string }) => void;
  setActiveMarketTrader: (traderId: string) => void;
  buyMarketListing: (listingId: string) => void;
  placeGarageSlot: (params: { slotId: string; column: number; row: number; isRotated: boolean }) => void;
  moveGarageSlot: (params: { slotId: string; column: number; row: number }) => void;
  rotateGarageSlot: (params: { slotId: string }) => void;
  resetGameState: () => void;
};

function withAutosave(state: GameState) {
  SaveEngine.save(state);
  return state;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialGameState(),
  isLoadedFromSave: false,

  hydrateFromSave: () =>
    set({
      gameState: SaveEngine.load(),
      isLoadedFromSave: true,
    }),

  saveGameState: () => SaveEngine.save(get().gameState),

  clearSavedGameState: () => SaveEngine.clear(),

  selectDriver: (params) =>
    set((store) => ({
      gameState: withAutosave(LoadoutEngine.selectDriver(store.gameState, params)),
    })),

  equipCarPart: (params) =>
    set((store) => ({
      gameState: withAutosave(LoadoutEngine.equipCarPart(store.gameState, params)),
    })),

  equipTeamMember: (params) =>
    set((store) => ({
      gameState: withAutosave(LoadoutEngine.equipTeamMember(store.gameState, params)),
    })),

  setActiveMarketTrader: (traderId) =>
    set((store) => ({
      gameState: withAutosave(MarketEngine.setActiveTrader(store.gameState, traderId)),
    })),

  buyMarketListing: (listingId) =>
    set((store) => ({
      gameState: withAutosave(MarketEngine.buyListing(store.gameState, listingId)),
    })),

  placeGarageSlot: (params) =>
    set((store) => ({
      gameState: withAutosave(InventoryEngine.placeGarageSlot(store.gameState, params)),
    })),

  moveGarageSlot: (params) =>
    set((store) => ({
      gameState: withAutosave(InventoryEngine.moveGarageSlot(store.gameState, params)),
    })),

  rotateGarageSlot: (params) =>
    set((store) => ({
      gameState: withAutosave(InventoryEngine.rotateGarageSlot(store.gameState, params)),
    })),

  resetGameState: () => {
    const nextState = createInitialGameState();
    SaveEngine.save(nextState);
    set({ gameState: nextState });
  },
}));
