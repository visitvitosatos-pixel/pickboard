export function AddPickForm() {
  return (
    <form className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-white/70">Вид спорта</span>
          <input
            type="text"
            placeholder="Например: Футбол"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Лига</span>
          <input
            type="text"
            placeholder="Например: EPL"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>
      </section>

      <label className="space-y-2">
        <span className="text-sm text-white/70">Событие</span>
        <input
          type="text"
          placeholder="Например: Arsenal vs Chelsea"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
        />
      </label>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-white/70">Рынок</span>
          <input
            type="text"
            placeholder="Например: Победа Arsenal"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Коэффициент</span>
          <input
            type="number"
            step="0.01"
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
            placeholder="3"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Время начала события</span>
          <input
            type="datetime-local"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20"
          />
        </label>
      </section>

      <label className="space-y-2">
        <span className="text-sm text-white/70">Комментарий</span>
        <textarea
          rows={5}
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
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Сохранить как черновик
        </button>
      </div>
    </form>
  );
}