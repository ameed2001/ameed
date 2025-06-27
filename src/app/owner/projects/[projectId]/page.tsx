
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CalendarDays, Image as ImageIcon, FileText, MessageSquare, Mail, Edit, Trash2,
  HardHat, Percent, BarChart3, GanttChartSquare, Loader2 as LoaderIcon, Send, MapPin, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { findProjectById, updateProject as dbUpdateProject, type Project, type ProjectComment, type ProjectPhoto } from '@/lib/db';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ShekelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 18V6"/>
    <path d="M18 6v12"/>
    <path d="M14 6h-4a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h4"/>
    <path d="M10 18h4a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-4"/>
  </svg>
);

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

  const [editingComment, setEditingComment] = useState<{ id: string; text: string } | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const refreshProjectFromDb = async () => { 
    if (!userEmail && !isClient) return;
    const currentProject = await findProjectById(projectId); 
    if (currentProject && currentProject.linkedOwnerEmail !== userEmail) {
      setProject(null);
      toast({ title: "غير مصرح به", description: "ليس لديك صلاحية لعرض هذا المشروع.", variant: "destructive" });
      router.push('/owner/dashboard');
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

  const handleUpdateComment = async () => {
    if (!editingComment || !project) return;
    const updatedComments = project.comments.map(c =>
      c.id === editingComment.id ? { ...c, text: editingComment.text, date: new Date().toISOString() } : c
    );
    const result = await dbUpdateProject(project.id.toString(), { comments: updatedComments });
    if (result.success) {
      toast({ title: "تم تحديث التعليق" });
      setEditingComment(null);
      await refreshProjectFromDb();
    } else {
      toast({ title: "فشل تحديث التعليق", variant: "destructive" });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!project) return;
    setIsDeletingComment(true);
    const updatedComments = project.comments.filter(c => c.id !== commentId);
    const result = await dbUpdateProject(project.id.toString(), { comments: updatedComments });
    if (result.success) {
      toast({ title: "تم حذف التعليق" });
      await refreshProjectFromDb();
    } else {
      toast({ title: "فشل حذف التعليق", variant: "destructive" });
    }
    setIsDeletingComment(false);
  };

  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
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
        {/* بطاقة معلومات المشروع الرئيسية */}
        <Card className="bg-gradient-to-r from-white to-gray-50 shadow-lg border-0 mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-app-red">{project.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-1">{project.description}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setIsContactEngineerModalOpen(true)}
              >
                <Mail size={18} className="ms-1.5" /> مراسلة المهندس
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                <MapPin className="h-6 w-6 text-app-red flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">الموقع</p>
                  <p className="font-medium text-gray-800">{project.location || 'غير محدد'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                <HardHat className="h-6 w-6 text-app-red flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">المهندس المسؤول</p>
                  <p className="font-medium text-gray-800">{project.engineer || 'غير محدد'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                <ShekelIcon className="h-6 w-6 text-app-red flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">الميزانية</p>
                  <p className="font-medium text-gray-800">{project.budget ? `${project.budget.toLocaleString()} شيكل` : 'غير محدد'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                <CalendarDays className="h-6 w-6 text-app-red flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">الفترة الزمنية</p>
                  <p className="font-medium text-gray-800">
                    {project.startDate} - {project.endDate}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <Percent size={18} /> التقدم العام للمشروع
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={project.overallProgress} className="h-3 flex-grow" />
                  <span className="font-bold text-app-gold text-lg min-w-[3rem]">{project.overallProgress}%</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شبكة المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* القسم الرئيسي (2/3 الشاشة) */}
          <div className="lg:col-span-2 space-y-6">
            {/* معرض الصور */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <ImageIcon size={20} className="text-app-red" /> معرض المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.photos && project.photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.photos.map((photo) => (
                      <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-gray-200">
                        <Image 
                          src={photo.src} 
                          alt={photo.alt} 
                          width={600} 
                          height={400} 
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {photo.caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm">{photo.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد صور متاحة</h3>
                    <p className="mt-1 text-sm text-gray-500">سيتم إضافة صور المشروع قريباً</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* التعليقات والاستفسارات */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <MessageSquare size={20} className="text-app-red" /> الاستفسارات والتعليقات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="newComment" className="block text-sm font-medium text-gray-700 mb-1">
                      أضف تعليقاً أو استفساراً
                    </Label>
                    <Textarea
                      id="newComment" 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك هنا..." 
                      rows={3} 
                      className="focus:ring-2 focus:ring-app-gold focus:border-app-gold"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-app-red hover:bg-red-700"
                    disabled={isSubmittingComment || !newComment.trim()}
                  >
                    {isSubmittingComment ? (
                      <>
                        <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        إرسال التعليق
                      </>
                    )}
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {project.comments && project.comments.length > 0 ? (
                    project.comments.slice().reverse().map((comment) => (
                      <div key={comment.id} className={cn(
                        "p-3 rounded-lg border",
                        comment.user === "المالك" 
                          ? "bg-yellow-50 border-yellow-200" 
                          : "bg-gray-50 border-gray-200"
                      )}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {comment.avatar ? (
                              <Image 
                                src={comment.avatar} 
                                alt={comment.user} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                                {comment.user.substring(0,1)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {comment.user}
                                </p>
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(comment.date).toLocaleString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {comment.user === 'المالك' && (
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:bg-blue-100" onClick={() => setEditingComment({ id: comment.id, text: comment.text })}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-100">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent dir="rtl" className="sm:max-w-md">
                                      <AlertDialogHeader className="text-right">
                                        <AlertDialogTitle className="text-xl font-bold">تأكيد الحذف</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground pt-2">
                                          هل أنت متأكد أنك تريد حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="flex-row justify-start gap-3 pt-4">
                                        <AlertDialogAction onClick={() => handleDeleteComment(comment.id)} className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700" disabled={isDeletingComment}>
                                          {isDeletingComment ? <LoaderIcon className="animate-spin" /> : "حذف"}
                                        </AlertDialogAction>
                                        <AlertDialogCancel className="w-full sm:w-auto mt-0">إلغاء</AlertDialogCancel>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                            
                            {editingComment?.id === comment.id ? (
                              <div className="mt-2 space-y-2">
                                <Textarea
                                  value={editingComment.text}
                                  onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                                  className="bg-white"
                                  rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button size="sm" variant="ghost" onClick={() => setEditingComment(null)}>إلغاء</Button>
                                  <Button size="sm" onClick={handleUpdateComment}>حفظ</Button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-700 break-words">
                                {comment.text}
                              </p>
                            )}

                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">لا توجد تعليقات حتى الآن</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الشريط الجانبي (1/3 الشاشة) */}
          <div className="space-y-6">
            {/* الجدول الزمني */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <GanttChartSquare size={20} className="text-app-red" /> الجدول الزمني للمشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    تتبع مراحل المشروع الرئيسية وتقدمها الزمني
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/owner/projects/${projectId}/timeline`}>
                      عرض التفاصيل الكاملة
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* تقارير الكميات */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <BarChart3 size={20} className="text-app-red" /> تقارير الكميات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {project.quantitySummary || "سيتم إضافة تقارير الكميات قريباً"}
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/owner/projects/${projectId}/reports`}>
                      عرض التقارير الكاملة
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* نافذة مراسلة المهندس */}
      <DialogContent className="sm:max-w-md bg-white rounded-lg">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-app-red">
            <Mail className="inline mr-2 h-5 w-5" />
            مراسلة المهندس
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            أرسل رسالة مباشرة إلى المهندس المسؤول عن المشروع
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSendEngineerMessage} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="engineerMessage" className="block text-sm font-medium text-gray-700 mb-1">
              نص الرسالة
            </Label>
            <Textarea
              id="engineerMessage"
              value={engineerMessage}
              onChange={(e) => setEngineerMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={5}
              className="focus:ring-2 focus:ring-app-gold focus:border-app-gold"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsContactEngineerModalOpen(false)}
              className="text-gray-700"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="bg-app-red hover:bg-red-700"
            >
              إرسال الرسالة
            </Button>
          </div>
        </form>
        
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4">
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
