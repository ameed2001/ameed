
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Briefcase, Settings, ScrollText, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const overviewCards = [
    { 
      title: "إدارة المستخدمين", 
      href: "/admin/users", 
      icon: Users, 
      description: "عرض وتعديل وحذف المستخدمين.",
      iconBgClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
      bottomBarClass: "bg-gradient-to-r from-blue-400 to-blue-600",
      buttonClassName: "bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-500 hover:text-white dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white",
      buttonText: "إدارة المستخدمين",
      dataAiHint: "manage users"
    },
    { 
      title: "إدارة المشاريع", 
      href: "/admin/projects", 
      icon: Briefcase, 
      description: "متابعة وحذف المشاريع القائمة.",
      iconBgClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
      bottomBarClass: "bg-gradient-to-r from-amber-400 to-amber-600",
      buttonClassName: "bg-amber-50 text-amber-700 border-2 border-amber-500 hover:bg-amber-500 hover:text-white dark:bg-amber-700/30 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-amber-600 dark:hover:text-white",
      buttonText: "إدارة المشاريع",
      dataAiHint: "manage projects"
    },
    { 
      title: "إعدادات النظام", 
      href: "/admin/settings", 
      icon: Settings, 
      description: "تكوين الإعدادات العامة للنظام.",
      iconBgClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
      bottomBarClass: "bg-gradient-to-r from-purple-400 to-purple-600",
      buttonClassName: "bg-purple-50 text-purple-700 border-2 border-purple-500 hover:bg-purple-500 hover:text-white dark:bg-purple-700/30 dark:text-purple-300 dark:border-purple-600 dark:hover:bg-purple-600 dark:hover:text-white",
      buttonText: "تعديل الإعدادات",
      dataAiHint: "system settings"
    },
    { 
      title: "سجلات النظام", 
      href: "/admin/logs", 
      icon: ScrollText, 
      description: "مراجعة أنشطة النظام والأحداث.",
      iconBgClass: "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400",
      bottomBarClass: "bg-gradient-to-r from-green-400 to-green-600",
      buttonClassName: "bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white dark:bg-green-700/30 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white",
      buttonText: "عرض السجلات",
      dataAiHint: "system logs"
    },
  ];

  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 dark:bg-card shadow-xl border border-gray-200/80 dark:border-gray-700/60">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">لوحة تحكم المسؤول الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-10">
            مرحباً بك في لوحة تحكم المسؤول. من هنا يمكنك إدارة المستخدمين، المشاريع، إعدادات النظام، ومراجعة السجلات.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {overviewCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white dark:bg-card rounded-xl shadow-md overflow-hidden card-hover-effect border border-gray-200 dark:border-gray-700 flex flex-col h-full"
                  data-ai-hint={card.dataAiHint}
                >
                  <div className="p-6 pb-4 flex-grow">
                    <div className="flex items-start justify-between mb-3 text-right">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{card.title}</h3>
                      <div className={cn("p-3 rounded-full", card.iconBgClass)}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 text-right">{card.description}</p>
                  </div>
                  <div className="px-6 pb-6 pt-0 mt-auto">
                    <Link
                      href={card.href}
                      className={cn(
                        "w-full block py-3 px-4 text-center rounded-lg font-medium transition-colors flex items-center justify-center",
                        card.buttonClassName
                      )}
                    >
                      <span>{card.buttonText}</span>
                      <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                  </div>
                  <div className={cn("h-1.5", card.bottomBarClass)}></div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
