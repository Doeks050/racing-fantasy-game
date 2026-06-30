export type HomeScheduleItem = {
  id: string;
  name: string;
  day: string;
  time: string;
  status: "completed" | "open" | "locked";
};

export type HomeDeadlineItem = {
  id: string;
  label: string;
  value: string;
};

export type HomeStandingPreviewItem = {
  rank: number;
  teamName: string;
  points: number;
  isPlayer?: boolean;
};

export type HomeSponsorPreviewItem = {
  id: string;
  title: string;
  current: number;
  target: number;
  rewardLabel: string;
};

export type HomeWeekendInfo = {
  weekendId: string;
  weekLabel: string;
  countryLabel: string;
  countryFlag: string;
  raceStartsInLabel: string;
};

export type HomeCircuitMeta = {
  circuitId: string;
  lengthKm: string;
  turns: number;
  laps: number;
  trackTempC: number;
};

const fallbackWeekendInfo: HomeWeekendInfo = {
  weekendId: "fallback",
  weekLabel: "Week 01 / 24",
  countryLabel: "Fantasy",
  countryFlag: "🏁",
  raceStartsInLabel: "02d 14h 37m",
};

const fallbackCircuitMeta: HomeCircuitMeta = {
  circuitId: "fallback",
  lengthKm: "5.742",
  turns: 16,
  laps: 52,
  trackTempC: 26,
};

export const homeWeekendInfoById: Record<string, HomeWeekendInfo> = {
  weekend_circuit_1_01: {
    weekendId: "weekend_circuit_1_01",
    weekLabel: "Week 01 / 24",
    countryLabel: "Fantasy",
    countryFlag: "🏁",
    raceStartsInLabel: "02d 14h 37m",
  },
};

export const homeCircuitMetaById: Record<string, HomeCircuitMeta> = {
  circuit_1: {
    circuitId: "circuit_1",
    lengthKm: "5.742",
    turns: 16,
    laps: 52,
    trackTempC: 26,
  },
};

export const homeSchedule: HomeScheduleItem[] = [
  { id: "practice_1", name: "Practice 1", day: "Fri", time: "09:00", status: "completed" },
  { id: "practice_2", name: "Practice 2", day: "Fri", time: "14:00", status: "open" },
  { id: "practice_3", name: "Practice 3", day: "Sat", time: "10:00", status: "open" },
  { id: "qualifying", name: "Qualifying", day: "Sat", time: "14:00", status: "open" },
  { id: "race", name: "Race", day: "Sun", time: "15:00", status: "locked" },
];

export const homeStandingsPreview: HomeStandingPreviewItem[] = [
  { rank: 1, teamName: "TurboFang", points: 1245 },
  { rank: 2, teamName: "PitKing22", points: 1028 },
  { rank: 3, teamName: "AeroWizard", points: 950 },
  { rank: 25, teamName: "You", points: 650, isPlayer: true },
];

export const homeSponsorPreview: HomeSponsorPreviewItem[] = [
  {
    id: "sponsor_finish_top_10",
    title: "Finish top 10",
    current: 0,
    target: 1,
    rewardLabel: "750 credits",
  },
  {
    id: "sponsor_five_top_5",
    title: "5 races in top 5",
    current: 2,
    target: 5,
    rewardLabel: "2,500 credits",
  },
];

export function getHomeWeekendInfo(weekendId: string): HomeWeekendInfo {
  return homeWeekendInfoById[weekendId] ?? fallbackWeekendInfo;
}

export function getHomeCircuitMeta(circuitId: string): HomeCircuitMeta {
  return homeCircuitMetaById[circuitId] ?? fallbackCircuitMeta;
}

export function getHomeDeadlines(params: {
  loadoutDeadlineLabel: string;
  rewardDraftStatus: string;
}): HomeDeadlineItem[] {
  return [
    { id: "loadout_lock", label: "Loadout lock", value: params.loadoutDeadlineLabel },
    { id: "sponsor_lock", label: "Sponsor lock", value: "1d 14h" },
    { id: "reward_draft", label: "Reward draft", value: params.rewardDraftStatus },
  ];
}
