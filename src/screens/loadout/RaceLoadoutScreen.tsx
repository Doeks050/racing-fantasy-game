"use client";

import { useState } from "react";
import { carParts, drivers, teamMembers } from "@/data";
import { getCarLoadoutStats, getOverallScore, getTeamLoadoutStats, meterValue } from "@/lib/stats/loadoutStats";
import { GaragePickerScreen } from "@/screens/garage/GaragePickerScreen";
import { DriverPickerScreen } from "@/screens/loadout/DriverPickerScreen";
import { useGameStore } from "@/store/useGameStore";
import type { CarLoadout, CarPart, Driver, GaragePickerMode, TeamMember } from "@/types";
import type { GameInventorySlot } from "@/engine";

type Tab = "car1" | "car2" | "team";
type CarTab = "car1" | "car2";

const RACE_CAR_IMAGE_PATH = "/cars/race-car-top-down.png";

const carSlots = ["engine", "chassis", "gearbox", "suspension", "brakes", "floor", "front_wing", "rear_wing"] as const;
type CarSlotType = (typeof carSlots)[number];

const partSlotRows: [CarSlotType, CarSlotType][] = [
  ["rear_wing", "engine"],
  ["gearbox", "chassis"],
  ["floor", "suspension"],
  ["front_wing", "brakes"],
];

const teamSlots = ["pit_crew", "strategist", "race_engineer", "data_analyst", "mechanic_chief"] as const;
const carStatKeys = ["topSpeed", "acceleration", "cornering", "braking", "stability", "reliability", "tyreManagement", "aeroEfficiency"] as const;
const driverStatKeys = ["pace", "consistency", "raceCraft", "awareness", "qualifying", "tyreManagement", "wetSkill", "aggression"] as const;

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortLabel(value: string) {
  return value
    .replace("topSpeed", "Speed")
    .replace("acceleration", "Accel")
    .replace("cornering", "Corner")
    .replace("braking", "Brake")
    .replace("stability", "Stable")
    .replace("reliability", "Rel")
    .replace("tyreManagement", "Tyres")
    .replace("aeroEfficiency", "Aero")
    .replace("raceCraft", "Race")
    .replace("wetSkill", "Wet")
    .replace("qualifying", "Quali")
    .replace("aggression", "Aggr");
}

function getCarTab(tab: Tab): CarTab {
  return tab === "car2" ? "car2" : "car1";
}

function resolvePart(loadoutValue: string | undefined, inventorySlots: GameInventorySlot[]) {
  if (!loadoutValue) return undefined;

  const inventorySlot = inventorySlots.find((slot) => slot.slotId === loadoutValue);
  return carParts.find((part) => part.id === (inventorySlot?.entityId ?? loadoutValue));
}

function getDriverRating(driver: Driver | undefined) {
  return driver ? getOverallScore(driver.stats) : 0;
}

function MeterLine({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-1 grid grid-cols-[1fr_auto] text-[9px]">
        <span className="truncate font-bold uppercase text-zinc-500">{name}</span>
        <span className="font-black text-zinc-300">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-sm bg-zinc-800">
        <div className="h-full bg-red-500" style={{ width: `${meterValue(value)}%` }} />
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded border border-red-500/25 bg-red-950/15 px-1.5 py-0.5 text-[8px] font-black uppercase text-red-300">
      {label} {value}
    </span>
  );
}

function DriverPanel({ driver, onClick }: { driver: Driver | undefined; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="grid min-h-[72px] grid-cols-[64px_1fr_auto] items-center gap-2 rounded-md border border-white/10 bg-black/45 p-2 text-left active:scale-[0.98]"
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-red-500/25 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(239,68,68,0.22),transparent_52%)]" />
        <div className="absolute bottom-0 left-1/2 h-10 w-8 -translate-x-1/2 rounded-t-full bg-zinc-800" />
        <div className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full bg-zinc-700" />
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">Active Driver</p>
        <p className="mt-0.5 truncate text-sm font-black uppercase text-zinc-100">{driver?.name ?? "Empty Driver"}</p>
        <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">Driver image slot ready</p>
      </div>

      <div className="grid justify-items-end gap-1">
        {driver && <MiniScore label="DRV" value={getDriverRating(driver)} />}
        <span className="text-[9px] font-black uppercase text-red-300">Change</span>
      </div>
    </button>
  );
}

function RaceCarBackground() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-md bg-black/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.11),transparent_50%)]" />
      {!imageFailed ? (
        <img
          src={RACE_CAR_IMAGE_PATH}
          alt="Race car top down"
          onError={() => setImageFailed(true)}
          className="absolute left-1/2 top-1/2 h-[430px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
          draggable={false}
        />
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-3 text-center">
          <div className="h-52 w-14 rounded-full border border-red-500/30 bg-zinc-950/80" />
          <p className="mt-3 text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">Upload car image</p>
          <p className="mt-1 break-all text-[8px] font-bold text-red-300">{RACE_CAR_IMAGE_PATH}</p>
        </div>
      )}
    </div>
  );
}

function PartSlotCard({ slot, part, onClick }: { slot: CarSlotType; part: CarPart | undefined; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative z-20 min-h-[108px] overflow-hidden rounded-md border border-white/10 bg-zinc-950/68 text-center shadow-lg shadow-black/25 backdrop-blur-[1px] active:scale-[0.98]"
    >
      <div className="absolute inset-0 flex items-center justify-center p-1.5 pt-6">
        {part?.imagePath ? (
          <img src={part.imagePath} alt={part.name} className="h-full w-full object-contain" draggable={false} />
        ) : part ? (
          <div className="grid gap-1 px-2">
            <span className="text-[11px] font-black uppercase leading-tight tracking-[0.08em] text-zinc-200">{part.name}</span>
            <span className="text-[8px] font-black uppercase tracking-[0.14em] text-red-300">Installed</span>
          </div>
        ) : (
          <span className="text-[15px] font-black uppercase tracking-[0.14em] text-zinc-500">Empty</span>
        )}
      </div>

      <div className="absolute inset-x-0 top-0 bg-black/52 px-1.5 py-0.5 backdrop-blur-sm">
        <p className="truncate text-[8px] font-black uppercase tracking-[0.1em] text-zinc-100">{label(slot)}</p>
      </div>
    </button>
  );
}

function RaceCarLoadoutMap({
  car,
  carId,
  inventorySlots,
  onSelectSlot,
}: {
  car: CarLoadout;
  carId: CarTab;
  inventorySlots: GameInventorySlot[];
  onSelectSlot: (slot: CarSlotType) => void;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-zinc-950/85 p-2 shadow-lg shadow-black/20">
      <div className="mb-1.5 grid grid-cols-[1fr_auto] items-center gap-2 border-b border-white/5 pb-1">
        <h3 className="truncate text-[8px] font-black uppercase tracking-[0.16em] text-zinc-400">Car Parts</h3>
        <p className="text-[8px] font-black uppercase tracking-[0.12em] text-red-400">{carId === "car1" ? "Car 1" : "Car 2"}</p>
      </div>

      <div className="relative min-h-[458px] overflow-hidden rounded-md border border-zinc-800 bg-black/35 p-2">
        <RaceCarBackground />

        <div className="relative z-10 grid h-full min-h-[442px] grid-cols-2 content-between gap-2">
          {partSlotRows.flatMap(([leftSlot, rightSlot]) => [leftSlot, rightSlot]).map((slot) => (
            <PartSlotCard key={slot} slot={slot} part={resolvePart(car.parts[slot], inventorySlots)} onClick={() => onSelectSlot(slot)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsColumn({ title, car, driver, inventorySlots }: { title: string; car: CarLoadout; driver: Driver | undefined; inventorySlots: GameInventorySlot[] }) {
  const carStats = getCarLoadoutStats(car, inventorySlots);
  const carRating = getOverallScore(carStats);
  const driverRating = getDriverRating(driver);

  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-2">
      <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-center gap-1.5">
        <div className="min-w-0">
          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-red-300">{title}</p>
          <p className="truncate text-[9px] font-bold text-zinc-400">{driver?.name ?? "No driver"}</p>
        </div>
        <MiniScore label="CAR" value={carRating} />
        <MiniScore label="DRV" value={driverRating} />
      </div>

      <div className="grid gap-2">
        <div>
          <p className="mb-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">Car Stats</p>
          <div className="grid gap-1.5">
            {carStatKeys.map((key) => (
              <MeterLine key={key} name={shortLabel(key)} value={carStats[key]} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">Driver Stats</p>
          <div className="grid gap-1.5">
            {driverStatKeys.map((key) => (
              <MeterLine key={key} name={shortLabel(key)} value={driver?.stats[key] ?? 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadoutStatsOverview({ loadout, inventorySlots }: { loadout: { car1: CarLoadout; car2: CarLoadout }; inventorySlots: GameInventorySlot[] }) {
  const driver1 = drivers.find((driver) => driver.id === loadout.car1.driverId);
  const driver2 = drivers.find((driver) => driver.id === loadout.car2.driverId);

  return (
    <details className="rounded-md border border-white/10 bg-zinc-950/85 p-2 shadow-lg shadow-black/20">
      <summary className="cursor-pointer list-none rounded-md border border-zinc-800 bg-black/35 px-2 py-1.5 marker:hidden">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-200">Loadout Stats</p>
            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Tap to open full car + driver stat list</p>
          </div>
          <span className="rounded border border-red-500/30 bg-red-950/15 px-2 py-1 text-[8px] font-black uppercase text-red-300">View</span>
        </div>
      </summary>

      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
        <StatsColumn title="Car 1" car={loadout.car1} driver={driver1} inventorySlots={inventorySlots} />
        <StatsColumn title="Car 2" car={loadout.car2} driver={driver2} inventorySlots={inventorySlots} />
      </div>
    </details>
  );
}

export function RaceLoadoutScreen() {
  const [tab, setTab] = useState<Tab>("car1");
  const [pickerMode, setPickerMode] = useState<GaragePickerMode | null>(null);
  const [isDriverPickerOpen, setIsDriverPickerOpen] = useState(false);

  const gameState = useGameStore((store) => store.gameState);
  const loadout = gameState.race.activeLoadout;
  const inventorySlots = gameState.garage.inventorySlots;
  const selectDriver = useGameStore((store) => store.selectDriver);
  const equipCarPart = useGameStore((store) => store.equipCarPart);
  const unequipCarPart = useGameStore((store) => store.unequipCarPart);
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
        onSelectCarPartSlot={(slot) => {
          if (pickerMode.type !== "car_part") return;

          equipCarPart({
            carId: pickerMode.carId,
            slotType: pickerMode.slotType,
            inventorySlotId: slot.slotId,
          });

          setPickerMode(null);
        }}
        onRemoveCarPart={() => {
          if (pickerMode.type !== "car_part") return;

          unequipCarPart({
            carId: pickerMode.carId,
            slotType: pickerMode.slotType,
          });

          setPickerMode(null);
        }}
        onSelectTeamMember={(member: TeamMember) => {
          if (pickerMode.type !== "team_member") return;

          equipTeamMember({ slotType: pickerMode.slotType, memberId: member.id });
          setPickerMode(null);
        }}
      />
    );
  }

  const activeCarId = getCarTab(tab);
  const car = activeCarId === "car1" ? loadout.car1 : loadout.car2;
  const driver = drivers.find((item) => item.id === car.driverId);
  const teamStats = getTeamLoadoutStats(loadout.team);

  return (
    <div className="grid gap-2 pb-4">
      <div className="grid grid-cols-3 overflow-hidden rounded-md border border-white/10 bg-black/40 shadow-lg shadow-black/20">
        {(["car1", "car2", "team"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`h-7 border-b px-2 text-[8px] font-black uppercase tracking-[0.13em] active:scale-[0.98] ${
              tab === item
                ? "border-red-500 bg-red-950/15 text-zinc-100"
                : "border-transparent bg-zinc-950/40 text-zinc-500"
            }`}
          >
            {item === "car1" ? "Driver 1" : item === "car2" ? "Driver 2" : "Team"}
          </button>
        ))}
      </div>

      {tab !== "team" ? (
        <>
          <DriverPanel driver={driver} onClick={() => setIsDriverPickerOpen(true)} />
          <RaceCarLoadoutMap
            car={car}
            carId={activeCarId}
            inventorySlots={inventorySlots}
            onSelectSlot={(slotType) => setPickerMode({ type: "car_part", carId: activeCarId, slotType })}
          />
        </>
      ) : (
        <section className="rounded-md border border-white/10 bg-zinc-950/85 p-2 shadow-lg shadow-black/20">
          <div className="mb-2 grid grid-cols-[1fr_auto] items-center gap-2 border-b border-white/5 pb-1.5">
            <h3 className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400">Pitwall Setup</h3>
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-red-400">Team</p>
          </div>

          <div className="grid gap-2">
            {teamSlots.map((slot) => {
              const memberId = loadout.team[slot];
              const member = teamMembers.find((item) => item.id === memberId);

              return (
                <button
                  key={slot}
                  onClick={() => setPickerMode({ type: "team_member", slotType: slot })}
                  className="grid grid-cols-[1fr_auto] rounded-md border border-zinc-800 bg-black/35 p-2.5 text-left active:scale-[0.98]"
                >
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">{label(slot)}</p>
                    <p className="truncate text-sm font-bold text-zinc-100">{member?.name ?? "Empty"}</p>
                  </div>
                  <span className="self-center text-[9px] font-black uppercase text-red-300">Select</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.entries(teamStats).map(([stat, value]) => (
              <div key={stat} className="rounded-md border border-zinc-800 bg-black/35 p-2">
                <p className="text-[8px] font-black uppercase tracking-[0.12em] text-zinc-500">{label(stat)}</p>
                <p className="text-base font-black text-zinc-100">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <LoadoutStatsOverview loadout={loadout} inventorySlots={inventorySlots} />
    </div>
  );
}
