"use client";

import { useState } from "react";
import { RaceLoadoutScreen } from "@/screens/loadout/RaceLoadoutScreen";
import { GarageStashScreen } from "@/screens/garage/GarageStashScreen";
import { MarketScreen } from "@/screens/market/MarketScreen";
import { RewardDraftScreen } from "@/screens/rewards/RewardDraftScreen";
import { StandingsScreen } from "@/screens/standings/StandingsScreen";

type Screen = "home" | "loadout" | "garage" | "market" | "rewards" | "standings";

export function RacingFantasyApp() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Racing Fantasy
          </p>
          <h1 className="mt-1 text-2xl font-black">Neon Harbor GP</h1>
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

              <button onClick={() => setScreen("loadout")} className="rounded-2xl bg-cyan-400 px-4 py-4 font-bold text-zinc-950">
                Build Race Loadout
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setScreen("garage")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Garage Stash</button>
                <button onClick={() => setScreen("market")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Market</button>
                <button onClick={() => setScreen("rewards")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Reward Draft</button>
                <button onClick={() => setScreen("standings")} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left">Standings</button>
              </div>
            </div>
          )}

          {screen === "loadout" && <RaceLoadoutScreen />}
          {screen === "garage" && <GarageStashScreen />}
          {screen === "market" && <MarketScreen />}
          {screen === "rewards" && <RewardDraftScreen />}
          {screen === "standings" && <StandingsScreen />}
        </section>

        <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t border-zinc-800 bg-zinc-950">
          {(["home", "loadout", "garage", "market", "standings"] as Screen[]).map((item) => (
            <button
              key={item}
              onClick={() => setScreen(item)}
              className={`px-1 py-3 text-xs capitalize ${screen === item ? "text-cyan-300" : "text-zinc-500"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
