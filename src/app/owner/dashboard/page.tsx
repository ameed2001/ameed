'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function OwnerDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <Home className="mx-auto h-12 w-12 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">لوحة تحكم المالك</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            مرحباً بك في لوحة التحكم الخاصة بك. (محتوى تجريبي)
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            هنا ستجد نظرة عامة على مشاريعك، الإشعارات الهامة، والوصول السريع إلى أدوات إدارة المشروع.
          </p>
          <Button asChild className="bg-app-gold hover:bg-yellow-600 text-primary-foreground">
            <Link href="/my-projects">عرض مشاريعي</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
