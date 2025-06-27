
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OwnerAppLayout from "@/components/owner/OwnerAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCircle, Edit3, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { updateProfileAction, changePasswordAction } from './actions';
import type { AdminUserUpdateResult, ChangePasswordResult } from '@/lib/db';


// Define a type for the user data we'll store and retrieve
interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const profileSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "كلمة المرور الحالية مطلوبة." }),
  newPassword: z.string().min(6, { message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل." }),
  confirmNewPassword: z.string().min(6, { message: "تأكيد كلمة المرور الجديدة مطلوب." }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "كلمتا المرور الجديدتان غير متطابقتين.",
  path: ["confirmNewPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue: setProfileValue,
    setError: setProfileError
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    setError: setPasswordError
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedRole = localStorage.getItem('userRole');
      
      if (storedId && storedName && storedEmail && storedRole) {
        const userData = { id: storedId, name: storedName, email: storedEmail, role: storedRole };
        setCurrentUser(userData);
        setProfileValue("name", storedName);
        setProfileValue("email", storedEmail);
      } else {
         toast({
          title: "غير مصرح به",
          description: "يجب تسجيل الدخول لعرض هذه الصفحة.",
          variant: "destructive"
        });
        router.push('/login');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!currentUser) return;
    setIsProfileLoading(true);

    const result: AdminUserUpdateResult = await updateProfileAction({
      userId: currentUser.id,
      name: data.name,
      email: data.email,
    });
    
    setIsProfileLoading(false);

    if (result.success && result.user) {
      toast({ title: "تم تحديث الملف الشخصي بنجاح" });
      const updatedUserData = { ...currentUser, name: result.user.name, email: result.user.email };
      setCurrentUser(updatedUserData);
      localStorage.setItem('userName', result.user.name);
      localStorage.setItem('userEmail', result.user.email);
      resetProfile(updatedUserData); // Reset form with new values
    } else {
      toast({
        title: "فشل تحديث الملف الشخصي",
        description: result.message || "حدث خطأ أثناء تحديث الملف الشخصي.",
        variant: "destructive"
      });
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(result.fieldErrors)) {
            if (messages) {
                 setProfileError(fieldName as keyof ProfileFormValues, { type: 'server', message: messages.join(', ')});
            }
        }
      }
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    if (!currentUser) return;
    setIsPasswordLoading(true);

    const result: ChangePasswordResult = await changePasswordAction({
        userId: currentUser.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });
    
    setIsPasswordLoading(false);

    if (result.success) {
      toast({ title: "تم تغيير كلمة المرور بنجاح" });
      resetPassword();
    } else {
      toast({
          title: "فشل تغيير كلمة المرور",
          description: result.message || "حدث خطأ ما.",
          variant: "destructive"
      });
       if (result.errorType === 'invalid_current_password') {
          setPasswordError('currentPassword', { type: 'server', message: result.message });
      }
    }
  };

  const handleDeleteAccount = () => {
    // This action is highly destructive, so it's safer to keep it as a simulation
    // until the user specifically asks to implement the full deletion logic.
    if (confirm("هل أنت متأكد أنك تريد حذف حسابك بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.")) {
      console.log("Delete account request (simulation) for:", currentUser?.email);
      toast({
        title: "طلب حذف الحساب (محاكاة)",
        description: "تم استلام طلب حذف حسابك. في تطبيق حقيقي، سيتم معالجة هذا الطلب.",
        variant: "destructive"
      });
    }
  };
  
  const displayRole = (role: string) => {
    switch (role.toUpperCase()) {
      case 'OWNER': return 'مالك';
      case 'ENGINEER': return 'مهندس';
      case 'ADMIN': return 'مشرف';
      case 'GENERAL_USER': return 'مستخدم عام';
      default: return role;
    }
  };

  if (!currentUser) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white/95 shadow-lg">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent className="text-right space-y-3 px-6 pb-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
              <span className="font-semibold text-gray-700">الاسم:</span>
              <span className="text-gray-900">{currentUser.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
              <span className="font-semibold text-gray-700">البريد الإلكتروني:</span>
              <span className="text-gray-900">{currentUser.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
              <span className="font-semibold text-gray-700">نوع الحساب:</span>
              <span className="text-gray-900 font-medium text-app-gold">{displayRole(currentUser.role)}</span>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/95 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-app-red text-right">تعديل معلومات الملف الشخصي</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-5 text-right">
              <div>
                <Label htmlFor="profileName" className="block mb-1.5 font-semibold text-gray-700">الاسم الكامل</Label>
                <Input id="profileName" type="text" {...registerProfile("name")} className="bg-white focus:border-app-gold" />
                {profileErrors.name && <p className="text-red-500 text-sm mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="profileEmail" className="block mb-1.5 font-semibold text-gray-700">البريد الإلكتروني</Label>
                <Input id="profileEmail" type="email" {...registerProfile("email")} className="bg-white focus:border-app-gold" />
                {profileErrors.email && <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-600 font-bold py-2.5 text-lg" disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Save className="ms-2 h-5 w-5" />}
                حفظ تعديلات الملف الشخصي
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-app-red text-right">تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-5 text-right">
              <div>
                <Label htmlFor="currentPassword"  className="block mb-1.5 font-semibold text-gray-700">كلمة المرور الحالية</Label>
                <div className="relative">
                  <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} {...registerPassword("currentPassword")} className="bg-white focus:border-app-gold pl-10" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="newPassword" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input id="newPassword" type={showNewPassword ? "text" : "password"} {...registerPassword("newPassword")} className="bg-white focus:border-app-gold pl-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword" className="block mb-1.5 font-semibold text-gray-700">تأكيد كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input id="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} {...registerPassword("confirmNewPassword")} className="bg-white focus:border-app-gold pl-10" />
                  <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                    {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmNewPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-600 font-bold py-2.5 text-lg" disabled={isPasswordLoading}>
                {isPasswordLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Edit3 className="ms-2 h-5 w-5" />}
                تغيير كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/95 shadow-xl border-red-300 border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive text-right">إجراءات الحساب الخطرة</CardTitle>
        </CardHeader>
        <CardContent className="text-right">
          <div className="mb-4">
            <Label className="font-semibold text-gray-700">حذف الحساب نهائياً</Label>
            <p className="text-sm text-muted-foreground mt-1">
              سيؤدي هذا الإجراء إلى حذف حسابك وجميع البيانات المرتبطة به بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          <Button 
            variant="destructive" 
            className="w-full font-bold py-2.5 text-lg bg-red-600 hover:bg-red-700"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="ms-2 h-5 w-5" />
            حذف حسابي نهائياً
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <OwnerAppLayout>
      <ProfilePageContent />
    </OwnerAppLayout>
  );
}
