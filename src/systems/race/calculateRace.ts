import type {
  CarLoadout,
  CarPart,
  CarStats,
  Circuit,
  Driver,
  RaceLoadout,
  TeamLoadout,
  TeamMember,
  TeamStats,
} from "@/types";
import type { GameInventorySlot } from "@/engine";

const PERFORMANCE_TO_TIME_FACTOR = 0.0015;
const FASTEST_TIME_MODIFIER = 0.92;
const SLOWEST_TIME_MODIFIER = 1.12;

const emptyCarStats: CarStats = {
  topSpeed: 0,
  acceleration: 0,
  cornering: 0,
  braking: 0,
  stability: 0,
  reliability: 0,
  tyreManagement: 0,
  aeroEfficiency: 0,
};

const emptyTeamStats: TeamStats = {
  pitStopSpeed: 0,
  strategy: 0,
  setupQuality: 0,
  reliabilitySupport: 0,
  dataAnalysis: 0,
};

function addCarStats(base: CarStats, add: Partial<CarStats>) {
  return {
    topSpeed: base.topSpeed + (add.topSpeed ?? 0),
    acceleration: base.acceleration + (add.acceleration ?? 0),
    cornering: base.cornering + (add.cornering ?? 0),
    braking: base.braking + (add.braking ?? 0),
    stability: base.stability + (add.stability ?? 0),
    reliability: base.reliability + (add.reliability ?? 0),
    tyreManagement: base.tyreManagement + (add.tyreManagement ?? 0),
    aeroEfficiency: base.aeroEfficiency + (add.aeroEfficiency ?? 0),
  };
}

function addTeamStats(base: TeamStats, add: Partial<TeamStats>) {
  return {
    pitStopSpeed: base.pitStopSpeed + (add.pitStopSpeed ?? 0),
    strategy: base.strategy + (add.strategy ?? 0),
    setupQuality: base.setupQuality + (add.setupQuality ?? 0),
    reliabilitySupport: base.reliabilitySupport + (add.reliabilitySupport ?? 0),
    dataAnalysis: base.dataAnalysis + (add.dataAnalysis ?? 0),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function resolveCarPart(
  loadoutValue: string | undefined,
  parts: CarPart[],
  inventorySlots: GameInventorySlot[],
) {
  if (!loadoutValue) {
    return undefined;
  }

  const inventorySlot = inventorySlots.find((slot) => slot.slotId === loadoutValue);

  if (inventorySlot) {
    return parts.find((candidate) => candidate.id === inventorySlot.entityId);
  }

  return parts.find((candidate) => candidate.id === loadoutValue);
}

function getCarStats(
  carLoadout: CarLoadout,
  parts: CarPart[],
  inventorySlots: GameInventorySlot[],
) {
  return Object.values(carLoadout.parts).reduce<CarStats>((stats, loadoutValue) => {
    const part = resolveCarPart(loadoutValue, parts, inventorySlots);

    if (!part) {
      return stats;
    }

    return addCarStats(stats, part.stats);
  }, emptyCarStats);
}

function getTeamStats(teamLoadout: TeamLoadout, teamMembers: TeamMember[]) {
  return Object.values(teamLoadout).reduce<TeamStats>((stats, memberId) => {
    const member = teamMembers.find((candidate) => candidate.id === memberId);

    if (!member) {
      return stats;
    }

    return addTeamStats(stats, member.stats);
  }, emptyTeamStats);
}

function scoreWeightedStats(
  weights: Circuit["sectors"][number],
  carStats: CarStats,
  driver: Driver,
  teamStats: TeamStats,
) {
  return Object.entries(weights).reduce((score, [statName, weight]) => {
    const carValue = carStats[statName as keyof CarStats];
    const driverValue = driver.stats[statName as keyof Driver["stats"]];
    const teamValue = teamStats[statName as keyof TeamStats];

    const value = carValue ?? driverValue ?? teamValue ?? 0;

    return score + value * ((weight ?? 0) / 100);
  }, 0);
}

function calculateSectorTimeMs(referenceSectorTimeMs: number, sectorRating: number, benchmarkRating: number) {
  const ratingDelta = sectorRating - benchmarkRating;
  const modifier = clamp(
    1 - ratingDelta * PERFORMANCE_TO_TIME_FACTOR,
    FASTEST_TIME_MODIFIER,
    SLOWEST_TIME_MODIFIER,
  );

  return Math.round(referenceSectorTimeMs * modifier);
}

function calculateRaceTimeModifiers(params: {
  circuit: Circuit;
  carStats: CarStats;
  driver: Driver;
  teamStats: TeamStats;
}) {
  const tyreLossMs = Math.round(
    Math.max(
      0,
      params.circuit.tyreWear - params.carStats.tyreManagement - params.driver.stats.tyreManagement * 0.4,
    ) * 12,
  );

  const mistakeLossMs = Math.round(
    Math.max(0, 70 - params.driver.stats.consistency - params.carStats.stability * 0.2) * 9,
  );

  const reliabilityLossMs = Math.round(
    Math.max(
      0,
      params.circuit.reliabilityStress - params.carStats.reliability - params.teamStats.reliabilitySupport * 0.5,
    ) * 10,
  );

  const pitStrategyGainMs = Math.round(
    (params.teamStats.pitStopSpeed * 0.12 + params.teamStats.strategy * 0.18 + params.teamStats.dataAnalysis * 0.08) *
      10,
  );

  return {
    tyreLossMs,
    mistakeLossMs,
    reliabilityLossMs,
    pitStrategyGainMs,
  };
}

function calculateCarRaceScore(
  carLoadout: CarLoadout,
  circuit: Circuit,
  drivers: Driver[],
  parts: CarPart[],
  inventorySlots: GameInventorySlot[],
  teamStats: TeamStats,
) {
  const driver = drivers.find((candidate) => candidate.id === carLoadout.driverId);

  if (!driver) {
    return {
      totalScore: 0,
      sectorScores: [0, 0, 0] as [number, number, number],
      sectorRatings: [0, 0, 0] as [number, number, number],
      sectorTimesMs: [0, 0, 0] as [number, number, number],
      lapTimeMs: 0,
      projectedRaceTimeMs: 0,
      raceTimeModifiers: {
        tyreLossMs: 0,
        mistakeLossMs: 0,
        reliabilityLossMs: 0,
        pitStrategyGainMs: 0,
      },
      carStats: emptyCarStats,
      driver: undefined,
    };
  }

  const carStats = getCarStats(carLoadout, parts, inventorySlots);

  const sectorRatings = circuit.sectors.map((sector) =>
    scoreWeightedStats(sector, carStats, driver, teamStats),
  ) as [number, number, number];

  const sectorTimesMs = sectorRatings.map((rating, index) =>
    calculateSectorTimeMs(circuit.referenceSectorTimesMs[index], rating, circuit.benchmarkRating),
  ) as [number, number, number];

  const cleanLapTimeMs = sectorTimesMs.reduce((sum, time) => sum + time, 0);
  const raceTimeModifiers = calculateRaceTimeModifiers({ circuit, carStats, driver, teamStats });

  const lapTimeMs = Math.max(
    0,
    cleanLapTimeMs +
      raceTimeModifiers.tyreLossMs +
      raceTimeModifiers.mistakeLossMs +
      raceTimeModifiers.reliabilityLossMs -
      raceTimeModifiers.pitStrategyGainMs,
  );

  const totalScore = circuit.referenceLapTimeMs / Math.max(1, lapTimeMs) * 100;

  return {
    totalScore: round2(totalScore),
    sectorScores: sectorRatings.map(round2) as [number, number, number],
    sectorRatings: sectorRatings.map(round2) as [number, number, number],
    sectorTimesMs,
    lapTimeMs,
    projectedRaceTimeMs: lapTimeMs * circuit.laps,
    raceTimeModifiers,
    carStats,
    driver,
  };
}

export function calculateRaceResult(params: {
  loadout: RaceLoadout;
  circuit: Circuit;
  drivers: Driver[];
  parts: CarPart[];
  teamMembers: TeamMember[];
  inventorySlots?: GameInventorySlot[];
}) {
  const teamStats = getTeamStats(params.loadout.team, params.teamMembers);
  const inventorySlots = params.inventorySlots ?? [];

  const car1 = calculateCarRaceScore(
    params.loadout.car1,
    params.circuit,
    params.drivers,
    params.parts,
    inventorySlots,
    teamStats,
  );

  const car2 = calculateCarRaceScore(
    params.loadout.car2,
    params.circuit,
    params.drivers,
    params.parts,
    inventorySlots,
    teamStats,
  );

  const totalTeamScore = round2(car1.totalScore + car2.totalScore);
  const combinedProjectedRaceTimeMs = car1.projectedRaceTimeMs + car2.projectedRaceTimeMs;

  return {
    circuit: params.circuit,
    teamStats,
    car1,
    car2,
    totalTeamScore,
    combinedProjectedRaceTimeMs,
  };
}
