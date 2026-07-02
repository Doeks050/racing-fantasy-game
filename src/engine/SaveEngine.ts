import { carParts } from "@/data";
import type { CarLoadout, CarPartType, RaceLoadout } from "@/types";
import { createInitialGameState, type GameInventorySlot, type GameState } from "./GameState";

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

const requiredCarPartSlots: CarPartType[] = [
  "chassis",
  "engine",
  "gearbox",
  "suspension",
  "front_wing",
  "rear_wing",
  "floor",
  "brakes",
];

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "version" in value && "player" in value && "garage" in value && "race" in value;
}

function mergeInventorySlots(defaultSlots: GameInventorySlot[], savedSlots: GameInventorySlot[] | undefined) {
  const mergedSlots = [...(savedSlots ?? [])];
  const existingSlotIds = new Set(mergedSlots.map((slot) => slot.slotId));

  defaultSlots.forEach((slot) => {
    if (!existingSlotIds.has(slot.slotId)) {
      mergedSlots.push(slot);
    }
  });

  return mergedSlots;
}

function isValidPartSlot(slotId: string | undefined, slotType: CarPartType, inventorySlots: GameInventorySlot[]) {
  const inventorySlot = inventorySlots.find((slot) => slot.slotId === slotId);
  const part = carParts.find((candidate) => candidate.id === inventorySlot?.entityId);

  return Boolean(inventorySlot && part?.type === slotType);
}

function repairCarLoadout(
  savedCar: CarLoadout | undefined,
  defaultCar: CarLoadout,
  inventorySlots: GameInventorySlot[],
  usedSlotIds: Set<string>,
): CarLoadout {
  const repairedParts: CarLoadout["parts"] = {};

  requiredCarPartSlots.forEach((slotType) => {
    const savedSlotId = savedCar?.parts?.[slotType];
    const defaultSlotId = defaultCar.parts[slotType];

    if (savedSlotId && !usedSlotIds.has(savedSlotId) && isValidPartSlot(savedSlotId, slotType, inventorySlots)) {
      repairedParts[slotType] = savedSlotId;
      usedSlotIds.add(savedSlotId);
      return;
    }

    if (defaultSlotId && !usedSlotIds.has(defaultSlotId) && isValidPartSlot(defaultSlotId, slotType, inventorySlots)) {
      repairedParts[slotType] = defaultSlotId;
      usedSlotIds.add(defaultSlotId);
    }
  });

  return {
    ...defaultCar,
    ...savedCar,
    parts: repairedParts,
  };
}

function repairRaceLoadout(
  savedLoadout: RaceLoadout | undefined,
  defaultLoadout: RaceLoadout,
  inventorySlots: GameInventorySlot[],
): RaceLoadout {
  const usedSlotIds = new Set<string>();

  return {
    ...defaultLoadout,
    ...savedLoadout,
    car1: repairCarLoadout(savedLoadout?.car1, defaultLoadout.car1, inventorySlots, usedSlotIds),
    car2: repairCarLoadout(savedLoadout?.car2, defaultLoadout.car2, inventorySlots, usedSlotIds),
    team: {
      ...defaultLoadout.team,
      ...savedLoadout?.team,
    },
  };
}

export function migrateGameState(savedState: GameState): GameState {
  const defaultState = createInitialGameState();
  const inventorySlots = mergeInventorySlots(defaultState.garage.inventorySlots, savedState.garage?.inventorySlots);
  const activeLoadout = repairRaceLoadout(savedState.race?.activeLoadout, defaultState.race.activeLoadout, inventorySlots);

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
      inventorySlots,
      ownedDriverIds: savedState.garage?.ownedDriverIds ?? defaultState.garage.ownedDriverIds,
      ownedStaffIds: savedState.garage?.ownedStaffIds ?? defaultState.garage.ownedStaffIds,
      ownedPartIds: Array.from(
        new Set([...(savedState.garage?.ownedPartIds ?? []), ...defaultState.garage.ownedPartIds]),
      ),
    },
    race: {
      ...defaultState.race,
      ...savedState.race,
      currentCircuitId: defaultState.race.currentCircuitId,
      currentWeekendId: defaultState.race.currentWeekendId,
      activeLoadout,
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
    const savedState = adapter.load();

    return savedState ? migrateGameState(savedState) : createInitialGameState();
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
