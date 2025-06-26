
"use client";

import { HardHat, Briefcase, CheckCircle, Hourglass, BarChart3, Activity, FolderKanban, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { getProjects, type Project } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

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
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colorClass.replace('text-', 'bg-')}/10`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function EngineerDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
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

      <div className="grid grid-cols-1 gap-8">
        {/* Active Projects */}
        <Card className="bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="text-app-gold" /> المشاريع النشطة
            </CardTitle>
             <CardDescription>
              عرض سريع لآخر المشاريع التي تعمل عليها حالياً.
            </CardDescription>
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
                        <Button asChild variant="ghost" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-500/10 hover:text-white">
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
      </div>
    </div>
  );
}
