"use client";

import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PriceForm from '@/components/forms/PriceForm';

interface PriceCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PriceCalculationModal = ({ isOpen, onClose }: PriceCalculationModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 sm:max-w-lg custom-dialog-overlay animate-modal-fade-in">
        <PriceForm />
        <DialogClose asChild className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-200 data-[state=open]:bg-transparent data-[state=open]:text-gray-700">
                <X />
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PriceCalculationModal;
