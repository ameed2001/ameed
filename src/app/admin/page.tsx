
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Briefcase, Settings, ScrollText } from "lucide-react";

export default function AdminDashboardPage() {
  const overviewCards = [
    { title: "إدارة المستخدمين", href: "/admin/users", icon: Users, description: "عرض وتعديل وحذف المستخدمين." },
    { title: "إدارة المشاريع", href: "/admin/projects", icon: Briefcase, description: "متابعة وحذف المشاريع القائمة." },
    { title: "إعدادات النظام", href: "/admin/settings", icon: Settings, description: "تكوين الإعدادات العامة للنظام." },
    { title: "سجلات النظام", href: "/admin/logs", icon: ScrollText, description: "مراجعة أنشطة النظام والأحداث." },
  ];

  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-app-red text-center">لوحة تحكم المشرف الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 text-center mb-8">
            مرحباً بك في لوحة تحكم المشرف. من هنا يمكنك إدارة المستخدمين، المشاريع، إعدادات النظام، ومراجعة السجلات.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {overviewCards.map((card) => (
              <Card key={card.title} className="bg-gray-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold text-app-red">{card.title}</CardTitle>
                  <card.icon className="h-6 w-6 text-app-gold" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  <Button asChild className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground">
                    <Link href={card.href}>الانتقال إلى {card.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
