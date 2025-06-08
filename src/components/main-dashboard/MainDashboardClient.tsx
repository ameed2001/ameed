"use client";

import { useState } from 'react';
import InfoCard from '@/components/ui/InfoCard';
import CalculationModal from '@/components/modals/CalculationModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ModalType = 'concrete' | 'steel' | 'engineer_guidelines' | 'owner_guidelines' | 'price_calculator' | null;
type CalculationCategory = 
  'صبة النظافة' | 'القواعد' | 'شروش الأعمدة' | 'الجسور الأرضية' | 
  'الأرضية' | 'الأعمدة' | 'الأسقف' | null;

const MainDashboardClient = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [calculationType, setCalculationType] = useState<'concrete' | 'steel' | null>(null);
  const [calculationCategory, setCalculationCategory] = useState<CalculationCategory>(null);
  
  // Specific modals for each card's initial options
  const [concreteOptionsOpen, setConcreteOptionsOpen] = useState(false);
  const [steelOptionsOpen, setSteelOptionsOpen] = useState(false);
  const [engineerGuidelinesOpen, setEngineerGuidelinesOpen] = useState(false);
  const [ownerGuidelinesOpen, setOwnerGuidelinesOpen] = useState(false);
  const [priceCalculatorOpen, setPriceCalculatorOpen] = useState(false);

  // Generic calculation form modal state
  const [calculationFormOpen, setCalculationFormOpen] = useState(false);


  const handleCardClick = (modalType: ModalType) => {
    setActiveModal(modalType);
    if (modalType === 'concrete') setConcreteOptionsOpen(true);
    else if (modalType === 'steel') setSteelOptionsOpen(true);
    else if (modalType === 'engineer_guidelines') setEngineerGuidelinesOpen(true);
    else if (modalType === 'owner_guidelines') setOwnerGuidelinesOpen(true);
    else if (modalType === 'price_calculator') setPriceCalculatorOpen(true);
  };

  const openCalculationForm = (type: 'concrete' | 'steel', category: CalculationCategory) => {
    setCalculationType(type);
    setCalculationCategory(category);
    setConcreteOptionsOpen(false);
    setSteelOptionsOpen(false);
    setCalculationFormOpen(true);
  };

  const concreteCategories: CalculationCategory[] = ['صبة النظافة', 'القواعد', 'شروش الأعمدة', 'الجسور الأرضية', 'الأرضية', 'الأعمدة', 'الأسقف'];
  const steelCategories: CalculationCategory[] = ['القواعد', 'شروش الأعمدة', 'الجسور الأرضية', 'الأرضية', 'الأعمدة', 'الأسقف'];

  return (
    <>
      <div className="bg-yellow-100/80 text-app-red p-4 md:p-6 my-6 md:my-8 rounded-3xl shadow-message max-w-3xl mx-auto backdrop-blur-sm">
        <p className="text-lg md:text-xl font-bold">
          هذا الموقع مختص في حساب الكميات لكل من الحديد والباطون للأبنية الانشائية والأبار والجدران الإستنادية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        <InfoCard title="حساب كميات الباطون" onClick={() => handleCardClick('concrete')} />
        <InfoCard title="حساب كميات الحديد" onClick={() => handleCardClick('steel')} />
        <InfoCard title="إرشادات للمهندس" onClick={() => handleCardClick('engineer_guidelines')} />
        <InfoCard title="إرشادات لصاحب المبنى" onClick={() => handleCardClick('owner_guidelines')} />
        <InfoCard title="حساب الأسعار" onClick={() => handleCardClick('price_calculator')} />
      </div>

      {/* Concrete Options Modal */}
      <Dialog open={concreteOptionsOpen} onOpenChange={setConcreteOptionsOpen}>
        <DialogContent className="modal-content-gradient text-white sm:max-w-[425px] animate-modal-fade-in custom-dialog-overlay">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">اختر عنصر الباطون</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 left-3 text-white hover:bg-white/20 hover:text-app-gold">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {concreteCategories.map(cat => (
              <Button key={cat} variant="outline" className="w-full justify-start p-3 bg-white/10 hover:bg-app-gold/80 hover:text-gray-900 border-white/30 text-white transition-all duration-300 transform hover:translate-x-[-10px]" onClick={() => openCalculationForm('concrete', cat)}>
                {cat}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Steel Options Modal */}
      <Dialog open={steelOptionsOpen} onOpenChange={setSteelOptionsOpen}>
        <DialogContent className="modal-content-gradient text-white sm:max-w-[425px] animate-modal-fade-in custom-dialog-overlay">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">اختر عنصر الحديد</DialogTitle>
             <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 left-3 text-white hover:bg-white/20 hover:text-app-gold">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {steelCategories.map(cat => (
              <Button key={cat} variant="outline" className="w-full justify-start p-3 bg-white/10 hover:bg-app-gold/80 hover:text-gray-900 border-white/30 text-white transition-all duration-300 transform hover:translate-x-[-10px]" onClick={() => openCalculationForm('steel', cat)}>
                {cat}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Calculation Form Modal */}
      {calculationFormOpen && calculationType && calculationCategory && (
        <CalculationModal
          isOpen={calculationFormOpen}
          onClose={() => setCalculationFormOpen(false)}
          calculationType={calculationType}
          category={calculationCategory}
        />
      )}

      {/* Engineer Guidelines Modal */}
      {engineerGuidelinesOpen && (
        <GuidelinesModal
          isOpen={engineerGuidelinesOpen}
          onClose={() => setEngineerGuidelinesOpen(false)}
          type="engineer"
        />
      )}

      {/* Owner Guidelines Modal */}
      {ownerGuidelinesOpen && (
        <GuidelinesModal
          isOpen={ownerGuidelinesOpen}
          onClose={() => setOwnerGuidelinesOpen(false)}
          type="owner"
        />
      )}

      {/* Price Calculator Modal */}
      {priceCalculatorOpen && (
        <PriceCalculationModal
          isOpen={priceCalculatorOpen}
          onClose={() => setPriceCalculatorOpen(false)}
        />
      )}
    </>
  );
};

export default MainDashboardClient;
