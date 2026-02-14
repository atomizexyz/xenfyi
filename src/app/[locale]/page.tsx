import { HeroSection } from "@/components/landing/hero-section";
import { AggregateStats } from "@/components/landing/aggregate-stats";
import { CrossChainOverview } from "@/components/landing/cross-chain-overview";
import { FeaturesSection } from "@/components/landing/features-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AggregateStats />
      <CrossChainOverview />
      <FeaturesSection />
    </>
  );
}
