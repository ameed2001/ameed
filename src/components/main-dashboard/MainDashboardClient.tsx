
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, Box, BarChart3, DollarSign, ArrowLeft } from 'lucide-react';
// Removed imports for other icons and modals no longer used directly here
import { useState } from 'react';

const MainDashboardClient = () => {
  // State for modals is no longer needed here as cards will scroll to auth section

  const authCards = [
    { 
      title: "تسجيل الدخول", 
      description: "قم بالوصول إلى حسابك الموجود لإدارة مشاريعك وحساباتك.",
      icon: <LogIn />, 
      iconWrapperClass: "bg-blue-100 dark:bg-blue-900",
      iconColorClass: "text-blue-600 dark:text-blue-400",
      href: "/login",
      dataAiHint: "user login",
      cardHeightClass: "h-72",
      applyFlipEffect: true,
      backTitle: "جاهز للبدء؟",
      backDescription: "اضغط هنا للوصول إلى حسابك وإدارة مشاريعك.",
      backCtaText: "تسجيل الدخول",
    },
    { 
      title: "إنشاء حساب", 
      description: "انضم إلينا للاستفادة من جميع ميزات الموقع وحفظ تقدمك.",
      icon: <UserPlus />, 
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-600 dark:text-green-400",
      href: "/signup",
      dataAiHint: "new user",
      cardHeightClass: "h-72",
      applyFlipEffect: true,
      backTitle: "جديد هنا؟",
      backDescription: "أنشئ حسابك الآن لتبدأ في استخدام أدواتنا القوية.",
      backCtaText: "إنشاء حساب",
    },
  ];

  const scrollToAuthSection = () => {
    const authSection = document.getElementById('auth-cards-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Box />, 
      iconWrapperClass: "bg-red-100 dark:bg-red-900",
      iconColorClass: "text-red-500 dark:text-red-400",
      onClick: scrollToAuthSection,
      dataAiHint: "concrete calculation",
      cardHeightClass: "h-72", // Or adjust as needed for non-flip cards
      applyFlipEffect: false,
    },
    {
      title: "حساب كميات الحديد",
      description: "تقدير كميات حديد التسليح المطلوبة لمشروعك.",
      icon: <BarChart3 />,
      iconWrapperClass: "bg-blue-100 dark:bg-blue-900",
      iconColorClass: "text-blue-500 dark:text-blue-400",
      onClick: scrollToAuthSection,
      dataAiHint: "steel calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
    },
    {
      title: "حساب الأسعار",
      description: "تقدير التكاليف الإجمالية لمواد البناء الأساسية.",
      icon: <DollarSign />,
      iconWrapperClass: "bg-yellow-100 dark:bg-yellow-700",
      iconColorClass: "text-yellow-500 dark:text-yellow-400",
      onClick: scrollToAuthSection,
      dataAiHint: "cost estimation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
    },
  ];


  return (
    <>
      <div 
        id="main-content-area" 
        className="container mx-auto px-4 py-12 text-center"
      >
        <div 
            id="auth-cards-section" 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto mb-16"
        >
          {authCards.map(card => (
            <InfoCard 
              key={card.title}
              {...card}
              // Pass ArrowLeft for the back of flip cards
              backCtaIcon={<ArrowLeft className="h-4 w-4" />}
            />
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-app-red mb-10">أدواتك الأساسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {dashboardCards.map(card => (
            <InfoCard 
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </div>

      {/* Modals are no longer triggered from this component directly */}
      {/* 
      <CalculationModal
        isOpen={isConcreteModalOpen}
        onClose={() => setIsConcreteModalOpen(false)}
        calculationType="concrete"
        category={concreteModalCategory}
      />
      <CalculationModal
        isOpen={isSteelModalOpen}
        onClose={() => setIsSteelModalOpen(false)}
        calculationType="steel"
        category={steelModalCategory}
      />
      <PriceCalculationModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />
      <GuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
        type={guidelinesModalType}
      /> 
      */}
    </>
  );
};

export default MainDashboardClient;
