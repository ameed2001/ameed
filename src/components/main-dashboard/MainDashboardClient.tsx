
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus, Cubes, BarChart3, Info as InfoIcon, Users, DollarSign, FileText as ReportsIcon, GanttChartSquare, FolderArchive, Brain } from 'lucide-react';
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
      backTitle: "تسجيل الدخول",
      backDescription: "مستعد للبدء؟ اضغط هنا للوصول إلى حسابك.",
      backCtaText: "تسجيل الدخول",
      applyFlipEffect: true,
    },
    { 
      title: "إنشاء حساب", 
      description: "انضم إلينا للاستفادة من جميع ميزات الموقع وحفظ تقدمك.",
      icon: <UserPlus />, 
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-600 dark:text-green-400",
      href: "/signup",
      dataAiHint: "new user",
      backTitle: "إنشاء حساب جديد",
      backDescription: "انضم إلى مجتمعنا الآن وابدأ في إدارة مشاريعك بكفاءة.",
      backCtaText: "إنشاء حساب",
      applyFlipEffect: true,
    },
  ];

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Cubes />,
      iconWrapperClass: "bg-red-100 dark:bg-red-900",
      iconColorClass: "text-red-500 dark:text-red-400",
      onClick: () => { setIsConcreteModalOpen(true); setConcreteModalCategory('العناصر الإنشائية'); },
      dataAiHint: "concrete calculation",
      backTitle: "خيارات الباطون",
      backDescription: "اختر العنصر الإنشائي لحساب كمية الباطون اللازمة.",
    },
    {
      title: "حساب كميات الحديد",
      description: "تقدير كميات حديد التسليح المطلوبة لمشروعك.",
      icon: <BarChart3 />,
      iconWrapperClass: "bg-blue-100 dark:bg-blue-900",
      iconColorClass: "text-blue-500 dark:text-blue-400",
      onClick: () => { setIsSteelModalOpen(true); setSteelModalCategory('العناصر الإنشائية'); },
      dataAiHint: "steel calculation",
      backTitle: "خيارات الحديد",
      backDescription: "اختر العنصر الإنشائي لحساب كمية الحديد اللازمة.",
    },
    {
      title: "إرشادات للمهندس",
      description: "نصائح وإرشادات عملية للمهندسين الإنشائيين.",
      icon: <Users />,
      iconWrapperClass: "bg-green-100 dark:bg-green-900",
      iconColorClass: "text-green-500 dark:text-green-400",
      onClick: () => { setIsGuidelinesModalOpen(true); setGuidelinesModalType('engineer'); },
      dataAiHint: "engineer guidelines",
      backTitle: "للمهندسين",
      backDescription: "إرشادات لضمان دقة الحسابات وكفاءة التنفيذ.",
    },
    {
      title: "إرشادات لصاحب المبنى",
      description: "معلومات هامة لأصحاب المشاريع والمباني.",
      icon: <InfoIcon />,
      iconWrapperClass: "bg-purple-100 dark:bg-purple-900",
      iconColorClass: "text-purple-500 dark:text-purple-400",
      onClick: () => { setIsGuidelinesModalOpen(true); setGuidelinesModalType('owner'); },
      dataAiHint: "owner guidelines",
      backTitle: "لأصحاب المباني",
      backDescription: "نصائح لمتابعة المشروع وفهم متطلبات البناء.",
    },
    {
      title: "حساب الأسعار",
      description: "تقدير التكاليف الإجمالية لمواد البناء الأساسية.",
      icon: <DollarSign />,
      iconWrapperClass: "bg-yellow-100 dark:bg-yellow-700", // Adjusted dark bg
      iconColorClass: "text-yellow-500 dark:text-yellow-400",
      onClick: () => setIsPriceModalOpen(true),
      dataAiHint: "cost estimation",
      backTitle: "تقدير التكلفة",
      backDescription: "أدخل الكميات والأسعار لتقدير تكلفة المواد.",
    },
    {
      title: "التقارير بالذكاء الاصطناعي",
      description: "إنشاء تقارير مشروع مخصصة باستخدام الذكاء الاصطناعي.",
      icon: <Brain />,
      iconWrapperClass: "bg-indigo-100 dark:bg-indigo-900",
      iconColorClass: "text-indigo-500 dark:text-indigo-400",
      href: "/ai-report-generator",
      dataAiHint: "ai reports",
      backTitle: "إنشاء التقارير",
      backDescription: "استخدم الذكاء الاصطناعي لتوليد تقارير مفصلة.",
      backCtaText: "ابدأ الإنشاء"
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
              cardHeightClass="h-72" // Specific height for flip cards
              className="min-h-[288px]" // Ensure consistent height for flip visual
            />
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-app-red mb-10">أدواتك الأساسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {dashboardCards.map(card => (
            <InfoCard 
              key={card.title}
              {...card}
              cardHeightClass="h-72" // Consistent height for dashboard cards
              className="min-h-[288px]"
              // applyFlipEffect={true} // Can enable flip for these too if desired by setting to true
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
