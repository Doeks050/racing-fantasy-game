"use client";

import { create } from "zustand";
import { createInitialGameState, InventoryEngine, LoadoutEngine, type GameState } from "@/engine";
import type { CarPartType, TeamSlotType } from "@/types";

type CarId = "car1" | "car2";

type GameStore = {
  gameState: GameState;
  selectDriver: (params: { carId: CarId; driverId: string }) => void;
  equipCarPart: (params: { carId: CarId; slotType: CarPartType; partId: string }) => void;
  equipTeamMember: (params: { slotType: TeamSlotType; memberId: string }) => void;
  moveGarageSlot: (params: { slotId: string; column: number; row: number }) => void;
  rotateGarageSlot: (params: { slotId: string }) => void;
  resetGameState: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialGameState(),

  selectDriver: (params) =>
    set((store) => ({
      gameState: LoadoutEngine.selectDriver(store.gameState, params),
    })),

  equipCarPart: (params) =>
    set((store) => ({
      gameState: LoadoutEngine.equipCarPart(store.gameState, params),
    })),

  equipTeamMember: (params) =>
    set((store) => ({
      gameState: LoadoutEngine.equipTeamMember(store.gameState, params),
    })),

  moveGarageSlot: (params) =>
    set((store) => ({
      gameState: InventoryEngine.moveGarageSlot(store.gameState, params),
    })),

  rotateGarageSlot: (params) =>
    set((store) => ({
      gameState: InventoryEngine.rotateGarageSlot(store.gameState, params),
    })),

  resetGameState: () => set({ gameState: createInitialGameState() }),
}));
