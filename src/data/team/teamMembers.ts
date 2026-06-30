import type { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [
  {
    id: "team_pit_crew_common_01",
    name: "Garage Line Pit Crew",
    slotType: "pit_crew",
    rarity: "common",
    value: 900,
    stats: {
      pitStopSpeed: 10,
      reliabilitySupport: 3,
    },
  },
  {
    id: "team_strategist_common_01",
    name: "Baseline Strategist",
    slotType: "strategist",
    rarity: "common",
    value: 850,
    stats: {
      strategy: 10,
      dataAnalysis: 2,
    },
  },
  {
    id: "team_engineer_common_01",
    name: "Setup Race Engineer",
    slotType: "race_engineer",
    rarity: "common",
    value: 950,
    stats: {
      setupQuality: 10,
      reliabilitySupport: 3,
    },
  },
  {
    id: "team_analyst_common_01",
    name: "Telemetry Data Analyst",
    slotType: "data_analyst",
    rarity: "common",
    value: 800,
    stats: {
      dataAnalysis: 10,
      strategy: 2,
    },
  },
  {
    id: "team_mechanic_common_01",
    name: "Chief Mechanic",
    slotType: "mechanic_chief",
    rarity: "common",
    value: 900,
    stats: {
      reliabilitySupport: 10,
      setupQuality: 2,
    },
  },
];
