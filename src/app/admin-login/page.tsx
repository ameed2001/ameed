"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from 'lucide-react';
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
  const [bgElements, setBgElements] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const elements = Array.from({ length: 20 }).map(() => ({
      width: `${Math.random() * 100 + 50}px`,
      height: `${Math.random() * 100 + 50}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${Math.random() * 10 + 10}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`
    }));
    setBgElements(elements);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password_input: "",
    }
  });

  const emailValue = watch("email");
  const passwordValue = watch("password_input");

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {bgElements.map((style, i) => (
        <div 
          key={i} 
          className="absolute rounded-full bg-app-gold/10"
          style={style}
        />
      ))}
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-fit p-4 bg-app-gold/10 rounded-full">
              <ShieldCheck className="h-12 w-12 text-app-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">دخول لوحة التحكم</h1>
            <p className="text-gray-400 mt-2">الرجاء إدخال بيانات الاعتماد الخاصة بك</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-app-gold focus:border-transparent peer`}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email" className={`absolute right-3 -top-2.5 bg-gray-800 px-1 text-sm text-gray-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-app-gold peer-focus:bg-gray-800`}>
                    البريد الإلكتروني
                  </label>
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 text-right">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    {...register("password_input")}
                    id="password_input"
                    type="password"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.password_input ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-app-gold focus:border-transparent peer`}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="password_input" className={`absolute right-3 -top-2.5 bg-gray-800 px-1 text-sm text-gray-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-app-gold peer-focus:bg-gray-800`}>
                    كلمة المرور
                  </label>
                </div>
                {errors.password_input && (
                  <p className="text-red-400 text-xs mt-1 text-right">
                    {errors.password_input.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-app-gold hover:text-app-gold/80 transition-colors"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-app-gold hover:bg-app-gold/90 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  جاري المعالجة...
                </>
              ) : 'تسجيل الدخول'}
            </button>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
