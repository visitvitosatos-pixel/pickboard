import type { StoredPick } from "@/types/pick";

export type ProfileStats = {
  rank: number;
  trustScore: number;
  picksCount: number;
  winRate: string;
  roi: string;
  streak: string;
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function buildProfileStats(params: {
  picks: StoredPick[];
  leaderboard: Array<{
    name: string;
    rank: number;
    trustScore: number;
  }>;
  author: string;
}): ProfileStats {
  const authorPicks = params.picks.filter((pick) => pick.author === params.author);

  if (authorPicks.length === 0) {
    return {
      rank: 12,
      trustScore: 71,
      picksCount: 28,
      winRate: "61%",
      roi: "+9.8%",
      streak: "3W",
    };
  }

  const wins = authorPicks.filter((pick) => pick.status === "won").length;
  const losses = authorPicks.filter((pick) => pick.status === "lost").length;
  const decidedCount = wins + losses;

  const totalRiskUnits = Math.max(
    authorPicks.reduce((sum, pick) => sum + Number(pick.stakeUnits || "0"), 0),
    1,
  );

  const profitUnits = authorPicks.reduce((sum, pick) => {
    const stake = Number(pick.stakeUnits || "0");
    const odds = Number(pick.odds || "0");

    if (pick.status === "won") {
      return sum + stake * Math.max(odds - 1, 0);
    }

    if (pick.status === "lost") {
      return sum - stake;
    }

    return sum;
  }, 0);

  const sortedByDate = [...authorPicks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  let streakType: "W" | "L" | null = null;
  let streakCount = 0;

  for (const pick of sortedByDate) {
    if (pick.status === "pending") {
      continue;
    }

    const currentType = pick.status === "won" ? "W" : "L";

    if (!streakType) {
      streakType = currentType;
      streakCount = 1;
      continue;
    }

    if (streakType === currentType) {
      streakCount += 1;
      continue;
    }

    break;
  }

  const leaderboardRow = params.leaderboard.find((row) => row.name === params.author);

  return {
    rank: leaderboardRow?.rank ?? 1,
    trustScore: leaderboardRow?.trustScore ?? 50,
    picksCount: authorPicks.length,
    winRate: formatPercent(decidedCount > 0 ? (wins / decidedCount) * 100 : 0),
    roi: formatSignedPercent((profitUnits / totalRiskUnits) * 100),
    streak: streakType ? `${streakCount}${streakType}` : "—",
  };
}

export function getRecentProfilePicks(picks: StoredPick[], author: string) {
  const authorPicks = picks
    .filter((pick) => pick.author === author)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return authorPicks.slice(0, 5);
}
