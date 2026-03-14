import { AppShell } from "@/components/layout/app-shell";
import { CommunityOverview } from "@/features/home/community-overview";
import { ValueGrid } from "@/features/home/value-grid";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommunityOverview />
        <ValueGrid />
      </div>
    </AppShell>
  );
}