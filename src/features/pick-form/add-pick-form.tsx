"use client";

import { useEffect, useMemo, useState } from "react";
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

type FormErrors = Partial<Record<keyof FormState, string>>;

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

const draftStorageKey = "pickboard:add-pick-draft";

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

function getInputClassName(hasError: boolean) {
  return `w-full rounded-2xl border px-4 py-3 text-white outline-none placeholder:text-white/30 ${
    hasError
      ? "border-rose-400/40 bg-rose-400/5 focus:border-rose-400/60"
      : "border-white/10 bg-white/5 focus:border-white/20"
  }`;
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.sport.trim()) {
    errors.sport = "Укажи вид спорта.";
  }

  if (!form.eventName.trim()) {
    errors.eventName = "Укажи событие.";
  }

  if (!form.marketType.trim()) {
    errors.marketType = "Укажи рынок или исход.";
  }

  if (!form.odds.trim()) {
    errors.odds = "Укажи коэффициент.";
  } else {
    const odds = Number(form.odds);

    if (Number.isNaN(odds) || odds <= 1) {
      errors.odds = "Коэффициент должен быть больше 1.";
    }
  }

  if (!form.stakeUnits.trim()) {
    errors.stakeUnits = "Укажи размер ставки.";
  } else {
    const stake = Number(form.stakeUnits);

    if (Number.isNaN(stake) || stake <= 0) {
      errors.stakeUnits = "Размер ставки должен быть больше 0.";
    }
  }

  if (!form.eventStartAt.trim()) {
    errors.eventStartAt = "Укажи время начала события.";
  }

  return errors;
}

export function AddPickForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [submittedPick, setSubmittedPick] = useState<FormState | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as FormState;
      setForm(parsedDraft);
      setIsDraftLoaded(true);
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, []);

  const formIsEmpty = useMemo(() => {
    return Object.values(form).every((value) => value.trim() === "");
  }, [form]);

  function updateField(field: keyof FormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));

    if (isDraftSaved) {
      setIsDraftSaved(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmittedPick(null);
      setIsDraftSaved(false);
      return;
    }

    setErrors({});
    setSubmittedPick(form);
    setIsDraftSaved(false);
    window.localStorage.removeItem(draftStorageKey);
  }

  function handleDraftSave() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(form));
    setIsDraftSaved(true);
    setSubmittedPick(null);
  }

  function handleClearDraft() {
    window.localStorage.removeItem(draftStorageKey);
    setForm(initialFormState);
    setErrors({});
    setIsDraftSaved(false);
    setSubmittedPick(null);
    setIsDraftLoaded(false);
  }

  return (
    <div className="space-y-6">
      {isDraftLoaded ? (
        <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
          Найден сохраненный черновик. Можешь продолжить заполнение формы.
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Вид спорта *</span>
            <input
              type="text"
              value={form.sport}
              onChange={(event) => updateField("sport", event.target.value)}
              placeholder="Например: Футбол"
              className={getInputClassName(Boolean(errors.sport))}
            />
            {errors.sport ? (
              <p className="text-sm text-rose-300">{errors.sport}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Лига</span>
            <input
              type="text"
              value={form.league}
              onChange={(event) => updateField("league", event.target.value)}
              placeholder="Например: EPL"
              className={getInputClassName(Boolean(errors.league))}
            />
          </label>
        </section>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Событие *</span>
          <input
            type="text"
            value={form.eventName}
            onChange={(event) => updateField("eventName", event.target.value)}
            placeholder="Например: Arsenal vs Chelsea"
            className={getInputClassName(Boolean(errors.eventName))}
          />
          {errors.eventName ? (
            <p className="text-sm text-rose-300">{errors.eventName}</p>
          ) : null}
        </label>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Рынок *</span>
            <input
              type="text"
              value={form.marketType}
              onChange={(event) => updateField("marketType", event.target.value)}
              placeholder="Например: Победа Arsenal"
              className={getInputClassName(Boolean(errors.marketType))}
            />
            {errors.marketType ? (
              <p className="text-sm text-rose-300">{errors.marketType}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Коэффициент *</span>
            <input
              type="number"
              step="0.01"
              value={form.odds}
              onChange={(event) => updateField("odds", event.target.value)}
              placeholder="1.92"
              className={getInputClassName(Boolean(errors.odds))}
            />
            {errors.odds ? (
              <p className="text-sm text-rose-300">{errors.odds}</p>
            ) : null}
          </label>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Размер ставки (в юнитах) *</span>
            <input
              type="number"
              step="0.5"
              value={form.stakeUnits}
              onChange={(event) => updateField("stakeUnits", event.target.value)}
              placeholder="3"
              className={getInputClassName(Boolean(errors.stakeUnits))}
            />
            {errors.stakeUnits ? (
              <p className="text-sm text-rose-300">{errors.stakeUnits}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Время начала события *</span>
            <input
              type="datetime-local"
              value={form.eventStartAt}
              onChange={(event) => updateField("eventStartAt", event.target.value)}
              className={getInputClassName(Boolean(errors.eventStartAt))}
            />
            {errors.eventStartAt ? (
              <p className="text-sm text-rose-300">{errors.eventStartAt}</p>
            ) : null}
          </label>
        </section>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Комментарий</span>
          <textarea
            rows={5}
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Коротко поясни логику прогноза"
            className={getInputClassName(Boolean(errors.note))}
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

          <button
            type="button"
            onClick={handleClearDraft}
            disabled={formIsEmpty}
            className="rounded-2xl border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Очистить
          </button>
        </div>
      </form>

      {isDraftSaved ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Черновик сохранен в браузере. После перезагрузки страницы он останется.
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