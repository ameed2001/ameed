
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Briefcase, FileText, Camera, Clock, MessageSquare,
    Loader2, CheckCircle, Hourglass
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { getProjects as dbGetProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string;
}

function StatCard({ title, value, icon, colorClass }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", colorClass.replace('text-', 'bg-') + '/10')}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}


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
    completed: projects.filter(p => p.status === "مكتمل").length,
  };

  const recentProjects = projects.slice(0, 3);
  
  const functionCards = [
    {
        title: "تقارير الكميات",
        description: "عرض ملخصات وتقارير الكميات من المهندس المسؤول.",
        href: "/owner/projects",
        icon: <FileText className="h-8 w-8 text-green-600" />,
        dataAiHint: "quantity reports"
    },
    {
        title: "التقدم البصري",
        description: "تصفح أحدث الصور ومقاطع الفيديو لمتابعة العمل في الموقع.",
        href: "/owner/projects",
        icon: <Camera className="h-8 w-8 text-purple-600" />,
        dataAiHint: "visual progress"
    },
    {
        title: "الجداول الزمنية",
        description: "اطلع على الخطط الزمنية والمواعيد الهامة لكل مشروع.",
        href: "/owner/project-timeline",
        icon: <Clock className="h-8 w-8 text-cyan-600" />,
        dataAiHint: "project timeline"
    },
    {
        title: "التعليقات والاستفسارات",
        description: "تواصل مع المهندس وأضف ملاحظاتك على المشاريع.",
        href: "/owner/projects",
        icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
        dataAiHint: "comments inquiries"
    },
  ];

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
            <p className="ms-3 text-lg">جاري تحميل البيانات...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 text-right">
        <h1 className="text-3xl font-bold text-app-red mb-6 text-center">لوحة تحكم المالك</h1>

        {/* نظرة عامة سريعة (Stat Cards) */}
        <Card className="bg-white/95 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">نظرة عامة سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="إجمالي المشاريع" value={stats.total} icon={<Briefcase className="h-5 w-5 text-blue-500" />} colorClass="text-blue-500" />
                <StatCard title="قيد التنفيذ" value={stats.inProgress} icon={<Hourglass className="h-5 w-5 text-amber-500" />} colorClass="text-amber-500" />
                <StatCard title="المشاريع المكتملة" value={stats.completed} icon={<CheckCircle className="h-5 w-5 text-green-500" />} colorClass="text-green-500" />
            </CardContent>
        </Card>

        {/* أحدث المشاريع */}
        <Card className="bg-white/95 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-800">أحدث المشاريع</CardTitle>
                <Button asChild variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
                    <Link href="/owner/projects">
                        عرض جميع المشاريع
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {recentProjects.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">اسم المشروع</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-right w-[150px]">نسبة الإنجاز</TableHead>
                                <TableHead className="text-center w-[120px]">الإجراءات</TableHead>
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
                                            <Progress value={project.overallProgress || 0} className="w-[70%] h-2" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button asChild variant="link" size="sm">
                                            <Link href={`/owner/projects/${project.id}`} passHref>
                                                عرض التفاصيل
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-10">لا توجد مشاريع لعرضها حالياً.</p>
                )}
            </CardContent>
        </Card>

        {/* Functional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {functionCards.map((card) => (
                <Card key={card.title} className="card-hover-effect" data-ai-hint={card.dataAiHint}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800">{card.title}</CardTitle>
                        <div className="p-3 bg-muted rounded-full">
                            {card.icon}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                        <Button asChild variant="link" className="p-0 h-auto text-blue-600">
                           <Link href={card.href}>
                               الانتقال إلى القسم
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
