import type { Circuit } from "@/types";

export const circuits: Circuit[] = [
  {
    id: "circuit_neon_harbor",
    name: "Neon Harbor GP",
    location: "Harbor City",
    tyreWear: 62,
    reliabilityStress: 58,
    overtakingDifficulty: 72,
    wetChance: 28,
    sectors: [
      {
        topSpeed: 35,
        acceleration: 20,
        braking: 15,
        pace: 20,
        consistency: 10,
      },
      {
        cornering: 35,
        braking: 25,
        stability: 15,
        raceCraft: 15,
        awareness: 10,
      },
      {
        acceleration: 25,
        aeroEfficiency: 20,
        tyreManagement: 25,
        consistency: 20,
        strategy: 10,
      },
    ],
  },
  {
    id: "circuit_apex_desert",
    name: "Apex Desert Circuit",
    location: "Red Dunes",
    tyreWear: 78,
    reliabilityStress: 70,
    overtakingDifficulty: 42,
    wetChance: 4,
    sectors: [
      {
        topSpeed: 45,
        acceleration: 20,
        aeroEfficiency: 15,
        pace: 20,
      },
      {
        cornering: 25,
        stability: 20,
        tyreManagement: 25,
        consistency: 15,
        setupQuality: 15,
      },
      {
        braking: 20,
        acceleration: 25,
        topSpeed: 20,
        raceCraft: 20,
        reliabilitySupport: 15,
      },
    ],
  },
  {
    id: "circuit_monsoon_peak",
    name: "Monsoon Peak Raceway",
    location: "Highlands",
    tyreWear: 55,
    reliabilityStress: 66,
    overtakingDifficulty: 63,
    wetChance: 68,
    sectors: [
      {
        cornering: 25,
        stability: 25,
        wetSkill: 25,
        awareness: 15,
        setupQuality: 10,
      },
      {
        braking: 25,
        acceleration: 20,
        stability: 20,
        wetSkill: 20,
        consistency: 15,
      },
      {
        aeroEfficiency: 20,
        tyreManagement: 20,
        strategy: 20,
        awareness: 20,
        reliabilitySupport: 20,
      },
    ],
  },
];
