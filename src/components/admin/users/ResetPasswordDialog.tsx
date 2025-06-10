
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, X, Eye, EyeOff } from 'lucide-react';
import { adminResetPasswordAction } from '@/app/admin/users/actions';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل." }),
  confirmNewPassword: z.string().min(6, { message: "تأكيد كلمة المرور الجديدة مطلوب." }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "كلمتا المرور الجديدتان غير متطابقتين.",
  path: ["confirmNewPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string | null;
  adminUserId: string; // For logging purposes
}

export default function ResetPasswordDialog({ isOpen, onClose, userId, userName, adminUserId }: ResetPasswordDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    }
  });

  useEffect(() => {
    if (!isOpen) {
      reset(); // Reset form when dialog is closed
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    if (!userId) {
      toast({ title: "خطأ", description: "معرف المستخدم غير متوفر.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const result = await adminResetPasswordAction({ userId, newPassword: data.newPassword }, adminUserId);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "تم إعادة تعيين كلمة المرور",
        description: result.message || `تم تحديث كلمة مرور المستخدم ${userName} بنجاح.`,
        variant: "default",
      });
      onClose(); // Close dialog on success
    } else {
      toast({
        title: "خطأ في إعادة تعيين كلمة المرور",
        description: result.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      if (result.fieldErrors) {
        for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
          if (fieldErrorMessages && fieldErrorMessages.length > 0) {
            setError(fieldName as keyof ResetPasswordFormValues, {
              type: "server",
              message: fieldErrorMessages.join(", "),
            });
          }
        }
      }
    }
  };

  const handleCloseDialog = () => {
    onClose();
  };

  if (!userId || !userName) return null; // Don't render if user details are missing

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
            "sm:max-w-md bg-card text-card-foreground p-6 rounded-lg shadow-xl custom-dialog-overlay text-right",
            // "add-user-dialog-no-x" // If you want to hide the default X
        )}
      >
        <DialogHeader className="mb-6 flex flex-col items-center">
            <div className="flex justify-center mb-4">
                <KeyRound className="h-10 w-10 text-app-gold" />
            </div>
            <DialogTitle className="text-gray-800 text-xl font-bold text-center">
                إعادة تعيين كلمة مرور المستخدم: {userName}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-sm text-right w-full">
                أدخل كلمة المرور الجديدة للمستخدم. سيتمكن المستخدم من تسجيل الدخول بها فوراً.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">كلمة المرور الجديدة</Label>
            <div className="relative">
                <Input id="newPassword" type={showNewPassword ? "text" : "password"} {...register("newPassword")} placeholder="********" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">تأكيد كلمة المرور الجديدة</Label>
            <div className="relative">
                <Input id="confirmNewPassword" type={showConfirmPassword ? "text" : "password"} {...register("confirmNewPassword")} placeholder="********" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
          </div>
          <DialogFooter className="pt-5 flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-primary-foreground font-semibold py-2.5 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <KeyRound className="ml-2 h-5 w-5" />}
              {isLoading ? "جاري التعيين..." : "إعادة تعيين كلمة المرور"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseDialog}
              className="w-full sm:flex-1 font-semibold py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="ml-2 h-5 w-5" />
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
