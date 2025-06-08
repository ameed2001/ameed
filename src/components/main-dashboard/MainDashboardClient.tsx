
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { Box, BarChart3, DollarSign, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import CalculationModal from '@/components/modals/CalculationModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
// import AuthModal, { type AuthModalType } from '@/components/modals/AuthModal'; // Restore if AuthModal was used

const MainDashboardClient = () => {
  const [isConcreteModalOpen, setIsConcreteModalOpen] = useState(false);
  const [concreteModalCategory, setConcreteModalCategory] = useState('');
  const [isSteelModalOpen, setIsSteelModalOpen] = useState(false);
  const [steelModalCategory, setSteelModalCategory] = useState('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  // const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Restore if AuthModal was used
  // const [authModalType, setAuthModalType] = useState<AuthModalType>('login'); // Restore if AuthModal was used

  const handleOpenConcreteModal = (category: string) => {
    setConcreteModalCategory(category);
    setIsConcreteModalOpen(true);
  };
  const handleOpenSteelModal = (category: string) => {
    setSteelModalCategory(category);
    setIsSteelModalOpen(true);
  };
  const handleOpenPriceModal = () => setIsPriceModalOpen(true);
  /*
  const handleOpenAuthModal = (type: AuthModalType) => { // Restore if AuthModal was used
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };
  */

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Box />, 
      iconWrapperClass: "bg-red-100 dark:bg-red-900",
      iconColorClass: "text-red-500 dark:text-red-400",
      onClick: () => handleOpenConcreteModal("القواعد"), 
      dataAiHint: "concrete calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
    },
    {
      title: "حساب كميات الحديد",
      description: "تقدير كميات حديد التسليح المطلوبة لمشروعك.",
      icon: <BarChart3 />,
      iconWrapperClass: "bg-blue-100 dark:bg-blue-900",
      iconColorClass: "text-blue-500 dark:text-blue-400",
      onClick: () => handleOpenSteelModal("الأعمدة"), 
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
      onClick: handleOpenPriceModal,
      dataAiHint: "cost estimation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
    },
    {
      title: "تسجيل الدخول",
      description: "للوصول إلى ميزات إضافية وإدارة مشاريعك.",
      icon: <LogIn />,
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-500 dark:text-green-400",
      // onClick: () => handleOpenAuthModal('login'), // Use this if AuthModal is preferred
      href: "/login",
      applyFlipEffect: true,
      backTitle: "مرحباً بعودتك!",
      backDescription: "أدخل بياناتك للوصول إلى حسابك وإدارة مشاريعك بكفاءة.",
      backCtaText: "تسجيل الدخول الآن",
      dataAiHint: "user login",
      cardHeightClass: "h-72",
    },
    {
      title: "إنشاء حساب جديد",
      description: "انضم للاستفادة من جميع أدوات حساب الكميات وإدارة المشاريع.",
      icon: <UserPlus />,
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      // onClick: () => handleOpenAuthModal('signup'), // Use this if AuthModal is preferred
      href: "/signup",
      applyFlipEffect: true,
      backTitle: "انضم إلى المحترفين!",
      backDescription: "أنشئ حسابك مجانًا وابدأ في استخدام أدواتنا المتقدمة اليوم.",
      backCtaText: "إنشاء حساب",
      dataAiHint: "user registration",
      cardHeightClass: "h-72",
    },
  ];

  return (
    <>
      <div 
        id="auth-cards-section" // This ID is used by HeroSection button to scroll here
        className="container mx-auto px-4 py-12 text-center"
      >
        <h2 className="text-3xl font-bold text-app-red mb-10">أدواتك الأساسية وتسجيل الدخول</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {dashboardCards.map(card => (
            <InfoCard 
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </div>

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
      {/* 
      <AuthModal // Restore if AuthModal was used
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authModalType}
      />
      */}
    </>
  );
};

export default MainDashboardClient;
