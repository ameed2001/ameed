
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
      <Card className="bg-white/95 shadow-xl border border-gray-200/80">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">لوحة تحكم المشرف الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 text-center mb-10">
            مرحباً بك في لوحة تحكم المشرف. من هنا يمكنك إدارة المستخدمين، المشاريع، إعدادات النظام، ومراجعة السجلات.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {overviewCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card 
                  key={card.title} 
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col border border-gray-200/60"
                  data-ai-hint={card.title.toLowerCase().replace(/\s+/g, '-')}
                >
                  <CardHeader className="p-5 sm:p-6 flex flex-row-reverse items-center justify-start gap-4"> {/* RTL: Icon on right, title to its left */}
                    <div className="flex-shrink-0 p-2 bg-app-gold/10 rounded-full">
                        <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-app-gold" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-app-red text-right">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 sm:px-6 pb-4 pt-0 text-right flex-grow">
                    <p className="text-sm sm:text-base text-gray-600">{card.description}</p>
                  </CardContent>
                  <CardFooter className="p-5 sm:p-6 pt-2 bg-gray-50/50 border-t border-gray-100">
                    <Button asChild className="w-full bg-app-gold hover:bg-yellow-500 text-primary-foreground font-semibold py-2.5 text-base sm:text-lg">
                      <Link href={card.href}>الانتقال إلى {card.title}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
