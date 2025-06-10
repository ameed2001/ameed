typescriptreact
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, FileText, Image } from 'lucide-react';

// Define a type for a project (replace with your actual project type)
interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Completed' | 'Archived'; // Replace with your actual status types
  completionPercentage: number;
}

// Placeholder data (replace with actual data fetching logic)
const placeholderProjects: Project[] = [
  { id: 'proj-001', name: 'مشروع الفيلا A', location: 'الرياض', status: 'Active', completionPercentage: 75 },
  { id: 'proj-002', name: 'مشروع المبنى التجاري B', location: 'جدة', status: 'Completed', completionPercentage: 100 },
  { id: 'proj-003', name: 'مشروع الشقق السكنية C', location: 'الدمام', status: 'Active', completionPercentage: 30 },
  { id: 'proj-004', name: 'مشروع المستودع D', location: 'الرياض', status: 'Archived', completionPercentage: 100 },
];

export default function OwnerProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Active', 'Completed', 'Archived'

  // TODO: Implement actual data fetching for owner's projects
  const projects = useMemo(() => {
    // Replace with fetched projects
    return placeholderProjects;
  }, []); // Add dependencies when real fetching is implemented

  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || project.status === statusFilter)
    );
  }, [projects, searchTerm, statusFilter]);

  return (
    <Card className="bg-white/95 shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-app-red">مشاريعي</CardTitle>
        <CardDescription className="text-gray-600">عرض، بحث، وتصفية مشاريع البناء الخاصة بك.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border rounded-lg bg-gray-50">
          <div className="relative flex-grow w-full sm:w-auto">
            <Input
              type="search"
              placeholder="ابحث باسم المشروع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <SelectItem value="Active">نشط</SelectItem>
              <SelectItem value="Completed">مكتمل</SelectItem>
              <SelectItem value="Archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
          {/* TODO: Add any other filters if needed */}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-right font-semibold text-gray-700">اسم المشروع</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الموقع</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">نسبة الإنجاز</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 'Active' ? 'نشط' : project.status === 'Completed' ? 'مكتمل' : 'مؤرشف'}
                    </span>
                  </TableCell>
                  <TableCell>{project.completionPercentage}%</TableCell>
                  <TableCell className="text-center space-x-1 space-x-reverse">
                    {/* TODO: Link to actual project detail page */}
                    <Link href={`/owner-account/projects/${project.id}`} passHref>
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" title="عرض التفاصيل">
                        <Eye className="h-5 w-5" /><span className="sr-only">عرض التفاصيل</span>
                      </Button>
                    </Link>
                    {/* TODO: Link to actual project report page/section */}
                     <Link href={`/owner-account/projects/${project.id}/reports`} passHref>
                       <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-100" title="عرض التقرير">
                        <FileText className="h-5 w-5" /><span className="sr-only">عرض التقرير</span>
                      </Button>
                    </Link>
                     {/* TODO: Link to actual project media page/section */}
                     <Link href={`/owner-account/projects/${project.id}/media`} passHref>
                       <Button variant="ghost" size="icon" className="text-purple-600 hover:text-purple-800 hover:bg-purple-100" title="عرض الوسائط">
                        <Image className="h-5 w-5" /><span className="sr-only">عرض الوسائط</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    لا يوجد مشاريع تطابق معايير البحث أو التصفية.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* TODO: Add pagination or other controls if needed */}
      </CardContent>
    </Card>
  );
}