import type { CarPartType, TeamSlotType } from "@/types";

export type GaragePickerMode =
  | {
      type: "car_part";
      carId: "car1" | "car2";
      slotType: CarPartType;
    }
  | {
      type: "team_member";
      slotType: TeamSlotType;
    };

export type AppScreen =
  | "home"
  | "loadout"
  | "garage"
  | "market"
  | "more"
  | "standings"
  | "raceWeekend"
  | "circuits"
  | "teamHq"
  | "upgrades"
  | "sponsors"
  | "results";
