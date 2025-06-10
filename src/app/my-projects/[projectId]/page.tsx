
"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import AppLayout from "@/components/AppLayout"; // This page still uses AppLayout as it's not exclusive to owner layout
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CalendarDays, Image as ImageIcon, FileText, MessageSquare, Edit, Send, Palette, CheckCircle2, 
  UploadCloud, Download, Link2, HardHat, Users, Percent, FileEdit, BarChart3, GanttChartSquare, Settings2, Loader2 as LoaderIcon, Mail, Calculator, Wrench, ListChecks
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { findProjectById, updateProject as dbUpdateProject, type Project, type ProjectComment, type ProjectPhoto, type TimelineTask } from '@/lib/db'; // Using new db.ts
import Link from 'next/link';

// Simulate logged-in user - replace with actual auth context in a real app
const MOCK_CURRENT_USER_ROLE: "Owner" | "Engineer" | "Admin" = "Engineer"; 
const MOCK_CURRENT_USER_EMAIL: string = "engineer@example.com"; 


export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState({ percentage: '', notes: '' });
  const [linkedOwnerEmailInput, setLinkedOwnerEmailInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isContactEngineerModalOpen, setIsContactEngineerModalOpen] = useState(false);
  const [engineerMessage, setEngineerMessage] = useState('');


  const isOwnerView = MOCK_CURRENT_USER_ROLE === "Owner";

  const refreshProjectFromDb = async () => { 
    const currentProject = await findProjectById(projectId); 
     if (isOwnerView && currentProject && currentProject.linkedOwnerEmail !== MOCK_CURRENT_USER_EMAIL) {
        setProject(null);
        toast({ title: "غير مصرح به", description: "ليس لديك صلاحية لعرض هذا المشروع.", variant: "destructive" });
        return;
    }
    setProject(currentProject ? {...currentProject} : null); 
    if (currentProject?.linkedOwnerEmail) {
      setLinkedOwnerEmailInput(currentProject.linkedOwnerEmail);
    }
    if (currentProject?.overallProgress) {
      setProgressUpdate(prev => ({ ...prev, percentage: currentProject.overallProgress.toString() }));
    }
  };

  useEffect(() => {
    refreshProjectFromDb();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]); 

  const handleCommentSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (!newComment.trim() || !project) return;
    setIsSubmittingComment(true);
    
    const commentToAdd: ProjectComment = {
      id: crypto.randomUUID(), 
      user: isOwnerView ? "المالك" : "المهندس (أنت)", 
      text: newComment, 
      date: new Date().toISOString(), 
      avatar: isOwnerView ? "https://placehold.co/40x40.png?text=OW" : "https://placehold.co/40x40.png?text=ME", 
      dataAiHintAvatar: isOwnerView ? "owner avatar" : "my avatar"
    };
    
    const updatedProjectResult = await dbUpdateProject(project.id.toString(), { 
        comments: [...(project.comments || []), commentToAdd]
    });

    if (updatedProjectResult.success) {
        refreshProjectFromDb();
        setNewComment('');
        toast({ title: "تم إضافة التعليق", description: "تم نشر تعليقك بنجاح." });
    } else {
        toast({ title: "خطأ", description: "فشل إضافة التعليق.", variant: "destructive" });
    }
    setIsSubmittingComment(false);
  };

  const handleProgressSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (!project || !progressUpdate.percentage) {
      toast({ title: "خطأ", description: "يرجى إدخال نسبة التقدم.", variant: "destructive"});
      return;
    }
    const newProgress = parseInt(progressUpdate.percentage);
    if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
      toast({ title: "خطأ", description: "الرجاء إدخال نسبة تقدم صالحة (0-100).", variant: "destructive"});
      return;
    }
    
    const updatedProjectResult = await dbUpdateProject(project.id.toString(), { 
        overallProgress: newProgress,
        quantitySummary: (project.quantitySummary || '') + ` (ملاحظة تقدم: ${progressUpdate.notes || 'لا يوجد'})`
    });

    if (updatedProjectResult.success) {
        refreshProjectFromDb();
        toast({ title: "تم تحديث التقدم", description: \`تم تحديث تقدم المشروع إلى \${newProgress}%. \${progressUpdate.notes ? 'الملاحظات: ' + progressUpdate.notes : ''}\` });
        setProgressUpdate(prev => ({ ...prev, notes: '' })); 
    } else {
        toast({ title: "خطأ", description: "فشل تحديث التقدم.", variant: "destructive" });
    }
  };

  const handleLinkOwnerSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (!project || !linkedOwnerEmailInput.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال بريد إلكتروني للمالك.", variant: "destructive"});
      return;
    }
    
    const updatedProjectResult = await dbUpdateProject(project.id.toString(), { linkedOwnerEmail: linkedOwnerEmailInput }); 
    if (updatedProjectResult.success) {
        refreshProjectFromDb();
        toast({ title: "تم ربط المالك", description: \`تم ربط المالك بالبريد الإلكتروني: \${linkedOwnerEmailInput}.\` });
    } else {
        toast({ title: "خطأ", description: "فشل ربط المالك.", variant: "destructive" });
    }
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !project) {
      toast({ title: "لم يتم اختيار ملف", description: "يرجى اختيار ملف لتحميله.", variant: "destructive" });
      return;
    }
    setIsUploadingFile(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const newPhoto: ProjectPhoto = {
      id: crypto.randomUUID(),
      src: URL.createObjectURL(selectedFile), 
      alt: \`Uploaded: \${selectedFile.name}\`,
      dataAiHint: "uploaded image",
      caption: \`تم الرفع: \${selectedFile.name}\`
    };
    
    const updatedProjectResult = await dbUpdateProject(project.id.toString(), { 
        photos: [...(project.photos || []), newPhoto]
    });

    if (updatedProjectResult.success) {
        refreshProjectFromDb();
        setSelectedFile(null);
        const fileInput = document.getElementById('projectFileUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        toast({ title: "تم رفع الملف بنجاح", description: \`\${selectedFile.name} جاهز الآن.\` });
    } else {
        toast({ title: "خطأ", description: "فشل رفع الملف.", variant: "destructive" });
    }
    setIsUploadingFile(false);
  };

  const handleSendEngineerMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!engineerMessage.trim() || !project || !project.engineer) {
        toast({ title: "خطأ", description: "يرجى كتابة رسالة.", variant: "destructive" });
        return;
    }
    console.log("Sending message to engineer:", project.engineer, "Message:", engineerMessage);
    toast({ title: "تم إرسال الرسالة", description: \`تم إرسال رسالتك إلى المهندس \${project.engineer} (محاكاة).\` });
    setEngineerMessage('');
    setIsContactEngineerModalOpen(false);
};

  const projectStartDate = project?.timelineTasks && project.timelineTasks.length > 0 ? new Date(Math.min(...project.timelineTasks.map(task => new Date(task.startDate).getTime()))) : new Date();
  const projectEndDate = project?.timelineTasks && project.timelineTasks.length > 0 ? new Date(Math.max(...project.timelineTasks.map(task => new Date(task.endDate).getTime()))) : new Date();
  let totalProjectDurationDays = project?.timelineTasks && project.timelineTasks.length > 0 ? Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 30;
  if (totalProjectDurationDays <= 0) totalProjectDurationDays = 30;

  const getTaskPositionAndWidth = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const offsetDays = Math.ceil((taskStart.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const leftPercentage = (offsetDays / totalProjectDurationDays) * 100;
    const widthPercentage = (durationDays / totalProjectDurationDays) * 100;
    return {
      left: \`\${Math.max(0, Math.min(100 - widthPercentage, leftPercentage))}%\`,
      width: \`\${Math.max(2, Math.min(100, widthPercentage))}%\`,
    };
  };

  if (!project) {
    return (
      <AppLayout>
        <div className="container mx-auto py-10 px-4 text-center">
          <Alert variant="destructive">
            <FileText className="h-5 w-5" />
            <AlertTitle>المشروع غير موجود أو غير مصرح لك بعرضه</AlertTitle>
            <AlertDescription>لم يتم العثور على تفاصيل المشروع المطلوب أو لا تملك الصلاحية اللازمة.</AlertDescription>
          </Alert>
           <Button asChild className="mt-6 bg-app-gold hover:bg-yellow-600 text-primary-foreground">
             <Link href="/my-projects">العودة إلى قائمة المشاريع</Link>
           </Button>
        </div>
      </AppLayout>
    );
  }

  const simulateAction = (actionName: string) => {
    toast({ title: "محاكاة إجراء", description: \`تم تنفيذ "\${actionName}" (محاكاة).\` });
  };

  return (
    <AppLayout>
      <Dialog open={isContactEngineerModalOpen} onOpenChange={setIsContactEngineerModalOpen}>
        <div className="container mx-auto py-8 px-4 text-right">
          <Card className="bg-white/95 shadow-xl mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="text-3xl font-bold text-app-red">{project.name}</CardTitle>
                      <CardDescription className="text-gray-700 mt-1">{project.description}</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {!isOwnerView && (
                        <Button variant="outline" size="sm" className="border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("تعديل بيانات المشروع")}>
                            <FileEdit size={18} className="ms-1.5" /> تعديل بيانات المشروع
                        </Button>
                    )}
                    {isOwnerView && project.engineer && (
                        <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-500/10" onClick={() => setIsContactEngineerModalOpen(true)}>
                            <Mail size={18} className="ms-1.5" /> مراسلة المهندس
                        </Button>
                    )}
                  </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
                  <span><strong>الموقع:</strong> {project.location || 'غير محدد'}</span>
                  <span><strong>المهندس المسؤول:</strong> {project.engineer || 'غير محدد'}</span>
                  <span><strong>العميل:</strong> {project.clientName || 'غير محدد'}</span>
                  <span><strong>الميزانية التقديرية:</strong> {project.budget ? \`\${project.budget.toLocaleString()} شيكل\` : 'غير محدد'}</span>
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
                <p className={\`text-sm font-semibold mt-1.5 \${
                      project.status === 'مكتمل' ? 'text-green-600' :
                      project.status === 'قيد التنفيذ' ? 'text-yellow-600' :
                      'text-blue-600' 
                    }\`}>
                      الحالة الحالية: {project.status}
                </p>
              </div>
            </CardContent>
          </Card>

          {!isOwnerView && (
            <Card className="bg-white/95 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                  <Wrench size={28}/> أدوات إدارة المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("فتح نموذج إدخال تفاصيل العناصر الإنشائية")}>
                    <ListChecks size={18} className="ms-2"/> إدخال تفاصيل العناصر
                </Button>
                 <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("فتح نموذج حساب الباطون لهذا المشروع")}>
                    <HardHat size={18} className="ms-2"/> حساب كميات الباطون
                </Button>
                <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("فتح نموذج حساب الحديد لهذا المشروع")}>
                    <BarChart3 size={18} className="ms-2"/> حساب كميات الحديد
                </Button>
                 <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10">
                        <UploadCloud size={18} className="ms-2"/> رفع صور/فيديو للمشروع
                    </Button>
                  </DialogTrigger>
                  <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("إدارة مراحل المشروع (تحديد/تعديل)")}>
                      <GanttChartSquare size={18} className="ms-2"/> تحديد/إدارة المراحل
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("تصدير تقارير الكميات والتقدم")}>
                      <Download size={18} className="ms-2"/> توليد/تصدير التقارير
                  </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/95 shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                    <GanttChartSquare size={28} /> الجدول الزمني للمشروع
                  </CardTitle>
                  {!isOwnerView && (
                    <Button variant="outline" size="sm" className="border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("تعديل مراحل الإنشاء في الجدول")}>
                        <CalendarDays size={18} className="ms-1.5" /> تعديل مهام الجدول
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {project.timelineTasks && project.timelineTasks.length > 0 ? (
                    <div className="space-y-5 relative overflow-x-auto p-1 pb-4 min-h-[200px] bg-gray-50 rounded-lg shadow-inner">
                       <div className="absolute inset-0 grid grid-cols-6 gap-0 pointer-events-none opacity-20">
                          {Array.from({ length: 6 }).map((_, i) => (
                          <div key={\`month-grid-detail-\${i}\`} className={cn("border-r border-gray-300", i === 5 && "border-r-0")}>
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
                                !isOwnerView && "cursor-pointer group-hover:ring-2 group-hover:ring-app-gold",
                                task.color
                              )}
                              style={{ left, width, right: 'auto' }}
                              title={\`\${task.name} (من \${task.startDate} إلى \${task.endDate}) - \${task.status} \${task.progress !== undefined ? task.progress + '%' : ''}\`}
                              onClick={!isOwnerView ? () => simulateAction(\`تعديل مهمة: \${task.name}\`) : undefined}
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

              <Card className="bg-white/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                    <ImageIcon size={28} /> صور تقدم المشروع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.photos && project.photos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {project.photos.map((photo) => (
                        <div key={photo.id} className="group relative rounded-lg overflow-hidden shadow-md">
                          <Image 
                              src={photo.src} alt={photo.alt} width={600} height={400} 
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
                    <p className="text-gray-500">لا توجد صور مرفوعة لهذا المشروع حالياً.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {!isOwnerView && (
                <>
                  <Card className="bg-white/95 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                        <Percent size={28} /> تحديث تقدم الإنشاء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProgressSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="progressPercentage" className="font-semibold text-gray-700">نسبة التقدم الإجمالية (%):</Label>
                          <Input 
                            id="progressPercentage" type="number" min="0" max="100"
                            value={progressUpdate.percentage}
                            onChange={(e) => setProgressUpdate({...progressUpdate, percentage: e.target.value})}
                            className="mt-1 bg-white focus:border-app-gold" placeholder="مثال: 75"
                          />
                        </div>
                        <div>
                          <Label htmlFor="progressNotes" className="font-semibold text-gray-700">ملاحظات التقدم:</Label>
                          <Textarea 
                            id="progressNotes" rows={3}
                            value={progressUpdate.notes}
                            onChange={(e) => setProgressUpdate({...progressUpdate, notes: e.target.value})}
                            className="mt-1 bg-white focus:border-app-gold" placeholder="أضف ملاحظات حول التقدم المحرز..."
                          />
                        </div>
                        <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-semibold">
                          <Send size={18} className="ms-2"/> إرسال تحديث التقدم
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                
                  <Card className="bg-white/95 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                        <Users size={28} /> ربط المالك بالمشروع
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLinkOwnerSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="ownerEmail" className="font-semibold text-gray-700">البريد الإلكتروني للمالك:</Label>
                          <Input 
                            id="ownerEmail" type="email"
                            value={linkedOwnerEmailInput}
                            onChange={(e) => setLinkedOwnerEmailInput(e.target.value)}
                            className="mt-1 bg-white focus:border-app-gold" placeholder="owner@example.com"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold">
                          <Link2 size={18} className="ms-2"/> {project.linkedOwnerEmail ? "تحديث ربط المالك" : "ربط المالك"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </>
              )}
              
              <Card className="bg-white/95 shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                    <FileText size={28} /> تقارير الكميات
                  </CardTitle>
                   {!isOwnerView && (
                     <Button variant="outline" size="sm" className="border-app-gold text-app-gold hover:bg-app-gold/10" onClick={() => simulateAction("تصدير تقرير الكميات PDF/Excel")}>
                        <Download size={18} className="ms-1.5" /> تصدير
                    </Button>
                   )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {project.quantitySummary || "لا توجد تقارير كميات ملخصة متاحة حالياً."}
                  </p>
                   {!isOwnerView && (
                    <div className="mt-4 text-sm text-gray-500 italic">
                      (سيتم إضافة خيارات لتخصيص عرض التقرير هنا لاحقًا)
                    </div>
                   )}
                </CardContent>
              </Card>
              
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
                        id="newComment" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        placeholder="اكتب تعليقك هنا..." rows={3} className="mt-1 bg-white focus:border-app-gold"
                      />
                    </div>
                    <Button type="submit" className="bg-app-red hover:bg-red-700 text-white font-semibold" disabled={isSubmittingComment || !newComment.trim()}>
                      {isSubmittingComment ? <LoaderIcon className="ms-2 h-5 w-5 animate-spin" /> : <Send size={18} className="ms-2"/>}
                      إرسال
                    </Button>
                  </form>
                  <Separator className="my-6" />
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {project.comments && project.comments.length > 0 ? (
                      project.comments.slice().reverse().map((comment) => (
                        <div key={comment.id} className={cn(
                          "p-3 rounded-lg border shadow-sm",
                          comment.user === "المالك" ? "bg-yellow-50 border-app-gold" : "bg-gray-50 border-gray-200"
                        )}>
                          <div className="flex items-start gap-3">
                             {comment.avatar && <Image src={comment.avatar} alt={comment.user} width={40} height={40} className="rounded-full" data-ai-hint={comment.dataAiHintAvatar || "avatar person"} />}
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

        {/* File Upload Dialog */}
        <DialogContent className="sm:max-w-[425px] bg-white/95 custom-dialog-overlay">
          <DialogHeader>
            <DialogTitle className="text-app-red text-right">رفع ملف جديد</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-right">
              <div>
                  <Label htmlFor="projectFileUpload" className="block mb-1.5 font-semibold text-gray-700">اختر ملفًا:</Label>
                  <Input id="projectFileUpload" type="file" onChange={handleFileChange} className="bg-white focus:border-app-gold"/>
                  {selectedFile && <p className="text-xs text-gray-500 mt-1">الملف المختار: {selectedFile.name}</p>}
              </div>
              <Button onClick={handleFileUpload} disabled={isUploadingFile || !selectedFile || isOwnerView} className="w-full bg-app-red hover:bg-red-700">
                  {isUploadingFile ? <LoaderIcon className="ms-2 h-5 w-5 animate-spin"/> : <UploadCloud size={18} className="ms-2"/>}
                  {isUploadingFile ? 'جاري الرفع...' : 'رفع الملف'}
              </Button>
              {isOwnerView && <p className="text-xs text-red-500 text-center">المالك لا يمكنه رفع الملفات.</p>}
          </div>
          <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 left-3 text-gray-500 hover:text-destructive-foreground hover:bg-destructive"><X size={20}/></Button>
          </DialogClose>
        </DialogContent>
        
        {/* Contact Engineer Dialog */}
        <DialogContent className="sm:max-w-md bg-white/95 custom-dialog-overlay">
            <DialogHeader className="text-right">
                <DialogTitle className="text-app-red text-xl font-bold">
                    مراسلة المهندس: {project?.engineer || "غير محدد"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                    أرسل رسالة مباشرة إلى المهندس المسؤول عن هذا المشروع.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendEngineerMessage} className="space-y-4 py-2 text-right">
                <div>
                    <Label htmlFor="engineerMessage" className="font-semibold text-gray-700">نص الرسالة:</Label>
                    <Textarea
                        id="engineerMessage"
                        value={engineerMessage}
                        onChange={(e) => setEngineerMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        rows={5}
                        className="mt-1 bg-white focus:border-app-gold"
                    />
                </div>
                <div className="flex justify-start gap-2">
                    <Button type="submit" className="bg-app-red hover:bg-red-700 text-white">
                        <Send size={18} className="ms-2"/> إرسال الرسالة
                    </Button>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => setIsContactEngineerModalOpen(false)}
                        className="bg-gray-200 text-gray-800 hover:bg-destructive hover:text-destructive-foreground"
                    >
                        إلغاء
                    </Button>
                </div>
            </form>
             <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 left-3 text-gray-500 hover:text-destructive-foreground hover:bg-destructive"><X size={20}/></Button>
          </DialogClose>
        </DialogContent>

      </Dialog>
    </AppLayout>
  );
}
