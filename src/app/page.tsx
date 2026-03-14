import { HeroSection } from "@/features/home/hero-section";
import { ValueGrid } from "@/features/home/value-grid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <HeroSection />
      <ValueGrid />
    </main>
  );
}