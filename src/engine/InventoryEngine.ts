import { carParts, drivers, teamMembers } from "@/data";
import type { CarPart, CarPartType, Driver, TeamMember, TeamSlotType } from "@/types";
import type { GameInventorySlot, GameState } from "./GameState";

export const GARAGE_GRID_COLUMNS = 10;
export const GARAGE_MIN_ROWS = 8;

export type HydratedGarageSlot = GameInventorySlot & {
  item: CarPart;
};

type GridRect = {
  column: number;
  row: number;
  width: number;
  height: number;
};

function touch(state: GameState): GameState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

function getSlotSize(slot: GameInventorySlot, item: CarPart) {
  if (!slot.isRotated) {
    return item.gridSize;
  }

  return {
    width: item.gridSize.height,
    height: item.gridSize.width,
  };
}

function doRectanglesOverlap(a: GridRect, b: GridRect) {
  return !(
    a.column + a.width <= b.column ||
    b.column + b.width <= a.column ||
    a.row + a.height <= b.row ||
    b.row + b.height <= a.row
  );
}

function getGarageSlotItem(slot: GameInventorySlot) {
  return carParts.find((part) => part.id === slot.entityId);
}

function getEquippedCarPartSlotIds(state: GameState) {
  return [
    ...Object.values(state.race.activeLoadout.car1.parts),
    ...Object.values(state.race.activeLoadout.car2.parts),
  ].filter((slotId): slotId is string => Boolean(slotId));
}

function hydrateGarageSlot(slot: GameInventorySlot): HydratedGarageSlot | undefined {
  const item = getGarageSlotItem(slot);

  if (!item) {
    return undefined;
  }

  return {
    ...slot,
    item,
  };
}

export const InventoryEngine = {
  getOwnedDrivers(state: GameState): Driver[] {
    return state.garage.ownedDriverIds
      .map((driverId) => drivers.find((driver) => driver.id === driverId))
      .filter((driver): driver is Driver => Boolean(driver));
  },

  getOwnedCarParts(state: GameState): CarPart[] {
    return state.garage.ownedPartIds
      .map((partId) => carParts.find((part) => part.id === partId))
      .filter((part): part is CarPart => Boolean(part));
  },

  getOwnedTeamMembers(state: GameState): TeamMember[] {
    return state.garage.ownedStaffIds
      .map((memberId) => teamMembers.find((member) => member.id === memberId))
      .filter((member): member is TeamMember => Boolean(member));
  },

  getCompatibleCarParts(state: GameState, slotType: CarPartType): CarPart[] {
    return this.getOwnedCarParts(state).filter((part) => part.type === slotType);
  },

  getCompatibleCarPartSlots(state: GameState, params: { slotType: CarPartType }): HydratedGarageSlot[] {
    return this.getHydratedStashSlots(state).filter((slot) => slot.item.type === params.slotType);
  },

  getCompatibleTeamMembers(state: GameState, slotType: TeamSlotType): TeamMember[] {
    return this.getOwnedTeamMembers(state).filter((member) => member.slotType === slotType);
  },

  getHydratedGarageSlots(state: GameState): HydratedGarageSlot[] {
    return state.garage.inventorySlots
      .map(hydrateGarageSlot)
      .filter((slot): slot is HydratedGarageSlot => Boolean(slot));
  },

  getHydratedStashSlots(state: GameState): HydratedGarageSlot[] {
    const equippedSlotIds = getEquippedCarPartSlotIds(state);

    return state.garage.inventorySlots
      .filter((slot) => !equippedSlotIds.includes(slot.slotId))
      .map(hydrateGarageSlot)
      .filter((slot): slot is HydratedGarageSlot => Boolean(slot));
  },

  getGridRowCount(slots: HydratedGarageSlot[]): number {
    const occupiedRows = slots.reduce((maxRow, slot) => {
      const row = slot.gridPosition?.row ?? 0;
      const height = slot.isRotated ? slot.item.gridSize.width : slot.item.gridSize.height;
      return Math.max(maxRow, row + height);
    }, 0);

    return Math.max(GARAGE_MIN_ROWS, occupiedRows + 2);
  },

  isCarPartSlotEquipped(state: GameState, inventorySlotId: string): boolean {
    return getEquippedCarPartSlotIds(state).includes(inventorySlotId);
  },

  canPlaceGarageSlot(
    state: GameState,
    params: { slotId: string; column: number; row: number; isRotated?: boolean },
  ): boolean {
    const movingSlot = state.garage.inventorySlots.find((slot) => slot.slotId === params.slotId);

    if (!movingSlot) {
      return false;
    }

    const movingItem = getGarageSlotItem(movingSlot);

    if (!movingItem) {
      return false;
    }

    const candidateSlot: GameInventorySlot = {
      ...movingSlot,
      gridPosition: {
        column: params.column,
        row: params.row,
      },
      isRotated: params.isRotated ?? movingSlot.isRotated,
    };

    const movingSize = getSlotSize(candidateSlot, movingItem);
    const movingRect: GridRect = {
      column: params.column,
      row: params.row,
      width: movingSize.width,
      height: movingSize.height,
    };

    if (
      movingRect.column < 0 ||
      movingRect.row < 0 ||
      movingRect.column + movingRect.width > GARAGE_GRID_COLUMNS
    ) {
      return false;
    }

    const equippedSlotIds = getEquippedCarPartSlotIds(state);

    return state.garage.inventorySlots.every((slot) => {
      if (
        slot.slotId === params.slotId ||
        !slot.gridPosition ||
        equippedSlotIds.includes(slot.slotId)
      ) {
        return true;
      }

      const item = getGarageSlotItem(slot);

      if (!item) {
        return true;
      }

      const size = getSlotSize(slot, item);
      const rect: GridRect = {
        column: slot.gridPosition.column,
        row: slot.gridPosition.row,
        width: size.width,
        height: size.height,
      };

      return !doRectanglesOverlap(movingRect, rect);
    });
  },

  placeGarageSlot(
    state: GameState,
    params: { slotId: string; column: number; row: number; isRotated: boolean },
  ): GameState {
    const canPlace = this.canPlaceGarageSlot(state, params);

    if (!canPlace) {
      return state;
    }

    return touch({
      ...state,
      garage: {
        ...state.garage,
        inventorySlots: state.garage.inventorySlots.map((candidate) =>
          candidate.slotId === params.slotId
            ? {
                ...candidate,
                gridPosition: {
                  column: params.column,
                  row: params.row,
                },
                isRotated: params.isRotated,
              }
            : candidate,
        ),
      },
    });
  },

  moveGarageSlot(
    state: GameState,
    params: { slotId: string; column: number; row: number },
  ): GameState {
    const slot = state.garage.inventorySlots.find((candidate) => candidate.slotId === params.slotId);

    if (!slot) {
      return state;
    }

    return this.placeGarageSlot(state, {
      slotId: params.slotId,
      column: params.column,
      row: params.row,
      isRotated: Boolean(slot.isRotated),
    });
  },

  rotateGarageSlot(state: GameState, params: { slotId: string }): GameState {
    const slot = state.garage.inventorySlots.find((candidate) => candidate.slotId === params.slotId);

    if (!slot?.gridPosition) {
      return state;
    }

    return this.placeGarageSlot(state, {
      slotId: params.slotId,
      column: slot.gridPosition.column,
      row: slot.gridPosition.row,
      isRotated: !slot.isRotated,
    });
  },
};
