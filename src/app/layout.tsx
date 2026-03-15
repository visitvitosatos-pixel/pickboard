import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickBoard",
  description: "Система рейтинга и истории прогнозов для Telegram-сообществ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
