
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { Box, BarChart3, DollarSign } from 'lucide-react'; // Removed LogIn, UserPlus
import { useState } from 'react';
import CalculationModal from '@/components/modals/CalculationModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';

const MainDashboardClient = () => {
  const [isConcreteModalOpen, setIsConcreteModalOpen] = useState(false);
  const [concreteModalCategory, setConcreteModalCategory] = useState('');
  const [isSteelModalOpen, setIsSteelModalOpen] = useState(false);
  const [steelModalCategory, setSteelModalCategory] = useState('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const handleOpenConcreteModal = (category: string) => {
    setConcreteModalCategory(category);
    setIsConcreteModalOpen(true);
  };
  const handleOpenSteelModal = (category: string) => {
    setSteelModalCategory(category);
    setIsSteelModalOpen(true);
  };
  const handleOpenPriceModal = () => setIsPriceModalOpen(true);

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
    // Login and Signup cards removed from here
  ];

  return (
    <>
      <div 
        className="container mx-auto px-4 py-16 text-center" // ID removed as it's now on page.tsx
      >
        <h2 className="text-3xl md:text-4xl font-bold text-app-red mb-12">أدواتك الأساسية للحسابات</h2>
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
    </>
  );
};

export default MainDashboardClient;
