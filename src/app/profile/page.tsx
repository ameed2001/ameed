"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OwnerAppLayout from "@/components/owner/OwnerAppLayout"; // Changed from AppLayout
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCircle, Edit3 } from 'lucide-react';

// Mock current user data
const currentUser = {
  name: "المستخدم الحالي",
  email: "user@example.com",
  role: "owner",
};

const profileSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }).optional(),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }).optional(),
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

function ProfilePageContent() { // Extracted content
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsProfileLoading(true);
    console.log("Update profile data:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "تم تحديث الملف الشخصي بنجاح" });
    currentUser.name = data.name || currentUser.name;
    currentUser.email = data.email || currentUser.email;
    setIsProfileLoading(false);
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    setIsPasswordLoading(true);
    console.log("Change password data:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.currentPassword === "oldpassword") {
        toast({ title: "تم تغيير كلمة المرور بنجاح" });
        resetPassword();
    } else {
        toast({ title: "كلمة المرور الحالية غير صحيحة", variant: "destructive" });
    }
    setIsPasswordLoading(false);
  };

  return (
    // Removed container and py-10, px-4 as OwnerAppLayout handles structure
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">الملف الشخصي</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            إدارة معلومات حسابك وتفضيلاتك.
          </CardDescription>
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
            <Button type="submit" className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground font-bold py-2.5 text-lg" disabled={isProfileLoading}>
              {isProfileLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Edit3 className="ms-2 h-5 w-5" />}
              حفظ التعديلات
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
              <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} className="bg-white focus:border-app-gold" />
              {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="newPassword" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور الجديدة</Label>
              <Input id="newPassword" type="password" {...registerPassword("newPassword")} className="bg-white focus:border-app-gold" />
              {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword" className="block mb-1.5 font-semibold text-gray-700">تأكيد كلمة المرور الجديدة</Label>
              <Input id="confirmNewPassword" type="password" {...registerPassword("confirmNewPassword")} className="bg-white focus:border-app-gold" />
              {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmNewPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-2.5 text-lg" disabled={isPasswordLoading}>
              {isPasswordLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Edit3 className="ms-2 h-5 w-5" />}
              تغيير كلمة المرور
            </Button>
          </form>
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
