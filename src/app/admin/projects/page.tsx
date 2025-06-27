
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Search, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  type Project,
  type ProjectStatusType,
  getProjects,
  deleteProject,
  updateProject
} from '@/lib/db';

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // On component mount, get the user ID from localStorage
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };


  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      (project.name.toLowerCase().includes(searchTerm) ||
      (project.engineer?.toLowerCase().includes(searchTerm)) ||
      (project.clientName?.toLowerCase().includes(searchTerm))
 ) &&
      (statusFilter === 'all' || project.status === statusFilter));
  }, [projects, searchTerm, statusFilter]);
  
  async function loadProjects() {
    if (!currentUserId) {
      // Don't attempt to load if there's no user ID
      // Optionally show a toast or message
      return;
    }
    const result = await getProjects(currentUserId);
    if (result.success && result.projects) {
      setProjects(result.projects);
    } else {
      toast({ title: "خطأ", description: result.message || "فشل تحميل المشاريع.", variant: "destructive" });
    }
  }

  // Reload projects when currentUserId is set
  useEffect(() => {
    loadProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  async function handleDeleteProject(projectId: number) {
    const result = await deleteProject(projectId.toString());
    if (result.success) {
      toast({ title: "نجاح", description: result.message });
      loadProjects();
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  }

  async function handleUpdateProjectStatus(projectId: number, newStatus: ProjectStatusType) {
    const result = await updateProject(projectId.toString(), { status: newStatus });
    if (result.success) {
      toast({ title: "نجاح", description: "تم تحديث حالة المشروع بنجاح", variant: "default" });
      loadProjects();
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  }

  return (
    <Card className="bg-white/95 shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-app-red">إدارة المشاريع</CardTitle>
        <CardDescription className="text-gray-600">متابعة المشاريع الإنشائية في النظام وإدارتها.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-gray-50 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Input
              type="search"
              placeholder="ابحث باسم المشروع، المهندس، أو المالك..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10 bg-white focus:border-app-gold"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
            <SelectTrigger className="w-full sm:w-auto bg-white focus:border-app-gold text-right">
              <SelectValue placeholder="تصفية حسب الحالة..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="مكتمل">مكتمل</SelectItem>
              <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
              <SelectItem value="مخطط له">مخطط له</SelectItem>
              <SelectItem value="مؤرشف">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-right font-semibold text-gray-700">اسم المشروع</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">المهندس المسؤول</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">المالك</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-app-red hover:underline">
                    <Link href={`/engineer/projects/${project.id}`}>{project.name}</Link>
                  </TableCell>
                  <TableCell>{project.engineer || 'غير محدد'}</TableCell>
                  <TableCell>{project.clientName || 'غير محدد'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                      project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-700' :
                      project.status === 'مخطط له' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700' 
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-1 space-x-reverse">
                    <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Link href={`/engineer/projects/${project.id}`}>
                        <Eye className="h-5 w-5" /><span className="sr-only">عرض التفاصيل</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                          <Trash2 className="h-5 w-5" /><span className="sr-only">حذف</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl" className="sm:max-w-md">
                        <AlertDialogHeader className="text-center items-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <Trash2 className="h-8 w-8 text-red-600" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold text-gray-800">تأكيد الحذف</AlertDialogTitle>
                        </AlertDialogHeader>

                        <AlertDialogDescription asChild>
                            <div className="text-center text-base text-gray-600 space-y-4">
                                <p>هل أنت متأكد أنك تريد حذف هذا الإجراء؟</p>
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
                                    سيتم حذف المشروع: <span className="font-bold">"{project.name}"</span>
                                </div>
                                <p className="text-xs text-gray-500">لا يمكن التراجع عن هذا الإجراء.</p>
                            </div>
                        </AlertDialogDescription>

                        <AlertDialogFooter className="flex-col sm:flex-row sm:justify-center gap-4 pt-4">
                            <AlertDialogAction onClick={() => handleDeleteProject(project.id)} className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 font-bold py-2.5 px-6 rounded-lg">
                                حذف نهائي
                            </AlertDialogAction>
                            <AlertDialogCancel className="w-full sm:w-auto mt-0 bg-gray-100 hover:bg-gray-200 text-gray-800 border-none font-bold py-2.5 px-6 rounded-lg">إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    لا توجد مشاريع تطابق معايير البحث أو التصفية.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredProjects.length > 0 && (
          <p className="text-xs text-gray-500 text-center">يتم عرض {filteredProjects.length} من إجمالي {projects.length} مشروع.</p>
        )}
      </CardContent>
    </Card>
  );
}
