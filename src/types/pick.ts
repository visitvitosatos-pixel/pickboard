// Главный файл типов ставок.
//
// Что здесь:
// 1) legacy-тип для текущего UI
// 2) новая продуктовая модель, которую подключим поэтапно
//
// Важно:
// LegacyStoredPick экспортируется отдельно,
// потому что его использует pick-mappers.ts.

export type LegacyPickStatus = "pending" | "won" | "lost";

// Старый формат ставки, на котором сейчас живёт UI
export type LegacyStoredPick = {
  id: string;
  author: string;
  sport: string;
  league: string;
  eventName: string;
  market: string;
  odds: string;
  stakeUnits: string;
  matchStartTime: string;
  betPlacedTime: string;
  note: string;
  status: LegacyPickStatus;
  createdAt: string;
};

// Пока текущий UI использует именно этот тип
export type StoredPick = LegacyStoredPick;

// ===== НОВАЯ ПРОДУКТОВАЯ МОДЕЛЬ =====

export type PickStatus =
  | "draft"
  | "published"
  | "locked"
  | "settled"
  | "void"
  | "disputed";

export type PickSettlementResult = "won" | "lost" | "push" | null;

export type PickType = "single" | "express";

export type MarketType =
  | "match_result"
  | "btts"
  | "total_over"
  | "total_under";

export type CommunityRole =
  | "owner"
  | "admin"
  | "moderator"
  | "tipster"
  | "member";

export type PickLeg = {
  id: string;
  matchId: string;
  competitionName: string;
  homeTeam: string;
  awayTeam: string;
  kickoffAtUtc: string;
  marketType: MarketType;
  marketValue: string;
  odds: number;
};

export type Pick = {
  id: string;
  communityId: string;
  authorId: string;
  authorHandle: string;
  type: PickType;
  status: PickStatus;
  sport: "football";
  leagueKeys: string[];
  legs: PickLeg[];
  totalOdds: number;
  stakeUnits: number | null;
  confidence: 1 | 2 | 3 | null;
  note: string;
  createdAtUtc: string;
  publishedAtUtc: string | null;
  lockedAtUtc: string | null;
  updatedAtUtc: string;
  settlement: {
    result: PickSettlementResult;
    settledAtUtc: string | null;
    settledByUserId: string | null;
    pnlUnits: number | null;
    roiPercent: number | null;
  };
  integrity: {
    editedAfterPublish: boolean;
    publishedBeforeKickoff: boolean;
    latePublishSeconds: number | null;
    requiresReview: boolean;
  };
};

export type PickStatusHistoryItem = {
  id: string;
  pickId: string;
  communityId: string;
  fromStatus: PickStatus | null;
  toStatus: PickStatus;
  changedByUserId: string;
  changedByRole: CommunityRole;
  reason: string | null;
  createdAtUtc: string;
};