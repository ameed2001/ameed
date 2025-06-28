"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
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
    <div className="admin-login-page-wrapper">
        <div className="container">
            <div className="login-box">
                <h2>دخول المسؤول</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-box">
                        <input
                            {...register("email")}
                            type="email"
                            required
                            data-filled={!!emailValue}
                        />
                        <label>البريد الإلكتروني</label>
                         {errors.email && <p className="text-red-400 text-xs mt-1 -mb-4 text-left px-2">{errors.email.message}</p>}
                    </div>
                    <div className="input-box">
                        <input
                            {...register("password_input")}
                            type="password"
                            required
                            data-filled={!!passwordValue}
                        />
                        <label>كلمة المرور</label>
                        {errors.password_input && <p className="text-red-400 text-xs mt-1 -mb-4 text-left px-2">{errors.password_input.message}</p>}
                    </div>
                    <div className="forgot-pass">
                        <Link href="/forgot-password">هل نسيت كلمة المرور؟</Link>
                    </div>
                    <button className="btn" type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : 'تسجيل الدخول'}
                    </button>
                    <div className="signup-link">
                        <Link href="/">العودة للرئيسية</Link>
                    </div>
                </form>
            </div>
             {Array.from({ length: 50 }).map((_, i) => (
                <span key={i} style={{ '--i': i } as React.CSSProperties}></span>
            ))}
        </div>
    </div>
  );
}
