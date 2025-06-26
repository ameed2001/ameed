
"use client";

import { HardHat, Briefcase, CheckCircle, Hourglass, BarChart3, FolderKanban, ExternalLink, Loader2, Blocks, Calculator, TrendingUp, Users, ArrowLeft, PlusCircle, PenSquare, ClipboardCheck, Settings2, Download, FileText, Camera, GanttChartSquare, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { getProjects, type Project } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
      title: "إدارة المشاريع",
      description: "عرض، تعديل، وأرشفة جميع مشاريعك الإنشائية.",
      icon: FolderKanban,
      colorClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
      links: [
        { href: "/engineer/create-project", label: "إنشاء مشروع جديد", icon: PlusCircle },
        { href: "/engineer/projects", label: "إدارة المشاريع", icon: FolderKanban },
      ]
    },
    {
      key: "structural-elements",
      title: "العناصر الإنشائية",
      description: "تحديد وتفصيل العناصر مثل الأعمدة والكمرات.",
      icon: Blocks,
      colorClass: "text-purple-500",
      buttonClass: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
      links: [
        { href: "#", label: "إدخال تفاصيل العناصر", icon: PenSquare },
        { href: "#", label: "التحقق من صحة البيانات", icon: ClipboardCheck },
      ]
    },
    {
      key: "quantity-survey",
      title: "حساب الكميات",
      description: "أدوات لحساب كميات الحديد والباطون للمشروع.",
      icon: Calculator,
      colorClass: "text-green-500",
      buttonClass: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
      links: [
        { href: "#", label: "حساب كميات المواد", icon: Calculator },
        { href: "#", label: "عرض تقارير الكميات", icon: BarChart3 },
        { href: "#", label: "تخصيص عرض التقارير", icon: Settings2 },
        { href: "#", label: "تصدير التقارير", icon: Download },
        { href: "#", label: "توليد بيانات التقرير", icon: FileText },
      ]
    },
    {
      key: "construction-progress",
      title: "تقدم البناء",
      description: "تسجيل التقدم المحرز في مراحل المشروع المختلفة.",
      icon: TrendingUp,
      colorClass: "text-orange-500",
      buttonClass: "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
      links: [
        { href: "/engineer/update-progress", label: "تحديث التقدم", icon: TrendingUp },
        { href: "#", label: "ملاحظات التقدم", icon: PenSquare },
        { href: "#", label: "رفع صور/فيديوهات", icon: Camera },
        { href: "#", label: "تحديد مراحل المشروع", icon: GanttChartSquare },
      ]
    },
    {
      key: "owner-linking",
      title: "ربط المالكين",
      description: "ربط حسابات المالكين بمشاريعهم لمتابعة التقدم.",
      icon: Users,
      colorClass: "text-red-500",
      buttonClass: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white",
      links: [
        { href: "#", label: "ربط مالك بمشروع", icon: Users },
      ]
    },
    {
      key: "reports",
      title: "التقارير",
      description: "توليد وعرض التقارير المخصصة للمشاريع والكميات.",
      icon: BarChart3,
      colorClass: "text-cyan-500",
      buttonClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
      links: [
        { href: "#", label: "عرض تقارير الكميات", icon: BarChart3 },
        { href: "#", label: "تخصيص عرض التقارير", icon: Settings2 },
        { href: "#", label: "تصدير التقارير", icon: Download },
      ]
    }
  ];

export default function EngineerDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
  }, []);

  useEffect(() => {
    if (!userName) return;

    async function fetchProjects() {
      setIsLoading(true);
      const result = await getProjects(userName);
      if (result.success && result.projects) {
        setProjects(result.projects);
      } else {
        toast({ title: "خطأ", description: "فشل تحميل بيانات المشاريع.", variant: "destructive" });
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, [userName, toast]);

  const stats = {
    active: projects.filter(p => p.status === "قيد التنفيذ" || p.status === "مخطط له").length,
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
             <HardHat className="h-12 w-12 text-app-gold" />
             <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
                مرحباً بالمهندس
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
          <StatCard title="المشاريع النشطة" value={stats.active} icon={<Briefcase className="h-5 w-5 text-blue-500" />} colorClass="text-blue-500" />
          <StatCard title="قيد التنفيذ" value={stats.inProgress} icon={<Hourglass className="h-5 w-5 text-amber-500" />} colorClass="text-amber-500" />
          <StatCard title="المشاريع المكتملة" value={stats.completed} icon={<CheckCircle className="h-5 w-5 text-green-500" />} colorClass="text-green-500" />
        </div>
      )}
      
      {/* Active Projects */}
      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center justify-start gap-2">
              <FolderKanban className="text-blue-700" /> المشاريع النشطة
            </CardTitle>
            <CardDescription>
              عرض سريع لآخر المشاريع التي تعمل عليها حالياً.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-app-gold" /></div>
          ) : recentProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا توجد مشاريع نشطة حالياً.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المشروع</TableHead>
                  <TableHead>نسبة الإنجاز</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell><Progress value={project.overallProgress} className="h-2" /></TableCell>
                    <TableCell>
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700' 
                        }`}>
                          {project.status}
                        </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
                        <Link href={`/my-projects/${project.id}`}>
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
                        <ArrowRight className="ml-2 h-4 w-4" /> العودة
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
                                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-start gap-2">
                                        <Icon className={cn("h-6 w-6", category.colorClass)} /> {category.title}
                                    </CardTitle>
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
                            <Link href={link.href} key={link.href} className="block">
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
