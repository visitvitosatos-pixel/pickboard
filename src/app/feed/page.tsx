import { AppShell } from "@/components/layout/app-shell";
import { PicksFeed } from "@/features/picks/picks-feed";

export default function FeedPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm text-white/50">Лента сообщества</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Прогнозы</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Здесь отображаются последние прогнозы участников, их статусы и
            краткие пояснения.
          </p>
        </div>

        <PicksFeed />
      </section>
    </AppShell>
  );
}