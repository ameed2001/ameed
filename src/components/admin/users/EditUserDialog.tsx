
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
import { Loader2, UserCog, X, Mail, Edit3 as EditIcon } from 'lucide-react';
import { adminUpdateUserAction, type AdminUpdateUserFormValues } from '@/app/admin/users/actions';
import type { UserDocument, AdminUserUpdateResult } from '@/lib/db';
import { cn } from '@/lib/utils';

const editUserSchema = z.object({
  userId: z.string(), // Hidden field, but needed for action
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }).optional(),
});

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: UserDocument | null;
  adminUserId: string;
}

export default function EditUserDialog({ isOpen, onClose, onUserUpdated, user, adminUserId }: EditUserDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, setError } = useForm<AdminUpdateUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user && isOpen) {
      setValue("userId", user.id);
      setValue("name", user.name);
      if (user.role === 'ENGINEER' || user.role === 'OWNER') {
        setValue("email", user.email);
      } else {
        setValue("email", undefined); 
      }
    } else if (!isOpen) {
      reset({ userId: "", name: "", email: "" });
    }
  }, [user, isOpen, setValue, reset]);

  const onSubmit: SubmitHandler<AdminUpdateUserFormValues> = async (data) => {
    if (!user) return;

    setIsLoading(true);
    
    const payload: AdminUpdateUserFormValues = {
      userId: user.id,
      name: data.name,
    };
    if ((user.role === 'ENGINEER' || user.role === 'OWNER') && data.email) {
      payload.email = data.email;
    }
    
    const result: AdminUserUpdateResult = await adminUpdateUserAction(payload, adminUserId);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "تم تحديث المستخدم",
        description: result.message || "تم تحديث بيانات المستخدم بنجاح.",
        variant: "default",
      });
      onUserUpdated();
      onClose(); 
    } else {
      toast({
        title: "خطأ في تحديث المستخدم",
        description: result.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      if (result.fieldErrors) {
        for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
          if (fieldErrorMessages && fieldErrorMessages.length > 0) {
             setError(fieldName as keyof AdminUpdateUserFormValues, {
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

  if (!user) return null;

  const canEditEmail = user.role === 'ENGINEER' || user.role === 'OWNER';

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
            "sm:max-w-md bg-card text-card-foreground p-6 rounded-lg shadow-xl custom-dialog-overlay text-right",
        )}
      >
        <DialogHeader className="mb-6 flex flex-col items-center">
            <div className="flex justify-center mb-4">
                <UserCog className="h-10 w-10 text-app-gold" />
            </div>
            <DialogTitle className="text-gray-800 text-xl font-bold text-center">
                تعديل بيانات المستخدم: {user.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-sm text-right w-full">
                تحديث اسم المستخدم أو بريده الإلكتروني (للمهندسين والملاك فقط).
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...register("userId")} />
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
            <div className="relative">
                <Input id="edit-name" {...register("name")} placeholder="مثال: علي محمد" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <EditIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          {canEditEmail && (
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">البريد الإلكتروني ({user.role === 'ENGINEER' ? 'للمهندس' : 'للمالك'})</Label>
              <div className="relative">
                  <Input id="edit-email" type="email" {...register("email")} placeholder={user.role === 'ENGINEER' ? "engineer@example.com" : "owner@example.com"} className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          )}
          
          {!canEditEmail && user.email && (
             <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
                <p className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md border border-gray-200">{user.email} (لا يمكن تغييره لهذا الدور)</p>
            </div>
          )}

          <DialogFooter className="pt-5 flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <UserCog className="ml-2 h-5 w-5" />}
              {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
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
