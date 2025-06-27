"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProjects, type Project } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GanttChartSquare, Info, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerProjectTimelinePage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
    } else {
      toast({
        title: "غير مصرح به",
        description: "يرجى تسجيل الدخول لعرض هذه الصفحة.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      const result = await getProjects(userId);
      if (result.success && result.projects) {
        setProjects(result.projects);
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل تحميل قائمة المشاريع.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [userId, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'قيد التنفيذ':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'مكتمل':
        return 'bg-green-100 text-green-800 border-green-300';
        default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl w-full">
        <CardHeader className="text-center">
          <Clock className="mx-auto h-12 w-12 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">الجداول الزمنية للمشاريع</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            اختر مشروعًا من القائمة أدناه لعرض الجدول الزمني التفصيلي الخاص به.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <Button asChild className="font-semibold bg-app-red hover:bg-red-700 text-white">
                    <Link href={`/owner/projects/${project.id}`}>
                      <GanttChartSquare className="ml-2 h-4 w-4" />
                      عرض الجدول الزمني
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg" data-ai-hint="no projects timeline">
                <Info size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="font-semibold">لا توجد مشاريع لعرضها</p>
                <p className="text-sm">لم يتم ربط أي مشاريع بحسابك بعد.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
