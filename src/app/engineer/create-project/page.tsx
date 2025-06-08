
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, MapPin, CalendarRange } from 'lucide-react';
import Link from 'next/link';

const createProjectSchema = z.object({
  projectName: z.string().min(3, { message: "اسم المشروع مطلوب (3 أحرف على الأقل)." }),
  location: z.string().min(3, { message: "موقع المشروع مطلوب." }),
  description: z.string().min(10, { message: "وصف المشروع مطلوب (10 أحرف على الأقل)." }),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ البدء غير صالح." }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ الانتهاء غير صالح." }),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "تاريخ الانتهاء يجب أن يكون بعد أو نفس تاريخ البدء.",
  path: ["endDate"],
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export default function CreateProjectPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit: SubmitHandler<CreateProjectFormValues> = async (data) => {
    setIsLoading(true);
    console.log("Create project data:", data); // Simulate API call

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "تم إنشاء المشروع بنجاح (محاكاة)",
      description: `مشروع "${data.projectName}" جاهز الآن.`,
      variant: "default",
    });
    reset();
    // In a real app, you might redirect to the new project's page or project list
    // For example: router.push('/my-projects');
    setIsLoading(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <PlusCircle className="mx-auto h-16 w-16 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">إنشاء مشروع جديد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل تفاصيل المشروع الإنشائي الجديد للبدء في إدارته وحساب كمياته.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
              <div>
                <Label htmlFor="projectName" className="block mb-1.5 font-semibold text-gray-700">اسم المشروع</Label>
                <Input id="projectName" type="text" {...register("projectName")} className="bg-white focus:border-app-gold" placeholder="مثال: بناء فيلا سكنية في حي الياسمين" />
                {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName.message}</p>}
              </div>

              <div>
                <Label htmlFor="location" className="block mb-1.5 font-semibold text-gray-700">موقع المشروع</Label>
                <div className="relative">
                    <Input id="location" type="text" {...register("location")} className="bg-white focus:border-app-gold pr-10" placeholder="مثال: مدينة الرياض، حي النرجس، قطعة رقم 123" />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="block mb-1.5 font-semibold text-gray-700">وصف المشروع</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="bg-white focus:border-app-gold"
                  placeholder="صف بإيجاز طبيعة المشروع، أهدافه، وأهم مكوناته..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate" className="block mb-1.5 font-semibold text-gray-700">تاريخ البدء المتوقع</Label>
                  <div className="relative">
                    <Input id="startDate" type="date" {...register("startDate")} className="bg-white focus:border-app-gold pr-10"/>
                    <CalendarRange className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="endDate" className="block mb-1.5 font-semibold text-gray-700">تاريخ الانتهاء المتوقع</Label>
                   <div className="relative">
                    <Input id="endDate" type="date" {...register("endDate")} className="bg-white focus:border-app-gold pr-10"/>
                    <CalendarRange className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="w-full sm:w-auto flex-grow bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                    <PlusCircle className="ms-2 h-5 w-5" />
                     إنشاء المشروع
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/my-projects">إلغاء</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
