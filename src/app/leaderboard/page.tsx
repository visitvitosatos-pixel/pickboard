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

        <LeaderboardTable />
      </section>
    </AppShell>
  );
}
