
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Search, Eye, Trash2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProjectStatus = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

interface AdminProject {
  id: string;
  name: string;
  engineer: string;
  owner: string;
  status: ProjectStatus;
}

const mockAdminProjects: AdminProject[] = [
  { id: '1', name: 'مشروع بناء فيلا النرجس', engineer: 'م. خالد الأحمدي', owner: 'السيد عبدالله الراجحي', status: 'قيد التنفيذ' },
  { id: '2', name: 'تطوير مجمع الياسمين السكني', engineer: 'م. سارة إبراهيم', owner: 'شركة التطوير العقاري', status: 'مكتمل' },
  { id: '3', name: 'إنشاء برج الأندلس التجاري', engineer: 'م. عمر حسن', owner: 'مستثمرون الخليج', status: 'مخطط له' },
  { id: '4', name: 'تجديد فندق الواحة', engineer: 'م. ليلى العلي', owner: 'مجموعة فنادق عالمية', status: 'مؤرشف' },
];


export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<AdminProject[]>(mockAdminProjects);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredProjects = projects.filter(project =>
    (project.name.toLowerCase().includes(searchTerm) ||
    project.engineer.toLowerCase().includes(searchTerm) ||
    project.owner.toLowerCase().includes(searchTerm)) &&
    (statusFilter === 'all' || project.status === statusFilter)
  );

  const handleDeleteProject = (projectId: string, projectName: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    toast({ title: "تم حذف المشروع", description: `تم حذف المشروع "${projectName}" بنجاح (محاكاة).`, variant: "destructive" });
  };

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
          {/* Potentially an "Add New Project" button here if admin can create them directly */}
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
                     <Link href={`/my-projects/${project.id}`}>{project.name}</Link>
                  </TableCell>
                  <TableCell>{project.engineer}</TableCell>
                  <TableCell>{project.owner}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                      project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-700' :
                      project.status === 'مخطط له' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700' // Archived
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-1 space-x-reverse">
                    <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Link href={`/my-projects/${project.id}`}>
                        <Eye className="h-5 w-5" /><span className="sr-only">عرض التفاصيل</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                          <Trash2 className="h-5 w-5" /><span className="sr-only">حذف</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد أنك تريد حذف المشروع "{project.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id, project.name)} className="bg-destructive hover:bg-destructive/90">
                            حذف
                          </AlertDialogAction>
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
