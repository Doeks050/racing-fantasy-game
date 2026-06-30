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
    return state.race.isSubmitted ? "Submitted" : "Open";
  },

  canSubmit(state: GameState) {
    return !state.race.isSubmitted && LoadoutEngine.validateRaceLoadout(state).isReady;
  },

  submitRaceLoadout(state: GameState): GameState {
    if (!this.canSubmit(state)) {
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
