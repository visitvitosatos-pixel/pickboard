import { AppShell } from "@/components/layout/app-shell";
import { ProfileRecentPicks } from "@/features/profile/profile-recent-picks";
import { ProfileSummary } from "@/features/profile/profile-summary";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <ProfileSummary />
        <ProfileRecentPicks />
      </div>
    </AppShell>
  );
}