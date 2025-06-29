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
import { Loader2, KeyRound, Mail } from 'lucide-react';
import { forgotPasswordAction } from './actions';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    const result = await forgotPasswordAction(data);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "تم إرسال التعليمات",
        description: result.message,
        variant: "default",
      });
      reset();
    } else {
      toast({
        title: "خطأ في الإرسال",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">نسيت كلمة المرور؟</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك تعليمات لإعادة التعيين.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
              <div>
                <Label htmlFor="email" className="block mb-1.5 font-semibold text-gray-700">البريد الإلكتروني المسجل</Label>
                <Input id="email" type="email" {...register("email")} className="bg-white focus:border-app-gold" placeholder="example@domain.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                  <Mail className="ms-2 h-5 w-5" />
                  إرسال تعليمات إعادة التعيين
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <Link href="/login" className="font-semibold text-app-gold hover:underline">
              العودة إلى تسجيل الدخول
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
