
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
        <div className="relative"> {/* Wrapper for positioning close button relative to the form card */}
          <PriceForm />
          <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10 text-gray-600 hover:text-app-red hover:bg-gray-200/70 rounded-full w-8 h-8 p-1.5"
                aria-label="Close"
              >
                  <X size={20} />
              </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceCalculationModal;
