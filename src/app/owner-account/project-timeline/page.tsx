
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const ProjectTimelinePage: React.FC = () => {
  return (
    <div className="space-y-8 text-right">
      <h1 className="text-3xl md:text-4xl font-bold text-app-red mb-6">الجدول الزمني للمشاريع</h1>
      <Card className="bg-white/95 shadow-lg">
        <CardHeader className="text-center">
          <Clock className="mx-auto h-12 w-12 text-app-gold mb-3" />
          <CardTitle className="text-2xl font-semibold text-gray-800">
            متابعة الجداول الزمنية لمشاريعك
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            لعرض الجدول الزمني التفصيلي لكل مشروع، يرجى الانتقال إلى قائمة مشاريعك واختيار المشروع المطلوب.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700 mb-6">
            تتوفر الجداول الزمنية التفصيلية، بما في ذلك المراحل والمهام، ضمن صفحة تفاصيل كل مشروع عند تحديد المشروع من قائمة "مشاريعي".
          </p>
          <Button asChild className="bg-app-red hover:bg-red-700 text-white font-semibold">
            <Link href="/owner/projects">
              الذهاب إلى قائمة المشاريع
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTimelinePage;
