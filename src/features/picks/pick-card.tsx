// Карточка ставки в ленте.
// Пока работает на текущем legacy-формате UI:
// pending / won / lost
//
// Это намеренно.
// Сначала стабилизируем сборку и текущий интерфейс,
// потом отдельным шагом переведём карточку на новую модель Pick.

type PickCardStatus = "pending" | "won" | "lost";

type PickCardProps = {
  author: string;
  eventName: string;
  market: string;
  odds: string;
  status: PickCardStatus;
  note: string;
  matchStartTime: string;
  betPlacedTime: string;
  stakeUnits?: string;
  actions?: React.ReactNode;
};

const statusMap: Record<PickCardStatus, string> = {
  pending: "bg-white/10 text-white/70",
  won: "bg-emerald-400/15 text-emerald-300",
  lost: "bg-rose-400/15 text-rose-300",
};

const statusLabelMap: Record<PickCardStatus, string> = {
  pending: "Ожидает",
  won: "Зашло",
  lost: "Не зашло",
};

export function PickCard({
  author,
  eventName,
  market,
  odds,
  status,
  note,
  matchStartTime,
  betPlacedTime,
  stakeUnits,
  actions,
}: PickCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{author}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{eventName}</h3>
          <p className="mt-2 text-sm text-white/65">{market}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusMap[status]}`}
        >
          {statusLabelMap[status]}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/50">Коэффициент</p>
          <p className="mt-2 text-xl font-semibold text-white">{odds}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/50">Ставка</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {stakeUnits ? `${stakeUnits} юн.` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/50">Матч</p>
          <p className="mt-2 text-sm font-semibold text-white">
            {matchStartTime}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/50">Ставка сделана</p>
          <p className="mt-2 text-sm font-semibold text-white">
            {betPlacedTime}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/70">{note}</p>

      {actions ? <div className="mt-4">{actions}</div> : null}
    </article>
  );
}