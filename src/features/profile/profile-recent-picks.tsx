"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredPicks } from "@/lib/utils/picks-storage";
import { getRecentProfilePicks } from "@/lib/utils/profile";
import type { StoredPick } from "@/types/pick";

const currentAuthor = "@visit.vitos.atos";

const demoPicks = [
  {
    id: "1",
    eventName: "Arsenal vs Chelsea",
    pick: "Победа Arsenal",
    odds: "1.92",
    status: "Зашло",
    statusClassName: "bg-emerald-400/15 text-emerald-300",
  },
  {
    id: "2",
    eventName: "Lakers vs Suns",
    pick: "Тотал больше 228.5",
    odds: "1.87",
    status: "Ожидает",
    statusClassName: "bg-white/10 text-white/70",
  },
  {
    id: "3",
    eventName: "Inter vs Roma",
    pick: "Обе забьют — да",
    odds: "1.76",
    status: "Не зашло",
    statusClassName: "bg-rose-400/15 text-rose-300",
  },
];

function mapStatusToUi(status: StoredPick["status"]) {
  if (status === "won") {
    return {
      label: "Зашло",
      className: "bg-emerald-400/15 text-emerald-300",
    };
  }

  if (status === "lost") {
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

export function ProfileRecentPicks() {
  const [storedPicks, setStoredPicks] = useState<StoredPick[]>([]);

  useEffect(() => {
    setStoredPicks(getStoredPicks());
  }, []);

  const recentPicks = useMemo(() => {
    const localPicks = getRecentProfilePicks(storedPicks, currentAuthor);

    if (localPicks.length === 0) {
      return demoPicks;
    }

    return localPicks.map((pick) => {
      const statusUi = mapStatusToUi(pick.status);

      return {
        id: pick.id,
        eventName: pick.eventName,
        pick: pick.market,
        odds: pick.odds,
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