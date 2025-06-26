// src/app/owner/dashboard/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Gauge, Briefcase, FileText, Camera, Clock, MessageSquare, DollarSign, ExternalLink, 
    Loader2, Hourglass, CheckCircle, FolderKanban, Wrench, Calculator, GanttChartSquare, ArrowLeft 
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { getProjects as dbGetProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// StatCard component definition, similar to engineer's dashboard
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

const dashboardCategories = [
    {
      key: "projects",
      title: "المشاريع والتقدم",
      description: "عرض تفاصيل المشاريع ومتابعة تقدمها.",
      icon: FolderKanban,
      colorClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
      links: [
        { href: "/owner/projects", label: "عرض جميع المشاريع", icon: Briefcase },
        { href: "/owner/project-timeline", label: "عرض الجداول الزمنية", icon: GanttChartSquare },
        { href: "/owner/projects", label: "عرض الصور والفيديوهات", icon: Camera },
      ]
    },
    {
      key: "tools",
      title: "الأدوات والتواصل",
      description: "استخدام الأدوات المتاحة ومراجعة التقارير.",
      icon: Wrench,
      colorClass: "text-green-500",
      buttonClass: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
      links: [
        { href: "/owner/cost-estimator", label: "حاسبة التكلفة التقديرية", icon: Calculator },
        { href: "/owner/projects", label: "مراجعة تقارير الكميات", icon: FileText },
        { href: "/owner/projects", label: "إضافة تعليقات واستفسارات", icon: MessageSquare },
      ]
    },
];

export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);
  
  useEffect(() => {
    async function fetchProjects() {
      if (!userEmail) return;
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

  const recentProjects = projects.filter(p => p.status !== "مكتمل" && p.status !== "مؤرشف").slice(0, 5);
  const activeCategory = selectedCategory ? dashboardCategories.find(c => c.key === selectedCategory) : null;

  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl border-gray-200/80 mb-10 text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-3 gap-3">
             <Gauge className="h-12 w-12 text-app-gold" />
             <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
                لوحة تحكم المالك
             </CardTitle>
          </div>
          <CardDescription className="text-lg text-gray-700 mt-2">
            هذه هي لوحة التحكم المركزية الخاصة بك. راقب، أدر، وتابع جميع مشاريعك من هنا.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-app-gold" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="إجمالي المشاريع" value={stats.total} icon={<Briefcase className="h-5 w-5 text-blue-500" />} colorClass="text-blue-500" />
          <StatCard title="قيد التنفيذ" value={stats.inProgress} icon={<Hourglass className="h-5 w-5 text-amber-500" />} colorClass="text-amber-500" />
          <StatCard title="المشاريع المكتملة" value={stats.completed} icon={<CheckCircle className="h-5 w-5 text-green-500" />} colorClass="text-green-500" />
        </div>
      )}
      
      {/* Recent Projects */}
      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className="flex items-center justify-start gap-2">
                <FolderKanban className="text-blue-700" />
                <CardTitle>
                    أحدث المشاريع
                </CardTitle>
             </div>
             <CardDescription>
                عرض سريع لآخر المشاريع المسجلة باسمك.
             </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-app-gold" /></div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center text-muted-foreground py-10" data-ai-hint="no projects available">
              <div className="flex justify-center mb-3">
                <Briefcase size={48} className="text-gray-400" />
              </div>
              <p>لا توجد مشاريع مرتبطة بحسابك حاليًا.</p>
              <p className="text-sm">عندما يقوم المهندس بربط مشروع بحسابك، سيظهر هنا.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المشروع</TableHead>
                  <TableHead className="text-right">نسبة الإنجاز</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium text-right align-middle text-app-red hover:underline">
                        <Link href={`/owner/projects/${project.id}`}>{project.name}</Link>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-sm font-mono">{project.overallProgress || 0}%</span>
                        <Progress value={project.overallProgress} className="w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-700' :
                          project.status === 'مخطط له' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {project.status}
                        </span>
                    </TableCell>
                    <TableCell className="text-center align-middle">
                      <Button asChild variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
                        <Link href={`/owner/projects/${project.id}`}>
                          عرض <ExternalLink className="mr-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Main content: either main categories or sub-categories */}
      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                    {activeCategory ? activeCategory.title : 'أدوات ومهام رئيسية'}
                </CardTitle>
                {activeCategory ? (
                    <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                        <ArrowLeft className="ml-2 h-4 w-4" /> العودة
                    </Button>
                ) : (
                    <CardDescription className="text-gray-600">وصول سريع إلى الأقسام والوظائف الأساسية.</CardDescription>
                )}
            </div>
        </CardHeader>
        <CardContent>
            {!activeCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Card 
                                key={category.key} 
                                className="card-hover-effect flex flex-col h-full text-right cursor-pointer group"
                                onClick={() => setSelectedCategory(category.key)}
                            >
                                 <CardHeader className="pb-4">
                                    <div className="flex items-center justify-start gap-2">
                                        <Icon className={cn("h-6 w-6", category.colorClass)} /> 
                                        <CardTitle className="text-xl font-semibold text-gray-800">
                                            {category.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                 <CardContent className="flex-grow pt-0 pb-4">
                                     <p className="text-gray-600 text-sm">{category.description}</p>
                                 </CardContent>
                                 <CardFooter className="pt-0 mt-auto">
                                    <div className={cn("w-full py-2 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-between border-2", category.buttonClass)}>
                                       <span>الانتقال إلى القسم</span>
                                       <ArrowLeft className="h-4 w-4" />
                                    </div>
                                 </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCategory.links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link href={link.href} key={link.label} className="block">
                                <Card className="card-hover-effect flex flex-col h-full text-right">
                                    <CardContent className="p-6 flex items-center justify-start gap-4">
                                        <Icon className={cn("h-8 w-8", activeCategory.colorClass)} />
                                        <span className="text-lg font-semibold text-gray-800">{link.label}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
