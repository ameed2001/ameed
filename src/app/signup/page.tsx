
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(["owner", "engineer"], { required_error: "يرجى اختيار الدور." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    console.log("Signup data:", data); // Simulate API call
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (data.role === "engineer") {
      toast({
        title: "تم إنشاء الحساب",
        description: "حسابك كمهندس قيد المراجعة وسيتم تفعيله قريباً.",
        variant: "default",
      });
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول.",
        variant: "default",
      });
    }
    reset();
    setIsLoading(false);
    // In a real app, you would redirect or handle login state here
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-lg mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              انضم إلينا للاستفادة من جميع ميزات الموقع.
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
                <Input id="email" type="email" {...register("email")} className="bg-white focus:border-app-gold" placeholder="example@domain.com" />
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

              <div>
                <Label className="block mb-1.5 font-semibold text-gray-700">أنا:</Label>
                <RadioGroup {...register("role")} dir="rtl" className="flex gap-x-6 gap-y-3 justify-end">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="owner" id="role-owner" />
                    <Label htmlFor="role-owner" className="font-normal">صاحب مبنى</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="engineer" id="role-engineer" />
                    <Label htmlFor="role-engineer" className="font-normal">مهندس</Label>
                  </div>
                </RadioGroup>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء الحساب"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-semibold text-app-gold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
