
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Gauge, Briefcase, FileText, Camera, Clock, MessageSquare, BarChart2, CheckCircle, PlayCircle, Loader2, Eye, Calculator
} from 'lucide-react';
import { getProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      const name = localStorage.getItem('userName');
      setUserEmail(email);
      setOwnerName(name);
    }
  }, []);

  useEffect(() => {
    async function fetchOwnerProjects() {
      if (!userEmail) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await getProjects(userEmail);
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          toast({ title: "خطأ", description: result.message || "فشل تحميل المشاريع.", variant: "destructive" });
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects for owner:", error);
        toast({ title: "خطأ فادح", description: "حدث خطأ أثناء تحميل بيانات المشاريع.", variant: "destructive" });
        setProjects([]);
      }
      setIsLoading(false);
    }

    fetchOwnerProjects();
  }, [userEmail, toast]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;
  const recentProjects = projects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3); // Show latest 3 projects

  const overviewStats = [
    { label: 'إجمالي المشاريع', value: totalProjects, icon: Briefcase, color: 'text-blue-500' },
    { label: 'المشاريع قيد التنفيذ', value: activeProjects, icon: PlayCircle, color: 'text-yellow-500' },
    { label: 'المشاريع المكتملة', value: completedProjects, icon: CheckCircle, color: 'text-green-500' },
  ];

  const quickAccessLinks = [
    { title: "تقارير الكميات", href: "/owner/projects", icon: FileText, color: "text-indigo-500" },
    { title: "التقدم البصري", href: "/owner/projects", icon: Camera, color: "text-purple-500" },
    { title: "الجداول الزمنية", href: "/owner/project-timeline", icon: Clock, color: "text-cyan-500" },
    { title: "التعليقات والاستفسارات", href: "/owner/projects", icon: MessageSquare, color: "text-orange-500" },
    { title: "حاسبة التكاليف", href: "/owner/cost-estimator", icon: Calculator, color: "text-red-500" },
  ];

  return (
    <div className="space-y-8 text-right">
      <Card className="mb-8 bg-gradient-to-r from-app-red via-red-700 to-red-800 text-white shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold">مرحباً بعودتك، {ownerName || 'أيها المالك'}!</h2>
          <p className="mt-2 text-red-100">
            هذه هي لوحة التحكم الخاصة بك. من هنا يمكنك متابعة مشاريعك، عرض التقارير، واستخدام أدواتنا.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/95 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-end gap-3">
            <CardTitle className="text-2xl font-semibold text-gray-800">نظرة عامة سريعة</CardTitle>
            <Gauge className="h-6 w-6 text-app-gold" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-6 w-[50px]" />
                </div>
              </div>
            )) : overviewStats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 border-r-4 border-app-gold/70">
                  <div className={`p-3 rounded-full bg-gray-200/50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-end gap-3">
              <CardTitle className="text-2xl font-semibold text-gray-800">أحدث المشاريع</CardTitle>
              <Briefcase className="h-6 w-6 text-app-gold" />
            </div>
            <Button asChild variant="outline" size="sm" className="border-app-gold text-app-gold hover:bg-app-gold/10">
              <Link href="/owner/projects">عرض جميع المشاريع</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المشروع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right w-[200px]">نسبة الإنجاز</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[100px] mx-auto" /></TableCell>
                  </TableRow>
                )) : recentProjects.length > 0 ? recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.overallProgress || 0} className="w-full h-2" />
                        <span className="text-xs font-medium">{project.overallProgress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100/50">
                        <Link href={`/owner/projects/${project.id}`}>
                          <Eye className="h-4 w-4 ml-1" /> عرض
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      لا توجد مشاريع لعرضها حالياً.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-end gap-3">
            <CardTitle className="text-2xl font-semibold text-gray-800">وصول سريع للأدوات والتقارير</CardTitle>
            <BarChart2 className="h-6 w-6 text-app-gold" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickAccessLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.title} href={link.href} className="block group">
                  <div className="p-4 text-center rounded-lg border bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col items-center justify-center">
                    <div className={cn("p-3 rounded-full mb-3", link.color)}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-gray-700 group-hover:text-app-red">{link.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
