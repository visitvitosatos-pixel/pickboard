export function ValueGrid() {
  const items = [
    {
      title: "История прогнозов",
      description:
        "Каждый прогноз сохраняется в ленте, больше не теряется в потоке сообщений и скриншотов.",
    },
    {
      title: "Рейтинг участников",
      description:
        "Система считает результаты, показывает сильных участников и формирует понятную таблицу лидеров.",
    },
    {
      title: "Прозрачность для админа",
      description:
        "Официальные прогнозы, итоги недели и статистика сообщества собираются в одном месте.",
    },
  ];

  return (
    <section className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-5xl gap-4 px-6 py-16 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>

            <p className="mt-3 text-sm leading-6 text-white/70">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}