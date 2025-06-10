
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/main-dashboard/HeroSection';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';
import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react'; // Added ShieldCheck

export default function Home() {
  return (
    <AppLayout>
      <HeroSection />
      <section id="auth-cards-section" className="container mx-auto px-4 py-16 text-center bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-app-red mb-12">
          ابدأ رحلتك معنا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"> {/* Adjusted max-w and grid-cols */}
          <InfoCard
            title="تسجيل الدخول"
            description="للوصول إلى ميزات إضافية وإدارة مشاريعك."
            icon={<LogIn />}
            iconWrapperClass="bg-green-100 dark:bg-green-900"
            iconColorClass="text-green-500 dark:text-green-400"
            href="/login"
            applyFlipEffect={true}
            backTitle="مرحباً بعودتك!"
            backDescription="أدخل بياناتك للوصول إلى حسابك وإدارة مشاريعك بكفاءة."
            backCtaText="تسجيل الدخول الآن"
            dataAiHint="user login"
            cardHeightClass="h-72 sm:h-80"
          />
          <InfoCard
            title="إنشاء حساب جديد"
            description="انضم للاستفادة من جميع أدوات حساب الكميات وإدارة المشاريع."
            icon={<UserPlus />}
            iconWrapperClass="bg-purple-100 dark:bg-purple-900"
            iconColorClass="text-purple-500 dark:text-purple-400"
            href="/signup"
            applyFlipEffect={true}
            backTitle="انضم إلى المحترفين!"
            backDescription="أنشئ حسابك مجانًا وابدأ في استخدام أدواتنا المتقدمة اليوم."
            backCtaText="إنشاء حساب"
            dataAiHint="user registration"
            cardHeightClass="h-72 sm:h-80"
          />
          <InfoCard
            title="تسجيل دخول المدير"
            description="وصول خاص للمشرفين لإدارة النظام والمستخدمين."
            icon={<ShieldCheck />} // Using ShieldCheck for admin
            iconWrapperClass="bg-sky-100 dark:bg-sky-900" // Different color for admin card
            iconColorClass="text-sky-500 dark:text-sky-400"
            href="/login" // Still points to the same login page
            applyFlipEffect={true}
            backTitle="لوحة تحكم المشرف"
            backDescription="أدخل بيانات اعتماد المسؤول للوصول إلى أدوات الإدارة المتقدمة."
            backCtaText="دخول المسؤول"
            dataAiHint="admin login"
            cardHeightClass="h-72 sm:h-80"
            className="lg:col-start-auto sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 max-w-md lg:max-w-none" // Center on medium, specific for 3rd card
          />
        </div>
      </section>
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
