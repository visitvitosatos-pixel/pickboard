"use client";

// Форма добавления прогноза.
//
// Что делает этот файл сейчас:
// 1) оставляет текущий UI и UX почти без изменений
// 2) сохраняет legacy StoredPick для существующей ленты
// 3) использует матч из API как источник названия матча и лиги
// 4) остаётся совместимым с текущим PickCard
//
// Почему так:
// сначала держим приложение стабильным,
// потом отдельно переводим feed/profile/leaderboard на новую доменную модель.

import { useEffect, useMemo, useState } from "react";
import { PickCard } from "@/features/picks/pick-card";
import { savePickToStorage } from "@/lib/utils/picks-storage";
import type { StoredPick } from "@/types/pick";

type BetType = "single" | "express";
type MatchDayFilter = "today" | "tomorrow";
type SingleMarketType = "result" | "btts" | "over" | "under";

type ExpressEvent = {
  eventName: string;
  marketType: string;
};

type MatchOption = {
  id: number;
  competition: string;
  utcDate: string;
  status: string;
  homeTeam: string;
  awayTeam: string;
};

type FormState = {
  betType: BetType;
  sport: string;
  league: string;
  selectedMatchId: string;
  eventName: string;
  singleMarketType: SingleMarketType;
  singleMarketValue: string;
  odds: string;
  stakeUnits: string;
  note: string;
  expressEvents: [ExpressEvent, ExpressEvent, ExpressEvent];
};

type FormErrors = {
  selectedMatchId?: string;
  singleMarketValue?: string;
  odds?: string;
  expressEvents?: Array<{
    eventName?: string;
    marketType?: string;
  }>;
};

const currentAuthor = "@AI_SECTOR_88";
const draftStorageKey = "pickboard:add-pick-draft";

const initialFormState: FormState = {
  betType: "single",
  sport: "Футбол",
  league: "",
  selectedMatchId: "",
  eventName: "",
  singleMarketType: "result",
  singleMarketValue: "",
  odds: "",
  stakeUnits: "",
  note: "",
  expressEvents: [
    { eventName: "", marketType: "" },
    { eventName: "", marketType: "" },
    { eventName: "", marketType: "" },
  ],
};

function getMoscowTimestampLabel(date?: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(date ?? new Date());
}

function formatMatchDateLabel(utcDate: string) {
  const date = new Date(utcDate);

  if (Number.isNaN(date.getTime())) {
    return "Дата неизвестна";
  }

  return `${getMoscowTimestampLabel(date)} МСК`;
}

function buildMatchLabel(match: MatchOption) {
  return `${match.homeTeam} — ${match.awayTeam}`;
}

function getInputClassName(hasError: boolean) {
  return `w-full rounded-2xl border px-4 py-3 text-white outline-none ${
    hasError
      ? "border-rose-400/40 bg-rose-400/10 focus:border-rose-400/60"
      : "border-white/10 bg-neutral-900 focus:border-white/20"
  }`;
}

function getSelectClassName(hasError: boolean) {
  return `w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
    hasError
      ? "border-rose-400/40 bg-neutral-900 text-white focus:border-rose-400/60"
      : "border-white/10 bg-neutral-900 text-white focus:border-white/20"
  }`;
}

function getChipClassName(isActive: boolean) {
  return `rounded-full border px-4 py-2 text-sm transition ${
    isActive
      ? "border-white bg-white text-black"
      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
  }`;
}

function buildExpressSummary(events: ExpressEvent[]) {
  return events
    .filter((eventItem) => eventItem.eventName.trim() && eventItem.marketType.trim())
    .map((eventItem, index) => `${index + 1}. ${eventItem.eventName} — ${eventItem.marketType}`)
    .join(" | ");
}

function getSingleMarketLabel(type: SingleMarketType, value: string) {
  if (type === "result") {
    if (value === "1") return "Исход: П1";
    if (value === "X") return "Исход: Х";
    if (value === "2") return "Исход: П2";
    return "Исход";
  }

  if (type === "btts") {
    if (value === "yes") return "Обе забьют: Да";
    if (value === "no") return "Обе забьют: Нет";
    return "Обе забьют";
  }

  if (type === "over") {
    return value ? `Тотал больше ${value}` : "Тотал больше";
  }

  return value ? `Тотал меньше ${value}` : "Тотал меньше";
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.odds.trim()) {
    errors.odds = "Укажи общий коэффициент.";
  } else {
    const odds = Number(form.odds);

    if (Number.isNaN(odds) || odds <= 1) {
      errors.odds = "Коэффициент должен быть больше 1.";
    }
  }

  if (form.betType === "single") {
    if (!form.selectedMatchId.trim()) {
      errors.selectedMatchId = "Выбери матч из списка.";
    }

    if (!form.singleMarketValue.trim()) {
      errors.singleMarketValue = "Заполни параметр рынка.";
      return errors;
    }

    if (form.singleMarketType === "over" || form.singleMarketType === "under") {
      const totalValue = Number(form.singleMarketValue);

      if (Number.isNaN(totalValue) || totalValue <= 0) {
        errors.singleMarketValue = "Укажи корректное значение тотала.";
      }
    }

    return errors;
  }

  const expressErrors: Array<{ eventName?: string; marketType?: string }> = [{}, {}, {}];
  let filledCount = 0;

  form.expressEvents.forEach((eventItem, index) => {
    const hasEventName = eventItem.eventName.trim().length > 0;
    const hasMarketType = eventItem.marketType.trim().length > 0;

    if (hasEventName || hasMarketType) {
      filledCount += 1;
    }

    if (hasEventName && !hasMarketType) {
      expressErrors[index].marketType = "Укажи исход.";
    }

    if (!hasEventName && hasMarketType) {
      expressErrors[index].eventName = "Укажи событие.";
    }
  });

  if (filledCount < 2) {
    expressErrors[0].eventName = expressErrors[0].eventName ?? "Для экспресса нужно минимум 2 события.";
  }

  if (expressErrors.some((item) => item.eventName || item.marketType)) {
    errors.expressEvents = expressErrors;
  }

  return errors;
}

function buildStoredPick(form: FormState, matches: MatchOption[]): StoredPick {
  const betPlacedAt = `${getMoscowTimestampLabel()} МСК`;
  const createdAt = new Date().toISOString();

  if (form.betType === "single") {
    const selectedMatch = matches.find((match) => String(match.id) === form.selectedMatchId);

    return {
      id: crypto.randomUUID(),
      author: currentAuthor,
      sport: form.sport,
      league: selectedMatch ? selectedMatch.competition : form.league,
      eventName: selectedMatch ? buildMatchLabel(selectedMatch) : form.eventName,
      market: getSingleMarketLabel(form.singleMarketType, form.singleMarketValue),
      odds: form.odds,
      stakeUnits: form.stakeUnits || "",
      matchStartTime: selectedMatch
        ? formatMatchDateLabel(selectedMatch.utcDate)
        : "Неизвестно",
      betPlacedTime: betPlacedAt,
      note: form.note || "Ординар",
      status: "pending",
      createdAt,
    };
  }

  const filledExpressEvents = form.expressEvents.filter(
    (item) => item.eventName.trim() && item.marketType.trim(),
  );

  return {
    id: crypto.randomUUID(),
    author: currentAuthor,
    sport: form.sport,
    league: form.league || "Несколько лиг",
    eventName: `Экспресс (${filledExpressEvents.length} события)`,
    market: buildExpressSummary(form.expressEvents),
    odds: form.odds,
    stakeUnits: form.stakeUnits || "",
    matchStartTime: "Несколько матчей",
    betPlacedTime: betPlacedAt,
    note: form.note || "Экспресс",
    status: "pending",
    createdAt,
  };
}

export function AddPickForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [submittedPick, setSubmittedPick] = useState<StoredPick | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isSavedToFeed, setIsSavedToFeed] = useState(false);
  const [matches, setMatches] = useState<MatchOption[]>([]);
  const [isMatchesLoading, setIsMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState("");
  const [matchDayFilter, setMatchDayFilter] = useState<MatchDayFilter>("today");

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as FormState;
      setForm({
        ...initialFormState,
        ...parsedDraft,
        expressEvents: parsedDraft.expressEvents ?? initialFormState.expressEvents,
      });
      setIsDraftLoaded(true);
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, []);

  useEffect(() => {
    async function loadMatches() {
      setIsMatchesLoading(true);
      setMatchesError("");

      try {
        const response = await fetch(`/api/matches?day=${matchDayFilter}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Не удалось загрузить матчи.");
        }

        setMatches(Array.isArray(data.matches) ? data.matches : []);
      } catch (error) {
        setMatchesError(error instanceof Error ? error.message : "Ошибка загрузки матчей.");
      } finally {
        setIsMatchesLoading(false);
      }
    }

    loadMatches();
  }, [matchDayFilter]);

  const formIsEmpty = useMemo(() => {
    const singleFieldsEmpty =
      !form.league.trim() &&
      !form.selectedMatchId.trim() &&
      !form.eventName.trim() &&
      !form.singleMarketValue.trim() &&
      !form.odds.trim() &&
      !form.stakeUnits.trim() &&
      !form.note.trim();

    const expressFieldsEmpty = form.expressEvents.every(
      (eventItem) => !eventItem.eventName.trim() && !eventItem.marketType.trim(),
    );

    return singleFieldsEmpty && expressFieldsEmpty;
  }, [form]);

  function updateField(field: keyof FormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors({});
    setIsDraftSaved(false);
    setIsSavedToFeed(false);
  }

  function handleSingleMatchChange(matchId: string) {
    const selectedMatch = matches.find((match) => String(match.id) === matchId);

    setForm((currentForm) => ({
      ...currentForm,
      selectedMatchId: matchId,
      eventName: selectedMatch ? buildMatchLabel(selectedMatch) : "",
      league: selectedMatch ? selectedMatch.competition : currentForm.league,
    }));

    setErrors({});
    setIsDraftSaved(false);
    setIsSavedToFeed(false);
  }

  function updateExpressEvent(index: number, field: keyof ExpressEvent, value: string) {
    setForm((currentForm) => {
      const nextEvents = [...currentForm.expressEvents] as [ExpressEvent, ExpressEvent, ExpressEvent];
      nextEvents[index] = {
        ...nextEvents[index],
        [field]: value,
      };

      return {
        ...currentForm,
        expressEvents: nextEvents,
      };
    });

    setErrors({});
    setIsDraftSaved(false);
    setIsSavedToFeed(false);
  }

  function handleExpressMatchChange(index: number, matchId: string) {
    const selectedMatch = matches.find((match) => String(match.id) === matchId);
    updateExpressEvent(index, "eventName", selectedMatch ? buildMatchLabel(selectedMatch) : "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmittedPick(null);
      setIsDraftSaved(false);
      setIsSavedToFeed(false);
      return;
    }

    const nextPick = buildStoredPick(form, matches);

    savePickToStorage(nextPick);
    setErrors({});
    setSubmittedPick(nextPick);
    setIsDraftSaved(false);
    setIsSavedToFeed(true);
    window.localStorage.removeItem(draftStorageKey);
  }

  function handleDraftSave() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(form));
    setIsDraftSaved(true);
    setSubmittedPick(null);
    setIsSavedToFeed(false);
  }

  function handleClearDraft() {
    window.localStorage.removeItem(draftStorageKey);
    setForm(initialFormState);
    setErrors({});
    setIsDraftSaved(false);
    setSubmittedPick(null);
    setIsDraftLoaded(false);
    setIsSavedToFeed(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-medium text-white">Новая логика ординара</p>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Матч выбирается из API, время матча подтягивается автоматически, а время
          ставки фиксируется отдельно по МСК. Для исхода теперь нужно указывать:
          П1, Х или П2.
        </p>
      </div>

      {isDraftLoaded ? (
        <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
          Найден сохраненный черновик. Можешь продолжить заполнение формы.
        </div>
      ) : null}

      {matchesError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          Не удалось загрузить матчи: {matchesError}
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="space-y-3">
          <span className="text-sm text-white/70">Тип ставки</span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateField("betType", "single")}
              className={getChipClassName(form.betType === "single")}
            >
              Ординар
            </button>

            <button
              type="button"
              onClick={() => updateField("betType", "express")}
              className={getChipClassName(form.betType === "express")}
            >
              Экспресс
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Вид спорта</span>
            <input
              type="text"
              value={form.sport}
              readOnly
              className={getInputClassName(false)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Лига</span>
            <input
              type="text"
              value={form.league}
              readOnly
              placeholder="Подставится автоматически после выбора матча"
              className={getInputClassName(false)}
            />
          </label>
        </section>

        <section className="space-y-3">
          <span className="text-sm text-white/70">День матчей</span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMatchDayFilter("today")}
              className={getChipClassName(matchDayFilter === "today")}
            >
              Сегодня
            </button>

            <button
              type="button"
              onClick={() => setMatchDayFilter("tomorrow")}
              className={getChipClassName(matchDayFilter === "tomorrow")}
            >
              Завтра
            </button>
          </div>
        </section>

        {form.betType === "single" ? (
          <>
            <label className="space-y-2">
              <span className="text-sm text-white/70">Матч *</span>
              <select
                value={form.selectedMatchId}
                onChange={(event) => handleSingleMatchChange(event.target.value)}
                className={getSelectClassName(Boolean(errors.selectedMatchId))}
                disabled={isMatchesLoading || matches.length === 0}
              >
                <option value="">
                  {isMatchesLoading
                    ? "Загрузка матчей..."
                    : matches.length === 0
                    ? "Матчи не найдены"
                    : "Выбери матч"}
                </option>

                {matches.map((match) => (
                  <option key={match.id} value={String(match.id)}>
                    {formatMatchDateLabel(match.utcDate)} · {buildMatchLabel(match)} · {match.competition}
                  </option>
                ))}
              </select>
              {errors.selectedMatchId ? (
                <p className="text-sm text-rose-300">{errors.selectedMatchId}</p>
              ) : null}
            </label>

            <section className="space-y-3">
              <span className="text-sm text-white/70">Рынок *</span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateField("singleMarketType", "result");
                    updateField("singleMarketValue", "");
                  }}
                  className={getChipClassName(form.singleMarketType === "result")}
                >
                  Исход
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField("singleMarketType", "btts");
                    updateField("singleMarketValue", "");
                  }}
                  className={getChipClassName(form.singleMarketType === "btts")}
                >
                  Обе забьют
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField("singleMarketType", "over");
                    updateField("singleMarketValue", "");
                  }}
                  className={getChipClassName(form.singleMarketType === "over")}
                >
                  Тотал больше
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField("singleMarketType", "under");
                    updateField("singleMarketValue", "");
                  }}
                  className={getChipClassName(form.singleMarketType === "under")}
                >
                  Тотал меньше
                </button>
              </div>
            </section>

            {form.singleMarketType === "result" ? (
              <section className="space-y-3">
                <span className="text-sm text-white/70">Выбор исхода *</span>

                <div className="flex flex-wrap gap-2">
                  {["1", "X", "2"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateField("singleMarketValue", value)}
                      className={getChipClassName(form.singleMarketValue === value)}
                    >
                      {value === "1" ? "П1" : value === "X" ? "Х" : "П2"}
                    </button>
                  ))}
                </div>

                {errors.singleMarketValue ? (
                  <p className="text-sm text-rose-300">{errors.singleMarketValue}</p>
                ) : null}
              </section>
            ) : null}

            {form.singleMarketType === "btts" ? (
              <section className="space-y-3">
                <span className="text-sm text-white/70">Обе забьют *</span>

                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "yes", label: "Да" },
                    { value: "no", label: "Нет" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => updateField("singleMarketValue", item.value)}
                      className={getChipClassName(form.singleMarketValue === item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {errors.singleMarketValue ? (
                  <p className="text-sm text-rose-300">{errors.singleMarketValue}</p>
                ) : null}
              </section>
            ) : null}

            {form.singleMarketType === "over" || form.singleMarketType === "under" ? (
              <label className="space-y-2">
                <span className="text-sm text-white/70">Значение тотала *</span>
                <input
                  type="number"
                  step="0.5"
                  value={form.singleMarketValue}
                  onChange={(event) => updateField("singleMarketValue", event.target.value)}
                  placeholder="Например: 2.5"
                  className={getInputClassName(Boolean(errors.singleMarketValue))}
                />
                {errors.singleMarketValue ? (
                  <p className="text-sm text-rose-300">{errors.singleMarketValue}</p>
                ) : null}
              </label>
            ) : null}
          </>
        ) : (
          <section className="space-y-4">
            <div>
              <p className="text-sm text-white/70">События экспресса *</p>
              <p className="mt-1 text-sm text-white/50">
                Добавь минимум 2 и максимум 3 события.
              </p>
            </div>

            {form.expressEvents.map((eventItem, index) => (
              <div
                key={`express-event-${index}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-white">
                  Событие {index + 1}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Матч</span>
                    <select
                      value={
                        matches.find((match) => buildMatchLabel(match) === eventItem.eventName)?.id
                          ? String(
                              matches.find((match) => buildMatchLabel(match) === eventItem.eventName)?.id,
                            )
                          : ""
                      }
                      onChange={(event) => handleExpressMatchChange(index, event.target.value)}
                      className={getSelectClassName(
                        Boolean(errors.expressEvents?.[index]?.eventName),
                      )}
                      disabled={isMatchesLoading || matches.length === 0}
                    >
                      <option value="">
                        {isMatchesLoading
                          ? "Загрузка матчей..."
                          : matches.length === 0
                          ? "Матчи не найдены"
                          : "Выбери матч"}
                      </option>

                      {matches.map((match) => (
                        <option key={match.id} value={String(match.id)}>
                          {formatMatchDateLabel(match.utcDate)} · {buildMatchLabel(match)}
                        </option>
                      ))}
                    </select>
                    {errors.expressEvents?.[index]?.eventName ? (
                      <p className="text-sm text-rose-300">
                        {errors.expressEvents[index]?.eventName}
                      </p>
                    ) : null}
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Исход</span>
                    <input
                      type="text"
                      value={eventItem.marketType}
                      onChange={(event) =>
                        updateExpressEvent(index, "marketType", event.target.value)
                      }
                      placeholder="Например: П1"
                      className={getInputClassName(
                        Boolean(errors.expressEvents?.[index]?.marketType),
                      )}
                    />
                    {errors.expressEvents?.[index]?.marketType ? (
                      <p className="text-sm text-rose-300">
                        {errors.expressEvents[index]?.marketType}
                      </p>
                    ) : null}
                  </label>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Общий коэффициент *</span>
            <input
              type="number"
              step="0.01"
              value={form.odds}
              onChange={(event) => updateField("odds", event.target.value)}
              placeholder="Например: 2.45"
              className={getInputClassName(Boolean(errors.odds))}
            />
            {errors.odds ? (
              <p className="text-sm text-rose-300">{errors.odds}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">
              Размер ставки (необязательно)
            </span>
            <input
              type="number"
              step="0.5"
              value={form.stakeUnits}
              onChange={(event) => updateField("stakeUnits", event.target.value)}
              placeholder="Например: 3"
              className={getInputClassName(false)}
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
            className={getInputClassName(false)}
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

      {isSavedToFeed ? (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Прогноз сохранен локально. Теперь открой ленту — запись уже должна быть там.
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
            author={submittedPick.author}
            eventName={submittedPick.eventName}
            market={submittedPick.market}
            odds={submittedPick.odds}
            status={submittedPick.status}
            note={submittedPick.note}
            matchStartTime={submittedPick.matchStartTime}
            betPlacedTime={submittedPick.betPlacedTime}
            stakeUnits={submittedPick.stakeUnits}
          />
        </section>
      ) : null}
    </div>
  );
}
