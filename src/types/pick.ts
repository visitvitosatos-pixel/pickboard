/**
 * src/types/pick.ts
 *
 * Здесь лежат типы данных для ставок.
 * Мы оставляем старый тип LegacyStoredPick, чтобы текущий UI не сломался,
 * и параллельно добавляем новую продуктовую модель Pick.
 */

// Старый статус для текущего локального демо.
export type LegacyPickStatus = "pending" | "won" | "lost";

// Старый формат ставки из localStorage. Пока оставляем для совместимости.
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

// Новый статус для продуктовой модели.
export type PickStatus =
  | "draft"
  | "published"
  | "locked"
  | "settled"
  | "void"
  | "disputed";

export type PickSettlementResult = "won" | "lost" | "push" | null;

export type PickType = "single" | "express";

// Нормализованный тип рынка.
export type MarketType =
  | "match_result"
  | "btts"
  | "total_over"
  | "total_under";

// Роли в сообществе. Нужны для будущей модерации и SaaS-логики.
export type CommunityRole =
  | "owner"
  | "admin"
  | "moderator"
  | "tipster"
  | "member";

// Одна нога ставки. Для single будет 1 leg, для express позже несколько.
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

// Новая доменная модель ставки.
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

// История изменения статусов. Нужна для будущего аудита.
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

// На текущем этапе не ломаем старый UI: StoredPick всё ещё смотрит на legacy тип.
export type StoredPick = LegacyStoredPick;
