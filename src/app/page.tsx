import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/main-dashboard/HeroSection';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';

export default function Home() {
  return (
    <AppLayout>
      <HeroSection />
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
