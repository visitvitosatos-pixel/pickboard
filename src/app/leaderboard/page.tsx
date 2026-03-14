import { AppShell } from "@/components/layout/app-shell";
import { LeaderboardTable } from "@/features/leaderboard/leaderboard-table";

export default function LeaderboardPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm text-white/50">Рейтинг сообщества</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Таблица лидеров
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Здесь видно, кто показывает лучший результат по дистанции, кто держит
            серию и кому в сообществе доверяют больше всего.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-white/50">Лидер недели</p>
            <p className="mt-2 text-xl font-semibold text-white">
              @sharpstorm
            </p>
            <p className="mt-2 text-sm text-white/70">
              12 прогнозов · ROI +14.2%
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-white/50">Лучшая серия</p>
            <p className="mt-2 text-xl font-semibold text-white">4 плюса</p>
            <p className="mt-2 text-sm text-white/70">
              Участник: @sharpstorm
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-white/50">Средний trust score</p>
            <p className="mt-2 text-xl font-semibold text-white">68</p>
            <p className="mt-2 text-sm text-white/70">
              По активным участникам недели
            </p>
          </article>
        </div>

        <LeaderboardTable />
      </section>
    </AppShell>
  );
}