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
      return isGameState(parsed) ? parsed : null;
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
    return (await adapter.load()) ?? createInitialGameState();
  },

  async saveAsync(state: GameState, adapter: AsyncSaveAdapter) {
    await adapter.save(state);
  },

  async clearAsync(adapter: AsyncSaveAdapter) {
    await adapter.clear();
  },
};
