"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ClipboardCheck, PenSquare, Info } from 'lucide-react';

export default function ValidateDataPage() {
  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
        <CardHeader className="text-center">
          <ClipboardCheck className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">التحقق من صحة البيانات</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            أدوات للتحقق من دقة وصحة البيانات المدخلة للعناصر الإنشائية لضمان حسابات صحيحة.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-5 px-6">
          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-md text-blue-800">
            <h3 className="font-bold">عملية تلقائية</h3>
            <p className="mt-1">
              يتم التحقق من صحة البيانات الأساسية (مثل الأبعاد غير الصفرية) تلقائيًا عند إدخالها في صفحة "إدخال تفاصيل العناصر".
            </p>
          </div>
          <p className="text-gray-800 text-lg">
            للبدء، انتقل إلى صفحة إدخال التفاصيل وأدخل أبعاد العنصر. سيقوم النظام بالتحقق الأولي من البيانات.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
            <Link href="/engineer/structural-elements/input-details">
              <PenSquare className="ms-2 h-5 w-5" />
              الانتقال إلى إدخال التفاصيل
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
