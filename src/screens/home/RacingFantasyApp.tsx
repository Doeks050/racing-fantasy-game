"use client";

import { useEffect, useState } from "react";
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
  { id: "upgrades", label: "Upgrades", description: "Improve parts over time" },
  { id: "sponsors", label: "Sponsors", description: "Sponsor challenges" },
  { id: "results", label: "Race Results", description: "Simulation outcome" },
];

export function RacingFantasyApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const hydrateFromSave = useGameStore((store) => store.hydrateFromSave);
  const player = useGameStore((store) => store.gameState.player);

  useEffect(() => {
    hydrateFromSave();
  }, [hydrateFromSave]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Racing Fantasy</p>
          <h1 className="mt-1 text-2xl font-black">Neon Harbor GP</h1>
          <p className="mt-1 text-xs text-zinc-500">{player.teamName} · {player.credits} credits</p>
        </header>

        <section className="flex-1 px-4 py-4 pb-24">
          {screen === "home" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-cyan-500/30 bg-zinc-900 p-4">
                <p className="text-sm text-zinc-400">Next Race Weekend</p>
                <h2 className="mt-1 text-2xl font-bold">Neon Harbor GP</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Deadline: Friday 20:00 · Status: Loadout open
                </p>
              </div>

              <button
                onClick={() => setScreen("loadout")}
                className="rounded-2xl bg-cyan-400 px-4 py-4 font-black text-zinc-950"
              >
                Build Race Loadout
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setScreen("garage")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Garage</button>
                <button onClick={() => setScreen("market")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Market</button>
                <button onClick={() => setScreen("standings")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Standings</button>
                <button onClick={() => setScreen("more")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">More</button>
              </div>
            </div>
          )}

          {screen === "loadout" && <RaceLoadoutScreen />}
          {screen === "garage" && <GarageStashScreen />}
          {screen === "market" && <MarketScreen />}

          {screen === "more" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black">More</h2>
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
                >
                  <h3 className="font-bold">{item.label}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
                </button>
              ))}
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

        <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t border-zinc-800 bg-zinc-950">
          {[
            ["home", "Home"],
            ["loadout", "Loadout"],
            ["garage", "Garage"],
            ["market", "Market"],
            ["more", "More"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setScreen(id as Screen)}
              className={`px-1 py-3 text-xs ${
                screen === id || (id === "more" && moreItems.some((item) => item.id === screen))
                  ? "text-cyan-300"
                  : "text-zinc-500"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
