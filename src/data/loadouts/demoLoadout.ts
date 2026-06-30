import type { RaceLoadout } from "@/types";

export const demoLoadout: RaceLoadout = {
  car1: {
    driverId: "driver_milo_vance",
    parts: {
      chassis: "common_chassis_01",
      engine: "common_engine_01",
      gearbox: "common_gearbox_01",
      suspension: "common_suspension_01",
      front_wing: "common_front_wing_01",
      rear_wing: "common_rear_wing_01",
      floor: "common_floor_01",
      brakes: "common_brakes_01",
    },
  },
  car2: {
    driverId: "driver_kira_vale",
    parts: {
      chassis: "common_chassis_01",
      engine: "common_engine_01",
      gearbox: "common_gearbox_01",
      suspension: "common_suspension_01",
      front_wing: "common_front_wing_01",
      rear_wing: "common_rear_wing_01",
      floor: "common_floor_01",
      brakes: "common_brakes_01",
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
