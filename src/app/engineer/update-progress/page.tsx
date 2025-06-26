
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function UpdateProgressPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">تحديث تقدم المشروع</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            يتم تحديث التقدم من داخل صفحة تفاصيل المشروع.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">
            لتحديث تقدم الإنشاء، إضافة ملاحظات، أو رفع صور، يرجى أولاً الذهاب إلى قائمة مشاريعك واختيار المشروع الذي تود تحديثه.
          </p>
          <Button asChild className="bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg">
            <Link href="/engineer/projects">
              <ArrowLeft className="ms-2 h-5 w-5" />
              الانتقال إلى إدارة المشاريع
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
