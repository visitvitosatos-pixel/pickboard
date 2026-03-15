"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Главная", href: "/" },
  { label: "Лента", href: "/feed" },
  { label: "Рейтинг", href: "/leaderboard" },
  { label: "Профиль", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-4 gap-2 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-center rounded-2xl text-sm transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
