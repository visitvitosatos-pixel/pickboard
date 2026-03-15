/**
 * src/lib/domain/pick-rules.ts
 *
 * Базовые правила продукта:
 * - какие переходы статусов допустимы
 * - опубликована ли ставка до начала матча
 * - насколько ставка была поздней
 */

import type { PickStatus } from "@/types/pick";

const allowedTransitions: Record<PickStatus, PickStatus[]> = {
  draft: ["published"],
  published: ["locked", "void", "disputed"],
  locked: ["settled", "void", "disputed"],
  settled: ["disputed"],
  void: [],
  disputed: ["settled", "void"],
};

// Проверяет, можно ли перевести ставку из одного статуса в другой.
export function canTransitionPickStatus(
  from: PickStatus,
  to: PickStatus,
): boolean {
  return allowedTransitions[from].includes(to);
}

// Считает, насколько публикация была позднее старта матча.
export function getLatePublishSeconds(params: {
  publishedAtUtc: string | null;
  kickoffAtUtc: string | null;
}) {
  if (!params.publishedAtUtc || !params.kickoffAtUtc) {
    return null;
  }

  const publishedAt = new Date(params.publishedAtUtc).getTime();
  const kickoffAt = new Date(params.kickoffAtUtc).getTime();

  if (Number.isNaN(publishedAt) || Number.isNaN(kickoffAt)) {
    return null;
  }

  const diffSeconds = Math.floor((publishedAt - kickoffAt) / 1000);

  return diffSeconds > 0 ? diffSeconds : 0;
}

// Проверяет, была ли ставка опубликована до начала матча.
export function isPublishedBeforeKickoff(params: {
  publishedAtUtc: string | null;
  kickoffAtUtc: string | null;
}) {
  if (!params.publishedAtUtc || !params.kickoffAtUtc) {
    return false;
  }

  return (
    new Date(params.publishedAtUtc).getTime() <=
    new Date(params.kickoffAtUtc).getTime()
  );
}
