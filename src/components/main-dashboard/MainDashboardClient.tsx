
"use client";

import { useState } from 'react';
import InfoCard from '@/components/ui/InfoCard';
import CalculationModal from '@/components/modals/CalculationModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calculator, DraftingCompass, UserCheck, FileText, DollarSign, MessageSquare, Info } from 'lucide-react'; // Added more icons

type ModalType = 
  'concrete_options' | 'steel_options' | 
  'engineer_guidelines' | 'owner_guidelines' | 
  'price_calculator' | null;

type CalculationCategory = 
  'صبة النظافة' | 'القواعد' | 'شروش الأعمدة' | 'الجسور الأرضية' | 
  'الأرضية' | 'الأعمدة' | 'الأسقف' | null;

const MainDashboardClient = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [calculationType, setCalculationType] = useState<'concrete' | 'steel' | null>(null);
  const [calculationCategory, setCalculationCategory] = useState<CalculationCategory>(null);
  
  const [calculationFormOpen, setCalculationFormOpen] = useState(false);
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);
  const [guidelinesType, setGuidelinesType] = useState<'engineer' | 'owner' | null>(null);
  const [priceCalculatorOpen, setPriceCalculatorOpen] = useState(false);

  const handleCardClick = (modalType: ModalType) => {
    setActiveModal(modalType); // This will open the respective options/info modal
    if (modalType === 'engineer_guidelines') {
      setGuidelinesType('engineer');
      setGuidelinesModalOpen(true);
    } else if (modalType === 'owner_guidelines') {
      setGuidelinesType('owner');
      setGuidelinesModalOpen(true);
    } else if (modalType === 'price_calculator') {
      setPriceCalculatorOpen(true);
    }
    // For concrete_options and steel_options, the Dialog below with `open={activeModal === '...'}` will handle it.
  };

  const openCalculationForm = (type: 'concrete' | 'steel', category: CalculationCategory) => {
    setCalculationType(type);
    setCalculationCategory(category);
    setActiveModal(null); // Close the options modal
    setCalculationFormOpen(true);
  };

  const closeCalculationForm = () => {
    setCalculationFormOpen(false);
    setCalculationType(null);
    setCalculationCategory(null);
  };

  const closeGuidelinesModal = () => {
    setGuidelinesModalOpen(false);
    setGuidelinesType(null);
  };

  const closePriceCalculatorModal = () => {
    setPriceCalculatorOpen(false);
  };


  const concreteCategories: CalculationCategory[] = ['صبة النظافة', 'القواعد', 'شروش الأعمدة', 'الجسور الأرضية', 'الأرضية', 'الأعمدة', 'الأسقف'];
  const steelCategories: CalculationCategory[] = ['القواعد', 'شروش الأعمدة', 'الجسور الأرضية', 'الأرضية', 'الأعمدة', 'الأسقف'];

  const cardData = [
    { title: "حساب كميات الباطون", modalType: 'concrete_options' as ModalType, icon: <DraftingCompass size={48} /> },
    { title: "حساب كميات الحديد", modalType: 'steel_options' as ModalType, icon: <Calculator size={48} /> },
    { title: "إرشادات للمهندس", modalType: 'engineer_guidelines' as ModalType, icon: <UserCheck size={48} /> },
    { title: "إرشادات لصاحب المبنى", modalType: 'owner_guidelines' as ModalType, icon: <Info size={48} /> },
    { title: "حساب الأسعار", modalType: 'price_calculator' as ModalType, icon: <DollarSign size={48} /> },
  ];

  return (
    <>
      <div className="text-lg md:text-xl font-bold text-[#FF0000] bg-[rgba(250,172,88,0.8)] p-4 my-6 md:my-8 rounded-[30px] shadow-message max-w-3xl mx-auto backdrop-blur-sm">
        <p>
          هذا الموقع مختص في حساب الكميات لكل من الحديد والباطون للأبنية الانشائية والأبار والجدران الإستنادية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
        {cardData.map(card => (
          <InfoCard 
            key={card.title}
            title={card.title} 
            onClick={() => handleCardClick(card.modalType)}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Concrete Options Modal */}
      <Dialog open={activeModal === 'concrete_options'} onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}>
        <DialogContent className="modal-content-gradient text-white sm:max-w-[425px] animate-modal-fade-in custom-dialog-overlay p-6">
          <DialogHeader className="relative">
            <DialogTitle className="text-white text-2xl text-center mb-4">اختر عنصر الباطون</DialogTitle>
            <DialogClose asChild>
              <button className="html-modal-close-btn" aria-label="Close">
                &times;
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="py-2 space-y-2">
            {concreteCategories.map(cat => cat && (
              <button key={cat} className="modal-option-link w-full" onClick={() => openCalculationForm('concrete', cat)}>
                {cat}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Steel Options Modal */}
      <Dialog open={activeModal === 'steel_options'} onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}>
        <DialogContent className="modal-content-gradient text-white sm:max-w-[425px] animate-modal-fade-in custom-dialog-overlay p-6">
          <DialogHeader className="relative">
            <DialogTitle className="text-white text-2xl text-center mb-4">اختر عنصر الحديد</DialogTitle>
             <DialogClose asChild>
              <button className="html-modal-close-btn" aria-label="Close">
                &times;
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="py-2 space-y-2">
            {steelCategories.map(cat => cat && (
              <button key={cat} className="modal-option-link w-full" onClick={() => openCalculationForm('steel', cat)}>
                {cat}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Calculation Form Modal */}
      {calculationFormOpen && calculationType && calculationCategory && (
        <CalculationModal
          isOpen={calculationFormOpen}
          onClose={closeCalculationForm}
          calculationType={calculationType}
          category={calculationCategory}
        />
      )}

      {/* Guidelines Modal */}
      {guidelinesModalOpen && guidelinesType && (
        <GuidelinesModal
          isOpen={guidelinesModalOpen}
          onClose={closeGuidelinesModal}
          type={guidelinesType}
        />
      )}

      {/* Price Calculator Modal */}
      {priceCalculatorOpen && (
        <PriceCalculationModal
          isOpen={priceCalculatorOpen}
          onClose={closePriceCalculatorModal}
        />
      )}
    </>
  );
};

export default MainDashboardClient;

    