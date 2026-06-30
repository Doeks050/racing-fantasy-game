"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/ui/GameCard";
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
  { id: "home", label: "Home", icon: "◆" },
  { id: "loadout", label: "Loadout", icon: "▣" },
  { id: "garage", label: "Garage", icon: "▦" },
  { id: "market", label: "Market", icon: "◇" },
  { id: "more", label: "More", icon: "⋯" },
];

function ActionCard({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[1.4rem] border border-zinc-800 bg-zinc-900/90 p-4 text-left shadow-lg shadow-black/20 active:scale-[0.98]"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-black text-zinc-100">{value}</p>
    </button>
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

  useEffect(() => {
    hydrateFromSave();
  }, [hydrateFromSave]);

  function handleDevReset() {
    resetGameState();
    setScreen("home");
  }

  return (
    <main className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,#153447_0%,#09090b_38%,#020617_100%)] text-zinc-100">
      <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden border-x border-white/5 bg-zinc-950/70 backdrop-blur">
        <header className="shrink-0 border-b border-white/10 bg-zinc-950/70 px-4 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-300">Racing Fantasy</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-50">Neon Harbor GP</h1>
            </div>
            <div className="rounded-2xl border border-cyan-500/25 bg-cyan-950/20 px-3 py-2 text-right">
              <p className="text-[10px] uppercase text-zinc-500">Credits</p>
              <p className="text-sm font-black text-cyan-300">{player.credits}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">{player.teamName} · Level {player.level} · {player.xp} XP</p>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {screen === "home" && (
            <div className="flex flex-col gap-4 pb-4">
              <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/25 bg-zinc-900 p-4 shadow-2xl shadow-black/30">
                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-400/15 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Next Race Weekend</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-50">Neon Harbor GP</h2>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase text-zinc-500">Deadline</p>
                      <p className="mt-1 text-sm font-black text-zinc-100">{gameState.race.deadlineLabel}</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase text-zinc-500">Status</p>
                      <p className="mt-1 text-sm font-black text-cyan-300">{weekendStatus}</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase text-zinc-500">Ready</p>
                      <p className="mt-1 text-sm font-black text-zinc-100">{validation.filledSlots}/{validation.totalSlots}</p>
                    </div>
                  </div>
                </div>
              </section>

              <button
                onClick={() => setScreen(gameState.race.isSubmitted ? "raceWeekend" : "loadout")}
                className="rounded-[1.5rem] bg-cyan-400 px-4 py-4 text-left font-black text-zinc-950 shadow-xl shadow-cyan-950/40 active:scale-[0.98]"
              >
                <span className="block text-xs uppercase tracking-[0.22em] opacity-70">
                  {validation.isReady ? "Race entry" : "Action required"}
                </span>
                <span className="mt-1 block text-lg">
                  {gameState.race.isSubmitted ? "View Race Weekend" : validation.isReady ? "Confirm Race Loadout" : "Finish Race Loadout"}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <ActionCard label="Garage" value="Stash Grid" onClick={() => setScreen("garage")} />
                <ActionCard label="Market" value="Buy Parts" onClick={() => setScreen("market")} />
                <ActionCard label="Results" value={gameState.race.isCompleted ? "Completed" : "Preview"} onClick={() => setScreen("results")} />
                <ActionCard label="Rewards" value={rewardCount ? `${rewardCount} Ready` : "Locked"} onClick={() => setScreen("upgrades")} />
              </div>

              <GameCard tone={validation.isReady ? "cyan" : "amber"} eyebrow="Loadout State" title={validation.isReady ? "Race-ready package" : "Missing race slots"}>
                {validation.isReady ? (
                  <p className="text-sm leading-6 text-zinc-400">
                    Both cars and the pitwall are ready. Confirm your race entry before the deadline.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {validation.missing.slice(0, 5).map((item) => (
                      <span key={item} className="rounded-full bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-amber-200">
                        {item}
                      </span>
                    ))}
                    {validation.missing.length > 5 && (
                      <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] font-bold text-zinc-400">
                        +{validation.missing.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </GameCard>
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

              <GameCard tone="red" eyebrow="Developer" title="Reset local game" description="Clears the current local save and rebuilds the default garage, market and loadout state.">
                <button
                  onClick={handleDevReset}
                  className="w-full rounded-2xl bg-red-500 px-4 py-3 font-black text-white active:scale-[0.98]"
                >
                  DEV RESET
                </button>
              </GameCard>
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

        <nav className="grid shrink-0 grid-cols-5 border-t border-white/10 bg-zinc-950/90 px-2 py-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = screen === item.id || (item.id === "more" && moreItems.some((moreItem) => moreItem.id === screen));

            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`rounded-2xl px-1 py-2 text-xs font-bold active:scale-[0.96] ${
                  isActive
                    ? "bg-cyan-400 text-zinc-950"
                    : "text-zinc-500"
                }`}
              >
                <span className="block text-sm leading-none">{item.icon}</span>
                <span className="mt-1 block text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
