"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Camera, FolderKanban } from 'lucide-react';

export default function UploadMediaPage() {
  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
        <CardHeader className="text-center">
          <Camera className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">رفع صور وفيديوهات</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            واجهة لرفع وإدارة الصور والفيديوهات التي توثق التقدم في موقع العمل.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-5 px-6">
          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-md text-blue-800">
            <h3 className="font-bold">ميزة متكاملة مع كل مشروع</h3>
            <p className="mt-1">
              يتم رفع الصور والفيديوهات لكل مشروع بشكل مستقل من خلال صفحة "تفاصيل المشروع" الخاصة به.
            </p>
          </div>
          <p className="text-gray-800 text-lg">
            اذهب إلى قائمة المشاريع لاختيار مشروع والبدء في رفع الوسائط.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
            <Link href="/engineer/projects">
              <FolderKanban className="ms-2 h-5 w-5" />
              الانتقال إلى قائمة المشاريع
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
