"use client";

import { useState, useEffect } from 'react';
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
import { Loader2, Home as HomeIcon, ArrowLeft, HardHat, ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import { ownerLoginAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';

const ownerLoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

type OwnerLoginFormValues = z.infer<typeof ownerLoginSchema>;

export default function OwnerLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      if (userRole === 'OWNER') {
        toast({
          title: "تم تسجيل الدخول بالفعل",
          description: `مرحباً ${userName || 'بعودتك'} أيها المالك! أنت مسجل الدخول حالياً وجاري توجيهك...`,
          variant: "default",
        });
        router.push('/owner-account');
      }
    }
  }, [router, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<OwnerLoginFormValues>({
    resolver: zodResolver(ownerLoginSchema),
    defaultValues: {
      email: "",
      password_input: "",
    }
  });

  const onSubmit: SubmitHandler<OwnerLoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result: LoginActionResponse = await ownerLoginAction(data);
      setIsLoading(false);

      if (result.success) {
        toast({
          title: "تسجيل دخول المالك",
          description: result.message || "مرحباً بعودتك!",
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
          router.push('/owner/dashboard'); 
        }
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          variant: "destructive",
        });
        if (result.fieldErrors) {
          for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
            if (fieldErrorMessages && fieldErrorMessages.length > 0) {
              setError(fieldName as keyof OwnerLoginFormValues, {
                type: "server",
                message: fieldErrorMessages.join(", "),
              });
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Owner login submission error:", error);
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
        <Card className="max-w-md mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <HomeIcon className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">تسجيل دخول المالك</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل بيانات حساب المالك الخاص بك للمتابعة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
              <div>
                <Label htmlFor="email" className="block mb-1.5 font-semibold text-gray-700">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="bg-white focus:border-app-gold"
                  placeholder="owner@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password_input" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور</Label>
                <div className="relative">
                    <Input
                        id="password_input"
                        type={showPassword ? "text" : "password"}
                        {...register("password_input")}
                        className="bg-white focus:border-app-gold pl-10"
                        placeholder="********"
                    />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password_input && <p className="text-red-500 text-sm mt-1">{errors.password_input.message}</p>}
              </div>

              <div className="text-sm text-left">
                <Link href="/forgot-password" className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </div>

              <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل دخول المالك"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center mt-4 space-y-3 w-full text-sm text-center">
            <Link
              href="/owner-signup"
              className="text-blue-700 hover:text-blue-800 hover:underline flex items-center justify-center gap-1 font-semibold"
            >
              <UserPlus className="h-5 w-5" />
              إنشاء حساب مالك جديد
            </Link>

            <div className="text-gray-700">
              تسجيل الدخول كـ:
              <Link
                href="/login"
                className="text-green-700 hover:text-green-800 hover:underline mx-2 inline-flex items-center gap-1 font-semibold"
              >
                <HardHat className="h-4 w-4" />
                مهندس
              </Link>
              أو
              <Link
                href="/admin-login"
                className="text-red-700 hover:text-red-800 hover:underline mx-2 inline-flex items-center gap-1 font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                مسؤول
              </Link>
            </div>

            <Link
              href="/"
              className="text-green-800 hover:text-green-700 hover:underline flex items-center justify-center gap-1 font-semibold mt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
