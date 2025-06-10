
"use client"; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/main-dashboard/HeroSection';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';
import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, ShieldCheck, HardHat, ArrowLeft, Home as HomeIcon } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'ADMIN') {
        setIsAdminLoggedIn(true);
      }
    }
  }, []);

  const handleAuthCardClickForAdmin = (cardTitle: string) => {
    toast({
      title: "تم تسجيل الدخول بالفعل",
      description: `أنت مسجّل الدخول بالفعل كمدير. لا حاجة لـ "${cardTitle}". جاري توجيهك إلى لوحة التحكم...`,
      variant: "default",
    });
    router.push('/admin');
  };

  const authCards = [
    {
      title: "تسجيل الدخول",
      description: "اختر نوع الحساب للوصول إلى ميزاتك المخصصة وإدارة مشاريعك.", // Updated description
      icon: <LogIn />,
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-500 dark:text-green-400",
      applyFlipEffect: true,
      backTitle: "اختر طريقة الدخول", // Updated back title
      backDescription: "حدد ما إذا كنت تريد تسجيل الدخول كمهندس أو كمالك.", // Updated back description
      backCustomContent: ( // Using custom content for two login buttons
        <div className="space-y-3 w-full px-4">
          <Button asChild size="lg" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <Link href="/login"> {/* login is now engineer login */}
              <HardHat className="ml-2 h-5 w-5" />
              تسجيل دخول مهندس
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <Link href="/owner-login"> {/* New owner login page */}
              <HomeIcon className="ml-2 h-5 w-5" />
              تسجيل دخول مالك
            </Link>
          </Button>
        </div>
      ),
      dataAiHint: "user login options",
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("تسجيل الدخول") : undefined,
    },
    {
      title: "إنشاء حساب جديد",
      description: "سجل كمالك مشروع أو كمهندس للوصول إلى الأدوات والخدمات المخصصة.",
      icon: <UserPlus />,
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      applyFlipEffect: true,
      backTitle: "اختر نوع الحساب",
      backDescription: "حدد نوع الحساب الذي ترغب في إنشائه للوصول إلى الميزات المناسبة.",
      backCustomContent: (
        <div className="space-y-3 w-full px-4">
          <Button asChild size="lg" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <Link href="/owner-signup"> 
              <HomeIcon className="ml-2 h-5 w-5" /> 
              إنشاء حساب مالك
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <Link href="/signup"> 
              <HardHat className="ml-2 h-5 w-5" />
              إنشاء حساب مهندس
            </Link>
          </Button>
        </div>
      ),
      dataAiHint: "account registration",
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("إنشاء حساب جديد") : undefined,
    },
    {
      title: "تسجيل دخول المدير",
      description: "وصول خاص للمشرفين لإدارة النظام والمستخدمين.",
      icon: <ShieldCheck />,
      iconWrapperClass: "bg-sky-100 dark:bg-sky-900",
      iconColorClass: "text-sky-500 dark:text-sky-400",
      href: "/admin-login",
      applyFlipEffect: true,
      backTitle: "لوحة تحكم المشرف",
      backDescription: "أدخل بيانات اعتماد المسؤول للوصول إلى أدوات الإدارة المتقدمة.",
      backCtaText: "دخول المسؤول",
      dataAiHint: "admin login",
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("تسجيل دخول المدير") : undefined,
    },
  ];


  return (
    <AppLayout>
      <HeroSection />
      <section id="auth-cards-section" className="container mx-auto px-4 py-16 text-center bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-app-red mb-12">
          ابدأ رحلتك معنا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto"> 
          {authCards.map(cardProps => (
            <InfoCard
              key={cardProps.title}
              title={cardProps.title}
              description={cardProps.description}
              icon={cardProps.icon}
              iconWrapperClass={cardProps.iconWrapperClass}
              iconColorClass={cardProps.iconColorClass}
              href={!isAdminLoggedIn && !cardProps.backCustomContent && cardProps.title === "تسجيل دخول المدير" ? cardProps.href : undefined}
              onClick={cardProps.onClick}
              applyFlipEffect={cardProps.applyFlipEffect}
              backTitle={cardProps.backTitle}
              backDescription={cardProps.backDescription}
              backCtaText={cardProps.backCtaText}
              backCustomContent={cardProps.backCustomContent}
              dataAiHint={cardProps.dataAiHint}
              cardHeightClass={cardProps.cardHeightClass}
              className={cn(
                cardProps.title === "إنشاء حساب جديد" && "sm:col-span-1 md:col-span-1", 
                cardProps.title === "تسجيل دخول المدير" && "sm:col-span-1 md:col-span-1" 
              )}
            />
          ))}
        </div>
      </section>
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
