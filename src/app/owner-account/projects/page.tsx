typescriptreact
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, FileText, Image } from 'lucide-react';
import { getProjects, Project } from "@/lib/db"; // Import getProjects and Project type
import { useAuth } from '@/context/AuthContext'; // Assuming you have an AuthContext to get user info
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

// Define a type for a project (using the type from db.ts)
interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Completed' | 'Archived'; // Replace with your actual status types
  completionPercentage: number;
}

export default function OwnerProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Active', 'Completed', 'Archived'
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assuming useAuth provides the logged-in user object with email
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !user.email) {
        setError("User not logged in or email not available.");
        setIsLoading(false);
        return;
      }
      try {
        const result = await getProjects(user.email); // Fetch projects for the logged-in owner's email
        if (result.success && result.projects) {
          // Need to map Project from db.ts to the local interface if different,
          // but for now assuming they are compatible.
          // The completionPercentage is not in the db.ts Project interface,
          // you'll need to calculate or fetch this data.
          // For now, adding a placeholder value.
          const projectsWithCompletion = result.projects.map(p => ({
             ...p,
             completionPercentage: Math.floor(Math.random() * 101) // Placeholder, replace with actual logic
          }));
          setProjects(projectsWithCompletion);
        } else {
          setError(result.message || "Failed to fetch projects.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]); // Re-fetch projects when the user changes

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