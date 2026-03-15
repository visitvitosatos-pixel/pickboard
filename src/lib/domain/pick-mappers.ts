/**
 * src/lib/domain/pick-mappers.ts
 *
 * Переводит старую локальную ставку из демо-модели
 * в новую продуктовую модель Pick.
 *
 * Это мост между старым UI и новой архитектурой.
 */

import {
  DEFAULT_AUTHOR_HANDLE,
  DEFAULT_AUTHOR_ID,
  DEFAULT_COMMUNITY_ID,
} from "@/lib/domain/constants";
import {
  getLatePublishSeconds,
  isPublishedBeforeKickoff,
} from "@/lib/domain/pick-rules";
import type {
  LegacyStoredPick,
  MarketType,
  Pick,
  PickSettlementResult,
} from "@/types/pick";

function inferMarketType(market: string): MarketType {
  const value = market.toLowerCase();

  if (value.includes("обе забьют")) {
    return "btts";
  }

  if (value.includes("тотал больше")) {
    return "total_over";
  }

  if (value.includes("тотал меньше")) {
    return "total_under";
  }

  return "match_result";
}

function inferMarketValue(market: string): string {
  if (market.includes("П1")) return "1";
  if (market.includes("Х")) return "X";
  if (market.includes("П2")) return "2";
  if (market.toLowerCase().includes("да")) return "yes";
  if (market.toLowerCase().includes("нет")) return "no";

  const totalMatch = market.match(/(\d+(\.\d+)?)/);

  return totalMatch?.[1] ?? market;
}

function mapLegacyStatus(status: LegacyStoredPick["status"]): Pick["status"] {
  if (status === "pending") return "published";
  return "settled";
}

function mapLegacySettlementResult(
  status: LegacyStoredPick["status"],
): PickSettlementResult {
  if (status === "won") return "won";
  if (status === "lost") return "lost";
  return null;
}

function calculatePnlUnits(params: {
  stakeUnits: number | null;
  odds: number;
  result: PickSettlementResult;
}) {
  if (!params.stakeUnits) return null;
  if (params.result === "won") {
    return Number((params.stakeUnits * (params.odds - 1)).toFixed(2));
  }
  if (params.result === "lost") {
    return Number((-params.stakeUnits).toFixed(2));
  }
  if (params.result === "push") return 0;
  return null;
}

function calculateRoiPercent(params: {
  stakeUnits: number | null;
  pnlUnits: number | null;
}) {
  if (!params.stakeUnits || params.pnlUnits === null) return null;
  return Number(((params.pnlUnits / params.stakeUnits) * 100).toFixed(2));
}

export function mapLegacyStoredPickToDomainPick(legacy: LegacyStoredPick): Pick {
  const odds = Number(legacy.odds || "0");
  const stakeUnits = legacy.stakeUnits ? Number(legacy.stakeUnits) : null;
  const settlementResult = mapLegacySettlementResult(legacy.status);

  // В handoff нет точного kickoff UTC, поэтому временно используем createdAt.
  // Это мостовое решение до нормального матчевого объекта.
  const kickoffAtUtc = legacy.createdAt;
  const publishedAtUtc = legacy.createdAt;

  const pnlUnits = calculatePnlUnits({
    stakeUnits,
    odds,
    result: settlementResult,
  });

  const roiPercent = calculateRoiPercent({
    stakeUnits,
    pnlUnits,
  });

  return {
    id: legacy.id,
    communityId: DEFAULT_COMMUNITY_ID,
    authorId: DEFAULT_AUTHOR_ID,
    authorHandle: legacy.author || DEFAULT_AUTHOR_HANDLE,
    type: "single",
    status: mapLegacyStatus(legacy.status),
    sport: "football",
    leagueKeys: [legacy.league],
    legs: [
      {
        id: `${legacy.id}:leg:1`,
        matchId: `legacy:${legacy.eventName}`,
        competitionName: legacy.league,
        homeTeam: legacy.eventName.split(" vs ")[0] ?? legacy.eventName,
        awayTeam: legacy.eventName.split(" vs ")[1] ?? "",
        kickoffAtUtc,
        marketType: inferMarketType(legacy.market),
        marketValue: inferMarketValue(legacy.market),
        odds,
      },
    ],
    totalOdds: odds,
    stakeUnits,
    confidence: null,
    note: legacy.note,
    createdAtUtc: legacy.createdAt,
    publishedAtUtc,
    lockedAtUtc: null,
    updatedAtUtc: legacy.createdAt,
    settlement: {
      result: settlementResult,
      settledAtUtc: settlementResult ? legacy.createdAt : null,
      settledByUserId: settlementResult ? "legacy-local" : null,
      pnlUnits,
      roiPercent,
    },
    integrity: {
      editedAfterPublish: false,
      publishedBeforeKickoff: isPublishedBeforeKickoff({
        publishedAtUtc,
        kickoffAtUtc,
      }),
      latePublishSeconds: getLatePublishSeconds({
        publishedAtUtc,
        kickoffAtUtc,
      }),
      requiresReview: false,
    },
  };
}
