
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { Box, BarChart3, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthRequiredModal from '@/components/modals/AuthRequiredModal';
import ConcreteForm from '@/components/forms/ConcreteForm';
import SteelForm from '@/components/forms/SteelForm';
import SimpleCostEstimatorForm from '@/components/SimpleCostEstimatorForm';
import { AnimatePresence, motion } from 'framer-motion';

const MainDashboardClient = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Safely get user role from localStorage on the client side
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleFeatureClick = (calculatorType: string) => {
    // Allow engineers, owners, AND admins to use the calculators
    if (userRole === 'ENGINEER' || userRole === 'OWNER' || userRole === 'ADMIN') {
      setActiveCalculator(prev => prev === calculatorType ? null : calculatorType);
    } else {
      // For guests, open the authentication modal
      setIsAuthModalOpen(true);
    }
  };

  const dashboardCards = [
    {
      title: "حساب كميات الباطون",
      description: "حساب الكميات الدقيقة للخرسانة لمختلف العناصر الإنشائية.",
      icon: <Box className="h-8 w-8 text-red-600"/>, 
      iconWrapperClass: "bg-red-100",
      onClick: () => handleFeatureClick('concrete'),
      dataAiHint: "concrete calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
      frontCustomClass: "bg-white/95",
    },
    {
      title: "حساب كميات الحديد",
      description: "تقدير كميات حديد التسليح المطلوبة لمشروعك.",
      icon: <BarChart3 className="h-8 w-8 text-blue-600"/>,
      iconWrapperClass: "bg-blue-100",
      onClick: () => handleFeatureClick('steel'),
      dataAiHint: "steel calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
      frontCustomClass: "bg-white/95",
    },
    {
      title: "حساب الأسعار",
      description: "تقدير التكلفة الإجمالية لمواد البناء المختلفة لمشروعك.",
      icon: <Calculator className="h-8 w-8 text-green-600"/>,
      iconWrapperClass: "bg-green-100",
      onClick: () => handleFeatureClick('price'),
      dataAiHint: "price calculation",
      cardHeightClass: "h-72",
      applyFlipEffect: false,
      frontCustomClass: "bg-white/95",
    },
  ];
  
  const renderCalculator = () => {
    let calculatorComponent = null;
    switch (activeCalculator) {
      case 'concrete':
        calculatorComponent = <ConcreteForm category="مخصص" />;
        break;
      case 'steel':
        calculatorComponent = <SteelForm category="مخصص" />;
        break;
      case 'price':
        calculatorComponent = <SimpleCostEstimatorForm />;
        break;
      default:
        return null;
    }
    
    return (
       <div className="mt-8 mb-8 relative max-w-2xl mx-auto">
        {calculatorComponent}
       </div>
    );
  };


  return (
    <>
      <section 
        className="py-16 text-center bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">أدواتك الأساسية للحسابات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {dashboardCards.map(card => (
              <InfoCard 
                key={card.title}
                {...card}
              />
            ))}
          </div>
          
          <AnimatePresence>
            {activeCalculator && (
              <motion.div
                initial={{ opacity: 0, y: 50, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -50, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {renderCalculator()}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default MainDashboardClient;
