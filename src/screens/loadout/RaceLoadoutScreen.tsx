"use client";

import { useState } from "react";
import { carParts, drivers, teamMembers } from "@/data";
import { getCarLoadoutStats, getOverallScore, getTeamLoadoutStats, meterValue } from "@/lib/stats/loadoutStats";
import { GaragePickerScreen } from "@/screens/garage/GaragePickerScreen";
import { DriverPickerScreen } from "@/screens/loadout/DriverPickerScreen";
import { useGameStore } from "@/store/useGameStore";
import type { CarPart, Driver, GaragePickerMode, TeamMember } from "@/types";

type Tab = "car1" | "car2" | "team";

type CarTab = "car1" | "car2";

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

function getCarTab(tab: Tab): CarTab {
  return tab === "car2" ? "car2" : "car1";
}

export function RaceLoadoutScreen() {
  const [tab, setTab] = useState<Tab>("car1");
  const [pickerMode, setPickerMode] = useState<GaragePickerMode | null>(null);
  const [isDriverPickerOpen, setIsDriverPickerOpen] = useState(false);

  const loadout = useGameStore((store) => store.gameState.race.activeLoadout);
  const selectDriver = useGameStore((store) => store.selectDriver);
  const equipCarPart = useGameStore((store) => store.equipCarPart);
  const equipTeamMember = useGameStore((store) => store.equipTeamMember);

  if (isDriverPickerOpen && tab !== "team") {
    const carId = getCarTab(tab);

    return (
      <DriverPickerScreen
        onBack={() => setIsDriverPickerOpen(false)}
        onSelectDriver={(driver: Driver) => {
          selectDriver({ carId, driverId: driver.id });
          setIsDriverPickerOpen(false);
        }}
      />
    );
  }

  if (pickerMode) {
    return (
      <GaragePickerScreen
        mode={pickerMode}
        onBack={() => setPickerMode(null)}
        onSelectCarPart={(part: CarPart) => {
          if (pickerMode.type !== "car_part") return;

          equipCarPart({
            carId: pickerMode.carId,
            slotType: pickerMode.slotType,
            partId: part.id,
          });

          setPickerMode(null);
        }}
        onSelectTeamMember={(member: TeamMember) => {
          if (pickerMode.type !== "team_member") return;

          equipTeamMember({
            slotType: pickerMode.slotType,
            memberId: member.id,
          });

          setPickerMode(null);
        }}
      />
    );
  }

  const activeCarId = getCarTab(tab);
  const car = activeCarId === "car1" ? loadout.car1 : loadout.car2;
  const driver = drivers.find((item) => item.id === car.driverId);
  const carStats = tab !== "team" ? getCarLoadoutStats(car) : null;
  const teamStats = getTeamLoadoutStats(loadout.team);

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
          <button
            onClick={() => setIsDriverPickerOpen(true)}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-left active:scale-[0.98]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Driver</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{driver?.name ?? "Empty Driver Slot"}</h2>
                <p className="text-sm text-zinc-400">Tap to change driver</p>
              </div>
              {driver && (
                <div className="rounded-2xl border border-cyan-400/40 px-3 py-2 text-cyan-300">
                  {driver.rarity}
                </div>
              )}
            </div>
          </button>

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
                    onClick={() =>
                      setPickerMode({
                        type: "car_part",
                        carId: activeCarId,
                        slotType: slot,
                      })
                    }
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
              {carStats &&
                Object.entries(carStats).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{label(stat)}</span>
                      <span>{value}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-zinc-800">
                      <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${meterValue(value)}%` }} />
                    </div>
                  </div>
                ))}

              {carStats && (
                <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-zinc-950 p-3">
                  <p className="text-xs uppercase text-zinc-500">Overall Car Rating</p>
                  <p className="text-3xl font-black text-cyan-300">{getOverallScore(carStats)}</p>
                </div>
              )}
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
                const memberId = loadout.team[slot];
                const member = teamMembers.find((item) => item.id === memberId);

                return (
                  <button
                    key={slot}
                    onClick={() =>
                      setPickerMode({
                        type: "team_member",
                        slotType: slot,
                      })
                    }
                    className="rounded-2xl border border-zinc-700 bg-zinc-950/80 p-3 text-left active:scale-95"
                  >
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
              {Object.entries(teamStats).map(([stat, value]) => (
                <div key={stat}>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{label(stat)}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-zinc-800">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${meterValue(value)}%` }} />
                  </div>
                </div>
              ))}

              <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-zinc-950 p-3">
                <p className="text-xs uppercase text-zinc-500">Overall Team Rating</p>
                <p className="text-3xl font-black text-cyan-300">{getOverallScore(teamStats)}</p>
              </div>
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
