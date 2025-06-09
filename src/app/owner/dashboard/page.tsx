
"use client";

// Simplified dashboard page content, layout is handled by OwnerAppLayout
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, ShieldCheck, BarChart3, MessageSquare, GanttChartSquare, Image as ImageIcon, ArrowLeft } from "lucide-react";

export default function OwnerDashboardPage() {
  const dashboardCards = [
    { 
      title: "عرض مشاريعي", 
      href: "/my-projects", 
      icon: Briefcase, 
      description: "تصفح جميع مشاريعك الإنشائية وتابع تفاصيلها.",
      dataAiHint: "my projects list"
    },
    { 
      title: "متابعة تقدم المشاريع", 
      href: "/my-projects", // Should ideally link to a specific view or filter
      icon: BarChart3, 
      description: "راقب التقدم العام للمشاريع، وشاهد الإنجازات والمراحل المكتملة.",
      dataAiHint: "project progress tracking"
    },
    { 
      title: "تقارير الكميات الملخصة", 
      href: "/my-projects", // Link to projects, specific reports inside project detail
      icon: ShieldCheck, 
      description: "اطلع على ملخصات كميات المواد المستخدمة في كل مشروع.",
      dataAiHint: "quantity reports summary"
    },
    { 
      title: "صور وفيديوهات التقدم", 
      href: "/my-projects", // Link to projects, photos inside project detail
      icon: ImageIcon, 
      description: "شاهد التحديثات المرئية التي يرفعها المهندس لكل مشروع.",
      dataAiHint: "progress photos videos"
    },
     { 
      title: "التعليقات والاستفسارات", 
      href: "/my-projects", // Link to projects, comments inside project detail
      icon: MessageSquare, 
      description: "تواصل مع فريق المشروع وأرسل استفساراتك وتعليقاتك.",
      dataAiHint: "project comments inquiries"
    },
    { 
      title: "الجداول الزمنية للمشاريع", 
      href: "/my-projects", // Link to projects, timeline inside project detail
      icon: GanttChartSquare, 
      description: "اطلع على الخطط الزمنية والمراحل المنجزة والمقبلة لكل مشروع.",
      dataAiHint: "project timelines"
    },
  ];

  return (
    // The container, py-10, px-4, and text-right are now handled by OwnerAppLayout's main section
    <div className="text-right">
      <h1 className="text-3xl font-bold mb-8 text-app-red">لوحة تحكم المالك</h1>
      
      <Card className="bg-white/95 shadow-lg mb-10 border border-gray-200/80 rounded-xl">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-app-red">أهلاً بك</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            من هنا يمكنك متابعة جميع مشاريعك والتفاعل معها بسهولة.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-gray-700 leading-relaxed">
            استخدم الشريط الجانبي للتنقل بين الأقسام المختلفة مثل عرض مشاريعك، تعديل ملفك الشخصي، أو الحصول على المساعدة.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-app-red mb-6">أدوات المتابعة السريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Card 
            key={card.title} 
            className="bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-1.5 transform transition-all duration-300 ease-in-out flex flex-col text-right group overflow-hidden border border-gray-200 hover:border-app-gold/60 min-h-[270px] md:min-h-[290px]"
            data-ai-hint={card.dataAiHint}
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-end gap-3 mb-1">
                <div className="p-2.5 bg-app-gold/10 rounded-full group-hover:bg-app-gold/20 transition-colors duration-300">
                  <card.icon className="h-6 w-6 text-app-gold transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-lg font-bold text-app-red group-hover:text-yellow-600 transition-colors duration-300">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex-grow">
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">{card.description}</p>
            </CardContent>
            <CardFooter className="p-5 pt-4 mt-auto bg-gray-50 group-hover:bg-gray-100/70 transition-colors duration-300">
              <Button asChild className="w-full bg-app-gold hover:bg-yellow-500 text-gray-900 font-semibold shadow-md hover:shadow-lg group-hover:scale-105 transform transition-transform duration-300 py-2.5 text-base">
                <Link href={card.href}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {/* Changed icon to ArrowLeft */}
                  استعراض
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

