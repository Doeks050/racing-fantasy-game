import { createInitialGameState, type GameState } from "./GameState";

export type SaveAdapter = {
  load: () => GameState | null;
  save: (state: GameState) => void;
  clear: () => void;
};

export type AsyncSaveAdapter = {
  load: () => Promise<GameState | null>;
  save: (state: GameState) => Promise<void>;
  clear: () => Promise<void>;
};

export const LOCAL_SAVE_KEY = "racing_fantasy_game_state_v1";

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "version" in value && "player" in value && "garage" in value && "race" in value;
}

export function migrateGameState(savedState: GameState): GameState {
  const defaultState = createInitialGameState();

  return {
    ...defaultState,
    ...savedState,
    player: {
      ...defaultState.player,
      ...savedState.player,
    },
    garage: {
      ...defaultState.garage,
      ...savedState.garage,
      inventorySlots: savedState.garage?.inventorySlots ?? defaultState.garage.inventorySlots,
      ownedDriverIds: savedState.garage?.ownedDriverIds ?? defaultState.garage.ownedDriverIds,
      ownedStaffIds: savedState.garage?.ownedStaffIds ?? defaultState.garage.ownedStaffIds,
      ownedPartIds: savedState.garage?.ownedPartIds ?? defaultState.garage.ownedPartIds,
    },
    race: {
      ...defaultState.race,
      ...savedState.race,
      currentCircuitId: defaultState.race.currentCircuitId,
      currentWeekendId: defaultState.race.currentWeekendId,
      activeLoadout: {
        ...defaultState.race.activeLoadout,
        ...savedState.race?.activeLoadout,
        car1: {
          ...defaultState.race.activeLoadout.car1,
          ...savedState.race?.activeLoadout?.car1,
          parts: {
            ...defaultState.race.activeLoadout.car1.parts,
            ...savedState.race?.activeLoadout?.car1?.parts,
          },
        },
        car2: {
          ...defaultState.race.activeLoadout.car2,
          ...savedState.race?.activeLoadout?.car2,
          parts: {
            ...defaultState.race.activeLoadout.car2.parts,
            ...savedState.race?.activeLoadout?.car2?.parts,
          },
        },
        team: {
          ...defaultState.race.activeLoadout.team,
          ...savedState.race?.activeLoadout?.team,
        },
      },
    },
    economy: {
      ...defaultState.economy,
      ...savedState.economy,
      marketListingIds: savedState.economy?.marketListingIds ?? defaultState.economy.marketListingIds,
      activeSponsorIds: savedState.economy?.activeSponsorIds ?? defaultState.economy.activeSponsorIds,
      pendingRewardIds: savedState.economy?.pendingRewardIds ?? defaultState.economy.pendingRewardIds,
    },
    progression: {
      ...defaultState.progression,
      ...savedState.progression,
      completedRaceWeekendIds:
        savedState.progression?.completedRaceWeekendIds ?? defaultState.progression.completedRaceWeekendIds,
      unlockedFeatureIds: savedState.progression?.unlockedFeatureIds ?? defaultState.progression.unlockedFeatureIds,
    },
    updatedAt: new Date().toISOString(),
  };
}

export const LocalStorageSaveAdapter: SaveAdapter = {
  load() {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(LOCAL_SAVE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      return isGameState(parsed) ? migrateGameState(parsed) : null;
    } catch {
      return null;
    }
  },

  save(state) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(state));
  },

  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(LOCAL_SAVE_KEY);
  },
};

export const SaveEngine = {
  createDefaultState(): GameState {
    return createInitialGameState();
  },

  load(adapter: SaveAdapter = LocalStorageSaveAdapter): GameState {
    return adapter.load() ?? createInitialGameState();
  },

  save(state: GameState, adapter: SaveAdapter = LocalStorageSaveAdapter) {
    adapter.save(state);
  },

  clear(adapter: SaveAdapter = LocalStorageSaveAdapter) {
    adapter.clear();
  },

  async loadAsync(adapter: AsyncSaveAdapter): Promise<GameState> {
    const savedState = await adapter.load();

    return savedState ? migrateGameState(savedState) : createInitialGameState();
  },

  async saveAsync(state: GameState, adapter: AsyncSaveAdapter) {
    await adapter.save(state);
  },

  async clearAsync(adapter: AsyncSaveAdapter) {
    await adapter.clear();
  },
};
