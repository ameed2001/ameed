
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

// Dummy data for stats bar - will be removed as it's moving to sidebar
// const stats = {
//   activeProjects: 4,
//   newMessages: 2,
//   overdueTasks: 1,
//   completedProjects: 7,
// };

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
    },
     { 
      title: "التعليقات والاستفسارات", 
      href: "/my-projects", 
      icon: MessageSquare, 
      description: "تواصل مع فريق المشروع وأرسل استفساراتك وتعليقاتك.",
      dataAiHint: "project comments inquiries",
      buttonText: "الرسائل",
      iconBgClass: "bg-red-50 text-red-600", // Matching app-red, assuming direct use
      bottomBarClass: "bg-gradient-to-r from-red-400 to-red-600",
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
      
      {/* Quick Action Tools Section */}
      <h2 className="text-2xl font-bold text-app-red mb-6 flex items-center">
          <ZapIcon className="ml-2 text-amber-500 w-6 h-6" />
          أدوات المتابعة السريعة
      </h2>
      
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
                    <Link href={card.href} className={`w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center 
                        ${card.iconBgClass.replace('text-', 'hover:bg-').replace('-50', '-100')} 
                        ${card.iconBgClass.replace('bg-', 'text-')}`}>
                        <span>{card.buttonText}</span>
                        <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                </div>
                <div className={`h-1 ${card.bottomBarClass}`}></div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar at Bottom - THIS SECTION IS REMOVED */}
      {/* 
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-20">
          <div className="container mx-auto px-4 py-3">
              <div className="flex justify-around items-center">
                  <div className="text-center">
                      <div className="text-gray-500 text-xs sm:text-sm">المشاريع النشطة</div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-600">{stats.activeProjects}</div>
                  </div>
                  <div className="text-center">
                      <div className="text-gray-500 text-xs sm:text-sm">الرسائل الجديدة</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.newMessages}</div>
                  </div>
                  <div className="text-center">
                      <div className="text-gray-500 text-xs sm:text-sm">المهام المتأخرة</div>
                      <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
                  </div>
                  <div className="text-center">
                      <div className="text-gray-500 text-xs sm:text-sm">المشاريع المكتملة</div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                  </div>
              </div>
          </div>
      </div> 
      */}
    </div>
  );
}
