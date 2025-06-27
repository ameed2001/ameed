
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
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
  UploadCloud, Download, Link2, HardHat, Users, Percent, FileEdit, BarChart3, GanttChartSquare, Settings2, Loader2 as LoaderIcon, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { findProjectById, updateProject as dbUpdateProject, type Project, type ProjectComment, type ProjectPhoto, type TimelineTask } from '@/lib/db';
import Link from 'next/link';

export default function OwnerProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isContactEngineerModalOpen, setIsContactEngineerModalOpen] = useState(false);
  const [engineerMessage, setEngineerMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const isOwnerView = true;

  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const refreshProjectFromDb = async () => { 
    if (!userEmail) return;
    const currentProject = await findProjectById(projectId); 
     if (currentProject && currentProject.linkedOwnerEmail !== userEmail) {
        setProject(null);
        toast({ title: "غير مصرح به", description: "ليس لديك صلاحية لعرض هذا المشروع.", variant: "destructive" });
        router.push('/owner/dashboard'); // Redirect if not authorized
        return;
    }
    setProject(currentProject ? {...currentProject} : null); 
  };

  useEffect(() => {
    if(isClient && userEmail) {
        refreshProjectFromDb();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userEmail, isClient]); 

  const handleCommentSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (!newComment.trim() || !project) return;
    setIsSubmittingComment(true);
    
    const commentToAdd: ProjectComment = {
      id: crypto.randomUUID(), 
      user: "المالك", 
      text: newComment, 
      date: new Date().toISOString(), 
      avatar: "https://placehold.co/40x40.png?text=OW",
      dataAiHintAvatar: "owner avatar"
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
  
  const handleSendEngineerMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!engineerMessage.trim() || !project || !project.engineer) {
        toast({ title: "خطأ", description: "يرجى كتابة رسالة.", variant: "destructive" });
        return;
    }
    console.log("Sending message to engineer:", project.engineer, "Message:", engineerMessage);
    toast({ title: "تم إرسال الرسالة", description: `تم إرسال رسالتك إلى المهندس ${project.engineer} (محاكاة).` });
    setEngineerMessage('');
    setIsContactEngineerModalOpen(false);
  };

  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Alert variant="destructive">
          <FileText className="h-5 w-5" />
          <AlertTitle>المشروع غير موجود أو غير مصرح لك بعرضه</AlertTitle>
          <AlertDescription>لم يتم العثور على تفاصيل المشروع المطلوب أو لا تملك الصلاحية اللازمة.</AlertDescription>
        </Alert>
         <Button asChild className="mt-6 bg-app-gold hover:bg-yellow-600 text-primary-foreground">
           <Link href="/owner/projects">العودة إلى قائمة المشاريع</Link>
         </Button>
      </div>
    );
  }

  return (
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
                    {isOwnerView && project.engineer && (
                        <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-100 hover:text-black" onClick={() => setIsContactEngineerModalOpen(true)}>
                            <Mail size={18} className="ms-1.5" /> مراسلة المهندس
                        </Button>
                    )}
                  </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
                  <span><strong>الموقع:</strong> {project.location || 'غير محدد'}</span>
                  <span><strong>المهندس المسؤول:</strong> {project.engineer || 'غير محدد'}</span>
                  <span><strong>العميل:</strong> {project.clientName || 'غير محدد'}</span>
                  <span><strong>الميزانية التقديرية:</strong> {project.budget ? `${project.budget.toLocaleString()} شيكل` : 'غير محدد'}</span>
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
              <Card className="bg-white/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                    <GanttChartSquare size={28} /> الجدول الزمني للمشروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    عرض الجدول الزمني المفصل للمشروع، بما في ذلك المراحل والمهام الرئيسية.
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    <Link href={`/owner/projects/${projectId}/timeline`}>
                      عرض الجدول الزمني التفصيلي
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-app-red flex items-center gap-2">
                    <FileText size={28} /> تقارير الكميات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {project.quantitySummary || "لا توجد تقارير كميات ملخصة متاحة حالياً."}
                  </p>
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
  );
}
