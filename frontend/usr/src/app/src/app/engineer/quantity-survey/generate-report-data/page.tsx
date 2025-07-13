"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Calculator } from 'lucide-react';

export default function GenerateReportDataPage() {
  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">توليد بيانات التقرير</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            نظام لتجميع ومعالجة البيانات من مصادر مختلفة لتوليد تقارير كميات شاملة.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-5 px-6">
          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-md text-blue-800">
            <h3 className="font-bold">عملية تلقائية</h3>
            <p className="mt-1">
              يتم توليد بيانات التقارير بشكل تلقائي بناءً على المعلومات التي تدخلها في صفحة "حساب كميات المواد". لا حاجة لإجراء يدوي هنا.
            </p>
          </div>
          <p className="text-gray-800 text-lg">
            ابدأ بإضافة عناصر مشروعك في صفحة الحسابات لترى النتائج.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
            <Link href="/engineer/quantity-survey/calculate-materials">
              <Calculator className="ms-2 h-5 w-5" />
              الانتقال إلى حساب الكميات
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
