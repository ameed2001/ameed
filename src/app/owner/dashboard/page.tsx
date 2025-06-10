
"use client";

import Link from "next/link";
import {
    Briefcase,
    ShieldCheck,
    BarChart3,
    MessageSquare,
    GanttChartSquare,
    Image as ImageIcon,
    ArrowLeft,
    Calendar,
    Zap as ZapIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// Action cards data is kept for potential restoration, but not rendered for now.
const actionCardsData = [
    {
      title: "عرض مشاريعي",
      href: "/my-projects",
      icon: Briefcase,
      description: "تصفح جميع مشاريعك الإنشائية وتابع تفاصيلها.",
      dataAiHint: "my projects list",
      buttonText: "استعراض المشاريع",
      iconBgClass: "bg-amber-50 text-amber-600",
      bottomBarClass: "bg-gradient-to-r from-amber-400 to-amber-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-amber-50 text-amber-700 border-2 border-amber-500 hover:bg-amber-500 hover:text-white",
    },
    {
      title: "متابعة تقدم المشاريع",
      href: "/my-projects",
      icon: BarChart3,
      description: "راقب التقدم العام للمشاريع، وشاهد الإنجازات والمراحل المكتملة.",
      dataAiHint: "project progress tracking",
      buttonText: "عرض التقارير",
      iconBgClass: "bg-blue-50 text-blue-600",
      bottomBarClass: "bg-gradient-to-r from-blue-400 to-blue-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-500 hover:text-white",
    },
    {
      title: "تقارير الكميات الملخصة",
      href: "/my-projects",
      icon: ShieldCheck,
      description: "اطلع على ملخصات كميات المواد المستخدمة في كل مشروع.",
      dataAiHint: "quantity reports summary",
      buttonText: "عرض الكميات",
      iconBgClass: "bg-green-50 text-green-600",
      bottomBarClass: "bg-gradient-to-r from-green-400 to-green-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white",
    },
    {
      title: "صور وفيديوهات التقدم",
      href: "/my-projects",
      icon: ImageIcon,
      description: "شاهد التحديثات المرئية التي يرفعها المهندس لكل مشروع.",
      dataAiHint: "progress photos videos",
      buttonText: "معرض الوسائط",
      iconBgClass: "bg-purple-50 text-purple-600",
      bottomBarClass: "bg-gradient-to-r from-purple-400 to-purple-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-purple-50 text-purple-700 border-2 border-purple-500 hover:bg-purple-500 hover:text-white",
    },
     {
      title: "التعليقات والاستفسارات",
      href: "/my-projects",
      icon: MessageSquare,
      description: "تواصل مع فريق المشروع وأرسل استفساراتك وتعليقاتك.",
      dataAiHint: "project comments inquiries",
      buttonText: "الرسائل",
      iconBgClass: "bg-red-50 text-red-600",
      bottomBarClass: "bg-gradient-to-r from-red-400 to-red-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-red-50 text-red-700 border-2 border-red-500 hover:bg-red-500 hover:text-white",
    },
    {
      title: "الجداول الزمنية للمشاريع",
      href: "/my-projects",
      icon: GanttChartSquare,
      description: "اطلع على الخطط الزمنية والمراحل المنجزة والمقبلة لكل مشروع.",
      dataAiHint: "project timelines",
      buttonText: "عرض الجداول",
      iconBgClass: "bg-teal-50 text-teal-600",
      bottomBarClass: "bg-gradient-to-r from-teal-400 to-teal-600",
      buttonClassName: "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center bg-teal-50 text-teal-700 border-2 border-teal-500 hover:bg-teal-500 hover:text-white",
    },
  ];

export default function OwnerDashboardPage() {
  return (
    <div className="text-right">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10 border border-gray-100 relative">
          <div className="absolute top-0 right-0 w-full h-1 gold-gradient"></div>
          <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-app-red mb-2">أهلاً بك في لوحة التحكم</h2>
              <p className="text-gray-600 mb-4">من هنا يمكنك متابعة جميع مشاريعك والتفاعل معها بسهولة.</p>
              <p className="text-gray-700 leading-relaxed">
                  استخدم الشريط الجانبي للتنقل بين الأقسام المختلفة مثل عرض مشاريعك، تعديل ملفك الشخصي، أو الحصول على المساعدة.
              </p>
          </div>
          <div className="p-4 bg-gray-50 flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                  <Calendar className="text-amber-500 w-4 h-4" />
                  <span>آخر دخول: اليوم</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>جميع الأنظمة تعمل</span>
              </div>
          </div>
      </div>

      {/* Quick Action Tools Section - Temporarily Removed */}
      <h2 className="text-2xl font-bold text-app-red mb-6 flex items-center">
          <ZapIcon className="ml-2 text-amber-500 w-6 h-6" />
          أدوات المتابعة السريعة (مُعطل مؤقتاً للتشخيص)
      </h2>
       <p className="text-gray-500 mb-10">
        تم تعطيل هذا القسم مؤقتاً للمساعدة في تشخيص مشكلة أداء.
      </p>

      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {actionCardsData.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
                key={card.title}
                className="bg-white rounded-xl shadow-md overflow-hidden card-hover-effect border border-gray-200 flex flex-col h-full"
                data-ai-hint={card.dataAiHint}
            >
                <div className="p-6 pb-4 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${card.iconBgClass}`}>
                            <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                </div>
                <div className="px-6 pb-6">
                    <Link
                        href={card.href}
                        className={card.buttonClassName}
                    >
                        <span>{card.buttonText}</span>
                        <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                </div>
                <div className={`h-1 ${card.bottomBarClass}`}></div>
            </div>
          );
        })}
      </div>
      */}
    </div>
  );
}
