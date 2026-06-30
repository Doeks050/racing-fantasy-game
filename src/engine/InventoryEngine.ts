import { carParts, drivers, teamMembers } from "@/data";
import type { CarPart, CarPartType, Driver, TeamMember, TeamSlotType } from "@/types";
import type { GameInventorySlot, GameState } from "./GameState";

export const GARAGE_GRID_COLUMNS = 6;
export const GARAGE_MIN_ROWS = 8;

export type HydratedGarageSlot = GameInventorySlot & {
  item: CarPart;
};

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

  getCompatibleTeamMembers(state: GameState, slotType: TeamSlotType): TeamMember[] {
    return this.getOwnedTeamMembers(state).filter((member) => member.slotType === slotType);
  },

  getHydratedGarageSlots(state: GameState): HydratedGarageSlot[] {
    return state.garage.inventorySlots
      .map((slot) => {
        const item = carParts.find((part) => part.id === slot.entityId);

        if (!item) {
          return undefined;
        }

        return {
          ...slot,
          item,
        };
      })
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
};
