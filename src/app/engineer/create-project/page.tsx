
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, MapPin, CalendarRange, HardHat } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addProject as dbAddProject, type Project, type ProjectStatusType } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const createProjectSchema = z.object({
  projectName: z.string().min(3, { message: "اسم المشروع مطلوب (3 أحرف على الأقل)." }),
  location: z.string().min(3, { message: "موقع المشروع مطلوب." }),
  description: z.string().min(10, { message: "وصف المشروع مطلوب (10 أحرف على الأقل)." }),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ البدء غير صالح." }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ الانتهاء غير صالح." }),
  status: z.enum(['مخطط له', 'قيد التنفيذ', 'مكتمل', 'مؤرشف'], {
    required_error: "حالة المشروع مطلوبة."
  }),
  engineer: z.string().min(3, { message: "اسم المهندس مطلوب." }), 
  clientName: z.string().min(3, { message: "اسم العميل/المالك مطلوب." }),
  budget: z.number().positive({ message: "الميزانية يجب أن تكون رقمًا موجبًا." }).optional(),
  linkedOwnerEmail: z.string().email({ message: "بريد المالك الإلكتروني غير صالح."}).optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "تاريخ الانتهاء يجب أن يكون بعد أو نفس تاريخ البدء.",
  path: ["endDate"],
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

const projectStatusOptions: { value: ProjectStatusType; label: string }[] = [
    { value: 'مخطط له', label: 'مخطط له' },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
    { value: 'مكتمل', label: 'مكتمل' },
    { value: 'مؤرشف', label: 'مؤرشف' },
];

export default function CreateProjectPage() {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
        engineer: "", // Will be set from localStorage
        status: 'مخطط له',
    }
  });

  useEffect(() => {
    const engineerNameFromStorage = localStorage.getItem('userName');
    if (engineerNameFromStorage) {
      setValue('engineer', engineerNameFromStorage);
    } else {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على معلومات المهندس. يرجى تسجيل الدخول مرة أخرى.",
        variant: "destructive"
      });
      router.push('/login');
    }
  }, [setValue, router, toast]);

  const onSubmit: SubmitHandler<CreateProjectFormValues> = async (data) => {
    setIsLoading(true);
    
    const projectDataForDb: Omit<Project, 'id' | 'overallProgress' | 'photos' | 'timelineTasks' | 'comments'> = {
        name: data.projectName,
        location: data.location,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status as ProjectStatusType,
        engineer: data.engineer,
        clientName: data.clientName,
        budget: data.budget,
        linkedOwnerEmail: data.linkedOwnerEmail,
        quantitySummary: ""
    };

    const newProject = await dbAddProject(projectDataForDb);

    if (newProject) {
        toast({
          title: "تم إنشاء المشروع بنجاح",
          description: `مشروع "${newProject.name}" جاهز الآن.`,
          variant: "default",
        });
        reset();
        router.push(`/my-projects/${newProject.id}`);
    } else {
        toast({
            title: "خطأ في إنشاء المشروع",
            description: "لم يتمكن النظام من إنشاء المشروع. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <PlusCircle className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">إنشاء مشروع بناء جديد</CardTitle>
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
              <Label htmlFor="engineer" className="block mb-1.5 font-semibold text-gray-700">المهندس المسؤول</Label>
              <div className="relative">
                <Input 
                  id="engineer" 
                  type="text" 
                  {...register("engineer")} 
                  className="bg-gray-100 focus:border-app-gold cursor-not-allowed pr-10" 
                  readOnly 
                  placeholder="جاري تحميل اسم المهندس..." 
                />
                <HardHat className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.engineer && <p className="text-red-500 text-sm mt-1">{errors.engineer.message}</p>}
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

             <div>
                <Label htmlFor="status" className="block mb-1.5 font-semibold text-gray-700">المرحلة الحالية</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <SelectTrigger id="status" className="w-full bg-white focus:border-app-gold text-right">
                        <SelectValue placeholder="اختر الحالة الأولية للمشروع..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>

            <div>
                <Label htmlFor="clientName" className="block mb-1.5 font-semibold text-gray-700">اسم العميل/المالك</Label>
                <Input id="clientName" type="text" {...register("clientName")} className="bg-white focus:border-app-gold" placeholder="اسم صاحب المشروع" />
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>}
            </div>
            <div>
                <Label htmlFor="budget" className="block mb-1.5 font-semibold text-gray-700">الميزانية التقديرية (شيكل - اختياري)</Label>
                <Input id="budget" type="number" {...register("budget", { valueAsNumber: true })} className="bg-white focus:border-app-gold" placeholder="مثال: 1500000" />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
            </div>
            <div>
                <Label htmlFor="linkedOwnerEmail" className="block mb-1.5 font-semibold text-gray-700">ربط ببريد المالك الإلكتروني (اختياري)</Label>
                <Input id="linkedOwnerEmail" type="email" {...register("linkedOwnerEmail")} className="bg-white focus:border-app-gold" placeholder="owner@example.com" />
                {errors.linkedOwnerEmail && <p className="text-red-500 text-sm mt-1">{errors.linkedOwnerEmail.message}</p>}
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
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full sm:w-auto bg-gray-200 text-gray-800 hover:bg-destructive hover:text-destructive-foreground" 
                  asChild
                >
                  <Link href="/engineer/projects">إلغاء</Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
