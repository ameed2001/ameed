import AppLayout from "@/components/AppLayout";
import HeroSection from "@/components/main-dashboard/HeroSection";
import FeaturesSection from "@/components/main-dashboard/FeaturesSection";
import MainDashboardClient from "@/components/main-dashboard/MainDashboardClient";
import AuthCardsSection from "@/components/main-dashboard/AuthCardsSection";
import UserTasksSection from "@/components/main-dashboard/UserTasksSection";
import TestimonialsSection from "@/components/main-dashboard/TestimonialsSection";

export default function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <AuthCardsSection />
      <MainDashboardClient />
      <UserTasksSection />
      <FeaturesSection />
      <TestimonialsSection />
    </AppLayout>
  );
}
