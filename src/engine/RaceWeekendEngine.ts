import type { GameState } from "./GameState";
import { LoadoutEngine } from "./LoadoutEngine";

const rewardDraftIds = ["reward_brake_focus", "reward_driver_focus", "reward_team_focus"];

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export const RaceWeekendEngine = {
  getStatusLabel(state: GameState) {
    if (state.race.isCompleted) {
      return "Completed";
    }

    return state.race.isSubmitted ? "Confirmed" : "Open";
  },

  canConfirm(state: GameState) {
    return !state.race.isSubmitted && LoadoutEngine.validateRaceLoadout(state).isReady;
  },

  canComplete(state: GameState) {
    return state.race.isSubmitted && !state.race.isCompleted;
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

  completeRaceWeekend(state: GameState): GameState {
    if (!this.canComplete(state)) {
      return state;
    }

    return touch({
      ...state,
      race: {
        ...state.race,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      },
      economy: {
        ...state.economy,
        pendingRewardIds: rewardDraftIds,
      },
      progression: {
        ...state.progression,
        completedRaceWeekendIds: state.progression.completedRaceWeekendIds.includes(
          state.race.currentWeekendId,
        )
          ? state.progression.completedRaceWeekendIds
          : [...state.progression.completedRaceWeekendIds, state.race.currentWeekendId],
      },
    });
  },
};
