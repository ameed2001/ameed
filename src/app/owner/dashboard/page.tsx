
// src/app/owner/dashboard/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gauge, Briefcase, FileText, Camera, Clock, MessageSquare, DollarSign, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProjects as dbGetProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

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
        // If userEmail is not yet set, don't attempt to fetch.
        // This can happen on initial render before localStorage is read.
        // We could show a different loading state or wait.
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


  const activeProjects = projects.filter(p => p.status === "قيد التنفيذ").length;
  const overallProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.overallProgress || 0), 0) / projects.length) 
    : 0;

  const recentProjects = projects.slice(0, 3); // Show latest 3 projects

  return (
    <div className="space-y-8 text-right">
      <h1 className="text-3xl md:text-4xl font-bold text-app-red">لوحة تحكم المالك</h1>

      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end gap-2">
            <Gauge className="text-app-gold" /> نظرة عامة سريعة
          </CardTitle>
          <CardDescription className="text-gray-600">ملخص سريع لمشاريعك الحالية.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-500">جاري تحميل الإحصائيات...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-700 font-medium">إجمالي المشاريع:</p>
                <p className="text-2xl font-bold text-app-red">{projects.length}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">المشاريع النشطة:</p>
                <p className="text-2xl font-bold text-green-600">{activeProjects}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">متوسط نسبة الإنجاز:</p>
                <Progress value={overallProgress} className="w-full h-3 mt-2" />
                <p className="text-xl font-bold text-blue-600 mt-1">{overallProgress}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end gap-2">
            <Briefcase className="text-app-gold" /> أحدث المشاريع
          </CardTitle>
           <CardDescription className="text-gray-600">نظرة سريعة على أحدث مشاريعك المسجلة.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <p className="text-center text-gray-500 py-8">جاري تحميل المشاريع...</p>
            ): projects.length === 0 ? (
                <div className="text-center text-gray-500 py-10" data-ai-hint="no projects available">
                    <Briefcase size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>لا توجد مشاريع مرتبطة بحسابك حاليًا.</p>
                    <p className="text-sm">عندما يقوم المهندس بربط مشروع بحسابك، سيظهر هنا.</p>
                </div>
            ) : (
                <>
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
                                    <TableCell className="font-medium text-app-red hover:underline">
                                         <Link href={`/my-projects/${project.id}`}>{project.name}</Link>
                                    </TableCell>
                                    <TableCell>{project.status}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={project.overallProgress || 0} className="w-[60%] h-2" />
                                            <span>{project.overallProgress || 0}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/my-projects/${project.id}`} passHref>
                                            <Button variant="link" className="text-blue-600 hover:underline px-2 py-1 h-auto">
                                                <ExternalLink size={16} className="ms-1"/> عرض
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {projects.length > recentProjects.length && (
                        <div className="text-center mt-6">
                            <Button asChild variant="outline" className="text-app-red border-app-red hover:bg-app-red hover:text-white">
                                <Link href="/my-projects">عرض جميع المشاريع</Link>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/95 shadow-md card-hover-effect">
            <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-end gap-2">
                <DollarSign className="text-green-500" /> حساب التكلفة التقديرية
            </CardTitle>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-600 mb-3">أداة لحساب التكاليف التقديرية لمواد البناء المختلفة لمشروعك.</p>
            <Button asChild variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                <Link href="/cost-estimator">بدء حساب التكلفة</Link>
            </Button>
            </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-md card-hover-effect">
            <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-end gap-2">
                <MessageSquare className="text-purple-500" /> التعليقات والاستفسارات
            </CardTitle>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-600 mb-3">راجع التعليقات والملاحظات على مشاريعك أو تواصل مع المهندس.</p>
            <Button asChild variant="outline" className="w-full border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white">
                <Link href="/my-projects">الذهاب إلى المشاريع</Link>
            </Button>
            </CardContent>
        </Card>
        
        <Card className="bg-white/95 shadow-md card-hover-effect">
            <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-end gap-2">
                <FileText className="text-blue-500" /> تقارير الكميات
            </CardTitle>
            </CardHeader>
            <CardContent className="text-right">
            <p className="text-gray-600 mb-3">اطلع على تقارير كميات المواد والأعمال المنجزة لمشاريعك.</p>
            <Button asChild variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
                <Link href="/my-projects">مراجعة التقارير</Link>
            </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

