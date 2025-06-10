
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, X } from 'lucide-react';
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
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 rounded-lg shadow-xl custom-dialog-overlay"> {/* Removed animate-modal-fade-in */}
        <DialogHeader className="text-right mb-4">
          <DialogTitle className="text-app-red text-2xl font-bold flex items-center justify-center gap-2">
            <UserPlus className="h-7 w-7" /> إضافة مستخدم جديد
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-1">
            أدخل بيانات المستخدم الجديد ليتمكن من الوصول إلى النظام.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right">
          <div>
            <Label htmlFor="add-name">الاسم الكامل</Label>
            <Input id="add-name" {...register("name")} placeholder="مثال: علي محمد" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="add-email">البريد الإلكتروني</Label>
            <Input id="add-email" type="email" {...register("email")} placeholder="example@domain.com" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="add-password">كلمة المرور</Label>
            <Input id="add-password" type="password" {...register("password")} placeholder="********" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="add-confirmPassword">تأكيد كلمة المرور</Label>
            <Input id="add-confirmPassword" type="password" {...register("confirmPassword")} placeholder="********" />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <Label htmlFor="add-role">الدور</Label>
            <Select
              onValueChange={(value: UserRole) => control._formValues.role = value} 
              defaultValue={control._formValues.role}
              dir="rtl"
            >
              <SelectTrigger id="add-role" className="w-full text-right">
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
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>
          <DialogFooter className="pt-3">
            <Button type="submit" className="w-full sm:w-auto bg-app-red hover:bg-red-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <UserPlus className="ms-2 h-5 w-5" />}
              {isLoading ? "جاري الإضافة..." : "إضافة المستخدم"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
              إلغاء
            </Button>
          </DialogFooter>
        </form>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground" onClick={handleCloseDialog}>
            <X size={20} />
            <span className="sr-only">إغلاق</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
