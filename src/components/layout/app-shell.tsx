import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}