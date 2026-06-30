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
      carStats: emptyCarStats,
      driver: undefined,
    };
  }

  const carStats = getCarStats(carLoadout, parts, inventorySlots);

  const sectorScores = circuit.sectors.map((sector) =>
    scoreWeightedStats(sector, carStats, driver, teamStats),
  ) as [number, number, number];

  const baseScore = sectorScores.reduce((sum, score) => sum + score, 0);

  const pitStrategyScore =
    teamStats.pitStopSpeed * 0.12 + teamStats.strategy * 0.18 + teamStats.dataAnalysis * 0.08;

  const reliabilityScore =
    carStats.reliability * 0.2 +
    teamStats.reliabilitySupport * 0.18 -
    circuit.reliabilityStress * 0.08;

  const tyrePenalty =
    Math.max(0, circuit.tyreWear - carStats.tyreManagement - driver.stats.tyreManagement * 0.4) *
    0.08;

  const mistakePenalty =
    Math.max(0, 70 - driver.stats.consistency - carStats.stability * 0.2) * 0.06;

  const totalScore =
    baseScore + pitStrategyScore + reliabilityScore - tyrePenalty - mistakePenalty;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    sectorScores: sectorScores.map((score) => Math.round(score * 100) / 100) as [
      number,
      number,
      number,
    ],
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

  const totalTeamScore = Math.round((car1.totalScore + car2.totalScore) * 100) / 100;

  return {
    circuit: params.circuit,
    teamStats,
    car1,
    car2,
    totalTeamScore,
  };
}
