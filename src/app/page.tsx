
"use client"; // Required for useEffect, useState, useRouter, useToast

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/main-dashboard/HeroSection';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';
import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      description: "للوصول إلى ميزات إضافية وإدارة مشاريعك.",
      icon: <LogIn />,
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-500 dark:text-green-400",
      href: "/login",
      applyFlipEffect: true,
      backTitle: "مرحباً بعودتك!",
      backDescription: "أدخل بياناتك للوصول إلى حسابك وإدارة مشاريعك بكفاءة.",
      backCtaText: "تسجيل الدخول الآن",
      dataAiHint: "user login",
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("تسجيل الدخول") : undefined,
    },
    {
      title: "إنشاء حساب جديد",
      description: "انضم للاستفادة من جميع أدوات حساب الكميات وإدارة المشاريع.",
      icon: <UserPlus />,
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      href: "/signup",
      applyFlipEffect: true,
      backTitle: "انضم إلى المحترفين!",
      backDescription: "أنشئ حسابك مجانًا وابدأ في استخدام أدواتنا المتقدمة اليوم.",
      backCtaText: "إنشاء حساب",
      dataAiHint: "user registration",
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
      className: "lg:col-start-auto sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 max-w-md lg:max-w-none",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {authCards.map(cardProps => (
            <InfoCard
              key={cardProps.title}
              title={cardProps.title}
              description={cardProps.description}
              icon={cardProps.icon}
              iconWrapperClass={cardProps.iconWrapperClass}
              iconColorClass={cardProps.iconColorClass}
              href={isAdminLoggedIn ? undefined : cardProps.href} // Pass href only if not admin or no custom onClick
              onClick={cardProps.onClick}
              applyFlipEffect={cardProps.applyFlipEffect}
              backTitle={cardProps.backTitle}
              backDescription={cardProps.backDescription}
              backCtaText={cardProps.backCtaText}
              dataAiHint={cardProps.dataAiHint}
              cardHeightClass={cardProps.cardHeightClass}
              className={cardProps.className}
            />
          ))}
        </div>
      </section>
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
