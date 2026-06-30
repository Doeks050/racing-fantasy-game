import { carParts, drivers, teamMembers } from "@/data";
import type { CarPartType, TeamSlotType } from "@/types";
import type { GameState } from "./GameState";

type CarId = "car1" | "car2";

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

const requiredTeamSlots: TeamSlotType[] = [
  "pit_crew",
  "strategist",
  "race_engineer",
  "data_analyst",
  "mechanic_chief",
];

export type LoadoutValidation = {
  isReady: boolean;
  filledSlots: number;
  totalSlots: number;
  missing: string[];
};

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

function getEquippedCarPartSlotIds(state: GameState) {
  return [
    ...Object.values(state.race.activeLoadout.car1.parts),
    ...Object.values(state.race.activeLoadout.car2.parts),
  ].filter((slotId): slotId is string => Boolean(slotId));
}

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function validateCar(state: GameState, carId: CarId) {
  const car = state.race.activeLoadout[carId];
  const missing: string[] = [];
  let filledSlots = 0;

  if (car.driverId) {
    filledSlots += 1;
  } else {
    missing.push(`${carId === "car1" ? "Car 1" : "Car 2"}: Driver`);
  }

  requiredCarPartSlots.forEach((slotType) => {
    const inventorySlotId = car.parts[slotType];
    const inventorySlot = state.garage.inventorySlots.find((slot) => slot.slotId === inventorySlotId);
    const part = carParts.find((candidate) => candidate.id === inventorySlot?.entityId);

    if (inventorySlot && part?.type === slotType) {
      filledSlots += 1;
      return;
    }

    missing.push(`${carId === "car1" ? "Car 1" : "Car 2"}: ${label(slotType)}`);
  });

  return { filledSlots, missing };
}

export const LoadoutEngine = {
  validateRaceLoadout(state: GameState): LoadoutValidation {
    const car1 = validateCar(state, "car1");
    const car2 = validateCar(state, "car2");
    const teamMissing: string[] = [];
    let teamFilledSlots = 0;

    requiredTeamSlots.forEach((slotType) => {
      const memberId = state.race.activeLoadout.team[slotType];
      const member = teamMembers.find((candidate) => candidate.id === memberId);

      if (member?.slotType === slotType) {
        teamFilledSlots += 1;
        return;
      }

      teamMissing.push(`Team: ${label(slotType)}`);
    });

    const totalSlots = 23;
    const filledSlots = car1.filledSlots + car2.filledSlots + teamFilledSlots;
    const missing = [...car1.missing, ...car2.missing, ...teamMissing];

    return {
      isReady: missing.length === 0,
      filledSlots,
      totalSlots,
      missing,
    };
  },

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
    params: { carId: CarId; slotType: CarPartType; inventorySlotId: string },
  ): GameState {
    const inventorySlot = state.garage.inventorySlots.find(
      (candidate) => candidate.slotId === params.inventorySlotId,
    );
    const part = carParts.find((candidate) => candidate.id === inventorySlot?.entityId);

    if (!inventorySlot || !part || part.type !== params.slotType) {
      return state;
    }

    const currentSlotId = state.race.activeLoadout[params.carId].parts[params.slotType];
    const isUsedElsewhere = getEquippedCarPartSlotIds(state).some(
      (slotId) => slotId === params.inventorySlotId && slotId !== currentSlotId,
    );

    if (isUsedElsewhere) {
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
              [params.slotType]: params.inventorySlotId,
            },
          },
        },
      },
    });
  },

  unequipCarPart(
    state: GameState,
    params: { carId: CarId; slotType: CarPartType },
  ): GameState {
    const { [params.slotType]: removedSlotId, ...remainingParts } = state.race.activeLoadout[params.carId].parts;

    if (!removedSlotId) {
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
            parts: remainingParts,
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
