
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, X, Users as UsersIcon, Mail, Eye } from 'lucide-react';
import { adminCreateUserAction } from '@/app/admin/users/actions';
import type { SignupActionResponse } from '@/app/signup/actions';
import type { UserRole } from '@/lib/db';

const addUserSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(['ADMIN', 'ENGINEER', 'OWNER', 'GENERAL_USER'], { required_error: "يرجى اختيار الدور." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'مشرف' },
  { value: 'ENGINEER', label: 'مهندس' },
  { value: 'OWNER', label: 'مالك' },
  { value: 'GENERAL_USER', label: 'مستخدم عام' },
];

export default function AddUserDialog({ isOpen, onClose, onUserAdded }: AddUserDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, control, setError } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    }
  });

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    setIsLoading(true);
    const result: SignupActionResponse = await adminCreateUserAction(data);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "تم إضافة المستخدم",
        description: result.message || "تم إنشاء حساب المستخدم بنجاح.",
        variant: "default",
      });
      reset();
      onUserAdded();
    } else {
      toast({
        title: "خطأ في إضافة المستخدم",
        description: result.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
       if (result.fieldErrors) {
        for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
          if (fieldErrorMessages && fieldErrorMessages.length > 0) {
            setError(fieldName as keyof AddUserFormValues, {
              type: "server",
              message: fieldErrorMessages.join(", "),
            });
          }
        }
      }
    }
  };

  const handleCloseDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 rounded-lg shadow-xl custom-dialog-overlay">
        <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
                <UsersIcon className="h-10 w-10 text-gray-700" />
            </div>
            <DialogTitle className="text-gray-800 text-2xl font-bold">
                إضافة مستخدم جديد
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-sm">
                أدخل بيانات المستخدم الجديد للتمكن من الوصول إلى النظام
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right">
          <div className="space-y-1.5">
            <Label htmlFor="add-name" className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
            <div className="relative">
                <Input id="add-name" {...register("name")} placeholder="مثال: علي محمد" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
             <div className="relative">
                <Input id="add-email" type="email" {...register("email")} placeholder="example@admin.com" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
            <div className="relative">
                <Input id="add-password" type="password" {...register("password")} placeholder="********" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-confirmPassword" className="text-sm font-medium text-gray-700">تأكيد كلمة المرور</Label>
            <div className="relative">
                <Input id="add-confirmPassword" type="password" {...register("confirmPassword")} placeholder="********" className="bg-gray-50 border-gray-300 focus:border-blue-500 pr-10" />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-role" className="text-sm font-medium text-gray-700">الدور</Label>
            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger id="add-role" className="w-full text-right bg-gray-50 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="اختر دور المستخدم..." />
                    </SelectTrigger>
                    <SelectContent>
                        {roleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
            />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
          <DialogFooter className="pt-5 flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <UsersIcon className="ml-2 h-5 w-5" />}
              {isLoading ? "جاري الإضافة..." : "إضافة المستخدم"}
            </Button>
            <Button
              type="button"
              variant="secondary" // Using secondary variant for cancel button
              onClick={handleCloseDialog}
              className="w-full sm:flex-1 font-semibold py-2.5 rounded-lg"
            >
              <X className="ml-2 h-5 w-5" />
              إلغاء
            </Button>
          </DialogFooter>
        </form>
        <DialogClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

