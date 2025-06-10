
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, UserCircle, X, ShieldCheck as AdminIcon } from 'lucide-react'; 
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { cn } from '@/lib/utils';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRequiredModal = ({ isOpen, onClose }: AuthRequiredModalProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      if (role === 'OWNER' || role === 'ENGINEER' || role === 'ADMIN') {
        setIsLoggedIn(true);
        setUserRole(role);
        setIsAdmin(role === 'ADMIN');
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setIsAdmin(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToAccount = () => {
    const dashboardPath = userRole === 'OWNER' ? '/owner/dashboard' : '/my-projects';
    router.push(dashboardPath);
    onClose();
  };
  
  const handleGoToAdminDashboard = () => {
    router.push('/admin');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground sm:max-w-md custom-dialog-overlay animate-modal-fade-in p-6 rounded-lg shadow-xl">
        <DialogHeader className="relative text-right mb-4">
          <DialogTitle className="text-app-red text-2xl font-bold text-center pt-8 sm:pt-2">
            تم تسجيل الدخول
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 text-right text-base leading-relaxed mb-6">
          {isLoggedIn && isAdmin ? (
            "انت قد سجلت دخولك سابقا ايها المدير وايضا هذه الكروت مخصصة فقط للمهندس والمالك."
          ) : isLoggedIn ? (
            "انت قد قمت بتسجيل دخولك مسبقا يرجى النقر على زر حسابي لنقلك لحسابك."
          ) : (
            "لاستخدام هذه الميزة وغيرها من الميزات المتقدمة في منصة \"المحترف لحساب الكميات\"، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد إذا لم تكن مسجلاً بعد."
          )}
        </DialogDescription>
        <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
          {isLoggedIn && isAdmin ? (
            <>
              <Button onClick={handleGoToAdminDashboard} className="w-full sm:flex-1 bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold py-2.5 text-base">
                <AdminIcon className="ms-2 h-5 w-5" />
                حساب المسؤول
              </Button>
              <Button 
                onClick={onClose} 
                variant="secondary" 
                className="w-full sm:flex-1 bg-gray-200 text-gray-800 hover:bg-destructive hover:text-destructive-foreground font-semibold py-2.5 text-base"
              >
                <X className="ms-2 h-5 w-5" />
                إغلاق
              </Button>
            </>
          ) : isLoggedIn ? (
            <>
              <Button onClick={handleGoToAccount} className="w-full sm:flex-1 bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold py-2.5 text-base">
                <UserCircle className="ms-2 h-5 w-5" />
                حسابي
              </Button>
              <Button 
                onClick={onClose} 
                variant="secondary" 
                className="w-full sm:flex-1 bg-gray-200 text-gray-800 hover:bg-destructive hover:text-destructive-foreground font-semibold py-2.5 text-base"
              >
                <X className="ms-2 h-5 w-5" />
                إغلاق
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
