
"use client"; // Required for useEffect, useState, useRouter, useToast

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/main-dashboard/HeroSection';
import MainDashboardClient from '@/components/main-dashboard/MainDashboardClient';
import FeaturesSection from '@/components/main-dashboard/FeaturesSection';
import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, ShieldCheck, HardHat } from 'lucide-react'; // Added HardHat
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
      title: "إنشاء حساب مالك", // Changed title
      description: "لأصحاب المشاريع لمتابعة مشاريعهم والحصول على التقديرات.", // Changed description
      icon: <UserPlus />, // Kept UserPlus, or could be <User />
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      href: "/signup", // Links to owner signup page
      applyFlipEffect: true,
      backTitle: "حساب مالك جديد", // Changed backTitle
      backDescription: "أنشئ حسابك كمالك مشروع للوصول إلى لوحة التحكم الخاصة بك.", // Changed backDescription
      backCtaText: "إنشاء حساب مالك", // Changed backCtaText
      dataAiHint: "owner registration", // Changed dataAiHint
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("إنشاء حساب مالك") : undefined,
    },
    {
      title: "إنشاء حساب مهندس", // New card
      description: "للمهندسين للاستفادة من أدوات حساب الكميات وإدارة المشاريع.",
      icon: <HardHat />,
      iconWrapperClass: "bg-yellow-100 dark:bg-yellow-900",
      iconColorClass: "text-yellow-600 dark:text-yellow-400",
      href: "/engineer-signup", // Links to engineer signup page
      applyFlipEffect: true,
      backTitle: "حساب مهندس جديد",
      backDescription: "سجل كمهندس للاستفادة من أدواتنا المتقدمة في إدارة المشاريع.",
      backCtaText: "إنشاء حساب مهندس",
      dataAiHint: "engineer registration",
      cardHeightClass: "h-72 sm:h-80",
      onClick: isAdminLoggedIn ? () => handleAuthCardClickForAdmin("إنشاء حساب مهندس") : undefined,
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
      // Removed special className to allow natural flow in a 2x2 grid
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto"> 
          {/* Changed grid to sm:grid-cols-2 for a 2x2 layout with 4 cards */}
          {authCards.map(cardProps => (
            <InfoCard
              key={cardProps.title}
              title={cardProps.title}
              description={cardProps.description}
              icon={cardProps.icon}
              iconWrapperClass={cardProps.iconWrapperClass}
              iconColorClass={cardProps.iconColorClass}
              href={isAdminLoggedIn ? undefined : cardProps.href}
              onClick={cardProps.onClick}
              applyFlipEffect={cardProps.applyFlipEffect}
              backTitle={cardProps.backTitle}
              backDescription={cardProps.backDescription}
              backCtaText={cardProps.backCtaText}
              dataAiHint={cardProps.dataAiHint}
              cardHeightClass={cardProps.cardHeightClass}
              className={cardProps.className} // Pass className if it exists (though Admin card's was removed)
            />
          ))}
        </div>
      </section>
      <MainDashboardClient />
      <FeaturesSection />
    </AppLayout>
  );
}
