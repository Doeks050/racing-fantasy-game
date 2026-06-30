export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type CarPartType =
  | "chassis"
  | "engine"
  | "gearbox"
  | "suspension"
  | "front_wing"
  | "rear_wing"
  | "floor"
  | "brakes";

export type TeamSlotType =
  | "pit_crew"
  | "strategist"
  | "race_engineer"
  | "data_analyst"
  | "mechanic_chief";

export type GridSize = {
  width: number;
  height: number;
};

export type CarStats = {
  topSpeed: number;
  acceleration: number;
  cornering: number;
  braking: number;
  stability: number;
  reliability: number;
  tyreManagement: number;
  aeroEfficiency: number;
};

export type DriverStats = {
  pace: number;
  consistency: number;
  raceCraft: number;
  awareness: number;
  wetSkill: number;
  qualifying: number;
  tyreManagement: number;
  aggression: number;
};

export type TeamStats = {
  pitStopSpeed: number;
  strategy: number;
  setupQuality: number;
  reliabilitySupport: number;
  dataAnalysis: number;
};

export type CarPart = {
  id: string;
  name: string;
  type: CarPartType;
  brand?: string;
  rarity: Rarity;
  value: number;
  gridSize: GridSize;
  stats: Partial<CarStats>;
  description: string;
};

export type Driver = {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  gridSize: GridSize;
  stats: DriverStats;
};

export type TeamMember = {
  id: string;
  name: string;
  slotType: TeamSlotType;
  rarity: Rarity;
  value: number;
  stats: Partial<TeamStats>;
};

export type SectorWeights = Partial<CarStats & DriverStats & TeamStats>;

export type Circuit = {
  id: string;
  name: string;
  location: string;
  country: string;
  countryFlag: string;
  heroImage: string;
  laps: number;
  referenceLapTimeMs: number;
  referenceSectorTimesMs: [number, number, number];
  benchmarkRating: number;
  sectors: [SectorWeights, SectorWeights, SectorWeights];
  tyreWear: number;
  reliabilityStress: number;
  overtakingDifficulty: number;
  wetChance: number;
};

export type MarketListingKind = "car_part" | "driver";

export type MarketTrader = {
  id: string;
  name: string;
  description: string;
  categoryLabel: string;
  listingKinds: MarketListingKind[];
  partTypes?: CarPartType[];
};

export type MarketListing = {
  id: string;
  traderId: string;
  kind: MarketListingKind;
  itemId: string;
  price: number;
  stock: number;
  gridPosition: {
    column: number;
    row: number;
  };
  isRotated?: boolean;
};

export type CarLoadout = {
  driverId?: string;
  parts: Partial<Record<CarPartType, string>>;
};

export type TeamLoadout = Partial<Record<TeamSlotType, string>>;

export type RaceLoadout = {
  car1: CarLoadout;
  car2: CarLoadout;
  team: TeamLoadout;
};
