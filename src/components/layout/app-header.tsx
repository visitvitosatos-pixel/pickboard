export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            PickBoard
          </p>
          <h1 className="text-sm font-semibold text-white">
            Sharp Club Demo
          </h1>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          914 участников
        </div>
      </div>
    </header>
  );
}
