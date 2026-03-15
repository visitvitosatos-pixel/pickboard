"use client";

// Верхний блок профиля.
// Берёт данные из новой доменной модели Pick.
// Фейковые stats убраны.

import { useEffect, useMemo, useState } from "react";
import { buildProductLeaderboardRows } from "@/lib/domain/scoring";
import { getDomainStoredPicks } from "@/lib/utils/picks-storage";
import type { Pick } from "@/types/pick";

const currentAuthor = "@visit.vitos.bar";

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function ProfileSummary() {
  const [storedPicks, setStoredPicks] = useState<Pick[]>([]);

  useEffect(() => {
    setStoredPicks(getDomainStoredPicks());
  }, []);

  const stats = useMemo(() => {
    const authorPicks = storedPicks.filter(
      (pick) => pick.authorHandle === currentAuthor,
    );

    const leaderboard = buildProductLeaderboardRows(storedPicks);
    const leaderboardRow = leaderboard.find((row) => row.name === currentAuthor);

    if (authorPicks.length === 0) {
      return {
        rank: "—",
        trustScore: "—",
        picksCount: 0,
        winRate: "0.0%",
        roi: "0.0%",
      };
    }

    const settled = authorPicks.filter((pick) => pick.status === "settled");
    const wins = settled.filter((pick) => pick.settlement.result === "won").length;
    const settledCount = settled.length;

    const totalPnl = settled.reduce(
      (sum, pick) => sum + (pick.settlement.pnlUnits ?? 0),
      0,
    );

    const totalRisk = settled.reduce(
      (sum, pick) => sum + (pick.stakeUnits ?? 0),
      0,
    );

    const winRate = settledCount > 0 ? (wins / settledCount) * 100 : 0;
    const roi = totalRisk > 0 ? (totalPnl / totalRisk) * 100 : 0;

    return {
      rank: leaderboardRow?.rank ?? "—",
      trustScore: leaderboardRow?.trustScore ?? "—",
      picksCount: authorPicks.length,
      winRate: formatPercent(winRate),
      roi: formatSignedPercent(roi),
    };
  }, [storedPicks]);

  return (
    <section className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white">
            VV
          </div>

          <div>
            <p className="text-sm text-white/50">Участник сообщества</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              {currentAuthor}
            </h1>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Место в рейтинге</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.rank}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Trust score</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.trustScore}
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/50">Статистика по локальным данным</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Прогнозов</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.picksCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Винрейт</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.winRate}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">ROI</p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                stats.roi.startsWith("-") ? "text-rose-300" : "text-emerald-300"
              }`}
            >
              {stats.roi}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}