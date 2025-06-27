"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Briefcase, FileText, Camera, Clock, MessageSquare, 
  BarChart2, CheckCircle, PlayCircle, Loader2, Eye, Calculator, ArrowLeft, BarChartHorizontal, SlidersHorizontal
} from 'lucide-react';
import { getProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId');
      const name = localStorage.getItem('userName');
      setUserId(id);
      setOwnerName(name);
    }
  }, []);

  useEffect(() => {
    async function fetchOwnerProjects() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await getProjects(userId);
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          toast({ 
            title: "خطأ", 
            description: result.message || "فشل تحميل المشاريع.", 
            variant: "destructive" 
          });
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects for owner:", error);
        toast({ 
          title: "خطأ فادح", 
          description: "حدث خطأ أثناء تحميل بيانات المشاريع.", 
          variant: "destructive" 
        });
        setProjects([]);
      }
      setIsLoading(false);
    }

    fetchOwnerProjects();
  }, [userId, toast]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;
  const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / totalProjects) : 0;
  
  const recentProjects = projects.sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ).slice(0, 3);

  const overviewStats = [
    { 
      label: 'إجمالي المشاريع', 
      value: totalProjects, 
      icon: Briefcase, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'المشاريع قيد التنفيذ', 
      value: activeProjects, 
      icon: PlayCircle, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      label: 'المشاريع المكتملة', 
      value: completedProjects, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
     { 
      label: 'متوسط الإنجاز الكلي', 
      value: `${averageProgress}%`, 
      icon: BarChartHorizontal, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  const quickAccessLinks = [
    { 
      title: "تقارير الكميات",
      description: "عرض ملخصات وتقارير كميات المواد والأعمال المنجزة.",
      href: "/owner/projects", 
      icon: FileText, 
      iconColorClass: "text-indigo-500",
      buttonClass: "border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white",
    },
    { 
      title: "التقدم البصري",
      description: "مشاهدة أحدث الصور والفيديوهات المرفوعة من موقع المشروع.",
      href: "/owner/projects", 
      icon: Camera,
      iconColorClass: "text-purple-500",
      buttonClass: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
    },
    { 
      title: "الجداول الزمنية",
      description: "متابعة الجدول الزمني للمشروع والمراحل الهامة.",
      href: "/owner/project-timeline", 
      icon: Clock, 
      iconColorClass: "text-cyan-500",
      buttonClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    },
    { 
      title: "التعليقات والاستفسارات",
      description: "التواصل مع المهندس وترك ملاحظاتك واستفساراتك.",
      href: "/owner/projects", 
      icon: MessageSquare,
      iconColorClass: "text-orange-500",
      buttonClass: "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
    },
    { 
      title: "حاسبة التكاليف",
      description: "استخدام حاسبة تقديرية بسيطة لتكاليف المواد.",
      href: "/owner/cost-estimator", 
      icon: Calculator,
      iconColorClass: "text-red-500",
      buttonClass: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد التنفيذ':
        return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل':
        return 'bg-green-100 text-green-800';
      case 'معلق':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8 text-right">
      {/* Welcome Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-red-600 to-red-800 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-50"></div>
        <div className="relative p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            مرحباً بعودتك، {ownerName || 'أيها المالك'}!
          </h1>
          <p className="mt-2 text-red-100 max-w-2xl">
            هذه هي لوحة التحكم الخاصة بك حيث يمكنك متابعة مشاريعك، عرض التقارير التفصيلية، 
            وإدارة جميع جوانب مشاريع البناء الخاصة بك.
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                  <div className="text-right">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-8 w-[50px] mt-1" />
                  </div>
                  <Skeleton className="h-14 w-14 rounded-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          overviewStats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Projects */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-app-gold" />
              <CardTitle className="text-xl font-semibold text-gray-800">أحدث المشاريع</CardTitle>
            </div>
            <Link
              href="/owner/projects"
              className="flex items-center gap-2 text-sm font-semibold text-app-red hover:text-red-700 hover:underline transition-colors"
            >
              <span>عرض جميع المشاريع</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[200px]">اسم المشروع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ البدء</TableHead>
                  <TableHead className="text-right w-[200px]">نسبة الإنجاز</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[100px] mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Link 
                          href={`/owner/projects/${project.id}`} 
                          className="hover:text-app-red transition-colors"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('en-CA') : 'غير محدد'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={project.overallProgress || 0} 
                            className="w-full h-2"
                            indicatorColor={
                              (project.overallProgress || 0) >= 80 ? 'bg-green-500' : 
                              (project.overallProgress || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }
                          />
                          <span className="text-sm font-medium w-10">
                            {project.overallProgress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="font-semibold border-app-red text-app-red hover:bg-app-red hover:text-white transition-colors duration-200"
                        >
                          <Link href={`/owner/projects/${project.id}`}>
                            <Eye className="h-4 w-4 ml-1" />
                            تفاصيل
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      لا توجد مشاريع لعرضها حالياً.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Tools */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-6 w-6 text-app-red" />
            <CardTitle className="text-xl font-semibold text-gray-800">الأدوات والتقارير</CardTitle>
          </div>
          <CardDescription className="text-right">
            وصول سريع إلى جميع الأدوات والتقارير التي تحتاجها لإدارة مشاريعك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessLinks.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title} 
                  className="card-hover-effect flex flex-col h-full text-right p-6 shadow-lg rounded-lg border border-gray-200/80"
                >
                  <div className="flex items-center justify-start gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                    <Icon className={cn("h-8 w-8", category.iconColorClass)} />
                  </div>
                  <p className="text-gray-600 text-sm mb-5 flex-grow">{category.description}</p>
                  <Button asChild variant="outline" className={cn("mt-auto w-full flex justify-between items-center font-semibold", category.buttonClass)}>
                    <Link href={category.href}>
                      <span>الانتقال إلى القسم</span>
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
