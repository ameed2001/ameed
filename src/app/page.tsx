import AppLayout from "@/components/AppLayout";
import HeroSection from "@/components/main-dashboard/HeroSection";
import FeaturesSection from "@/components/main-dashboard/FeaturesSection";
import MainDashboardClient from "@/components/main-dashboard/MainDashboardClient";
import AuthCardsSection from "@/components/main-dashboard/AuthCardsSection";

export default function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <AuthCardsSection /> {/* تمت إضافة هذا القسم هنا */}
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
