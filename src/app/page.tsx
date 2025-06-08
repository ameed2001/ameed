import AppLayout from '@/components/AppLayout';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';

export default function Home() {
  return (
    <AppLayout>
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
