"use client";

import { useEffect, useState } from "react";
import { circuits } from "@/data";
import { LoadoutEngine, RaceWeekendEngine } from "@/engine";
import { RaceLoadoutScreen } from "@/screens/loadout/RaceLoadoutScreen";
import { GarageStashScreen } from "@/screens/garage/GarageStashScreen";
import { MarketScreen } from "@/screens/market/MarketScreen";
import { StandingsScreen } from "@/screens/standings/StandingsScreen";
import { RaceWeekendScreen } from "@/screens/race-weekend/RaceWeekendScreen";
import { CircuitsScreen } from "@/screens/circuits/CircuitsScreen";
import { TeamHqScreen } from "@/screens/team-hq/TeamHqScreen";
import { UpgradesScreen } from "@/screens/upgrades/UpgradesScreen";
import { SponsorsScreen } from "@/screens/sponsors/SponsorsScreen";
import { RaceResultsScreen } from "@/screens/results/RaceResultsScreen";
import { useGameStore } from "@/store/useGameStore";

type Screen =
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

const moreItems: { id: Screen; label: string; description: string }[] = [
  { id: "standings", label: "Standings", description: "Championship table" },
  { id: "raceWeekend", label: "Race Weekend", description: "Deadlines and race status" },
  { id: "circuits", label: "Circuits", description: "Sector profiles and track traits" },
  { id: "teamHq", label: "Team HQ", description: "Team identity and facilities" },
  { id: "upgrades", label: "Reward Draft", description: "Choose 1 of 3 race rewards" },
  { id: "sponsors", label: "Sponsors", description: "Sponsor challenges" },
  { id: "results", label: "Race Results", description: "Simulation outcome" },
];

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "loadout", label: "Loadout", icon: "◇" },
  { id: "garage", label: "Stash", icon: "▦" },
  { id: "market", label: "Market", icon: "↗" },
  { id: "upgrades", label: "Draft", icon: "✦" },
];

const scheduleItems = [
  { name: "Practice 1", day: "Fri", time: "09:00", status: "Completed" },
  { name: "Practice 2", day: "Fri", time: "14:00", status: "Open" },
  { name: "Practice 3", day: "Sat", time: "10:00", status: "Open" },
  { name: "Qualifying", day: "Sat", time: "14:00", status: "Open" },
  { name: "Race", day: "Sun", time: "15:00", status: "Locked" },
];

const standingsPreview = [
  { rank: 1, name: "TurboFang", points: 1245 },
  { rank: 2, name: "PitKing22", points: 1028 },
  { rank: 3, name: "AeroWizard", points: 950 },
  { rank: 25, name: "You", points: 650 },
];

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/45 p-2">
      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className={`mt-1 text-xs font-black ${accent ? "text-red-400" : "text-zinc-100"}`}>{value}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-3 shadow-lg shadow-black/30">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">{title}</h3>
        {action && <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-400">{action}</p>}
      </div>
      {children}
    </section>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function RacingFantasyApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const hydrateFromSave = useGameStore((store) => store.hydrateFromSave);
  const resetGameState = useGameStore((store) => store.resetGameState);
  const gameState = useGameStore((store) => store.gameState);
  const player = gameState.player;
  const validation = LoadoutEngine.validateRaceLoadout(gameState);
  const weekendStatus = RaceWeekendEngine.getStatusLabel(gameState);
  const rewardCount = gameState.economy.pendingRewardIds.length;
  const circuit = circuits.find((item) => item.id === gameState.race.currentCircuitId) ?? circuits[0];
  const readyPercent = Math.round((validation.filledSlots / validation.totalSlots) * 100);

  useEffect(() => {
    hydrateFromSave();
  }, [hydrateFromSave]);

  function handleDevReset() {
    resetGameState();
    setScreen("home");
  }

  return (
    <main className="h-dvh overflow-hidden bg-black text-zinc-100">
      <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden border-x border-red-950/40 bg-[#07090c]">
        <header className="shrink-0 border-b border-white/10 bg-black/90 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setScreen("more")} className="rounded-xl p-2 text-lg text-zinc-300 active:scale-95">
              ☰
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase italic tracking-[0.18em] text-red-500">Pitwall</p>
              <h1 className="-mt-1 truncate text-sm font-black uppercase tracking-[0.2em] text-zinc-50">Racing Fantasy</h1>
            </div>
            <div className="flex items-center gap-1">
              <div className="rounded-full border border-yellow-500/30 bg-yellow-950/20 px-2 py-1 text-[10px] font-black text-yellow-300">◉ {player.credits}</div>
              <div className="rounded-full border border-purple-500/30 bg-purple-950/20 px-2 py-1 text-[10px] font-black text-purple-300">◆ {player.xp}</div>
              <button className="relative rounded-xl p-2 text-zinc-300 active:scale-95">
                ♟
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          {screen === "home" && (
            <div className="flex flex-col gap-3 pb-3">
              <section className="relative min-h-[248px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-zinc-950 shadow-2xl shadow-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(239,68,68,0.24),transparent_34%),linear-gradient(180deg,rgba(12,15,18,0.45),#050607_90%)]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-50" />
                <div className="absolute bottom-10 left-6 h-16 w-56 skew-x-[-18deg] rounded-[2rem] border border-red-500/30 bg-black/70 shadow-[0_0_50px_rgba(239,68,68,0.25)]" />
                <div className="absolute bottom-16 left-16 h-5 w-24 rounded-full bg-red-500/40 blur-xl" />
                <div className="absolute bottom-10 left-11 h-10 w-10 rounded-full border-4 border-zinc-800 bg-black" />
                <div className="absolute bottom-10 left-48 h-10 w-10 rounded-full border-4 border-zinc-800 bg-black" />
                <div className="absolute right-4 top-16 w-24 rounded-2xl border border-white/10 bg-black/55 p-2">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-zinc-500">Race starts in</p>
                  <p className="mt-1 text-lg font-black text-red-500">02d 14h</p>
                  <p className="text-[10px] font-bold text-red-400">37m</p>
                </div>
                <div className="relative p-4">
                  <p className="text-xs font-black uppercase italic tracking-[0.18em] text-red-500">Race Weekend</p>
                  <h2 className="mt-1 max-w-[230px] text-4xl font-black uppercase leading-[0.88] tracking-tight text-zinc-50">
                    {circuit.name.replace(" GP", "")}
                  </h2>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{circuit.location}</p>
                  <button onClick={() => setScreen("raceWeekend")} className="mt-3 rounded-lg border border-red-500/50 bg-red-950/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-red-300 active:scale-95">
                    Week 08 / 24
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-5 gap-2">
                <MiniStat label="Weather" value={`${circuit.wetChance}% wet`} />
                <MiniStat label="Track" value="23°C" accent />
                <MiniStat label="Length" value="5.301km" />
                <MiniStat label="Turns" value="18" />
                <MiniStat label="Laps" value="52" />
              </div>

              <div className="grid grid-cols-[1.2fr_0.9fr] gap-3">
                <Panel title="Schedule">
                  <div className="grid gap-2">
                    {scheduleItems.map((item) => (
                      <div key={item.name} className="grid grid-cols-[1fr_32px_44px] items-center gap-2 text-[10px]">
                        <span className={`font-bold uppercase ${item.name === "Race" ? "text-red-400" : "text-zinc-300"}`}>{item.name}</span>
                        <span className="text-zinc-500">{item.day}</span>
                        <span className={item.status === "Completed" ? "text-emerald-400" : item.name === "Race" ? "text-red-400" : "text-zinc-400"}>
                          {item.status === "Completed" ? "DONE" : item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Deadlines" action="View all">
                  <div className="grid gap-2 text-[10px]">
                    <div className="flex justify-between gap-2"><span className="text-zinc-500">Loadout lock</span><span className="font-black text-zinc-200">{gameState.race.deadlineLabel}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-zinc-500">Sponsor lock</span><span className="font-black text-zinc-200">1d 14h</span></div>
                    <div className="flex justify-between gap-2"><span className="text-zinc-500">Reward draft</span><span className="font-black text-zinc-200">{rewardCount ? "Ready" : "After race"}</span></div>
                  </div>
                </Panel>
              </div>

              <div className="grid grid-cols-[1fr_0.86fr] gap-3">
                <Panel title="Your Team">
                  <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-3">
                    <p className="text-lg font-black uppercase leading-tight text-zinc-50">{player.teamName}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div><p className="text-[9px] uppercase text-zinc-500">OVR</p><p className="text-2xl font-black text-zinc-50">{Math.round(readyPercent * 0.86)}</p></div>
                      <div><p className="text-[9px] uppercase text-zinc-500">Rank</p><p className="text-2xl font-black text-zinc-50">25</p></div>
                    </div>
                    <button onClick={() => setScreen("teamHq")} className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 active:scale-95">Team details</button>
                  </div>
                </Panel>

                <Panel title="Race Status">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-[10px]"><span className="text-zinc-500">Status</span><span className="font-black text-red-400">{weekendStatus}</span></div>
                    <div className="flex items-center justify-between text-[10px]"><span className="text-zinc-500">Ready</span><span className="font-black text-zinc-100">{validation.filledSlots}/{validation.totalSlots}</span></div>
                    <ProgressBar value={readyPercent} />
                    <button onClick={() => setScreen(validation.isReady ? "raceWeekend" : "loadout")} className="mt-2 rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white active:scale-95">
                      {validation.isReady ? "Confirm" : "Fix loadout"}
                    </button>
                  </div>
                </Panel>
              </div>

              <Panel title="Standings" action="Global">
                <div className="grid gap-1.5">
                  {standingsPreview.map((item) => (
                    <button key={item.rank} onClick={() => setScreen("standings")} className={`grid grid-cols-[24px_1fr_56px] rounded-lg px-2 py-1.5 text-left text-[10px] ${item.name === "You" ? "bg-red-950/40 text-red-300" : "bg-black/30 text-zinc-300"}`}>
                      <span>{item.rank}</span>
                      <span className="font-bold">{item.name}</span>
                      <span className="text-right font-black">{item.points} pts</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Sponsor Challenges" action="Active 0/2">
                <div className="grid gap-3">
                  <button onClick={() => setScreen("sponsors")} className="rounded-xl border border-white/10 bg-black/35 p-3 text-left active:scale-[0.98]">
                    <div className="flex items-center justify-between text-[10px]"><span className="font-black uppercase text-zinc-200">Finish top 10</span><span className="text-zinc-500">0 / 1</span></div>
                    <div className="mt-2"><ProgressBar value={0} /></div>
                    <p className="mt-2 text-[10px] font-bold text-yellow-300">Reward 750 credits</p>
                  </button>
                  <button onClick={() => setScreen("sponsors")} className="rounded-xl border border-white/10 bg-black/35 p-3 text-left active:scale-[0.98]">
                    <div className="flex items-center justify-between text-[10px]"><span className="font-black uppercase text-zinc-200">5 races in top 5</span><span className="text-zinc-500">2 / 5</span></div>
                    <div className="mt-2"><ProgressBar value={40} /></div>
                    <p className="mt-2 text-[10px] font-bold text-yellow-300">Reward 2,500 credits</p>
                  </button>
                </div>
              </Panel>
            </div>
          )}

          {screen === "loadout" && <RaceLoadoutScreen />}
          {screen === "garage" && <GarageStashScreen />}
          {screen === "market" && <MarketScreen />}

          {screen === "more" && (
            <div className="flex flex-col gap-4 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Command Menu</p>
                <h2 className="mt-1 text-3xl font-black text-zinc-50">More</h2>
              </div>

              <div className="grid gap-3">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className="rounded-[1.4rem] border border-zinc-800 bg-zinc-900 p-4 text-left shadow-lg shadow-black/20 active:scale-[0.98]"
                  >
                    <h3 className="font-black text-zinc-100">{item.label}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
                  </button>
                ))}
              </div>

              <section className="rounded-[1.75rem] border border-red-900/60 bg-red-950/20 p-4 shadow-xl shadow-black/20">
                <p className="text-xs uppercase tracking-[0.24em] text-red-300">Developer</p>
                <h3 className="mt-1 text-xl font-black text-zinc-50">Reset local game</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">Clears the current local save and rebuilds the default garage, market and loadout state.</p>
                <button onClick={handleDevReset} className="mt-4 w-full rounded-2xl bg-red-500 px-4 py-3 font-black text-white active:scale-[0.98]">DEV RESET</button>
              </section>
            </div>
          )}

          {screen === "standings" && <StandingsScreen />}
          {screen === "raceWeekend" && <RaceWeekendScreen />}
          {screen === "circuits" && <CircuitsScreen />}
          {screen === "teamHq" && <TeamHqScreen />}
          {screen === "upgrades" && <UpgradesScreen />}
          {screen === "sponsors" && <SponsorsScreen />}
          {screen === "results" && <RaceResultsScreen />}
        </section>

        <nav className="grid shrink-0 grid-cols-5 border-t border-white/10 bg-black px-2 py-2">
          {navItems.map((item) => {
            const isActive = screen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`rounded-xl px-1 py-2 text-xs font-black uppercase active:scale-[0.96] ${
                  isActive
                    ? "text-red-500"
                    : "text-zinc-500"
                }`}
              >
                <span className="block text-sm leading-none">{item.icon}</span>
                <span className="mt-1 block text-[9px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
