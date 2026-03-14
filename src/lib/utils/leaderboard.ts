import type { StoredPick } from "@/types/pick";

export type LeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  picksCount: number;
  winRate: string;
  roi: string;
  streak: string;
  trustScore: number;
};

type UserStats = {
  name: string;
  picksCount: number;
  wins: number;
  losses: number;
  pending: number;
  profitUnits: number;
  streakType: "W" | "L" | null;
  streakCount: number;
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function calculateTrustScore(params: {
  picksCount: number;
  winRate: number;
  roi: number;
  pending: number;
}) {
  const volumePart = Math.min(params.picksCount * 2, 30);
  const winRatePart = Math.min(params.winRate * 0.5, 35);
  const roiPart = Math.max(Math.min(params.roi * 1.5, 25), -10);
  const pendingPenalty = Math.min(params.pending, 10);

  const rawScore = volumePart + winRatePart + roiPart - pendingPenalty;

  return Math.max(1, Math.min(99, Math.round(rawScore)));
}

function updateStreak(stats: UserStats, pickStatus: StoredPick["status"]) {
  if (pickStatus === "pending") {
    return;
  }

  const nextType = pickStatus === "won" ? "W" : "L";

  if (stats.streakType === nextType) {
    stats.streakCount += 1;
    return;
  }

  stats.streakType = nextType;
  stats.streakCount = 1;
}

export function buildLeaderboardFromPicks(picks: StoredPick[]): LeaderboardRow[] {
  const finishedOrPendingPicks = [...picks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const statsMap = new Map<string, UserStats>();

  for (const pick of finishedOrPendingPicks) {
    const existingStats =
      statsMap.get(pick.author) ??
      ({
        name: pick.author,
        picksCount: 0,
        wins: 0,
        losses: 0,
        pending: 0,
        profitUnits: 0,
        streakType: null,
        streakCount: 0,
      } satisfies UserStats);

    existingStats.picksCount += 1;

    const units = Number(pick.stakeUnits || "0");
    const odds = Number(pick.odds || "0");

    if (pick.status === "won") {
      existingStats.wins += 1;
      existingStats.profitUnits += units * Math.max(odds - 1, 0);
    } else if (pick.status === "lost") {
      existingStats.losses += 1;
      existingStats.profitUnits -= units;
    } else {
      existingStats.pending += 1;
    }

    updateStreak(existingStats, pick.status);
    statsMap.set(pick.author, existingStats);
  }

  const rows = Array.from(statsMap.values()).map((stats) => {
    const decidedCount = stats.wins + stats.losses;
    const totalRiskUnits = Math.max(
      picks
        .filter((pick) => pick.author === stats.name)
        .reduce((sum, pick) => sum + Number(pick.stakeUnits || "0"), 0),
      1,
    );

    const winRate = decidedCount > 0 ? (stats.wins / decidedCount) * 100 : 0;
    const roi = (stats.profitUnits / totalRiskUnits) * 100;

    const trustScore = calculateTrustScore({
      picksCount: stats.picksCount,
      winRate,
      roi,
      pending: stats.pending,
    });

    return {
      id: stats.name,
      rank: 0,
      name: stats.name,
      picksCount: stats.picksCount,
      winRate: formatPercent(winRate),
      roi: formatSignedPercent(roi),
      streak:
        stats.streakType && stats.streakCount > 0
          ? `${stats.streakCount}${stats.streakType}`
          : "—",
      trustScore,
      _sort: {
        trustScore,
        roi,
        picksCount: stats.picksCount,
      },
    };
  });

  const sortedRows = rows
    .sort((a, b) => {
      if (b._sort.trustScore !== a._sort.trustScore) {
        return b._sort.trustScore - a._sort.trustScore;
      }

      if (b._sort.roi !== a._sort.roi) {
        return b._sort.roi - a._sort.roi;
      }

      return b._sort.picksCount - a._sort.picksCount;
    })
    .map((row, index) => ({
      id: row.id,
      rank: index + 1,
      name: row.name,
      picksCount: row.picksCount,
      winRate: row.winRate,
      roi: row.roi,
      streak: row.streak,
      trustScore: row.trustScore,
    }));

  return sortedRows;
}