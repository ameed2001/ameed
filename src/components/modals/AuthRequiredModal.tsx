
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react'; // Removed X icon as it's replaced by text
import Link from 'next/link';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRequiredModal = ({ isOpen, onClose }: AuthRequiredModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground sm:max-w-md custom-dialog-overlay animate-modal-fade-in p-6 rounded-lg shadow-xl">
        <DialogHeader className="relative text-right mb-4">
          <DialogTitle className="text-app-red text-2xl font-bold text-center">الوصول يتطلب تسجيل الدخول</DialogTitle>
          {/* DialogClose is now part of the footer for a more standard modal pattern */}
        </DialogHeader>
        <DialogDescription className="text-gray-700 text-right text-base leading-relaxed mb-6">
          لاستخدام هذه الميزة وغيرها من الميزات المتقدمة في منصة "المحترف لحساب الكميات"، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد إذا لم تكن مسجلاً بعد.
        </DialogDescription>
        <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
          <Button asChild className="w-full sm:flex-1 bg-app-red hover:bg-red-700 text-white font-semibold py-2.5 text-base">
            <Link href="/login" onClick={onClose}>
              <LogIn className="ms-2 h-5 w-5" />
              تسجيل الدخول
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1 bg-green-700 hover:bg-green-800 text-white border-green-700 hover:border-green-800 font-semibold py-2.5 text-base">
            <Link href="/signup" onClick={onClose}>
              <UserPlus className="ms-2 h-5 w-5" />
              إنشاء حساب جديد
            </Link>
          </Button>
        </DialogFooter>
         <DialogClose asChild>
            <Button 
              variant="ghost" 
              className="absolute top-3 left-3 text-sm text-gray-500 hover:text-app-red hover:bg-red-100/50 rounded-md px-3 py-1.5"
              aria-label="Close"
              onClick={onClose}
            >
              إغلاق
            </Button>
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
