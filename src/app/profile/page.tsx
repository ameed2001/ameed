
"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OwnerAppLayout from "@/components/owner/OwnerAppLayout"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCircle, Edit3, Trash2, Save } from 'lucide-react'; // Added Save icon

// Define a type for the user data we'll store and retrieve
interface UserProfileData {
  name: string;
  email: string;
  role: string;
}

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

function ProfilePageContent() {
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfileData>({
    name: "جاري التحميل...",
    email: "جاري التحميل...",
    role: "جاري التحميل...",
  });

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors }, reset: resetProfile, setValue: setProfileValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName') || "مستخدم";
      const storedEmail = localStorage.getItem('userEmail') || "email@example.com";
      const storedRole = localStorage.getItem('userRole') || "GeneralUser";
      
      setCurrentUser({ name: storedName, email: storedEmail, role: storedRole });
      // Set form default values after fetching from localStorage
      setProfileValue("name", storedName);
      setProfileValue("email", storedEmail);
    }
  }, [setProfileValue]);


  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsProfileLoading(true);
    try {
      // Replace with your actual backend API endpoint for updating profile
      const response = await fetch('/api/update-profile', {
        method: 'PUT', // Or 'POST' depending on your backend
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here (e.g., Authorization: Bearer token)
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({ title: "تم تحديث الملف الشخصي بنجاح" }); // Removed simulation text
        // Optionally update the displayed user state if the backend confirms the change
        setCurrentUser(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
        }));
      } else {
        const errorData = await response.json(); // Assuming backend returns JSON with error details
        toast({
          title: "فشل تحديث الملف الشخصي",
          description: errorData.message || "حدث خطأ أثناء تحديث الملف الشخصي.", // Display backend error message
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "خطأ", description: "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.", variant: "destructive" });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    setIsPasswordLoading(true);
    try {
      // Replace with your actual backend API endpoint for changing password
      const response = await fetch('/api/change-password', { // استبدل هذا بالعنوان الفعلي
        method: 'PUT', // Or 'POST'
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) { // إذا كانت الاستجابة تشير إلى النجاح (مثل 200 OK)
        toast({ title: "تم تغيير كلمة المرور بنجاح" }); // Removed simulation text
        resetPassword();
      } else { // إذا كانت الاستجابة تشير إلى خطأ (مثل 400 Bad Request)
        const errorData = await response.json(); // Assuming backend returns JSON with error details
        toast({ title: "فشل تغيير كلمة المرور", description: errorData.message || "كلمة المرور الحالية غير صحيحة.", variant: "destructive" });
      }
    } catch (error) { // للتعامل مع أخطاء الشبكة أو الأخطاء الأخرى أثناء الطلب
      console.error("Error changing password:", error);
      toast({ title: "خطأ", description: "حدث خطأ غير متوقع أثناء تغيير كلمة المرور. يرجى المحاولة لاحقًا.", variant: "destructive" });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, use a proper confirmation dialog (e.g., AlertDialog)
    if (confirm("هل أنت متأكد أنك تريد حذف حسابك بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.")) {
      console.log("Delete account request (simulation) for:", currentUser.email);
      toast({
        title: "طلب حذف الحساب (محاكاة)",
        description: "تم استلام طلب حذف حسابك. في تطبيق حقيقي، سيتم معالجة هذا الطلب.",
        variant: "destructive"
      });
      // Add logic here to call an API endpoint for account deletion
      // and then redirect the user, e.g., to the homepage or login page.
    }
  };
  
  const displayRole = (role: string) => {
    switch (role.toUpperCase()) { // Ensure comparison is case-insensitive for safety
      case 'OWNER': return 'مالك';
      case 'ENGINEER': return 'مهندس';
      case 'ADMIN': return 'مشرف';
      case 'GENERAL_USER': return 'مستخدم عام';
      default: return role;
    }
  };

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

