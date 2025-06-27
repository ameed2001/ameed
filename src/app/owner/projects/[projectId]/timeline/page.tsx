'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GanttChartSquare, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { findProjectById, type Project, type TimelineTask } from '@/lib/db';
import Link from 'next/link';

export default function ProjectSpecificTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      setIsLoading(true);
      const userEmail = localStorage.getItem('userEmail');
      const fetchedProject = await findProjectById(projectId);

      if (!fetchedProject || fetchedProject.linkedOwnerEmail !== userEmail) {
        toast({
          title: "غير مصرح به",
          description: "ليس لديك صلاحية لعرض هذا المشروع.",
          variant: "destructive",
        });
        router.push('/owner/dashboard');
        return;
      }
      
      setProject(fetchedProject);
      setIsLoading(false);
    };

    fetchProject();
  }, [projectId, router, toast]);

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-64">
         <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
         <p className="ms-3 text-lg">جاري تحميل الجدول الزمني...</p>
       </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Alert variant="destructive">
          <GanttChartSquare className="h-5 w-5" />
          <AlertTitle>المشروع غير موجود</AlertTitle>
          <AlertDescription>لم يتم العثور على تفاصيل المشروع المطلوب.</AlertDescription>
        </Alert>
        <Button asChild className="mt-6 bg-app-gold hover:bg-yellow-600 text-primary-foreground">
          <Link href="/owner/projects">العودة إلى قائمة المشاريع</Link>
        </Button>
      </div>
    );
  }
  
  const projectStartDate = project.timelineTasks && project.timelineTasks.length > 0 ? new Date(Math.min(...project.timelineTasks.map(task => new Date(task.startDate).getTime()))) : new Date();
  const projectEndDate = project.timelineTasks && project.timelineTasks.length > 0 ? new Date(Math.max(...project.timelineTasks.map(task => new Date(task.endDate).getTime()))) : new Date();
  let totalProjectDurationDays = project.timelineTasks && project.timelineTasks.length > 0 ? Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 30;
  if (totalProjectDurationDays <= 0) totalProjectDurationDays = 30;

  const getTaskPositionAndWidth = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const offsetDays = Math.ceil((taskStart.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const leftPercentage = (offsetDays / totalProjectDurationDays) * 100;
    const widthPercentage = (durationDays / totalProjectDurationDays) * 100;
    return {
      left: `${Math.max(0, Math.min(100 - widthPercentage, leftPercentage))}%`,
      width: `${Math.max(2, Math.min(100, widthPercentage))}%`,
    };
  };

  return (
    <div className="container mx-auto py-8 px-4 text-right">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-app-red">الجدول الزمني لمشروع: {project.name}</h1>
          <Button asChild variant="outline">
              <Link href={`/owner/projects/${projectId}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  العودة لتفاصيل المشروع
              </Link>
          </Button>
      </div>
      <Card className="bg-white/95 shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
            <GanttChartSquare size={28} /> مخطط جانت الزمني
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.timelineTasks && project.timelineTasks.length > 0 ? (
            <div className="space-y-5 relative overflow-x-auto p-1 pb-4 min-h-[400px] bg-gray-50 rounded-lg shadow-inner">
              <div className="absolute inset-0 grid grid-cols-6 gap-0 pointer-events-none opacity-20">
                {Array.from({ length: 6 }).map((_, i) => (
                <div key={`month-grid-detail-${i}`} className={cn("border-r border-gray-300", i === 5 && "border-r-0")}>
                    <span className="block p-1 text-xs text-gray-400 text-center">
                    {new Date(projectStartDate.getFullYear(), projectStartDate.getMonth() + Math.floor(i * totalProjectDurationDays / 6 / 30)).toLocaleString('ar', { month: 'short' })}
                    </span>
                </div>
                ))}
              </div>
              {project.timelineTasks.map((task, index) => {
                const { left, width } = getTaskPositionAndWidth(task);
                return (
                  <div key={task.id} className="relative h-12 flex items-center text-right pr-3 group" style={{ zIndex: index + 1 }}>
                    <div 
                      className={cn(
                        "absolute h-8 rounded-md shadow-sm flex items-center justify-between px-2.5 text-white transition-all duration-300 ease-in-out hover:opacity-90 text-xs",
                        task.color
                      )}
                      style={{ left, width, right: 'auto' }}
                      title={`${task.name} (من ${task.startDate} إلى ${task.endDate}) - ${task.status} ${task.progress !== undefined ? task.progress + '%' : ''}`}
                    >
                      <span className="font-medium truncate">{task.name}</span>
                      {task.status === 'مكتمل' && <CheckCircle2 size={14} className="text-white/90 shrink-0 ml-1.5"/>}
                      {task.status === 'قيد التنفيذ' && <div className="h-2.5 w-2.5 rounded-full bg-white/80 animate-pulse shrink-0 ml-1.5"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">لا يوجد جدول زمني محدد لهذا المشروع بعد.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
