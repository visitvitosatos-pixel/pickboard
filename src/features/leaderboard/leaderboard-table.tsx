"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredPicks } from "@/lib/utils/picks-storage";
import { buildLeaderboardFromPicks } from "@/lib/utils/leaderboard";
import type { LeaderboardRow } from "@/lib/utils/leaderboard";

const demoLeaders: LeaderboardRow[] = [
  {
    id: "1",
    rank: 1,
    name: "@sharpstorm",
    picksCount: 12,
    winRate: "66%",
    roi: "+14.2%",
    streak: "4W",
    trustScore: 82,
  },
  {
    id: "2",
    rank: 2,
    name: "@betwizard",
    picksCount: 18,
    winRate: "61%",
    roi: "+10.8%",
    streak: "2W",
    trustScore: 77,
  },
  {
    id: "3",
    rank: 3,
    name: "@coldvalue",
    picksCount: 24,
    winRate: "58%",
    roi: "+7.4%",
    streak: "1L",
    trustScore: 71,
  },
  {
    id: "4",
    rank: 4,
    name: "@linehunter",
    picksCount: 9,
    winRate: "55%",
    roi: "+4.1%",
    streak: "3W",
    trustScore: 64,
  },
];

export function LeaderboardTable() {
  const [localRows, setLocalRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    const storedPicks = getStoredPicks();

    if (storedPicks.length === 0) {
      setLocalRows([]);
      return;
    }

    setLocalRows(buildLeaderboardFromPicks(storedPicks));
  }, []);

  const rows = useMemo(() => {
    return localRows.length > 0 ? localRows : demoLeaders;
  }, [localRows]);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="grid grid-cols-7 gap-2 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.16em] text-white/40">
        <div>Место</div>
        <div className="col-span-2">Участник</div>
        <div>Прогнозы</div>
        <div>Винрейт</div>
        <div>ROI</div>
        <div>Trust</div>
      </div>

      <div className="divide-y divide-white/10">
        {rows.map((leader) => (
          <article
            key={leader.id}
            className="grid grid-cols-7 gap-2 px-4 py-4 text-sm text-white"
          >
            <div className="font-semibold text-white/80">{leader.rank}</div>

            <div className="col-span-2">
              <p className="font-medium">{leader.name}</p>
              <p className="mt-1 text-xs text-white/50">
                Серия: {leader.streak}
              </p>
            </div>

            <div className="text-white/75">{leader.picksCount}</div>
            <div className="text-white/75">{leader.winRate}</div>
            <div
              className={
                leader.roi.startsWith("-") ? "text-rose-300" : "text-emerald-300"
              }
            >
              {leader.roi}
            </div>
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {leader.trustScore}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
