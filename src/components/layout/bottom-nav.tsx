const items = [
  { label: "Главная", active: true },
  { label: "Лента", active: false },
  { label: "Рейтинг", active: false },
  { label: "Профиль", active: false },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-4 px-2">
        {items.map((item) => (
          <button
            key={item.label}
            className={`rounded-2xl text-sm transition ${
              item.active
                ? "bg-white text-black"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}