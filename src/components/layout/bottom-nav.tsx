import Link from "next/link";

const items = [
  { label: "Главная", href: "/", active: false },
  { label: "Лента", href: "/feed", active: true },
  { label: "Рейтинг", href: "#", active: false },
  { label: "Профиль", href: "#", active: false },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-4 gap-2 px-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-center rounded-2xl text-sm transition ${
              item.active
                ? "bg-white text-black"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}