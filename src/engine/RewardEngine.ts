import type { GameState } from "./GameState";

export type RewardDraftOption = {
  id: string;
  title: string;
  category: string;
  description: string;
  rewardText: string;
};

const rewardDraftOptions: RewardDraftOption[] = [
  {
    id: "reward_brake_focus",
    title: "Brake Development Program",
    category: "Car Upgrade",
    description: "Invest in brake testing and race-stability development for next weekend.",
    rewardText: "+700 credits",
  },
  {
    id: "reward_driver_focus",
    title: "Driver Coaching Session",
    category: "Driver Upgrade",
    description: "Run simulator work and race review sessions with your driver crew.",
    rewardText: "+120 XP",
  },
  {
    id: "reward_team_focus",
    title: "Pitwall Strategy Package",
    category: "Team Upgrade",
    description: "Improve preparation with extra data analysis and pitwall strategy work.",
    rewardText: "+400 credits and +60 XP",
  },
];

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export const RewardEngine = {
  getPendingRewardOptions(state: GameState): RewardDraftOption[] {
    return state.economy.pendingRewardIds
      .map((rewardId) => rewardDraftOptions.find((option) => option.id === rewardId))
      .filter((option): option is RewardDraftOption => Boolean(option));
  },

  chooseReward(state: GameState, rewardId: string): GameState {
    if (!state.race.isCompleted || !state.economy.pendingRewardIds.includes(rewardId)) {
      return state;
    }

    if (rewardId === "reward_brake_focus") {
      return touch({
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits + 700,
        },
        economy: {
          ...state.economy,
          pendingRewardIds: [],
        },
      });
    }

    if (rewardId === "reward_driver_focus") {
      return touch({
        ...state,
        player: {
          ...state.player,
          xp: state.player.xp + 120,
        },
        economy: {
          ...state.economy,
          pendingRewardIds: [],
        },
      });
    }

    if (rewardId === "reward_team_focus") {
      return touch({
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits + 400,
          xp: state.player.xp + 60,
        },
        economy: {
          ...state.economy,
          pendingRewardIds: [],
        },
      });
    }

    return state;
  },
};
