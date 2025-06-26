
"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link2, Users, Briefcase } from 'lucide-react';
import { getProjects, getUsers, updateProject, type Project, type UserDocument } from '@/lib/db';
import { useRouter } from 'next/navigation';

const linkOwnerSchema = z.object({
  projectId: z.string().min(1, { message: "يرجى اختيار مشروع." }),
  ownerId: z.string().min(1, { message: "يرجى اختيار مالك." }),
});

type LinkOwnerFormValues = z.infer<typeof linkOwnerSchema>;

export default function LinkOwnerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [owners, setOwners] = useState<UserDocument[]>([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<LinkOwnerFormValues>({
    resolver: zodResolver(linkOwnerSchema),
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetchingData(true);
      const engineerName = localStorage.getItem('userName');
      if (!engineerName) {
        toast({ title: "خطأ", description: "لم يتم العثور على معلومات المهندس. يرجى تسجيل الدخول.", variant: "destructive" });
        router.push('/login');
        return;
      }

      try {
        const [projectsResult, usersResult] = await Promise.all([
          getProjects(engineerName),
          getUsers("admin-id") // Fetch all users
        ]);

        if (projectsResult.success && projectsResult.projects) {
          setProjects(projectsResult.projects.filter(p => p.status !== 'مؤرشف'));
        } else {
          toast({ title: "خطأ", description: "فشل تحميل قائمة المشاريع.", variant: "destructive" });
        }

        if (usersResult.success && usersResult.users) {
          setOwners(usersResult.users.filter(u => u.role === 'OWNER' && u.status === 'ACTIVE'));
        } else {
          toast({ title: "خطأ", description: "فشل تحميل قائمة المالكين.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "خطأ فادح", description: "حدث خطأ أثناء جلب البيانات.", variant: "destructive" });
      }
      setIsFetchingData(false);
    }

    fetchData();
  }, [toast, router]);

  const onSubmit = async (data: LinkOwnerFormValues) => {
    setIsLoading(true);
    const selectedOwner = owners.find(o => o.id === data.ownerId);

    if (!selectedOwner) {
      toast({ title: "خطأ", description: "المالك المختار غير موجود.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const updates = {
      linkedOwnerEmail: selectedOwner.email,
      clientName: selectedOwner.name,
    };

    const result = await updateProject(data.projectId, updates);

    if (result.success) {
      toast({
        title: "تم الربط بنجاح",
        description: `تم ربط المالك "${selectedOwner.name}" بالمشروع بنجاح.`,
        variant: "default",
      });
      reset();
      // Optionally, redirect or refresh data
      router.push(`/engineer/projects/${data.projectId}`);
    } else {
      toast({
        title: "فشل الربط",
        description: result.message || "فشل تحديث المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (isFetchingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
        <p className="ms-3 text-lg">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <Link2 className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">ربط المالكين بالمشاريع</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            اختر مشروعًا ومالكًا لربطهما معًا.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
            <div>
              <Label htmlFor="projectId" className="flex items-center gap-2 mb-1.5 font-semibold text-gray-700">
                <Briefcase size={18} />
                اختر المشروع
              </Label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                    <SelectTrigger id="projectId" className="w-full bg-white focus:border-app-gold text-right">
                      <SelectValue placeholder="اختر مشروعًا لربطه..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length > 0 ? projects.map(project => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name} (المالك الحالي: {project.clientName || 'غير محدد'})
                        </SelectItem>
                      )) : <SelectItem value="none" disabled>لا توجد مشاريع متاحة</SelectItem>}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.projectId && <p className="text-red-500 text-sm mt-1">{errors.projectId.message}</p>}
            </div>

            <div>
              <Label htmlFor="ownerId" className="flex items-center gap-2 mb-1.5 font-semibold text-gray-700">
                <Users size={18} />
                اختر المالك
              </Label>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                    <SelectTrigger id="ownerId" className="w-full bg-white focus:border-app-gold text-right">
                      <SelectValue placeholder="اختر مالكًا لربطه بالمشروع..." />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.length > 0 ? owners.map(owner => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </SelectItem>
                      )) : <SelectItem value="none" disabled>لا يوجد ملاك متاحون</SelectItem>}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ownerId && <p className="text-red-500 text-sm mt-1">{errors.ownerId.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading || isFetchingData}>
              {isLoading ? (
                <>
                  <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                  جاري الربط...
                </>
              ) : (
                <>
                  <Link2 className="ms-2 h-5 w-5" />
                  ربط المشروع بالمالك
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
