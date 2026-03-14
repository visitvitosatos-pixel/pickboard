"use client";

import { useState } from "react";
import { PickCard } from "@/features/picks/pick-card";

type FormState = {
  sport: string;
  league: string;
  eventName: string;
  marketType: string;
  odds: string;
  stakeUnits: string;
  eventStartAt: string;
  note: string;
};

const initialFormState: FormState = {
  sport: "",
  league: "",
  eventName: "",
  marketType: "",
  odds: "",
  stakeUnits: "",
  eventStartAt: "",
  note: "",
};

function formatEventTime(value: string) {
  if (!value) {
    return "Не указано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AddPickForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [submittedPick, setSubmittedPick] = useState<FormState | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (isDraftSaved) {
      setIsDraftSaved(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedPick(form);
    setIsDraftSaved(false);
  }

  function handleDraftSave() {
    setIsDraftSaved(true);
    setSubmittedPick(null);
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Вид спорта</span>
            <input
              type="text"
              value={form.sport}
              onChange={(event) => updateField("sport", event.target.value)}
              placeholder="Например: Футбол"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Лига</span>
            <input
              type="text"
              value={form.league}
              onChange={(event) => updateField("league", event.target.value)}
              placeholder="Например: EPL"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
            />
          </label>
        </section>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Событие</span>
          <input
            type="text"
            value={form.eventName}
            onChange={(event) => updateField("eventName", event.target.value)}
            placeholder="Например: Arsenal vs Chelsea"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Рынок</span>
            <input
              type="text"
              value={form.marketType}
              onChange={(event) => updateField("marketType", event.target.value)}
              placeholder="Например: Победа Arsenal"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Коэффициент</span>
            <input
              type="number"
              step="0.01"
              value={form.odds}
              onChange={(event) => updateField("odds", event.target.value)}
              placeholder="1.92"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
            />
          </label>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Размер ставки (в юнитах)</span>
            <input
              type="number"
              step="0.5"
              value={form.stakeUnits}
              onChange={(event) => updateField("stakeUnits", event.target.value)}
              placeholder="3"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Время начала события</span>
            <input
              type="datetime-local"
              value={form.eventStartAt}
              onChange={(event) => updateField("eventStartAt", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </label>
        </section>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Комментарий</span>
          <textarea
            rows={5}
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Коротко поясни логику прогноза"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>

        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-white">Скриншот ставки</p>
          <p className="mt-2 text-sm text-white/55">
            Пока это только визуальный блок. Загрузку файла подключим следующим этапом.
          </p>

          <button
            type="button"
            className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Выбрать файл
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Сохранить прогноз
          </button>

          <button
            type="button"
            onClick={handleDraftSave}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Сохранить как черновик
          </button>
        </div>
      </form>

      {isDraftSaved ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Черновик сохранен локально на странице. Следующим шагом подключим запись в базу.
        </div>
      ) : null}

      {submittedPick ? (
        <section className="space-y-4">
          <div>
            <p className="text-sm text-white/50">Предпросмотр</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Как будет выглядеть прогноз
            </h2>
          </div>

          <PickCard
            author="@visit.vitos.atos"
            eventName={
              submittedPick.league
                ? `${submittedPick.eventName} · ${submittedPick.league}`
                : submittedPick.eventName || "Без названия события"
            }
            market={submittedPick.marketType || "Рынок не указан"}
            odds={submittedPick.odds || "—"}
            status="pending"
            note={
              submittedPick.note ||
              `Вид спорта: ${submittedPick.sport || "не указан"} · Ставка: ${
                submittedPick.stakeUnits || "не указана"
              } юн.`
            }
            startTime={formatEventTime(submittedPick.eventStartAt)}
          />
        </section>
      ) : null}
    </div>
  );
}