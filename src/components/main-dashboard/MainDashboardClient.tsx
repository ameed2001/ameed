
"use client";

import { useState } from 'react';
import InfoCard from '@/components/ui/InfoCard';
import CalculationModal from '@/components/modals/CalculationModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import PriceCalculationModal from '@/components/modals/PriceCalculationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  X, Calculator, DraftingCompass, UserCheck, FileText, DollarSign, MessageSquare, Info, Handshake, ListChecks,
  Layers3, Square, Anchor, Minus, Grid3x3, RectangleVertical, PanelTop, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    setActiveModal(modalType); 
    if (modalType === 'engineer_guidelines') {
      setGuidelinesType('engineer');
      setGuidelinesModalOpen(true);
    } else if (modalType === 'owner_guidelines') {
      setGuidelinesType('owner');
      setGuidelinesModalOpen(true);
    } else if (modalType === 'price_calculator') {
      setPriceCalculatorOpen(true);
    }
  };

  const openCalculationForm = (type: 'concrete' | 'steel', category: CalculationCategory) => {
    setCalculationType(type);
    setCalculationCategory(category);
    setActiveModal(null); 
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

  const concreteCategories: CalculationCategory[] = ['الأرضية', 'الأعمدة', 'القواعد', 'الجسور الأرضية', 'صبة النظافة', 'الأسقف', 'شروش الأعمدة'];
  const steelCategories: CalculationCategory[] = ['القواعد', 'الأعمدة', 'الجسور الأرضية', 'الأرضية', 'الأسقف', 'شروش الأعمدة'];
  
  const categoryIcons: Record<string, React.ElementType> = {
    'الأرضية': Grid3x3, // Slabs/Floors
    'الأعمدة': RectangleVertical, // Columns
    'القواعد': Square, // Foundations
    'الجسور الأرضية': Minus, // Ground Beams (like equals sign)
    'صبة النظافة': Layers3, // Cleaning Pour
    'الأسقف': PanelTop, // Roofs/Ceilings
    'شروش الأعمدة': Anchor, // Column Necks/Starters
    // Add steel specific if different, otherwise they share
  };


  const cardData = [
    { title: "حساب كميات الباطون", modalType: 'concrete_options' as ModalType, icon: <DraftingCompass size={48} /> },
    { title: "حساب كميات الحديد", modalType: 'steel_options' as ModalType, icon: <Calculator size={48} /> },
    { title: "إرشادات للمهندس", modalType: 'engineer_guidelines' as ModalType, icon: <UserCheck size={48} /> },
    { title: "إرشادات لصاحب المبنى", modalType: 'owner_guidelines' as ModalType, icon: <Handshake size={48} /> },
    { title: "حساب الأسعار", modalType: 'price_calculator' as ModalType, icon: <DollarSign size={48} /> },
  ];

  return (
    <>
      <div className="welcome-message-box">
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
        <DialogContent className="sm:max-w-xl bg-background custom-dialog-overlay p-6">
          <DialogHeader className="relative text-center mb-4">
            <DialogTitle className="text-app-red text-2xl font-bold">حساب كميات الباطون</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-0 left-0 text-gray-500 hover:text-app-red w-8 h-8 p-1.5">
                <X size={24} />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {concreteCategories.map(cat => {
              if (!cat) return null;
              const IconComponent = categoryIcons[cat] || CheckCircle; // Default icon
              return (
                <button key={cat} className="modal-option-button" onClick={() => openCalculationForm('concrete', cat)}>
                  <span className="modal-option-button-icon-area">
                    <IconComponent className="modal-option-button-icon" />
                  </span>
                  <span className="modal-option-button-text">{cat}</span>
                </button>
              );
            })}
          </div>
          <DialogFooter className="mt-6 pt-4 border-t border-gray-200">
            <DialogClose asChild>
              <Button className="modal-footer-close-button">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Steel Options Modal */}
      <Dialog open={activeModal === 'steel_options'} onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl bg-background custom-dialog-overlay p-6">
           <DialogHeader className="relative text-center mb-4">
            <DialogTitle className="text-app-red text-2xl font-bold">حساب كميات الحديد</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-0 left-0 text-gray-500 hover:text-app-red w-8 h-8 p-1.5">
                <X size={24} />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {steelCategories.map(cat => {
              if (!cat) return null;
              const IconComponent = categoryIcons[cat] || CheckCircle; // Default icon
              return (
                <button key={cat} className="modal-option-button" onClick={() => openCalculationForm('steel', cat)}>
                  <span className="modal-option-button-icon-area">
                    <IconComponent className="modal-option-button-icon" />
                  </span>
                  <span className="modal-option-button-text">{cat}</span>
                </button>
              );
            })}
          </div>
          <DialogFooter className="mt-6 pt-4 border-t border-gray-200">
            <DialogClose asChild>
              <Button className="modal-footer-close-button">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
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
