typescriptreact
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gauge, Briefcase, FileText, Camera, Clock, MessageCircle } from 'lucide-react'; // Example icons

// Placeholder data types
interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
}

export default function OwnerDashboardPage() {
  // --- Placeholder Data ---
  const totalProjects = 15; // Example data
  const activeProjects = 8; // Example data
  const overallProgress = 75; // Example data
  const recentProjects: Project[] = [ // Example data
    { id: 'proj-001', name: 'مشروع البناء أ', status: 'نشط', progress: 80 },
    { id: 'proj-002', name: 'تجديد المكتب ب', status: 'نشط', progress: 40 },
    { id: 'proj-003', name: 'مبنى سكني ج', status: 'مكتمل', progress: 100 },
  ];
  // --- End Placeholder Data ---

  // --- Placeholder Logic ---
  // useEffect(() => {
  //   // Fetch actual dashboard data here
  // }, []);
  // --- End Placeholder Logic ---

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-app-red mb-6 text-right">لوحة تحكم المالك</h1>

      {/* نظرة عامة سريعة */}
      <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
             نظرة عامة سريعة <Gauge className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
          <CardDescription className="text-gray-600 text-right">ملخص سريع لمشاريعك.</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-medium">إجمالي المشاريع:</p>
              <p className="text-2xl font-bold text-app-red">{totalProjects}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">المشاريع النشطة:</p>
              <p className="text-2xl font-bold text-green-600">{activeProjects}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">نسبة الإنجاز الإجمالية:</p>
              <Progress value={overallProgress} className="w-full h-3 mt-2" />
              <p className="text-xl font-bold text-blue-600 mt-1">{overallProgress}%</p>
            </div>
          </div>
           {/* Add more quick overview metrics here */}
        </CardContent>
      </Card>

      {/* مشاريعي */}
      <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
            مشاريعي <Briefcase className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
           <CardDescription className="text-gray-600 text-right">قائمة بأحدث مشاريعك.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Placeholder for a table or list of recent projects */}
            <Table dir="rtl">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right">اسم المشروع</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">نسبة الإنجاز</TableHead>
                        <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentProjects.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                             <TableCell>{project.status}</TableCell>
                             <TableCell>
                                <div className="flex items-center">
                                     <Progress value={project.progress} className="w-[60%] h-2 mr-2" />
                                     <span>{project.progress}%</span>
                                </div>
                             </TableCell>
                            <TableCell className="text-center">
                                <Link href={`/owner-account/projects/${project.id}`} passHref>
                                    <Button variant="link" className="text-blue-600 hover:underline">عرض التفاصيل</Button>
                                </Link>
                                {/* Add other quick action buttons if needed */}
                            </TableCell>
                        </TableRow>
                    ))}
                    {recentProjects.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500">لا توجد مشاريع لعرضها حالياً.</TableCell>
                         </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="text-center mt-4">
                 <Link href="/owner-account/projects" passHref>
                    <Button variant="outline" className="text-app-red border-app-red hover:bg-app-red hover:text-white">عرض جميع المشاريع</Button>
                </Link>
            </div>
        </CardContent>
      </Card>

      {/* تقارير الكميات */}
       <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
            تقارير الكميات <FileText className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
           <CardDescription className="text-gray-600 text-right">الوصول السريع لتقارير كميات المواد والأعمال.</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          {/* Placeholder for a list of recent reports or a link to the reports page */}
          <p className="text-gray-700 mb-3">سيتم عرض أحدث تقارير الكميات هنا أو رابط للصفحة الكاملة.</p>
           <Link href="/owner-account/quantity-reports" passHref> {/* Assuming a reports page */}
               <Button variant="outline" className="text-app-red border-app-red hover:bg-app-red hover:text-white">عرض تقارير الكميات</Button>
           </Link>
           {/* Add components to display a summary or table of recent reports */}
        </CardContent>
      </Card>

      {/* تقدم المشروع بصريًا */}
       <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
            تقدم المشروع بصريًا <Camera className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
           <CardDescription className="text-gray-600 text-right">معاينة أحدث الصور والفيديوهات من مشاريعك.</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          {/* Placeholder for a gallery or links to media sections per project */}
           <p className="text-gray-700 mb-3">سيتم عرض معاينة لأحدث الصور والفيديوهات هنا.</p>
           {/* Add components to display a grid of recent media or a link to visual progress section */}
           {/* You might link to project-specific media pages like /owner-account/projects/[projectId]/media */}
        </CardContent>
      </Card>

      {/* الجدول الزمني */}
       <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
            الجدول الزمني <Clock className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
           <CardDescription className="text-gray-600 text-right">متابعة المواعيد والمعالم الهامة لمشاريعك.</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          {/* Placeholder for a timeline view or links to project timelines */}
           <p className="text-gray-700 mb-3">سيتم عرض ملخص للجدول الزمني للمشاريع هنا.</p>
            {/* You might link to project-specific timeline pages like /owner-account/projects/[projectId]/timeline */}
        </CardContent>
      </Card>

      {/* التعليقات والاستفسارات */}
       <Card className="mb-6 bg-white/95 shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-end">
            التعليقات والاستفسارات <MessageCircle className="ml-3 h-6 w-6 text-app-gold" />
          </CardTitle>
           <CardDescription className="text-gray-600 text-right">إرسال ملاحظاتك أو استفساراتك.</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          {/* Placeholder for a form to submit comments or a link to the comments section */}
           <p className="text-gray-700 mb-3">نموذج لإرسال تعليق أو استفسار.</p>
           {/* Add a simple form or a link to a dedicated comments page/modal */}
           {/* You might link to project-specific comments pages like /owner-account/projects/[projectId]/comments */}
        </CardContent>
      </Card>

       {/* Placeholder for the Sidebar - typically managed by a Layout component */}
       {/* The actual Sidebar component would likely wrap the content of this page */}
       <div className="mt-8 p-4 border-t border-gray-200 text-center text-gray-500">
         {/* Sidebar Placeholder */}
         <p>الشريط الجانبي سيظهر هنا (عادةً يتم إدارته بواسطة مكون التخطيط الرئيسي).</p>
       </div>

    </div>
  );
}