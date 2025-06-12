
"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ArrowLeft, HardHat, Home as HomeIcon } from 'lucide-react';
import { adminLoginAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';

const adminLoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName'); 
      
      if (userRole === 'ADMIN') {
        toast({
          title: "تم تسجيل الدخول بالفعل",
          description: `مرحباً ${userName || 'أيها المسؤول'}! أنت مسجل الدخول حالياً وجاري توجيهك للوحة التحكم...`,
          variant: "default",
        });
        router.push('/admin');
      }
    }
  }, [router, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "ameed2001@admin.com",
      password_input: "ameed2001",
    }
  });

  const onSubmit: SubmitHandler<AdminLoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result: LoginActionResponse = await adminLoginAction(data);
      setIsLoading(false);

      if (result.success) {
        toast({
          title: "تسجيل دخول المسؤول",
          description: result.message || "تم تسجيل الدخول بنجاح.",
          variant: "default",
        });
        reset();
        
        if (result.user && typeof window !== 'undefined') {
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userRole', result.user.role); 
            localStorage.setItem('userEmail', result.user.email); 
            localStorage.setItem('userId', result.user.id);
        }

        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          router.push('/admin'); 
        }
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.message || "بيانات اعتماد المسؤول غير صحيحة.",
          variant: "destructive",
        });
        if (result.fieldErrors) {
          for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
            if (fieldErrorMessages && fieldErrorMessages.length > 0) {
              setError(fieldName as keyof AdminLoginFormValues, {
                type: "server",
                message: fieldErrorMessages.join(", "),
              });
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Admin login submission error:", error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto bg-white/95 shadow-xl border-2 border-app-gold">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">تسجيل دخول المسؤول</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              الوصول الخاص بمدير النظام.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
              <div>
                <Label htmlFor="email" className="block mb-1.5 font-semibold text-gray-700">البريد الإلكتروني للمسؤول</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="bg-white focus:border-app-gold"
                  placeholder="admin@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password_input" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور</Label>
                <Input
                  id="password_input"
                  type="password"
                  {...register("password_input")}
                  className="bg-white focus:border-app-gold"
                  placeholder="********"
                />
                {errors.password_input && <p className="text-red-500 text-sm mt-1">{errors.password_input.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  "دخول المسؤول"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center mt-4 pt-2 pb-6 space-y-3">
            <Link href="/login" className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline flex items-center gap-1">
              <HardHat className="h-4 w-4" />
              تسجيل الدخول كمهندس
            </Link>
            <Link href="/owner-login" className="text-sm font-medium text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              تسجيل الدخول كمالك
            </Link>
            <Link href="/" className="text-sm font-semibold text-green-800 hover:text-green-700 hover:underline flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
