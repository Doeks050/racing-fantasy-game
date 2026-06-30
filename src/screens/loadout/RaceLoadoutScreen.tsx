"use client";

import { useState } from "react";
import { carParts, demoLoadout, drivers, teamMembers } from "@/data";

type Tab = "car1" | "car2" | "team";

const carSlots = [
  "front_wing",
  "engine",
  "rear_wing",
  "chassis",
  "suspension",
  "gearbox",
  "floor",
  "brakes",
] as const;

const teamSlots = [
  "pit_crew",
  "strategist",
  "race_engineer",
  "data_analyst",
  "mechanic_chief",
] as const;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RaceLoadoutScreen() {
  const [tab, setTab] = useState<Tab>("car1");
  const car = tab === "car1" ? demoLoadout.car1 : demoLoadout.car2;
  const driver = drivers.find((item) => item.id === car?.driverId);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-900 p-1">
        {(["car1", "car2", "team"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-xl px-3 py-3 text-sm font-bold uppercase ${
              tab === item ? "bg-cyan-400 text-zinc-950" : "text-zinc-400"
            }`}
          >
            {item === "car1" ? "Car 1" : item === "car2" ? "Car 2" : "Team"}
          </button>
        ))}
      </div>

      {tab !== "team" ? (
        <>
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Driver</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{driver?.name}</h2>
                <p className="text-sm text-zinc-400">Tap to change driver later</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/40 px-3 py-2 text-cyan-300">
                {driver?.rarity}
              </div>
            </div>
          </section>

          <section className="relative min-h-[300px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
            <div className="absolute left-1/2 top-24 h-24 w-72 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-800/70" />
            <div className="absolute left-1/2 top-32 h-10 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-xl" />
            <p className="relative text-xs uppercase tracking-[0.25em] text-cyan-300">Car Setup</p>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              {carSlots.map((slot) => {
                const partId = car.parts[slot];
                const part = carParts.find((item) => item.id === partId);

                return (
                  <button
                    key={slot}
                    className="min-h-20 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-2 text-left active:scale-95"
                  >
                    <p className="text-[10px] uppercase text-zinc-500">{label(slot)}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-100">{part?.name ?? "Empty"}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="font-bold">Car Performance</h3>
            <div className="mt-3 grid gap-2">
              {["Top Speed", "Acceleration", "Cornering", "Braking", "Stability", "Reliability"].map((stat, i) => (
                <div key={stat}>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{stat}</span>
                    <span>{62 + i * 4}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-zinc-800">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${62 + i * 4}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="font-bold">Driver Stats</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {driver &&
                Object.entries(driver.stats).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-zinc-950 p-3">
                    <p className="text-xs text-zinc-500">{label(key)}</p>
                    <p className="text-lg font-bold">{value}</p>
                  </div>
                ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="relative min-h-[280px] rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Pitwall Setup</p>
            <div className="mt-6 grid gap-3">
              {teamSlots.map((slot) => {
                const memberId = demoLoadout.team[slot];
                const member = teamMembers.find((item) => item.id === memberId);

                return (
                  <button key={slot} className="rounded-2xl border border-zinc-700 bg-zinc-950/80 p-3 text-left">
                    <p className="text-[10px] uppercase text-zinc-500">{label(slot)}</p>
                    <p className="mt-1 text-sm font-bold">{member?.name ?? "Empty"}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="font-bold">Team Performance</h3>
            <div className="mt-3 grid gap-2">
              {["Pit Stop Speed", "Strategy", "Setup Quality", "Reliability Support", "Data Analysis"].map((stat, i) => (
                <div key={stat}>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{stat}</span>
                    <span>{55 + i * 7}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-zinc-800">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${55 + i * 7}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <button className="sticky bottom-16 rounded-2xl bg-cyan-400 px-4 py-4 font-black text-zinc-950">
        Save Race Loadout
      </button>
    </div>
  );
}
