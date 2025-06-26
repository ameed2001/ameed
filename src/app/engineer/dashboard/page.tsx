
"use client";

import { 
    FolderKanban, 
    Calculator, 
    Blocks, 
    TrendingUp, 
    BarChart3, 
    Users, 
    ArrowLeft 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const dashboardCategories = [
    {
      title: "إدارة المشاريع",
      description: "عرض، تعديل، وأرشفة جميع مشاريعك الإنشائية.",
      icon: FolderKanban,
      href: "/engineer/projects",
      iconColorClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
    },
    {
      title: "حساب الكميات",
      description: "أدوات لحساب كميات الحديد والباطون للمشروع.",
      icon: Calculator,
      href: "/engineer/cost-estimator",
      iconColorClass: "text-green-500",
      buttonClass: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
    },
    {
      title: "العناصر الإنشائية",
      description: "تحديد وتفصيل العناصر مثل الأعمدة والكمرات.",
      icon: Blocks,
      href: "#",
      iconColorClass: "text-purple-500",
      buttonClass: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
    },
    {
      title: "تقدم البناء",
      description: "تسجيل التقدم المحرز في مراحل المشروع المختلفة.",
      icon: TrendingUp,
      href: "/engineer/update-progress",
      iconColorClass: "text-orange-500",
      buttonClass: "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
    },
    {
      title: "التقارير",
      description: "توليد وعرض التقارير المخصصة للمشاريع والكميات.",
      icon: BarChart3,
      href: "#",
      iconColorClass: "text-cyan-500",
      buttonClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    },
    {
      title: "ربط المالكين",
      description: "ربط حسابات المالكين بمشاريعهم لمتابعة التقدم.",
      icon: Users,
      href: "/engineer/link-owner",
      iconColorClass: "text-red-500",
      buttonClass: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white",
    },
];

export default function EngineerDashboardPage() {
  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl border-gray-200/80">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800">
            أدوات ومهام رئيسية
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            وصول سريع إلى الأقسام والوظائف الأساسية.
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
