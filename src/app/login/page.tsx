
"use client";

import { useState } from 'react';
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
import { Loader2, LogIn } from 'lucide-react';
import { loginUserAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }), // Changed from password to password_input
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // data already contains email and password_input
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
              // Adjust fieldName mapping if necessary; for now, assume it matches LoginFormValues
              if (fieldName === 'password') { // If server returns 'password' but form uses 'password_input'
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
                  id="password_input" // Changed from password to password_input
                  type="password"
                  {...register("password_input")} // Changed from password to password_input
                  className="bg-white focus:border-app-gold"
                  placeholder="********"
                />
                {errors.password_input && <p className="text-red-500 text-sm mt-1">{errors.password_input.message}</p>}
              </div>

              <div className="text-sm text-left">
                <Link href="/forgot-password" className="font-medium text-app-gold hover:underline">
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
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/signup" className="font-semibold text-app-gold hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

