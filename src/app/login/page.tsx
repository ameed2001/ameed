"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Loader2, HardHat, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import { loginUserAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

type EngineerLoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (userRole === 'ENGINEER') {
      toast({
        title: "تم تسجيل الدخول بالفعل",
        description: `مرحباً ${userName || 'بعودتك'} أيها المهندس! جاري توجيهك...`,
        variant: "default",
      });
      router.push('/engineer/dashboard');
    }
  }, [router, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<EngineerLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password_input: "",
    }
  });

  const onSubmit: SubmitHandler<EngineerLoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result: LoginActionResponse = await loginUserAction(data);
      setIsLoading(false);

      if (result.success) {
        toast({
          title: "تسجيل دخول المهندس",
          description: result.message || "مرحباً بعودتك!",
          variant: "default",
        });
        reset();

        if (result.user) {
          localStorage.setItem('userName', result.user.name);
          localStorage.setItem('userRole', result.user.role);
          localStorage.setItem('userEmail', result.user.email);
          localStorage.setItem('userId', result.user.id);
          console.log('Login Page: User Role set in localStorage:', result.user.role);
        }
        
        setTimeout(() => {
          if (result.redirectTo) {
            router.push(result.redirectTo);
          } else {
            router.push('/engineer/dashboard');
          }
        }, 50);
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          variant: "destructive",
        });

        if (result.fieldErrors) {
          for (const [fieldName, messages] of Object.entries(result.fieldErrors)) {
            if (messages && messages.length > 0) {
              const errorKey = fieldName === 'password' ? 'password_input' : fieldName;
              setError(errorKey as keyof EngineerLoginFormValues, {
                type: "server",
                message: messages.join(", "),
              });
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Engineer login error:", error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4" dir="rtl">
        <Card className="max-w-md mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <HardHat className="mx-auto h-12 w-12 text-yellow-600 mb-3" />
            <CardTitle className="text-3xl font-bold text-red-700">تسجيل دخول المهندس</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل بيانات حساب المهندس للمتابعة.
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
                  className="bg-white focus:border-yellow-500"
                  placeholder="engineer@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password_input" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور</Label>
                <Input
                  id="password_input"
                  type="password"
                  {...register("password_input")}
                  className="bg-white focus:border-yellow-500"
                  placeholder="********"
                />
                {errors.password_input && <p className="text-red-500 text-sm mt-1">{errors.password_input.message}</p>}
              </div>

              <div className="text-sm text-left">
                <Link href="/forgot-password" className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل دخول المهندس"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center mt-4 space-y-3">
            <p className="text-sm text-gray-600">
              ليس لديك حساب مهندس؟{" "}
              <Link href="/signup" className="font-semibold text-blue-700 underline hover:text-blue-800">
                إنشاء حساب
              </Link>
            </p>

            <Link href="/owner-login" className="text-sm font-medium text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              تسجيل الدخول كمالك
            </Link>

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
