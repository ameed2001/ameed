import AppLayout from "@/components/AppLayout";
import HeroSection from "@/components/main-dashboard/HeroSection";
import FeaturesSection from "@/components/main-dashboard/FeaturesSection";
import MainDashboardClient from "@/components/main-dashboard/MainDashboardClient";

export default function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
