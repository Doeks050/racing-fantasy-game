import { carParts, teamMembers } from "@/data";
import type { CarLoadout, CarStats, TeamLoadout, TeamStats } from "@/types";

export const emptyCarStats: CarStats = {
  topSpeed: 0,
  acceleration: 0,
  cornering: 0,
  braking: 0,
  stability: 0,
  reliability: 0,
  tyreManagement: 0,
  aeroEfficiency: 0,
};

export const emptyTeamStats: TeamStats = {
  pitStopSpeed: 0,
  strategy: 0,
  setupQuality: 0,
  reliabilitySupport: 0,
  dataAnalysis: 0,
};

export function getCarLoadoutStats(carLoadout: CarLoadout): CarStats {
  return Object.values(carLoadout.parts).reduce<CarStats>((stats, partId) => {
    const part = carParts.find((item) => item.id === partId);

    if (!part) {
      return stats;
    }

    return {
      topSpeed: stats.topSpeed + (part.stats.topSpeed ?? 0),
      acceleration: stats.acceleration + (part.stats.acceleration ?? 0),
      cornering: stats.cornering + (part.stats.cornering ?? 0),
      braking: stats.braking + (part.stats.braking ?? 0),
      stability: stats.stability + (part.stats.stability ?? 0),
      reliability: stats.reliability + (part.stats.reliability ?? 0),
      tyreManagement: stats.tyreManagement + (part.stats.tyreManagement ?? 0),
      aeroEfficiency: stats.aeroEfficiency + (part.stats.aeroEfficiency ?? 0),
    };
  }, emptyCarStats);
}

export function getTeamLoadoutStats(teamLoadout: TeamLoadout): TeamStats {
  return Object.values(teamLoadout).reduce<TeamStats>((stats, memberId) => {
    const member = teamMembers.find((item) => item.id === memberId);

    if (!member) {
      return stats;
    }

    return {
      pitStopSpeed: stats.pitStopSpeed + (member.stats.pitStopSpeed ?? 0),
      strategy: stats.strategy + (member.stats.strategy ?? 0),
      setupQuality: stats.setupQuality + (member.stats.setupQuality ?? 0),
      reliabilitySupport: stats.reliabilitySupport + (member.stats.reliabilitySupport ?? 0),
      dataAnalysis: stats.dataAnalysis + (member.stats.dataAnalysis ?? 0),
    };
  }, emptyTeamStats);
}

export function getOverallScore(stats: Record<string, number>) {
  const values = Object.values(stats);

  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function meterValue(value: number) {
  return Math.max(0, Math.min(100, value));
}
