import AppLayout from '@/components/AppLayout';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import HeroSection from '@/components/main-dashboard/HeroSection';

export default function Home() {
  return (
    <AppLayout>
      <HeroSection />
      <MainDashboardClient />
    </AppLayout>
  );
}
