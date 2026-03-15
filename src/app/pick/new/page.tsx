import { AppShell } from "@/components/layout/app-shell";
import { AddPickForm } from "@/features/pick-form/add-pick-form";

export default function AddPickPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm text-white/50">Новый прогноз</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Добавить прогноз
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Заполни основные поля, чтобы прогноз попал в ленту, профиль и будущий рейтинг.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <AddPickForm />
        </div>
      </section>
    </AppShell>
  );
}
