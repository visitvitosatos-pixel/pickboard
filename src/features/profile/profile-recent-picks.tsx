"use client";

// Последние пики профиля.
// Читает доменные Pick из dual storage.

import { useEffect, useMemo, useState } from "react";
import { getDomainStoredPicks } from "@/lib/utils/picks-storage";
import type { Pick } from "@/types/pick";

const currentAuthor = "@visit.vitos.bar";

const demoPicks = [
  {
    id: "1",
    eventName: "Arsenal vs Chelsea",
    pick: "Исход: П1",
    odds: "1.92",
    status: "Зашло",
    statusClassName: "bg-emerald-400/15 text-emerald-300",
  },
  {
    id: "2",
    eventName: "PSG vs Marseille",
    pick: "Тотал больше 2.5",
    odds: "1.87",
    status: "Ожидает",
    statusClassName: "bg-white/10 text-white/70",
  },
  {
    id: "3",
    eventName: "Inter vs Roma",
    pick: "Обе забьют: Да",
    odds: "1.76",
    status: "Не зашло",
    statusClassName: "bg-rose-400/15 text-rose-300",
  },
];

function mapDomainStatusToUi(pick: Pick) {
  if (pick.status === "settled" && pick.settlement.result === "won") {
    return {
      label: "Зашло",
      className: "bg-emerald-400/15 text-emerald-300",
    };
  }

  if (pick.status === "settled" && pick.settlement.result === "lost") {
    return {
      label: "Не зашло",
      className: "bg-rose-400/15 text-rose-300",
    };
  }

  return {
    label: "Ожидает",
    className: "bg-white/10 text-white/70",
  };
}

function getPickTitle(pick: Pick) {
  const firstLeg = pick.legs[0];
  if (!firstLeg) return "Матч не найден";
  return `${firstLeg.homeTeam} vs ${firstLeg.awayTeam}`;
}

function getPickMarket(pick: Pick) {
  const firstLeg = pick.legs[0];
  if (!firstLeg) return "Рынок не указан";

  if (firstLeg.marketType === "match_result") {
    if (firstLeg.marketValue === "1") return "Исход: П1";
    if (firstLeg.marketValue === "X") return "Исход: Х";
    if (firstLeg.marketValue === "2") return "Исход: П2";
  }

  if (firstLeg.marketType === "btts") {
    return `Обе забьют: ${firstLeg.marketValue === "yes" ? "Да" : "Нет"}`;
  }

  if (firstLeg.marketType === "total_over") {
    return `Тотал больше ${firstLeg.marketValue}`;
  }

  if (firstLeg.marketType === "total_under") {
    return `Тотал меньше ${firstLeg.marketValue}`;
  }

  return "Рынок не указан";
}

export function ProfileRecentPicks() {
  const [storedPicks, setStoredPicks] = useState<Pick[]>([]);

  useEffect(() => {
    setStoredPicks(getDomainStoredPicks());
  }, []);

  const recentPicks = useMemo(() => {
    const localPicks = storedPicks
      .filter((pick) => pick.authorHandle === currentAuthor)
      .sort(
        (a, b) =>
          new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime(),
      )
      .slice(0, 5);

    if (localPicks.length === 0) {
      return demoPicks;
    }

    return localPicks.map((pick) => {
      const statusUi = mapDomainStatusToUi(pick);

      return {
        id: pick.id,
        eventName: getPickTitle(pick),
        pick: getPickMarket(pick),
        odds: String(pick.totalOdds),
        status: statusUi.label,
        statusClassName: statusUi.className,
      };
    });
  }, [storedPicks]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">Последние прогнозы</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            История участника
          </h2>
        </div>

        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
          Смотреть все
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {recentPicks.map((pick) => (
          <article
            key={pick.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {pick.eventName}
                </h3>
                <p className="mt-1 text-sm text-white/65">{pick.pick}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${pick.statusClassName}`}
              >
                {pick.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-white/50">
              Коэффициент: <span className="text-white/80">{pick.odds}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}