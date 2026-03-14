import { PickCard } from "@/features/picks/pick-card";

const demoPicks = [
  {
    id: "1",
    author: "@sharpstorm",
    eventName: "Arsenal vs Chelsea",
    market: "Победа Arsenal",
    odds: "1.92",
    status: "won" as const,
    note: "Домашняя форма сильнее, соперник нестабилен в обороне.",
    startTime: "15 мар · 17:30",
  },
  {
    id: "2",
    author: "@betwizard",
    eventName: "Lakers vs Suns",
    market: "Тотал больше 228.5",
    odds: "1.87",
    status: "pending" as const,
    note: "Ожидаю быстрый темп и слабую защиту на периметре.",
    startTime: "15 мар · 23:00",
  },
  {
    id: "3",
    author: "@coldvalue",
    eventName: "Inter vs Roma",
    market: "Обе забьют — да",
    odds: "1.76",
    status: "lost" as const,
    note: "Ставка по форме атаки, но матч ушел в закрытый сценарий.",
    startTime: "14 мар · 21:45",
  },
];

export function PicksFeed() {
  return (
    <section className="space-y-4">
      {demoPicks.map((pick) => (
        <PickCard
          key={pick.id}
          author={pick.author}
          eventName={pick.eventName}
          market={pick.market}
          odds={pick.odds}
          status={pick.status}
          note={pick.note}
          startTime={pick.startTime}
        />
      ))}
    </section>
  );
}