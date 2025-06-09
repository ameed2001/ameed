
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, UserCircle, Settings, LogOut, ShieldCheck, BarChart3, MessageSquare, GanttChartSquare, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [ownerName, setOwnerName] = useState("المالك"); // Default name

  useEffect(() => {
    // In a real app, fetch user data from auth context or localStorage
    // This is a simplified approach for the current setup
    if (typeof window !== 'undefined') {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
        setOwnerName(storedUserName);
        } else {
        // Fallback if no name is found, or direct to login
        console.warn("User name not found in localStorage for owner dashboard.");
        // Optionally, redirect to login if no user info is found
        // router.push('/login'); 
        }
    }
  }, [router]);


  const handleLogout = () => {
    // In a real app, this would call an actual logout API endpoint
    // and clear localStorage/session
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
    }
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
      variant: "default",
    });
    router.push('/login');
  };

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
      href: "/my-projects", // Users will select a project first
      icon: BarChart3, 
      description: "راقب التقدم العام للمشاريع، وشاهد الإنجازات والمراحل المكتملة.",
      dataAiHint: "project progress tracking"
    },
    { 
      title: "تقارير الكميات الملخصة", 
      href: "/my-projects", // Accessed via specific project
      icon: ShieldCheck, 
      description: "اطلع على ملخصات كميات المواد المستخدمة في كل مشروع.",
      dataAiHint: "quantity reports summary"
    },
    { 
      title: "صور وفيديوهات التقدم", 
      href: "/my-projects", // Accessed via specific project
      icon: ImageIcon, 
      description: "شاهد التحديثات المرئية التي يرفعها المهندس لكل مشروع.",
      dataAiHint: "progress photos videos"
    },
     { 
      title: "التعليقات والاستفسارات", 
      href: "/my-projects", // Accessed via specific project
      icon: MessageSquare, 
      description: "تواصل مع فريق المشروع وأرسل استفساراتك وتعليقاتك.",
      dataAiHint: "project comments inquiries"
    },
    { 
      title: "الجداول الزمنية للمشاريع", 
      href: "/my-projects", // Accessed via specific project
      icon: GanttChartSquare, 
      description: "اطلع على الخطط الزمنية والمراحل المنجزة والمقبلة لكل مشروع.",
      dataAiHint: "project timelines"
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="bg-white/95 shadow-xl mb-10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <UserCircle className="h-16 w-16 text-app-gold mb-3" />
              <CardTitle className="text-3xl font-bold text-app-red">
                مرحباً بك، {ownerName}!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                هذه هي لوحة التحكم الخاصة بك كمالك للمشاريع.
              </CardDescription>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="border-app-gold text-app-gold hover:bg-app-gold/10" asChild>
                    <Link href="/profile">
                        <Settings className="ms-2 h-5 w-5" />
                        الملف الشخصي
                    </Link>
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="ms-2 h-5 w-5" />
                    تسجيل الخروج
                </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-bold text-app-red mb-8 text-center">لوحة التحكم السريع</h2>
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
                  {card.title === "عرض مشاريعي" ? "الانتقال إلى المشاريع" : "استعراض المشاريع"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

