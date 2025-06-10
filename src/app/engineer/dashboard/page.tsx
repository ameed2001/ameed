
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    PlusSquare, 
    Briefcase, 
    Calculator, 
    FileText, 
    FolderArchive, 
    Cpu, 
    HardHat, 
    Settings2, 
    BarChart3, 
    ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mapping Engineer Use Cases to Dashboard Actions
const engineerActions = [
    {
        title: "إنشاء مشروع بناء جديد",
        href: "/engineer/create-project",
        icon: PlusSquare,
        description: "بدء وتحديد مشروع بناء جديد، إدخال التفاصيل الأساسية، وتحديد مراحله الأولية لتمكين المتابعة الفعالة.",
        iconBgClass: "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400",
        bottomBarClass: "bg-gradient-to-r from-green-400 to-green-600",
        buttonClassName: "bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white dark:bg-green-700/30 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white",
        buttonText: "إنشاء مشروع",
        dataAiHint: "create new project"
    },
    {
        title: "إدارة المشاريع الإنشائية",
        href: "/my-projects",
        icon: Briefcase,
        description: "عرض وتعديل مشاريعك. يشمل: إدارة التفاصيل (العناصر، المراحل)، تحديث التقدم (ملاحظات، صور/فيديو)، ربط المالك، عرض وتخصيص التقارير، تصدير البيانات، وأرشفة المشاريع.",
        iconBgClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        bottomBarClass: "bg-gradient-to-r from-blue-400 to-blue-600",
        buttonClassName: "bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-500 hover:text-white dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white",
        buttonText: "إدارة المشاريع",
        dataAiHint: "manage projects"
    },
    {
        title: "حساب كميات الباطون",
        href: "/concrete-estimator", 
        icon: Calculator, 
        description: "أداة لحساب كميات الباطون المطلوبة لمختلف العناصر الإنشائية (مثل الأعمدة، الجوائز، الأساسات) بناءً على الأبعاد والتفاصيل المدخلة.",
        iconBgClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
        bottomBarClass: "bg-gradient-to-r from-amber-400 to-amber-600",
        buttonClassName: "bg-amber-50 text-amber-700 border-2 border-amber-500 hover:bg-amber-500 hover:text-white dark:bg-amber-700/30 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-amber-600 dark:hover:text-white",
        buttonText: "حساب الباطون",
        dataAiHint: "concrete estimator tool"
    },
    {
        title: "حساب كميات الحديد",
        href: "/steel-calculator", 
        icon: BarChart3, 
        description: "أداة لتقدير كميات حديد التسليح اللازمة لمشروعك بناءً على تفاصيل العناصر الإنشائية ونسب الحديد المحددة.",
        iconBgClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
        bottomBarClass: "bg-gradient-to-r from-purple-400 to-purple-600",
        buttonClassName: "bg-purple-50 text-purple-700 border-2 border-purple-500 hover:bg-purple-500 hover:text-white dark:bg-purple-700/30 dark:text-purple-300 dark:border-purple-600 dark:hover:bg-purple-600 dark:hover:text-white",
        buttonText: "حساب الحديد",
        dataAiHint: "steel calculator tool"
    },
    {
        title: "إدارة المستندات",
        href: "/documents",
        icon: FolderArchive,
        description: "إدارة المستندات الهندسية الهامة مثل المخططات، العقود، والفواتير، ورفعها لتكون متاحة ضمن تفاصيل المشروع.",
        iconBgClass: "bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400",
        bottomBarClass: "bg-gradient-to-r from-teal-400 to-teal-600",
        buttonClassName: "bg-teal-50 text-teal-700 border-2 border-teal-500 hover:bg-teal-500 hover:text-white dark:bg-teal-700/30 dark:text-teal-300 dark:border-teal-600 dark:hover:bg-teal-600 dark:hover:text-white",
        buttonText: "إدارة المستندات",
        dataAiHint: "document management"
    },
    {
        title: "إنشاء تقرير بالذكاء الاصطناعي",
        href: "/ai-report-generator",
        icon: Cpu,
        description: "استخدام الذكاء الاصطناعي لتجميع وتحليل بيانات المشروع وتوليد تقارير مفصلة للكميات والتقدم، وتصديرها بصيغ PDF أو Excel.",
        iconBgClass: "bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400",
        bottomBarClass: "bg-gradient-to-r from-red-400 to-red-600",
        buttonClassName: "bg-red-50 text-red-700 border-2 border-red-500 hover:bg-red-500 hover:text-white dark:bg-red-700/30 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-600 dark:hover:text-white",
        buttonText: "إنشاء تقرير ذكي",
        dataAiHint: "ai report generation"
    }
];

export default function EngineerDashboardPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4 text-right">
        <Card className="bg-white/95 dark:bg-card shadow-xl border border-gray-200/80 dark:border-gray-700/60 mb-10">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-3">
                    <HardHat className="h-12 w-12 text-app-gold" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
                    لوحة تحكم المهندس
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
                      <span>{action.buttonText}</span>
                      <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                  </div>
                  <div className={cn("h-1.5", action.bottomBarClass)}></div>
                </div>
              );
            })}
          </div>
      </div>
    </AppLayout>
  );
}

    