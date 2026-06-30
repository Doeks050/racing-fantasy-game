import { isGameState, type AsyncSaveAdapter, type GameState } from "@/engine";

export type PoolAppUserContext = {
  userId: string;
  teamName?: string;
  credits?: number;
};

export type PoolAppSaveClient = {
  loadRacingFantasyState: (userId: string) => Promise<unknown>;
  saveRacingFantasyState: (userId: string, state: GameState) => Promise<void>;
  clearRacingFantasyState?: (userId: string) => Promise<void>;
};

export function applyPoolAppUserContext(state: GameState, user: PoolAppUserContext): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      id: user.userId,
      teamName: user.teamName ?? state.player.teamName,
      credits: user.credits ?? state.player.credits,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function createPoolAppSaveAdapter(params: {
  userId: string;
  client: PoolAppSaveClient;
}): AsyncSaveAdapter {
  return {
    async load() {
      const loadedState = await params.client.loadRacingFantasyState(params.userId);
      return isGameState(loadedState) ? loadedState : null;
    },

    async save(state) {
      await params.client.saveRacingFantasyState(params.userId, state);
    },

    async clear() {
      if (params.client.clearRacingFantasyState) {
        await params.client.clearRacingFantasyState(params.userId);
      }
    },
  };
}
