
"use client";

// Removed AppLayout import as OwnerLayout will handle it
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, ShieldCheck, BarChart3, MessageSquare, GanttChartSquare, Image as ImageIcon } from "lucide-react";
// Removed useRouter, useToast, useEffect, useState for logout as sidebar will handle it

export default function OwnerDashboardPage() {
  // Logout and ownerName logic is now in OwnerSidebar.tsx

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
      href: "/my-projects", 
      icon: BarChart3, 
      description: "راقب التقدم العام للمشاريع، وشاهد الإنجازات والمراحل المكتملة.",
      dataAiHint: "project progress tracking"
    },
    { 
      title: "تقارير الكميات الملخصة", 
      href: "/my-projects", 
      icon: ShieldCheck, 
      description: "اطلع على ملخصات كميات المواد المستخدمة في كل مشروع.",
      dataAiHint: "quantity reports summary"
    },
    { 
      title: "صور وفيديوهات التقدم", 
      href: "/my-projects", 
      icon: ImageIcon, 
      description: "شاهد التحديثات المرئية التي يرفعها المهندس لكل مشروع.",
      dataAiHint: "progress photos videos"
    },
     { 
      title: "التعليقات والاستفسارات", 
      href: "/my-projects", 
      icon: MessageSquare, 
      description: "تواصل مع فريق المشروع وأرسل استفساراتك وتعليقاتك.",
      dataAiHint: "project comments inquiries"
    },
    { 
      title: "الجداول الزمنية للمشاريع", 
      href: "/my-projects", 
      icon: GanttChartSquare, 
      description: "اطلع على الخطط الزمنية والمراحل المنجزة والمقبلة لكل مشروع.",
      dataAiHint: "project timelines"
    },
  ];

  return (
    // The container, py-10, px-4, and text-right are now handled by OwnerAppLayout's main section
    <div>
      <Card className="bg-white/95 shadow-xl mb-10">
        <CardHeader className="text-center">
          {/* UserCircle and Welcome message now in OwnerSidebar */}
          <CardTitle className="text-3xl font-bold text-app-red">
            لوحة تحكم المالك
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            نظرة عامة على أدواتك لمتابعة مشاريعك.
          </CardDescription>
        </CardHeader>
        {/* Buttons for profile and logout are now in OwnerSidebar */}
      </Card>

      <h2 className="text-2xl font-bold text-app-red mb-8 text-center">أدوات المتابعة السريعة</h2>
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
