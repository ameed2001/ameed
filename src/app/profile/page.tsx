
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
import { Loader2, UserCircle, KeyRound, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateProfileAction, changePasswordAction, getUserProfile } from './actions';
import type { UserDocument, ChangePasswordResult } from '@/lib/db';

const profileSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  phone: z.string().optional(),
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
type UserProfileData = Omit<UserDocument, 'password_hash'>;

export function ProfilePageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
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
    const fetchUserData = async () => {
      const storedId = localStorage.getItem('userId');
      if (storedId) {
        const userProfile = await getUserProfile(storedId);
        if (userProfile) {
          setCurrentUser(userProfile);
          resetProfile({
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone || '',
          });
        } else {
          // Handle case where user is not found in DB but has localStorage items
          localStorage.clear();
          router.push('/login');
        }
      } else {
        toast({
          title: "غير مصرح به",
          description: "يجب تسجيل الدخول لعرض هذه الصفحة.",
          variant: "destructive"
        });
        router.push('/login');
      }
    };
    fetchUserData();
  }, [router, toast, resetProfile]);

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!currentUser) return;
    setIsProfileLoading(true);
    const result = await updateProfileAction({ userId: currentUser.id, ...data });
    setIsProfileLoading(false);

    if (result.success && result.user) {
      toast({ title: "تم تحديث الملف الشخصي بنجاح" });
      const updatedUser = { ...currentUser, name: result.user.name, email: result.user.email, phone: result.user.phone };
      setCurrentUser(updatedUser);
      localStorage.setItem('userName', result.user.name);
      localStorage.setItem('userEmail', result.user.email);
    } else {
      toast({
        title: "فشل تحديث الملف الشخصي",
        description: result.message || "حدث خطأ ما.",
        variant: "destructive"
      });
       if (result.fieldErrors) {
        for (const [key, value] of Object.entries(result.fieldErrors)) {
          if(value) setProfileError(key as keyof ProfileFormValues, { type: 'server', message: value.join(', ')});
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
      toast({ title: "فشل تغيير كلمة المرور", description: result.message || "حدث خطأ ما.", variant: "destructive" });
      if (result.errorType === 'invalid_current_password') {
        setPasswordError('currentPassword', { type: 'server', message: result.message });
      }
    }
  };

  const displayRole = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'مالك';
      case 'ENGINEER': return 'مهندس';
      case 'ADMIN': return 'مشرف';
      default: return role || '...';
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
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 text-right">
      <div className="flex justify-center items-center gap-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">الملف الشخصي</h1>
        <UserCircle className="h-10 w-10 text-app-red" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Change Password Card (Left) */}
        <Card className="bg-white/95 shadow-md border-gray-200/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <KeyRound className="h-6 w-6 text-app-gold"/>
              تغيير كلمة المرور
            </CardTitle>
            <CardDescription>قم بتحديث كلمة مرورك لضمان أمان حسابك.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور</Label>
                <Input id="confirmNewPassword" type="password" {...registerPassword("confirmNewPassword")} />
                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmNewPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5" disabled={isPasswordLoading}>
                {isPasswordLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <KeyRound className="ms-2 h-5 w-5" />}
                تغيير كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Profile Info Card (Right) */}
        <Card className="bg-white/95 shadow-md border-gray-200/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <UserCircle className="h-6 w-6 text-app-gold"/>
              المعلومات الشخصية
            </CardTitle>
            <CardDescription>قم بتحديث معلوماتك الشخصية والمهنية.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="profileName">الاسم الكامل</Label>
                <Input id="profileName" {...registerProfile("name")} />
                {profileErrors.name && <p className="text-red-500 text-sm mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="profileEmail">البريد الإلكتروني</Label>
                <Input id="profileEmail" type="email" {...registerProfile("email")} />
                {profileErrors.email && <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="profileRole">الدور الوظيفي</Label>
                <Input id="profileRole" readOnly value={displayRole(currentUser.role)} className="bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <Label htmlFor="profilePhone">رقم الهاتف</Label>
                <Input id="profilePhone" {...registerProfile("phone")} placeholder="أدخل رقم هاتفك" />
                {profileErrors.phone && <p className="text-red-500 text-sm mt-1">{profileErrors.phone.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5" disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Save className="ms-2 h-5 w-5" />}
                حفظ التغييرات
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
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
