
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
import { Loader2, LogIn, ShieldCheck } from 'lucide-react'; // Added ShieldCheck
import { loginUserAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName'); 

      if (userRole === 'OWNER' || userRole === 'ENGINEER') {
        const dashboardPath = userRole === 'OWNER' ? '/owner/dashboard' : '/my-projects';
        toast({
          title: "تم تسجيل الدخول بالفعل",
          description: `مرحباً ${userName || 'بعودتك'}! أنت مسجل الدخول حالياً وجاري توجيهك...`,
          variant: "default",
        });
        router.push(dashboardPath);
      }
    }
  }, [router, toast]);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { // Removed default admin credentials
      email: "", 
      password_input: "",
    }
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result: LoginActionResponse = await loginUserAction(data);
      setIsLoading(false);

      if (result.success) {
        toast({
          title: "تسجيل الدخول",
          description: result.message || "مرحباً بعودتك!",
          variant: "default",
        });
        reset();
        
        if (result.user) {
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userRole', result.user.role); 
            localStorage.setItem('userEmail', result.user.email); 
            localStorage.setItem('userId', result.user.id); 
        }

        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          router.push('/');
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
              if (fieldName === 'password') {
                 setError('password_input' as keyof LoginFormValues, {
                    type: "server",
                    message: fieldErrorMessages.join(", "),
                 });
              } else {
                 setError(fieldName as keyof LoginFormValues, {
                    type: "server",
                    message: fieldErrorMessages.join(", "),
                 });
              }
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login submission error:", error);
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
            <LogIn className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">تسجيل الدخول</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل بيانات حسابك للمتابعة.
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
                  placeholder="example@domain.com"
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

              <div className="text-sm text-left">
                <Link href="/forgot-password" className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </div>

              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center mt-4 space-y-3">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟ إنشاء حساب جديد كـ{' '}
              <Link href="/engineer-signup" className="font-semibold text-blue-700 underline hover:text-blue-800">
                مهندس
              </Link>
              {' '}أو كـ{' '}
              <Link href="/signup" className="font-semibold text-blue-700 underline hover:text-blue-800">
                مالك
              </Link>
            </p>
            <Link href="/admin-login" className="text-sm font-medium text-red-700 hover:text-red-800 hover:underline flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                تسجيل الدخول كمسؤول
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
