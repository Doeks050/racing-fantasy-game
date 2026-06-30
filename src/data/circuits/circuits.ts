import type { Circuit } from "@/types";

export const circuits: Circuit[] = [
  {
    id: "circuit_1",
    name: "Circuit 1",
    location: "Circuit 1",
    country: "Fantasy",
    countryFlag: "🏁",
    heroImage: "/circuits/circuit-1.png",
    laps: 52,
    referenceLapTimeMs: 93400,
    referenceSectorTimesMs: [30200, 33100, 30100],
    benchmarkRating: 60,
    tyreWear: 61,
    reliabilityStress: 56,
    overtakingDifficulty: 48,
    wetChance: 24,
    sectors: [
      {
        topSpeed: 35,
        aeroEfficiency: 20,
        braking: 15,
        pace: 20,
        consistency: 10,
      },
      {
        cornering: 30,
        stability: 20,
        braking: 15,
        raceCraft: 15,
        awareness: 10,
        setupQuality: 10,
      },
      {
        acceleration: 25,
        topSpeed: 20,
        tyreManagement: 20,
        cornering: 15,
        consistency: 10,
        dataAnalysis: 10,
      },
    ],
  },
];
