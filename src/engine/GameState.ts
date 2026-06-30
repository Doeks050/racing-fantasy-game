import { demoLoadout, marketListings, marketTraders } from "@/data";
import type { RaceLoadout } from "@/types";

export type GameInventorySlot = {
  slotId: string;
  entityId: string;
  quantity: number;
  gridPosition?: {
    column: number;
    row: number;
  };
  isRotated?: boolean;
};

export type PlayerProfile = {
  id: string;
  teamName: string;
  credits: number;
  xp: number;
  level: number;
};

export type GarageState = {
  inventorySlots: GameInventorySlot[];
  ownedDriverIds: string[];
  ownedStaffIds: string[];
  ownedPartIds: string[];
};

export type RaceWeekendState = {
  activeLoadout: RaceLoadout;
  submittedLoadout?: RaceLoadout;
  currentCircuitId: string;
  currentWeekendId: string;
  deadlineLabel: string;
  isSubmitted: boolean;
  submittedAt?: string;
};

export type EconomyState = {
  activeMarketTraderId: string;
  marketListingIds: string[];
  activeSponsorIds: string[];
  pendingRewardIds: string[];
};

export type ProgressionState = {
  completedRaceWeekendIds: string[];
  unlockedFeatureIds: string[];
};

export type GameState = {
  version: 1;
  player: PlayerProfile;
  garage: GarageState;
  race: RaceWeekendState;
  economy: EconomyState;
  progression: ProgressionState;
  updatedAt: string;
};

export function createInitialGameState(): GameState {
  return {
    version: 1,
    player: {
      id: "local_player",
      teamName: "Neon Vector Racing",
      credits: 12500,
      xp: 0,
      level: 1,
    },
    garage: {
      inventorySlots: [
        { slotId: "slot_chassis_01", entityId: "common_chassis_01", quantity: 1, gridPosition: { column: 0, row: 0 } },
        { slotId: "slot_engine_01", entityId: "common_engine_01", quantity: 1, gridPosition: { column: 2, row: 0 } },
        { slotId: "slot_gearbox_01", entityId: "common_gearbox_01", quantity: 1, gridPosition: { column: 4, row: 0 } },
        { slotId: "slot_suspension_01", entityId: "common_suspension_01", quantity: 1, gridPosition: { column: 0, row: 2 } },
        { slotId: "slot_front_wing_01", entityId: "common_front_wing_01", quantity: 1, gridPosition: { column: 2, row: 2 } },
        { slotId: "slot_rear_wing_01", entityId: "common_rear_wing_01", quantity: 1, gridPosition: { column: 0, row: 3 } },
        { slotId: "slot_floor_01", entityId: "common_floor_01", quantity: 1, gridPosition: { column: 3, row: 3 } },
        { slotId: "slot_brakes_01", entityId: "common_brakes_01", quantity: 1, gridPosition: { column: 5, row: 2 } },
      ],
      ownedDriverIds: ["driver_milo_vance", "driver_kira_vale"],
      ownedStaffIds: [
        "team_pit_crew_common_01",
        "team_strategist_common_01",
        "team_engineer_common_01",
        "team_analyst_common_01",
        "team_mechanic_common_01",
      ],
      ownedPartIds: [
        "common_chassis_01",
        "common_engine_01",
        "common_gearbox_01",
        "common_suspension_01",
        "common_front_wing_01",
        "common_rear_wing_01",
        "common_floor_01",
        "common_brakes_01",
      ],
    },
    race: {
      activeLoadout: demoLoadout,
      currentCircuitId: "circuit_neon_harbor",
      currentWeekendId: "weekend_neon_harbor_01",
      deadlineLabel: "Friday 20:00",
      isSubmitted: false,
    },
    economy: {
      activeMarketTraderId: marketTraders[0]?.id ?? "",
      marketListingIds: marketListings.map((listing) => listing.id),
      activeSponsorIds: [],
      pendingRewardIds: [],
    },
    progression: {
      completedRaceWeekendIds: [],
      unlockedFeatureIds: [],
    },
    updatedAt: new Date().toISOString(),
  };
}
