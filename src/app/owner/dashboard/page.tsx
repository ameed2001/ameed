// src/app/owner/dashboard/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Gauge, Briefcase, FileText, Camera, Clock, MessageSquare,
    Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProjects as dbGetProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);
  
  useEffect(() => {
    async function fetchProjects() {
      if (!userEmail) {
           setIsLoading(false);
           return;
      }
      setIsLoading(true);
      try {
        const result = await dbGetProjects(userEmail);
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          toast({ title: "خطأ", description: result.message || "فشل تحميل المشاريع.", variant: "destructive" });
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects for owner dashboard:", error);
        toast({ title: "خطأ فادح", description: "حدث خطأ أثناء تحميل بيانات المشاريع.", variant: "destructive" });
        setProjects([]);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, [userEmail, toast]);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "قيد التنفيذ").length,
    overallProgress: projects.length > 0
        ? Math.round(projects.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / projects.length)
        : 0,
  };

  const recentProjects = projects.slice(0, 3);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
            <p className="ms-3 text-lg">جاري تحميل البيانات...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-app-red mb-6 text-center">لوحة تحكم المالك</h1>

        {/* نظرة عامة سريعة */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                نظرة عامة سريعة <Gauge className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">ملخص سريع لمشاريعك.</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                <p className="text-gray-700 font-medium">إجمالي المشاريع:</p>
                <p className="text-2xl font-bold text-app-red">{stats.total}</p>
                </div>
                <div>
                <p className="text-gray-700 font-medium">المشاريع قيد التنفيذ:</p>
                <p className="text-2xl font-bold text-green-600">{stats.inProgress}</p>
                </div>
                <div>
                <p className="text-gray-700 font-medium">نسبة الإنجاز الإجمالية (متوسط):</p>
                <Progress value={stats.overallProgress} className="w-full h-3 mt-2" />
                <p className="text-xl font-bold text-blue-600 mt-1">{stats.overallProgress}%</p>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* مشاريعي */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                مشاريعي <Briefcase className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">قائمة بأحدث مشاريعك.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table dir="rtl">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">اسم المشروع</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">نسبة الإنجاز</TableHead>
                            <TableHead className="text-center">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentProjects.map(project => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{project.status}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <span>{project.overallProgress || 0}%</span>
                                        <Progress value={project.overallProgress || 0} className="w-[60%] h-2" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link href={`/owner/projects/${project.id}`} passHref>
                                        <Button variant="link" className="text-blue-600 hover:underline">عرض التفاصيل</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {recentProjects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">لا توجد مشاريع لعرضها حالياً.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="text-center mt-4">
                    <Link href="/owner/projects" passHref>
                        <Button variant="outline" className="text-app-red border-app-red hover:bg-app-red hover:text-white">عرض جميع المشاريع</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

        {/* تقارير الكميات */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                تقارير الكميات <FileText className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">الوصول السريع لتقارير كميات المواد والأعمال.</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-700 mb-3">يمكنك عرض التقارير التفصيلية للكميات من داخل صفحة كل مشروع.</p>
            <Link href="/owner/projects" passHref>
                <Button variant="outline" className="text-app-red border-app-red hover:bg-app-red hover:text-white">الانتقال إلى المشاريع</Button>
            </Link>
            </CardContent>
        </Card>

        {/* تقدم المشروع بصريًا */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                تقدم المشروع بصريًا <Camera className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">معاينة أحدث الصور والفيديوهات من مشاريعك.</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-700 mb-3">شاهد آخر الصور ومقاطع الفيديو التي يرفعها المهندس من صفحة كل مشروع.</p>
            </CardContent>
        </Card>

        {/* الجدول الزمني */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                الجدول الزمني <Clock className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">متابعة المواعيد والمعالم الهامة لمشاريعك.</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-700 mb-3">تتوفر الجداول الزمنية المفصلة داخل صفحة كل مشروع على حدة.</p>
            </CardContent>
        </Card>

        {/* التعليقات والاستفسارات */}
        <Card className="mb-6 bg-white/95 shadow-lg">
            <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
                التعليقات والاستفسارات <MessageSquare className="ml-3 h-6 w-6 text-app-gold" />
            </CardTitle>
            <CardDescription className="text-gray-600 text-right">إرسال ملاحظاتك أو استفساراتك.</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-700 mb-3">تواصل مباشرة مع المهندس المسؤول من خلال قسم التعليقات في صفحة المشروع.</p>
            </CardContent>
        </Card>
    </div>
  );
}
