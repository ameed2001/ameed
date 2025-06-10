
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
import { Loader2, UserPlus, Home } from 'lucide-react'; // Changed icon to Home for Owner
import { ownerSignupUserAction, type SignupActionResponse } from '../signup/actions'; // Uses ownerSignupUserAction
import { useRouter } from 'next/navigation';

// Schema for owner signup (remains the same)
const ownerSignupSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type OwnerSignupFormValues = z.infer<typeof ownerSignupSchema>;

export default function OwnerSignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<OwnerSignupFormValues>({
    resolver: zodResolver(ownerSignupSchema),
  });

  const onSubmit: SubmitHandler<OwnerSignupFormValues> = async (data) => {
    setIsLoading(true);
    const result: SignupActionResponse = await ownerSignupUserAction(data); // Calling owner specific action
    setIsLoading(false);

    if (result.success) {
      reset();
      toast({
        title: "تم إنشاء حساب المالك",
        description: result.message || "تم إنشاء حساب المالك بنجاح!",
        variant: "default",
      });
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else {
        router.push('/login'); // Redirect to login after owner signup
      }
    } else {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: result.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      if (result.fieldErrors) {
        for (const [fieldName, fieldErrorMessages] of Object.entries(result.fieldErrors)) {
          if (fieldErrorMessages && fieldErrorMessages.length > 0) {
            setError(fieldName as keyof OwnerSignupFormValues, {
              type: "server",
              message: fieldErrorMessages.join(", "),
            });
          }
        }
      }
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-lg mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <Home className="mx-auto h-12 w-12 text-app-gold mb-3" /> {/* Icon for Owner */}
            <CardTitle className="text-3xl font-bold text-app-red">إنشاء حساب مالك مشروع جديد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              انضم إلينا كمالك مشروع للاستفادة من ميزات تتبع مشاريعك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right">
              <div>
                <Label htmlFor="name" className="block mb-1.5 font-semibold text-gray-700">الاسم الكامل</Label>
                <Input id="name" type="text" {...register("name")} className="bg-white focus:border-app-gold" placeholder="مثال: أحمد عبدالله" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="block mb-1.5 font-semibold text-gray-700">البريد الإلكتروني</Label>
                <Input id="email" type="email" {...register("email")} className="bg-white focus:border-app-gold" placeholder="owner@example.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="block mb-1.5 font-semibold text-gray-700">كلمة المرور</Label>
                <Input id="password" type="password" {...register("password")} className="bg-white focus:border-app-gold" placeholder="********" />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block mb-1.5 font-semibold text-gray-700">تأكيد كلمة المرور</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="bg-white focus:border-app-gold" placeholder="********" />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء حساب المالك"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-semibold text-app-gold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              هل أنت مهندس؟{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
                إنشاء حساب مهندس
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
