
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, Box, BarChart3, Info as InfoIcon, Users, DollarSign, FileText as ReportsIcon, GanttChartSquare, FolderArchive, Brain, ArrowLeft } from 'lucide-react';
import CalculationModal from '@/components/modals/CalculationModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import { useState } from 'react';

const MainDashboardClient = () => {
  const [isConcreteModalOpen, setIsConcreteModalOpen] = useState(false);
  const [concreteModalCategory, setConcreteModalCategory] = useState('');
  const [isSteelModalOpen, setIsSteelModalOpen] = useState(false);
  const [steelModalCategory, setSteelModalCategory] = useState('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [guidelinesModalType, setGuidelinesModalType] = useState<'engineer' | 'owner'>('engineer');

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

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Box />, 
      iconWrapperClass: "bg-red-100 dark:bg-red-900",
      iconColorClass: "text-red-500 dark:text-red-400",
      onClick: () => { setIsConcreteModalOpen(true); setConcreteModalCategory('العناصر الإنشائية'); },
      dataAiHint: "concrete calculation",
      cardHeightClass: "h-72",
    },
    {
      title: "حساب كميات الحديد",
      description: "تقدير كميات حديد التسليح المطلوبة لمشروعك.",
      icon: <BarChart3 />,
      iconWrapperClass: "bg-blue-100 dark:bg-blue-900",
      iconColorClass: "text-blue-500 dark:text-blue-400",
      onClick: () => { setIsSteelModalOpen(true); setSteelModalCategory('العناصر الإنشائية'); },
      dataAiHint: "steel calculation",
      cardHeightClass: "h-72",
    },
    {
      title: "إرشادات للمهندس",
      description: "نصائح وإرشادات عملية للمهندسين الإنشائيين.",
      icon: <Users />, // Using Users icon as per original InfoCard for engineers
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-500 dark:text-green-400",
      onClick: () => { setIsGuidelinesModalOpen(true); setGuidelinesModalType('engineer'); },
      dataAiHint: "engineer guidelines",
      cardHeightClass: "h-72",
    },
    {
      title: "إرشادات لصاحب المبنى",
      description: "معلومات هامة لأصحاب المشاريع والمباني.",
      icon: <InfoIcon />, // Using Info icon as per original InfoCard for owners
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      onClick: () => { setIsGuidelinesModalOpen(true); setGuidelinesModalType('owner'); },
      dataAiHint: "owner guidelines",
      cardHeightClass: "h-72",
    },
    {
      title: "حساب الأسعار",
      description: "تقدير التكاليف الإجمالية لمواد البناء الأساسية.",
      icon: <DollarSign />,
      iconWrapperClass: "bg-yellow-100 dark:bg-yellow-700",
      iconColorClass: "text-yellow-500 dark:text-yellow-400",
      onClick: () => setIsPriceModalOpen(true),
      dataAiHint: "cost estimation",
      cardHeightClass: "h-72",
    },
    {
      title: "التقارير بالذكاء الاصطناعي",
      description: "إنشاء تقارير مشروع مخصصة باستخدام الذكاء الاصطناعي.",
      icon: <Brain />,
      iconWrapperClass: "bg-indigo-100 dark:bg-indigo-900",
      iconColorClass: "text-indigo-500 dark:text-indigo-400",
      href: "/ai-report-generator",
      dataAiHint: "ai reports",
      cardHeightClass: "h-72",
       // Assuming you want a flip effect for this as well, if not, remove applyFlipEffect or set to false
      applyFlipEffect: false, // Set to true if you want flip effect
      // backTitle: "إنشاء التقارير", // Add if applyFlipEffect is true
      // backDescription: "استخدم الذكاء الاصطناعي لتوليد تقارير مفصلة.", // Add if applyFlipEffect is true
      // backCtaText: "ابدأ الإنشاء" // Add if applyFlipEffect is true
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
    </>
  );
};

export default MainDashboardClient;
