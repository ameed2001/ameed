
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { Box, BarChart3 } from 'lucide-react'; // Removed DollarSign
import { useState } from 'react';
import AuthRequiredModal from '@/components/modals/AuthRequiredModal';

const MainDashboardClient = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleFeatureClick = () => {
    setIsAuthModalOpen(true);
  };

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Box />, 
      iconWrapperClass: "bg-red-100 dark:bg-red-900",
      iconColorClass: "text-red-500 dark:text-red-400",
      onClick: handleFeatureClick,
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
      onClick: handleFeatureClick,
      dataAiHint: "steel calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
    },
    // Card for "حساب الأسعار" has been removed
  ];

  return (
    <>
      <div 
        className="container mx-auto px-4 py-16 text-center"
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

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default MainDashboardClient;
