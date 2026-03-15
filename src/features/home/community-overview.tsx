import Link from "next/link";

export function CommunityOverview() {
  return (
    <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/50">Итоги за 7 дней</p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Лига прогнозистов сообщества
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          Все прогнозы сохраняются, сильные участники поднимаются в рейтинге,
          а админ получает прозрачную статистику по официальным прогнозам.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Прогнозов</p>
            <p className="mt-2 text-2xl font-semibold text-white">128</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Активных авторов</p>
            <p className="mt-2 text-2xl font-semibold text-white">34</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Официальных пиков</p>
            <p className="mt-2 text-2xl font-semibold text-white">11</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/pick/new"
            className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Добавить прогноз
          </Link>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/50">Лучший участник недели</p>

        <div className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-lg font-semibold text-white">@sharpstorm</p>
          <p className="mt-2 text-sm text-white/70">
            12 прогнозов · винрейт 66% · ROI 14.2%
          </p>
          <p className="mt-4 text-sm font-medium text-emerald-300">
            Серия: 4 плюса подряд
          </p>
        </div>
      </article>
    </section>
  );
}
