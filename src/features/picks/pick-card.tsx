type PickCardProps = {
  author: string;
  eventName: string;
  market: string;
  odds: string;
  status: "pending" | "won" | "lost";
  note: string;
  startTime: string;
  stakeUnits?: string;
  actions?: React.ReactNode;
};

const statusMap: Record<PickCardProps["status"], string> = {
  pending: "bg-white/10 text-white/70",
  won: "bg-emerald-400/15 text-emerald-300",
  lost: "bg-rose-400/15 text-rose-300",
};

const statusLabelMap: Record<PickCardProps["status"], string> = {
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
  startTime,
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
          <p className="text-xs text-white/50">Начало события</p>
          <p className="mt-2 text-xl font-semibold text-white">{startTime}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/70">{note}</p>

      {actions ? <div className="mt-4">{actions}</div> : null}
    </article>
  );
}