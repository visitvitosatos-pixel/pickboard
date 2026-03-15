"use client";

// Таблица leaderboard.
// Теперь читает новую доменную модель Pick из dual storage.

import { useEffect, useMemo, useState } from "react";
import { buildProductLeaderboardRows } from "@/lib/domain/scoring";
import { getDomainStoredPicks } from "@/lib/utils/picks-storage";

type LeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  picksCount: number;
  winRate: string;
  roi: string;
  trustScore: number;
};

const demoLeaders: LeaderboardRow[] = [
  {
    id: "1",
    rank: 1,
    name: "@sharpstorm",
    picksCount: 12,
    winRate: "66%",
    roi: "+14.2%",
    trustScore: 82,
  },
  {
    id: "2",
    rank: 2,
    name: "@betwizard",
    picksCount: 18,
    winRate: "61%",
    roi: "+10.8%",
    trustScore: 77,
  },
  {
    id: "3",
    rank: 3,
    name: "@coldvalue",
    picksCount: 24,
    winRate: "58%",
    roi: "+7.4%",
    trustScore: 71,
  },
  {
    id: "4",
    rank: 4,
    name: "@linehunter",
    picksCount: 9,
    winRate: "55%",
    roi: "+4.1%",
    trustScore: 64,
  },
];

export function LeaderboardTable() {
  const [localRows, setLocalRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    const domainPicks = getDomainStoredPicks();

    if (domainPicks.length === 0) {
      setLocalRows([]);
      return;
    }

    const rows = buildProductLeaderboardRows(domainPicks).map((row) => ({
      id: row.id,
      rank: row.rank,
      name: row.name,
      picksCount: row.picksCount,
      winRate: row.winRate,
      roi: row.roi,
      trustScore: row.trustScore,
    }));

    setLocalRows(rows);
  }, []);

  const rows = useMemo(() => {
    return localRows.length > 0 ? localRows : demoLeaders;
  }, [localRows]);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="grid grid-cols-6 gap-2 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.16em] text-white/40">
        <div>Место</div>
        <div className="col-span-2">Участник</div>
        <div>Прогнозы</div>
        <div>Винрейт</div>
        <div>Trust</div>
      </div>

      <div className="divide-y divide-white/10">
        {rows.map((leader) => (
          <article
            key={leader.id}
            className="grid grid-cols-6 gap-2 px-4 py-4 text-sm text-white"
          >
            <div className="font-semibold text-white/80">{leader.rank}</div>

            <div className="col-span-2">
              <p className="font-medium">{leader.name}</p>
              <p className="mt-1 text-xs text-white/50">ROI: {leader.roi}</p>
            </div>

            <div className="text-white/75">{leader.picksCount}</div>
            <div className="text-white/75">{leader.winRate}</div>

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