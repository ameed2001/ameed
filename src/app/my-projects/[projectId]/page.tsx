
"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarDays, Image as ImageIcon, FileText, MessageSquare, Edit, Send, Palette, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Using next/image

interface ProjectPhoto {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
}

interface TimelineTask {
  id: string;
  name: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له';
  startDate: string;
  endDate: string;
  progress?: number; // 0-100 for in-progress tasks
  color: string; // Tailwind bg color like 'bg-blue-500'
}

interface ProjectComment {
  id: string;
  user: string;
  text: string;
  date: string;
  avatar?: string; // URL to user avatar
}

interface Project {
  id: string;
  name: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له';
  overallProgress: number; // 0-100
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  engineer?: string;
  quantitySummary?: string;
  photos?: ProjectPhoto[];
  timelineTasks?: TimelineTask[];
  comments?: ProjectComment[];
}

// Enhanced Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'مشروع بناء فيلا النرجس',
    status: 'قيد التنفيذ',
    overallProgress: 65,
    description: 'فيلا سكنية فاخرة مكونة من طابقين وحديقة واسعة، تقع في حي النرجس الراقي. يتميز المشروع بتصميم معماري حديث واستخدام مواد بناء عالية الجودة.',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    location: "حي النرجس، الرياض",
    engineer: "م. خالد الأحمدي",
    quantitySummary: 'تم استهلاك 120 متر مكعب من الباطون و 15 طن من حديد التسليح حتى الآن. تم الانتهاء من 80% من أعمال الهيكل الخرساني.',
    photos: [
      { id: 'p1', src: 'https://placehold.co/600x400.png', alt: 'أعمال الأساسات', dataAiHint: 'building foundation', caption: 'صب قواعد الأساسات بتاريخ 15 مارس 2024' },
      { id: 'p2', src: 'https://placehold.co/600x400.png', alt: 'أعمدة الطابق الأرضي', dataAiHint: 'concrete columns', caption: 'الانتهاء من أعمدة الطابق الأرضي بتاريخ 10 أبريل 2024' },
      { id: 'p3', src: 'https://placehold.co/600x400.png', alt: 'تقدم الهيكل', dataAiHint: 'construction progress', caption: 'نظرة عامة على تقدم الهيكل الخرساني بتاريخ 1 مايو 2024' },
    ],
    timelineTasks: [
      { id: 't1', name: "التخطيط والتراخيص", startDate: "2024-03-01", endDate: "2024-03-15", status: 'مكتمل', progress: 100, color: "bg-green-500" },
      { id: 't2', name: "أعمال الحفر والأساسات", startDate: "2024-03-16", endDate: "2024-04-30", status: 'مكتمل', progress: 100, color: "bg-green-500" },
      { id: 't3', name: "الهيكل الخرساني للطابق الأرضي", startDate: "2024-05-01", endDate: "2024-06-30", status: 'قيد التنفيذ', progress: 80, color: "bg-yellow-500" },
      { id: 't4', name: "الهيكل الخرساني للطابق الأول", startDate: "2024-07-01", endDate: "2024-08-31", status: 'قيد التنفيذ', progress: 30, color: "bg-yellow-500" },
      { id: 't5', name: "أعمال التشطيبات الأولية", startDate: "2024-09-01", endDate: "2024-10-31", status: 'مخطط له', progress: 0, color: "bg-blue-500" },
      { id: 't6', name: "التشطيبات النهائية والتسليم", startDate: "2024-11-01", endDate: "2024-12-31", status: 'مخطط له', progress: 0, color: "bg-blue-500" },
    ],
    comments: [
      { id: 'c1', user: "م. خالد الأحمدي", text: "تم الانتهاء من صب سقف الطابق الأرضي اليوم. كل شيء يسير وفق الجدول.", date: "2024-06-20", avatar: "https://placehold.co/40x40.png?text=EN" },
      { id: 'c2', user: "المالك", text: "عمل رائع! متى يمكنني زيارة الموقع للاطلاع على آخر التطورات؟", date: "2024-06-21", avatar: "https://placehold.co/40x40.png?text=OW" },
    ]
  },
  // Add other mock projects if needed, similar to the structure above
];


export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // Simulate fetching project data
    const foundProject = mockProjects.find(p => p.id === projectId);
    setProject(foundProject || null);
  }, [projectId]);

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !project) return;

    setIsSubmittingComment(true);
    // Simulate API call
    setTimeout(() => {
      const commentToAdd: ProjectComment = {
        id: crypto.randomUUID(),
        user: "المالك (أنت)", // Simulate current user
        text: newComment,
        date: new Date().toISOString().split('T')[0],
        avatar: "https://placehold.co/40x40.png?text=ME"
      };
      setProject(prev => prev ? { ...prev, comments: [...(prev.comments || []), commentToAdd] } : null);
      setNewComment('');
      setIsSubmittingComment(false);
      toast({
        title: "تم إضافة التعليق",
        description: "تم نشر تعليقك بنجاح.",
        variant: "default",
      });
    }, 1000);
  };
  
  // Calculate the total duration of the project in days for timeline scaling
  const projectStartDate = project?.timelineTasks ? new Date(Math.min(...project.timelineTasks.map(task => new Date(task.startDate).getTime()))) : new Date();
  const projectEndDate = project?.timelineTasks ? new Date(Math.max(...project.timelineTasks.map(task => new Date(task.endDate).getTime()))) : new Date();
  let totalProjectDurationDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1; // Min 1 day
  if (totalProjectDurationDays <= 0) totalProjectDurationDays = 30; // Default to 30 if no tasks or invalid dates

  const getTaskPositionAndWidth = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const offsetDays = Math.ceil((taskStart.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leftPercentage = (offsetDays / totalProjectDurationDays) * 100;
    const widthPercentage = (durationDays / totalProjectDurationDays) * 100;

    return {
      left: `${Math.max(0, Math.min(100 - widthPercentage, leftPercentage))}%`, // Ensure it stays within bounds
      width: `${Math.max(2, Math.min(100, widthPercentage))}%`, // Min width, max 100%
    };
  };


  if (!project) {
    return (
      <AppLayout>
        <div className="container mx-auto py-10 px-4 text-center">
          <Alert variant="destructive">
            <FileText className="h-5 w-5" />
            <AlertTitle>المشروع غير موجود</AlertTitle>
            <AlertDescription>
              لم يتم العثور على تفاصيل المشروع المطلوب. قد يكون الرابط غير صحيح أو تم حذف المشروع.
            </AlertDescription>
          </Alert>
           <Button asChild className="mt-6 bg-app-gold hover:bg-yellow-600 text-primary-foreground">
             <Link href="/my-projects">العودة إلى قائمة المشاريع</Link>
           </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 text-right">
        <Card className="bg-white/95 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-app-red">{project.name}</CardTitle>
            <CardDescription className="text-gray-700 mt-1">
              {project.description}
            </CardDescription>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
                <span><strong>الموقع:</strong> {project.location || 'غير محدد'}</span>
                <span><strong>المهندس المسؤول:</strong> {project.engineer || 'غير محدد'}</span>
                <span><strong>تاريخ البدء:</strong> {project.startDate}</span>
                <span><strong>التسليم المتوقع:</strong> {project.endDate}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-base font-semibold text-gray-800">التقدم العام للمشروع:</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <Progress value={project.overallProgress} className="h-4 flex-grow" />
                <span className="font-bold text-app-gold text-lg">{project.overallProgress}%</span>
              </div>
              <p className={`text-sm font-semibold mt-1.5 ${
                    project.status === 'مكتمل' ? 'text-green-600' :
                    project.status === 'قيد التنفيذ' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    الحالة الحالية: {project.status}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Project Timeline Section */}
            <Card className="bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                  <CalendarDays size={28} /> الجدول الزمني للمشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.timelineTasks && project.timelineTasks.length > 0 ? (
                  <div className="space-y-5 relative overflow-x-auto p-1 pb-4 min-h-[200px] bg-gray-50 rounded-lg shadow-inner">
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
                        <div key={task.id} className="relative h-12 flex items-center text-right pr-3" style={{ zIndex: index + 1 }}>
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
                  <p className="text-gray-500">لا يوجد جدول زمني محدد لهذا المشروع بعد.</p>
                )}
              </CardContent>
            </Card>

            {/* Progress Photos/Videos Section */}
            <Card className="bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                  <ImageIcon size={28} /> صور وفيديوهات تقدم المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.photos && project.photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.photos.map((photo) => (
                      <div key={photo.id} className="group relative rounded-lg overflow-hidden shadow-md">
                        <Image 
                            src={photo.src} 
                            alt={photo.alt} 
                            width={600} 
                            height={400} 
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={photo.dataAiHint} 
                        />
                        {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {photo.caption}
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لا توجد صور أو فيديوهات مرفوعة لهذا المشروع حالياً.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Summarized Quantity Reports Section */}
            <Card className="bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                  <FileText size={28} /> تقارير الكميات الملخصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {project.quantitySummary || "لا توجد تقارير كميات ملخصة متاحة حالياً."}
                </p>
                {project.quantitySummary && (
                    <Button variant="outline" className="mt-4 border-app-gold text-app-gold hover:bg-app-gold/10">
                        <FileText size={18} className="ms-2" /> تحميل التقرير التفصيلي (PDF)
                    </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Comments/Inquiries Section */}
            <Card className="bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                  <MessageSquare size={28} /> التعليقات والاستفسارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="newComment" className="font-semibold text-gray-700">أضف تعليقاً أو استفساراً:</Label>
                    <Textarea
                      id="newComment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك هنا..."
                      rows={3}
                      className="mt-1 bg-white focus:border-app-gold"
                    />
                  </div>
                  <Button type="submit" className="bg-app-red hover:bg-red-700 text-white font-semibold" disabled={isSubmittingComment || !newComment.trim()}>
                    {isSubmittingComment ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : <Send size={18} className="ms-2"/>}
                    إرسال
                  </Button>
                </form>
                <Separator className="my-6" />
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {project.comments && project.comments.length > 0 ? (
                    project.comments.slice().reverse().map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start gap-3">
                           {comment.avatar && <Image src={comment.avatar} alt={comment.user} width={40} height={40} className="rounded-full" data-ai-hint="avatar person" />}
                           {!comment.avatar && <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">{comment.user.substring(0,1)}</div>}
                           <div className="flex-grow">
                                <p className="font-semibold text-gray-800">{comment.user}</p>
                                <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                           </div>
                        </div>
                        <p className="text-gray-700 mt-2 ps-12">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Loader2 icon for simulating loading state
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
