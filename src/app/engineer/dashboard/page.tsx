"use client";

import { useState, useEffect } from 'react';
import {
    FolderKanban,
    Calculator,
    Blocks,
    TrendingUp,
    BarChart3,
    Users,
    ArrowLeft,
    Gauge,
    Briefcase,
    PlayCircle,
    CheckCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const dashboardCategories = [
    {
      title: "إدارة المشاريع",
      description: "عرض، تعديل، وأرشفة جميع مشاريعك الإنشائية.",
      icon: FolderKanban,
      href: "/engineer/projects",
      iconColorClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
    },
    {
      title: "حساب الكميات",
      description: "أدوات لحساب كميات الحديد والباطون للمشروع.",
      icon: Calculator,
      href: "/engineer/cost-estimator",
      iconColorClass: "text-green-500",
      buttonClass: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
    },
    {
      title: "العناصر الإنشائية",
      description: "تحديد وتفصيل العناصر مثل الأعمدة والكمرات.",
      icon: Blocks,
      href: "#",
      iconColorClass: "text-purple-500",
      buttonClass: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
    },
    {
      title: "تقدم البناء",
      description: "تسجيل التقدم المحرز في مراحل المشروع المختلفة.",
      icon: TrendingUp,
      href: "/engineer/update-progress",
      iconColorClass: "text-orange-500",
      buttonClass: "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
    },
    {
      title: "التقارير",
      description: "توليد وعرض التقارير المخصصة للمشاريع والكميات.",
      icon: BarChart3,
      href: "#",
      iconColorClass: "text-cyan-500",
      buttonClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    },
    {
      title: "ربط المالكين",
      description: "ربط حسابات المالكين بمشاريعهم لمتابعة التقدم.",
      icon: Users,
      href: "/engineer/link-owner",
      iconColorClass: "text-red-500",
      buttonClass: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white",
    },
];

export default function EngineerDashboardPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const name = localStorage.getItem('userName');
          setUserName(name);
          if (!name) {
            setIsLoading(false);
            toast({
              title: "مستخدم غير معروف",
              description: "لم يتم العثور على معلومات المهندس. يرجى تسجيل الدخول مرة أخرى.",
              variant: "destructive",
            });
          }
        }
      }, [toast]);

    useEffect(() => {
    async function fetchEngineerProjects() {
        if (!userName) return;
        setIsLoading(true);
        try {
        const result = await getProjects(userName);
        if (result.success && result.projects) {
            setProjects(result.projects);
        } else {
            toast({ title: "خطأ", description: result.message || "فشل تحميل المشاريع.", variant: "destructive" });
            setProjects([]);
        }
        } catch (error) {
        console.error("Error fetching projects for engineer:", error);
        toast({ title: "خطأ فادح", description: "حدث خطأ أثناء تحميل بيانات المشاريع.", variant: "destructive" });
        setProjects([]);
        }
        setIsLoading(false);
    }

    if (userName) {
        fetchEngineerProjects();
    }
    }, [userName, toast]);

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
    const completedProjects = projects.filter(p => p.status === 'مكتمل').length;

    const overviewStats = [
        { label: 'إجمالي المشاريع', value: totalProjects, icon: Briefcase, color: 'text-blue-500' },
        { label: 'المشاريع قيد التنفيذ', value: activeProjects, icon: PlayCircle, color: 'text-yellow-500' },
        { label: 'المشاريع المكتملة', value: completedProjects, icon: CheckCircle, color: 'text-green-500' },
    ];

  return (
    <div className="space-y-8 text-right">
       {/* Welcome Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-50"></div>
        <div className="relative p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            مرحباً بعودتك، {userName ? `م. ${userName}` : 'أيها المهندس'}!
          </h1>
          <p className="mt-2 text-blue-100 max-w-2xl">
            هنا يمكنك إدارة مشاريعك، حساب الكميات، تحديث التقدم، وإصدار التقارير.
          </p>
        </div>
      </div>

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

      <Card className="bg-white/95 shadow-xl border-gray-200/80">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800">
            أدوات ومهام رئيسية
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            وصول سريع إلى الأقسام والوظائف الأساسية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCategories.map((category) => {
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
