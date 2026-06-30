import type { GameState } from "./GameState";
import { LoadoutEngine } from "./LoadoutEngine";

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export const RaceWeekendEngine = {
  getStatusLabel(state: GameState) {
    return state.race.isSubmitted ? "Confirmed" : "Open";
  },

  canConfirm(state: GameState) {
    return !state.race.isSubmitted && LoadoutEngine.validateRaceLoadout(state).isReady;
  },

  confirmRaceLoadout(state: GameState): GameState {
    if (!this.canConfirm(state)) {
      return state;
    }

    return touch({
      ...state,
      race: {
        ...state.race,
        submittedLoadout: structuredClone(state.race.activeLoadout),
        isSubmitted: true,
        submittedAt: new Date().toISOString(),
      },
    });
  },
};
