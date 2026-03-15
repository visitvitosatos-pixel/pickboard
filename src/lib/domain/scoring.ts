/**
 * src/lib/domain/scoring.ts
 *
 * Первая продуктовая версия расчёта лидерборда.
 * Это ещё не финальная “научная” формула, а beta-правила для пилота.
 */

import type { Pick } from "@/types/pick";

export type ProductLeaderboardRow = {
  id: string;
  name: string;
  rank: number;
  settledCount: number;
  picksCount: number;
  winRate: string;
  roi: string;
  pnlUnits: string;
  trustScore: number;
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatSigned(value: number, suffix = "") {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}${suffix}`;
}

function calculateTrustScore(params: {
  settledCount: number;
  publishedBeforeKickoffRate: number;
  roiPercent: number;
  disputedCount: number;
}) {
  const volume = Math.min(params.settledCount * 2.5, 35);
  const discipline = Math.min(params.publishedBeforeKickoffRate * 0.35, 30);
  const roi = Math.max(Math.min(params.roiPercent * 1.2, 25), -10);
  const disputesPenalty = Math.min(params.disputedCount * 5, 20);

  return Math.max(
    1,
    Math.min(99, Math.round(volume + discipline + roi - disputesPenalty)),
  );
}

export function buildProductLeaderboardRows(picks: Pick[]): ProductLeaderboardRow[] {
  const grouped = new Map<string, Pick[]>();

  for (const pick of picks) {
    const list = grouped.get(pick.authorHandle) ?? [];
    list.push(pick);
    grouped.set(pick.authorHandle, list);
  }

  const rows = Array.from(grouped.entries()).map(([authorHandle, authorPicks]) => {
    const settled = authorPicks.filter((pick) => pick.status === "settled");
    const wins = settled.filter((pick) => pick.settlement.result === "won").length;
    const losses = settled.filter((pick) => pick.settlement.result === "lost").length;
    const settledCount = settled.length;

    const totalPnl = settled.reduce(
      (sum, pick) => sum + (pick.settlement.pnlUnits ?? 0),
      0,
    );

    const totalRisk = settled.reduce(
      (sum, pick) => sum + (pick.stakeUnits ?? 0),
      0,
    );

    const roiPercent = totalRisk > 0 ? (totalPnl / totalRisk) * 100 : 0;

    const beforeKickoffCount = authorPicks.filter(
      (pick) => pick.integrity.publishedBeforeKickoff,
    ).length;

    const publishedBeforeKickoffRate =
      authorPicks.length > 0 ? (beforeKickoffCount / authorPicks.length) * 100 : 0;

    const disputedCount = authorPicks.filter(
      (pick) => pick.status === "disputed",
    ).length;

    const trustScore = calculateTrustScore({
      settledCount,
      publishedBeforeKickoffRate,
      roiPercent,
      disputedCount,
    });

    return {
      id: authorHandle,
      name: authorHandle,
      rank: 0,
      picksCount: authorPicks.length,
      settledCount,
      winRate: formatPercent(
        settledCount > 0 ? (wins / Math.max(wins + losses, 1)) * 100 : 0,
      ),
      roi: formatSigned(roiPercent, "%"),
      pnlUnits: formatSigned(totalPnl, "u"),
      trustScore,
      _sort: {
        trustScore,
        roiPercent,
        settledCount,
      },
    };
  });

  return rows
    .sort((a, b) => {
      if (b._sort.trustScore !== a._sort.trustScore) {
        return b._sort.trustScore - a._sort.trustScore;
      }

      if (b._sort.roiPercent !== a._sort.roiPercent) {
        return b._sort.roiPercent - a._sort.roiPercent;
      }

      return b._sort.settledCount - a._sort.settledCount;
    })
    .map((row, index) => ({
      id: row.id,
      name: row.name,
      rank: index + 1,
      picksCount: row.picksCount,
      settledCount: row.settledCount,
      winRate: row.winRate,
      roi: row.roi,
      pnlUnits: row.pnlUnits,
      trustScore: row.trustScore,
    }));
}
