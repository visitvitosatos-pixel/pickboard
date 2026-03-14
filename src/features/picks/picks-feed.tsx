"use client";

import { useEffect, useState } from "react";
import { getStoredPicks, updateStoredPickStatus } from "@/lib/utils/picks-storage";
import { PickCard } from "@/features/picks/pick-card";
import type { StoredPick, PickStatus } from "@/types/pick";

const demoPicks: StoredPick[] = [
  {
    id: "demo-1",
    author: "@sharpstorm",
    sport: "Футбол",
    league: "Premier League",
    eventName: "Arsenal vs Chelsea",
    market: "Исход: П1",
    odds: "1.92",
    stakeUnits: "3",
    matchStartTime: "15 мар, 17:30 МСК",
    betPlacedTime: "14 мар, 10:20 МСК",
    note: "Домашняя форма сильнее, соперник нестабилен в обороне.",
    status: "won",
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "demo-2",
    author: "@betwizard",
    sport: "Футбол",
    league: "Ligue 1",
    eventName: "PSG vs Marseille",
    market: "Тотал больше 2.5",
    odds: "1.87",
    stakeUnits: "2",
    matchStartTime: "15 мар, 03:00 МСК",
    betPlacedTime: "14 мар, 18:05 МСК",
    note: "Ожидаю открытый сценарий и высокий темп.",
    status: "pending",
    createdAt: "2026-03-14T11:00:00.000Z",
  },
  {
    id: "demo-3",
    author: "@coldvalue",
    sport: "Футбол",
    league: "Serie A",
    eventName: "Inter vs Roma",
    market: "Обе забьют: Да",
    odds: "1.76",
    stakeUnits: "4",
    matchStartTime: "14 мар, 21:45 МСК",
    betPlacedTime: "14 мар, 12:10 МСК",
    note: "Ставка по форме атаки, но матч ушел в закрытый сценарий.",
    status: "lost",
    createdAt: "2026-03-14T09:00:00.000Z",
  },
];

function getStatusButtonClass(isActive: boolean, tone: "neutral" | "success" | "danger") {
  if (isActive) {
    if (tone === "success") {
      return "border-emerald-400/40 bg-emerald-400/15 text-emerald-300";
    }

    if (tone === "danger") {
      return "border-rose-400/40 bg-rose-400/15 text-rose-300";
    }

    return "border-white bg-white text-black";
  }

  return "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white";
}

export function PicksFeed() {
  const [storedPicks, setStoredPicks] = useState<StoredPick[]>([]);

  useEffect(() => {
    setStoredPicks(getStoredPicks());
  }, []);

  function handleStatusChange(pickId: string, status: PickStatus) {
    updateStoredPickStatus(pickId, status);
    setStoredPicks(getStoredPicks());
  }

  const allPicks = [...storedPicks, ...demoPicks];

  return (
    <section className="space-y-4">
      {allPicks.map((pick) => {
        const isLocalPick = !pick.id.startsWith("demo-");

        return (
          <PickCard
            key={pick.id}
            author={pick.author}
            eventName={pick.eventName}
            market={pick.market}
            odds={pick.odds}
            status={pick.status}
            note={pick.note}
            matchStartTime={pick.matchStartTime}
            betPlacedTime={pick.betPlacedTime}
            stakeUnits={pick.stakeUnits}
            actions={
              isLocalPick ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                    Изменить статус
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(pick.id, "pending")}
                      className={`rounded-full border px-4 py-2 text-sm transition ${getStatusButtonClass(
                        pick.status === "pending",
                        "neutral",
                      )}`}
                    >
                      Ожидает
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(pick.id, "won")}
                      className={`rounded-full border px-4 py-2 text-sm transition ${getStatusButtonClass(
                        pick.status === "won",
                        "success",
                      )}`}
                    >
                      Зашло
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(pick.id, "lost")}
                      className={`rounded-full border px-4 py-2 text-sm transition ${getStatusButtonClass(
                        pick.status === "lost",
                        "danger",
                      )}`}
                    >
                      Не зашло
                    </button>
                  </div>
                </div>
              ) : null
            }
          />
        );
      })}
    </section>
  );
}