"use client";

import { create } from "zustand";
import { createInitialGameState, InventoryEngine, LoadoutEngine, MarketEngine, RaceWeekendEngine, SaveEngine, type GameState } from "@/engine";
import { RewardEngine } from "@/engine/RewardEngine";
import { starterGarageInventorySlots, starterOwnedPartIds } from "@/data/starter/starterGarage";
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
  confirmRaceLoadout: () => void;
  completeRaceWeekend: () => void;
  chooseRewardDraftOption: (rewardId: string) => void;
  placeGarageSlot: (params: { slotId: string; column: number; row: number; isRotated: boolean }) => void;
  moveGarageSlot: (params: { slotId: string; column: number; row: number }) => void;
  rotateGarageSlot: (params: { slotId: string }) => void;
  resetGameState: () => void;
};

function withAutosave(state: GameState) {
  SaveEngine.save(state);
  return state;
}

function createStarterState() {
  const nextState = createInitialGameState();

  return {
    ...nextState,
    garage: {
      ...nextState.garage,
      inventorySlots: starterGarageInventorySlots,
      ownedPartIds: starterOwnedPartIds,
    },
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createStarterState(),
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

  confirmRaceLoadout: () =>
    set((store) => ({
      gameState: withAutosave(RaceWeekendEngine.confirmRaceLoadout(store.gameState)),
    })),

  completeRaceWeekend: () =>
    set((store) => ({
      gameState: withAutosave(RaceWeekendEngine.completeRaceWeekend(store.gameState)),
    })),

  chooseRewardDraftOption: (rewardId) =>
    set((store) => ({
      gameState: withAutosave(RewardEngine.chooseReward(store.gameState, rewardId)),
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
    const nextState = createStarterState();
    SaveEngine.save(nextState);
    set({ gameState: nextState });
  },
}));
