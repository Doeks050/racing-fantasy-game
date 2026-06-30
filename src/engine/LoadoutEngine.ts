import { carParts, drivers, teamMembers } from "@/data";
import type { CarPartType, TeamSlotType } from "@/types";
import type { GameState } from "./GameState";

type CarId = "car1" | "car2";

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export const LoadoutEngine = {
  selectDriver(state: GameState, params: { carId: CarId; driverId: string }): GameState {
    const driverExists = drivers.some((driver) => driver.id === params.driverId);
    const ownsDriver = state.garage.ownedDriverIds.includes(params.driverId);

    if (!driverExists || !ownsDriver) {
      return state;
    }

    return touch({
      ...state,
      race: {
        ...state.race,
        activeLoadout: {
          ...state.race.activeLoadout,
          [params.carId]: {
            ...state.race.activeLoadout[params.carId],
            driverId: params.driverId,
          },
        },
      },
    });
  },

  equipCarPart(
    state: GameState,
    params: { carId: CarId; slotType: CarPartType; partId: string },
  ): GameState {
    const part = carParts.find((candidate) => candidate.id === params.partId);
    const ownsPart = state.garage.ownedPartIds.includes(params.partId);

    if (!part || !ownsPart || part.type !== params.slotType) {
      return state;
    }

    return touch({
      ...state,
      race: {
        ...state.race,
        activeLoadout: {
          ...state.race.activeLoadout,
          [params.carId]: {
            ...state.race.activeLoadout[params.carId],
            parts: {
              ...state.race.activeLoadout[params.carId].parts,
              [params.slotType]: params.partId,
            },
          },
        },
      },
    });
  },

  equipTeamMember(
    state: GameState,
    params: { slotType: TeamSlotType; memberId: string },
  ): GameState {
    const member = teamMembers.find((candidate) => candidate.id === params.memberId);
    const ownsMember = state.garage.ownedStaffIds.includes(params.memberId);

    if (!member || !ownsMember || member.slotType !== params.slotType) {
      return state;
    }

    return touch({
      ...state,
      race: {
        ...state.race,
        activeLoadout: {
          ...state.race.activeLoadout,
          team: {
            ...state.race.activeLoadout.team,
            [params.slotType]: params.memberId,
          },
        },
      },
    });
  },
};
