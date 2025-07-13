"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Search, FileText, Download } from 'lucide-react';

// Mock data to simulate real reports
const mockReports = [
  { id: 1, name: "تقرير كميات الأساسات - فيلا الياسمين", project: "فيلا الياسمين", date: "2024-05-15", status: "مكتمل" },
  { id: 2, name: "تقرير حديد التسليح للطابق الأول - برج النخيل", project: "برج النخيل", date: "2024-05-20", status: "مكتمل" },
  { id: 3, name: "ملخص تكاليف مرحلة العظم - مشروع ABC", project: "مشروع ABC", date: "2024-06-01", status: "قيد المراجعة" },
  { id: 4, name: "تقرير كميات الباطون للجدران - فيلا الياسمين", project: "فيلا الياسمين", date: "2024-06-10", status: "مكتمل" },
];

export default function ViewReportsPage() {
  const [reports] = useState(mockReports);

  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-4xl mx-auto bg-white/95 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-app-red flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                عرض تقارير الكميات
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                تصفح، ابحث، وحمّل التقارير المفصلة لمشاريعك.
              </CardDescription>
            </div>
            <Button disabled>
              <Search className="ms-2 h-4 w-4" />
              بحث متقدم (قريباً)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  <TableHead className="text-right font-semibold">اسم التقرير</TableHead>
                  <TableHead className="text-right font-semibold">المشروع</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-center font-semibold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium text-app-red">{report.name}</TableCell>
                    <TableCell>{report.project}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'مكتمل' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="sm" disabled>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           <p className="text-xs text-gray-500 mt-4 text-center">
            ملاحظة: هذه قائمة توضيحية. سيتم عرض التقارير الحقيقية التي تقوم بإنشائها هنا.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
