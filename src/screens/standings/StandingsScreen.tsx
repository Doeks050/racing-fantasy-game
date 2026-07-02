"use client";

import { homeDriverLeaderboardPreview, homeTeamLeaderboardPreview, type HomeLeaderboardPreviewItem } from "@/data/home/homeDashboard";
import { useGameStore } from "@/store/useGameStore";

function LeaderboardTable({ title, items, playerTeamName }: { title: string; items: HomeLeaderboardPreviewItem[]; playerTeamName: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/85 p-3 shadow-lg shadow-black/20">
      <div className="mb-2 border-b border-white/5 pb-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300">{title}</h3>
      </div>
      <div className="grid gap-1.5">
        {items.map((item) => (
          <div
            key={`${title}-${item.rank}-${item.name}`}
            className={`grid grid-cols-[34px_1fr_64px] rounded-md px-2 py-2 text-sm ${
              item.isPlayer ? "bg-red-950/35 text-red-300" : "bg-black/35 text-zinc-300"
            }`}
          >
            <span className="font-black">P{item.rank}</span>
            <span className="truncate font-bold">{item.isPlayer && item.name === "You" ? playerTeamName : item.name}</span>
            <span className="text-right font-black">{item.points} pts</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StandingsScreen() {
  const teamName = useGameStore((store) => store.gameState.player.teamName);

  return (
    <div className="grid gap-3 pb-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Season</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-50">Standings</h2>
      </div>

      <LeaderboardTable title="Driver Leaderboard" items={homeDriverLeaderboardPreview} playerTeamName={teamName} />
      <LeaderboardTable title="Team Leaderboard" items={homeTeamLeaderboardPreview} playerTeamName={teamName} />
    </div>
  );
}
