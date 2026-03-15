"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredPicks } from "@/lib/utils/picks-storage";
import { buildLeaderboardFromPicks } from "@/lib/utils/leaderboard";
import { buildProfileStats } from "@/lib/utils/profile";
import type { StoredPick } from "@/types/pick";

const currentAuthor = "@visit.vitos.atos";

export function ProfileSummary() {
  const [storedPicks, setStoredPicks] = useState<StoredPick[]>([]);

  useEffect(() => {
    setStoredPicks(getStoredPicks());
  }, []);

  const stats = useMemo(() => {
    const leaderboard = buildLeaderboardFromPicks(storedPicks);

    return buildProfileStats({
      picks: storedPicks,
      leaderboard,
      author: currentAuthor,
    });
  }, [storedPicks]);

  return (
    <section className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white">
            VS
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
            <p className="mt-2 text-2xl font-semibold text-white">{stats.rank}</p>
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Серия</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.streak}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
