// src/app/engineer/page.tsx
"use client";

import { HardHat, PlusSquare, Briefcase, Calculator, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const engineerActions = [
  {
    title: "إنشاء مشروع إنشاء جديد",
    href: "/engineer/create-project",
    icon: PlusSquare,
    description: "ابدأ مشروعًا جديدًا بإدخال الاسم والموقع والنطاق.",
    iconBgClass: "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400",
    bottomBarClass: "bg-gradient-to-r from-green-400 to-green-600",
    buttonClassName: "bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white dark:bg-green-700/30 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white",
    buttonText: "إنشاء مشروع",
    dataAiHint: "create new project"
  },
  {
    title: "إدارة المشاريع",
    href: "/engineer/projects",
    icon: Briefcase,
    description: "عرض وتتبع جميع المشاريع النشطة والمؤرشفة.",
    iconBgClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    bottomBarClass: "bg-gradient-to-r from-blue-400 to-blue-600",
    buttonClassName: "bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-500 hover:text-white dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white",
    buttonText: "إدارة المشاريع",
    dataAiHint: "manage projects"
  },
  {
    title: "تحديث تقدم المشروع",
    href: "/engineer/update-progress",
    icon: Calculator,
    description: "سجل المراحل المكتملة، وأضف ملاحظات وصور.",
    iconBgClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
    bottomBarClass: "bg-gradient-to-r from-purple-400 to-purple-600",
    buttonClassName: "bg-purple-50 text-purple-700 border-2 border-purple-500 hover:bg-purple-500 hover:text-white dark:bg-purple-700/30 dark:text-purple-300 dark:border-purple-600 dark:hover:bg-purple-600 dark:hover:text-white",
    buttonText: "تحديث التقدم",
    dataAiHint: "update progress"
  }
];

export default function EngineerDashboardPage() {
  return (
    <>
      <Card className="bg-white/95 dark:bg-card shadow-xl border border-gray-200/80 dark:border-gray-700/60 mb-10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-3">
            <HardHat className="h-12 w-12 text-app-gold" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
            مرحبًا بالمهندس 👷‍♂️
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            مرحباً بك في لوحة التحكم الخاصة بالمهندسين. من هنا يمكنك إدارة مشاريعك وأدواتك الهندسية.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {engineerActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.title}
              className="bg-white dark:bg-card rounded-xl shadow-md overflow-hidden card-hover-effect border border-gray-200 dark:border-gray-700 flex flex-col h-full"
              data-ai-hint={action.dataAiHint}
            >
              <div className="p-6 pb-4 flex-grow">
                <div className="flex items-start justify-between mb-3 text-right">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{action.title}</h3>
                  <div className={cn("p-3 rounded-full", action.iconBgClass)}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 text-right">{action.description}</p>
              </div>
              <div className="px-6 pb-6 pt-0 mt-auto">
                <Link
                  href={action.href}
                  className={cn(
                    "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center",
                    action.buttonClassName
                  )}
                >
                  {action.buttonText}
                  <ArrowLeft className="mr-2 w-5 h-5" />
                </Link>
              </div>
              <div className={cn("h-1.5", action.bottomBarClass)}></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
