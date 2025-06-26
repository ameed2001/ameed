
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Gauge, Briefcase, FileText, Camera, Clock, MessageSquare, 
  BarChart2, CheckCircle, PlayCircle, Loader2, Eye, Calculator
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
  }, [userEmail, toast]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;
  const averageProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / totalProjects)
    : 0;
  const recentProjects = projects.sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ).slice(0, 3);

  const overviewStats = [
    { 
      label: 'إجمالي المشاريع', 
      value: totalProjects, 
      icon: Briefcase, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'المشاريع قيد التنفيذ', 
      value: activeProjects, 
      icon: PlayCircle, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    { 
      label: 'المشاريع المكتملة', 
      value: completedProjects, 
      icon: CheckCircle, 
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
     { 
      label: 'متوسط الإنجاز الكلي', 
      value: `${averageProgress}%`, 
      icon: Gauge, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
  ];

  const quickAccessLinks = [
    { 
      title: "تقارير الكميات", 
      href: "/owner/projects", 
      icon: FileText, 
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600"
    },
    { 
      title: "التقدم البصري", 
      href: "/owner/projects", 
      icon: Camera, 
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    { 
      title: "الجداول الزمنية", 
      href: "/owner/project-timeline", 
      icon: Clock, 
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600"
    },
    { 
      title: "التعليقات والاستفسارات", 
      href: "/owner/projects", 
      icon: MessageSquare, 
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    },
    { 
      title: "حاسبة التكاليف", 
      href: "/owner/cost-estimator", 
      icon: Calculator, 
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
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
          <div className="mt-4 flex gap-3">
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/owner/projects">عرض جميع المشاريع</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-6 w-[50px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          overviewStats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
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
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="border-app-gold text-app-gold hover:bg-app-gold/10"
            >
              <Link href="/owner/projects">عرض جميع المشاريع</Link>
            </Button>
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
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('ar-EG') : 'غير محدد'}
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
                          variant="ghost" 
                          size="sm" 
                          className="text-app-red hover:bg-red-100/50"
                        >
                          <Link href={`/owner/projects/${project.id}`}>
                            <Eye className="h-4 w-4 ml-1" /> تفاصيل
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
            <BarChart2 className="h-6 w-6 text-app-gold" />
            <CardTitle className="text-xl font-semibold text-gray-800">الأدوات والتقارير</CardTitle>
          </div>
          <CardDescription className="text-right">
            وصول سريع إلى جميع الأدوات والتقارير التي تحتاجها لإدارة مشاريعك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickAccessLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.title} 
                  href={link.href} 
                  className="block group transition-all"
                >
                  <div className={`
                    p-5 text-center rounded-lg shadow-sm border 
                    bg-white hover:shadow-lg hover:-translate-y-1 
                    transition-all duration-200 h-full flex flex-col 
                    items-center justify-center
                  `}>
                    <div className={`
                      p-3 rounded-full mb-3 text-white 
                      ${link.color} ${link.hoverColor} transition-colors
                    `}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-gray-700 group-hover:text-app-red">
                      {link.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      عرض التفاصيل
                    </p>
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
