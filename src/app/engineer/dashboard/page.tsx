
"use client";

import { HardHat, PlusSquare, FolderKanban, BarChartHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const engineerActions = [
  {
    title: "إنشاء مشروع إنشاء جديد",
    href: "/engineer/create-project",
    icon: PlusSquare,
    description: "ابدأ مشروعًا جديدًا بإدخال الاسم والموقع والنطاق.",
    iconBgClass: "bg-green-100 text-green-600",
    buttonClassName: "bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white dark:bg-green-700/30 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white",
    dataAiHint: "create new project"
  },
  {
    title: "إدارة المشاريع",
    href: "/engineer/projects",
    icon: FolderKanban,
    description: "عرض وتتبع جميع المشاريع النشطة والمؤرشفة.",
    iconBgClass: "bg-blue-100 text-blue-600",
    buttonClassName: "bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-500 hover:text-white dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white",
    dataAiHint: "manage projects"
  },
  {
    title: "تحديث تقدم المشروع",
    href: "/engineer/update-progress",
    icon: BarChartHorizontal,
    description: "سجل المراحل المكتملة، وأضف ملاحظات وصور.",
    iconBgClass: "bg-purple-100 text-purple-600",
    buttonClassName: "bg-purple-50 text-purple-700 border-2 border-purple-500 hover:bg-purple-500 hover:text-white dark:bg-purple-700/30 dark:text-purple-300 dark:border-purple-600 dark:hover:bg-purple-600 dark:hover:text-white",
    dataAiHint: "update progress"
  }
];

export default function EngineerDashboardPage() {
  return (
    <>
      <Card className="bg-white/95 shadow-xl border border-gray-200/80 mb-10 text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-3 gap-3">
             <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
                مرحباً بالمهندس 👷‍♂️
             </CardTitle>
             <HardHat className="h-12 w-12 text-app-gold" />
          </div>
          <CardDescription className="text-lg text-gray-700 mt-2">
            مرحباً بك في لوحة التحكم الخاصة بالمهندسين. من هنا يمكنك إدارة مشاريعك وأدواتك الهندسية.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {engineerActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={action.title}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover-effect border border-gray-200 flex flex-col h-full text-right"
              data-ai-hint={action.dataAiHint}
            >
              <CardHeader className="flex-grow">
                 <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{action.title}</h3>
                    <div className={cn("p-3 rounded-full shadow-inner", action.iconBgClass)}>
                        <IconComponent className="w-7 h-7" />
                    </div>
                </div>
                <p className="text-gray-600 text-base mb-5">{action.description}</p>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 mt-auto">
                <Button asChild className={cn("w-full py-3 text-base font-bold", action.buttonClassName)}>
                    <Link href={action.href}>
                       الذهاب إلى {action.title}
                    </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
