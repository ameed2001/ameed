
"use client";

import { 
    FolderKanban, 
    Calculator, 
    MessageSquare, 
    TrendingUp, 
    BarChart3, 
    Camera, 
    ArrowLeft,
    FileText,
    Clock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const dashboardCategories = [
    {
      title: "مشاريعي",
      description: "عرض، وتتبع جميع مشاريعك الإنشائية المرتبطة بحسابك.",
      icon: FolderKanban,
      href: "/owner/projects",
      iconColorClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
    },
    {
      title: "تقارير الكميات",
      description: "الوصول إلى التقارير الملخصة للكميات والأعمال المنجزة.",
      icon: FileText,
      href: "/owner/projects", 
      iconColorClass: "text-green-500",
      buttonClass: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
    },
    {
      title: "التقدم البصري",
      description: "معاينة الصور والفيديوهات المرفوعة من قبل المهندس لمتابعة العمل.",
      icon: Camera,
      href: "/owner/projects", 
      iconColorClass: "text-purple-500",
      buttonClass: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
    },
    {
      title: "الجداول الزمنية",
      description: "عرض الجداول الزمنية للأنشطة المخطط لها والمواعيد النهائية للمشروع.",
      icon: Clock,
      href: "/owner/project-timeline",
      iconColorClass: "text-cyan-500",
      buttonClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    },
    {
      title: "التعليقات والاستفسارات",
      description: "التواصل مع المهندس وتقديم ملاحظاتك أو طرح أسئلتك.",
      icon: MessageSquare,
      href: "/owner/projects", 
      iconColorClass: "text-orange-500",
      buttonClass: "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
    },
    {
      title: "حاسبة التكاليف",
      description: "أداة تقديرية بسيطة لحساب تكاليف المواد الأولية.",
      icon: Calculator,
      href: "/owner/cost-estimator",
      iconColorClass: "text-red-500",
      buttonClass: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white",
    },
];

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl border-gray-200/80">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800">
            لوحة تحكم المالك
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            وصول سريع إلى الأقسام والوظائف الأساسية لمتابعة مشاريعك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title} 
                  className="card-hover-effect flex flex-col h-full text-right p-6 shadow-lg rounded-lg border border-gray-200/80"
                >
                  <div className="flex items-center justify-start gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                    <Icon className={cn("h-8 w-8", category.iconColorClass)} />
                  </div>
                  <p className="text-gray-600 text-sm mb-5 flex-grow">{category.description}</p>
                  <Button asChild variant="outline" className={cn("mt-auto w-full flex justify-between items-center font-semibold", category.buttonClass)}>
                    <Link href={category.href}>
                      <span>الانتقال إلى القسم</span>
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
