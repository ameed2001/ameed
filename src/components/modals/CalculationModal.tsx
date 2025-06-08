
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ConcreteForm from '@/components/forms/ConcreteForm';
import SteelForm from '@/components/forms/SteelForm';

interface CalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationType: 'concrete' | 'steel';
  category: string;
}

const CalculationModal = ({ isOpen, onClose, calculationType, category }: CalculationModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 sm:max-w-lg custom-dialog-overlay animate-modal-fade-in">
        {/* The form itself has Card styling, so DialogContent can be minimal */}
        {/* The Card component used in forms has its own close button if needed via DialogClose, or this one can be styled */}
        <div className="relative"> {/* Wrapper for positioning close button relative to the form card */}
          {calculationType === 'concrete' ? (
            <ConcreteForm category={category} />
          ) : (
            <SteelForm category={category} />
          )}
          <DialogClose asChild className="absolute top-2 right-2 z-10"> {/* Adjusted: top-2 right-2 for RTL */}
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-app-red hover:bg-gray-200/70 rounded-full w-8 h-8 p-1.5">
              <X size={20} />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculationModal;

    