
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { adminLoginAction } from './actions';
import { type LoginActionResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

const adminLoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [router]);

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
      <div className="min-h-[calc(100vh-250px)] flex items-center justify-center p-4 text-right">
        <div
            style={{animation: "slideInFromLeft 1s ease-out"}}
            className="max-w-md w-full bg-gradient-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8"
        >
            <div className="text-center" style={{animation: "appear 2s ease-out"}}>
                <h2 className="text-4xl font-extrabold text-white">
                    مرحباً بالمسؤول
                </h2>
                <p className="mt-2 text-gray-200">
                    سجل دخولك للوصول إلى لوحة التحكم
                </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        placeholder=" "
                        className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
                        {...register("email")}
                    />
                    <label
                        htmlFor="email"
                        className="absolute right-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm"
                    >
                        البريد الإلكتروني
                    </label>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div className="relative">
                    <input
                        id="password_input"
                        type={showPassword ? "text" : "password"}
                        placeholder=" "
                        className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
                        {...register("password_input")}
                    />
                    <label
                        htmlFor="password_input"
                        className="absolute right-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm"
                    >
                        كلمة المرور
                    </label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-2 text-gray-400 hover:text-white">
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                    {errors.password_input && <p className="text-red-400 text-sm mt-1">{errors.password_input.message}</p>}
                </div>
                
                <div className="text-left">
                    <Link href="/forgot-password" className="text-sm text-purple-200 hover:underline">
                        هل نسيت كلمة المرور؟
                    </Link>
                </div>
                
                <Button
                    type="submit"
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'تسجيل الدخول'}
                </Button>
            </form>

            <div className="text-center text-gray-300 text-sm">
                <Link href="/" className="text-purple-300 hover:underline flex items-center justify-center gap-1">
                    <ArrowLeft size={16}/>
                    العودة إلى الرئيسية
                </Link>
            </div>
        </div>
    </div>
    </AppLayout>
  );
}
