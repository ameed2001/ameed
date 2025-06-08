
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus } from 'lucide-react';
// Modals are still imported but not actively used by InfoCards on this page
import CalculationModal from '@/components/modals/CalculationModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import { useState } from 'react';

const MainDashboardClient = () => {
  // State for modals (kept for now, in case they are used by other means or future cards)
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
      // href: "/login", // Removed href to make it non-navigational
      icon: <LogIn />, 
      iconWrapperClass: "bg-blue-100 dark:bg-blue-800",
      iconColorClass: "text-blue-600 dark:text-blue-300",
      dataAiHint: "user login" 
    },
    { 
      title: "إنشاء حساب", 
      description: "انضم إلينا للاستفادة من جميع ميزات الموقع وحفظ تقدمك.",
      // href: "/signup", // Removed href to make it non-navigational
      icon: <UserPlus />, 
      iconWrapperClass: "bg-green-100 dark:bg-green-800",
      iconColorClass: "text-green-600 dark:text-green-300",
      dataAiHint: "new user" 
    },
  ];

  return (
    <>
      <div 
        id="auth-cards-section" // ID for scrolling from HeroSection button
        className="container mx-auto px-4 py-12 text-center"
      >
        <div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto"
            style={{minHeight: 'calc(100vh - 400px - 150px - 3rem)'}} // Adjusted minHeight for viewport filling
        >
          {authCards.map(card => (
            <InfoCard 
              key={card.title}
              title={card.title} 
              description={card.description}
              href={card.href} // href will be undefined for these cards
              icon={card.icon}
              iconWrapperClass={card.iconWrapperClass}
              iconColorClass={card.iconColorClass}
              dataAiHint={card.dataAiHint}
              className="min-h-[240px] sm:min-h-[260px]"
            />
          ))}
        </div>
      </div>

      {/* Modals are kept in the DOM but won't be triggered by the current InfoCards */}
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
