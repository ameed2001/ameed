
"use client";

// Simplified dashboard page content, layout is handled by OwnerAppLayout
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, ShieldCheck, BarChart3, MessageSquare, GanttChartSquare, Image as ImageIcon } from "lucide-react";

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
      
      <Card className="bg-white/95 shadow-lg mb-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-app-red">أهلاً بك</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            من هنا يمكنك متابعة جميع مشاريعك والتفاعل معها بسهولة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            استخدم الشريط الجانبي للتنقل بين الأقسام المختلفة مثل عرض مشاريعك، تعديل ملفك الشخصي، أو الحصول على المساعدة.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-app-red mb-6">أدوات المتابعة السريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="bg-white hover:shadow-lg transition-shadow duration-300 text-right">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-app-red">{card.title}</CardTitle>
              <card.icon className="h-7 w-7 text-app-gold" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{card.description}</p>
              <Button asChild className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground">
                <Link href={card.href}>
                  {card.title.startsWith("عرض") ? "الانتقال إلى المشاريع" : "استعراض عبر المشاريع"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
