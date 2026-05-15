import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeTicker } from "@/components/sections/MarqueeTicker";
import { StatsSection } from "@/components/sections/StatsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { VehicleTiersSection } from "@/components/sections/VehicleTiersSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { DriveWithUsSection } from "@/components/sections/DriveWithUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { DownloadSection } from "@/components/sections/DownloadSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeTicker />
        <StatsSection />
        <HowItWorksSection />
        <VehicleTiersSection />
        <SafetySection />
        <DriveWithUsSection />
        <TestimonialsSection />
        <FeaturesSection />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
