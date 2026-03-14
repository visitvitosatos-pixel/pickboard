export function HeroSection() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
        PickBoard
      </div>

      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Система рейтинга и истории прогнозов для Telegram-сообществ
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
        Превращаем хаос скриншотов и сообщений в понятную ленту прогнозов,
        рейтинг участников и прозрачную статистику по сообществу.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button className="rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90">
          Открыть демо
        </button>

        <button className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
          Подключить сообщество
        </button>
      </div>
    </section>
  );
}