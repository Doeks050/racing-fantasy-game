"use client";

import { create } from "zustand";
import { createInitialGameState, LoadoutEngine, type GameState } from "@/engine";
import type { CarPartType, TeamSlotType } from "@/types";

type CarId = "car1" | "car2";

type GameStore = {
  gameState: GameState;
  selectDriver: (params: { carId: CarId; driverId: string }) => void;
  equipCarPart: (params: { carId: CarId; slotType: CarPartType; partId: string }) => void;
  equipTeamMember: (params: { slotType: TeamSlotType; memberId: string }) => void;
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

  resetGameState: () => set({ gameState: createInitialGameState() }),
}));
