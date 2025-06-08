import AppLayout from '@/components/AppLayout';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import HeroSection from '@/components/main-dashboard/HeroSection';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection'; // Added import

export default function Home() {
  return (
    <AppLayout>
      <HeroSection />
      <MainDashboardClient />
      <FeaturesSection /> {/* Added FeaturesSection here */}
    </AppLayout>
  );
}
