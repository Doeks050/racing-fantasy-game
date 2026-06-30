import type { RaceLoadout } from "@/types";

export const demoLoadout: RaceLoadout = {
  car1: {
    driverId: "driver_milo_vance",
    parts: {
      chassis: "slot_chassis_01",
      engine: "slot_engine_01",
      gearbox: "slot_gearbox_01",
      suspension: "slot_suspension_01",
      front_wing: "slot_front_wing_01",
      rear_wing: "slot_rear_wing_01",
      floor: "slot_floor_01",
      brakes: "slot_brakes_01",
    },
  },
  car2: {
    driverId: "driver_kira_vale",
    parts: {
      chassis: "slot_chassis_02",
      engine: "slot_engine_02",
      gearbox: "slot_gearbox_02",
      suspension: "slot_suspension_02",
      front_wing: "slot_front_wing_02",
      rear_wing: "slot_rear_wing_02",
      floor: "slot_floor_02",
      brakes: "slot_brakes_02",
    },
  },
  team: {
    pit_crew: "team_pit_crew_common_01",
    strategist: "team_strategist_common_01",
    race_engineer: "team_engineer_common_01",
    data_analyst: "team_analyst_common_01",
    mechanic_chief: "team_mechanic_common_01",
  },
};
