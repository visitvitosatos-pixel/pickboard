// Данные для leaderboard.
//
// Что делает этот файл:
// 1) читает новую доменную модель Pick из localStorage
// 2) строит рейтинг по нормализованным данным
// 3) если доменных данных ещё нет, мягко откатывается на старую демо-таблицу
//
// Зачем:
// это первый реальный шаг к продуктовой логике рейтинга,
// но без слома текущего UI leaderboard-страницы.

import { buildProductLeaderboardRows } from "@/lib/domain/scoring";
import { getDomainStoredPicks } from "@/lib/utils/picks-storage";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  trustScore: number;
  winRate: string;
  roi: string;
  picksCount: number;
};

const fallbackLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "@sharpstorm",
    trustScore: 91,
    winRate: "68%",
    roi: "+24%",
    picksCount: 37,
  },
  {
    rank: 2,
    name: "@betwizard",
    trustScore: 87,
    winRate: "64%",
    roi: "+18%",
    picksCount: 42,
  },
  {
    rank: 3,
    name: "@coldvalue",
    trustScore: 82,
    winRate: "59%",
    roi: "+11%",
    picksCount: 29,
  },
];

export function getLeaderboardEntries(): LeaderboardEntry[] {
  const domainPicks = getDomainStoredPicks();

  if (!domainPicks.length) {
    return fallbackLeaderboard;
  }

  const rows = buildProductLeaderboardRows(domainPicks);

  if (!rows.length) {
    return fallbackLeaderboard;
  }

  return rows.map((row) => ({
    rank: row.rank,
    name: row.name,
    trustScore: row.trustScore,
    winRate: row.winRate,
    roi: row.roi,
    picksCount: row.picksCount,
  }));
}