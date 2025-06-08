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
        {calculationType === 'concrete' ? (
          <ConcreteForm category={category} />
        ) : (
          <SteelForm category={category} />
        )}
         <DialogClose asChild className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-200 data-[state=open]:bg-transparent data-[state=open]:text-gray-700">
            <X />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CalculationModal;
