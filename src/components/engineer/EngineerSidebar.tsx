
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FolderKanban,
    PlusCircle,
    Blocks,
    ClipboardCheck,
    Calculator,
    BarChart3,
    Settings2,
    Download,
    FileText,
    TrendingUp,
    PenSquare,
    Camera,
    GanttChartSquare,
    Users,
    LogOut,
    Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const mainLinks = [
    { href: '/', label: 'الرئيسية للموقع', icon: Home },
    { href: '/engineer/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
];

const accordionItems = [
  {
    value: "projects",
    title: "المشاريع",
    icon: FolderKanban,
    color: "text-blue-500",
    links: [
      { href: "/engineer/create-project", label: "إنشاء مشروع جديد", icon: PlusCircle },
      { href: "/engineer/projects", label: "إدارة المشاريع", icon: FolderKanban },
    ],
  },
  {
    value: "structural-elements",
    title: "العناصر الإنشائية",
    icon: Blocks,
    color: "text-purple-500",
    links: [
      { href: "#", label: "إدخال تفاصيل العناصر", icon: PenSquare },
      { href: "#", label: "التحقق من صحة البيانات", icon: ClipboardCheck },
    ],
  },
  {
    value: "quantity-survey",
    title: "حساب الكميات",
    icon: Calculator,
    color: "text-green-500",
    links: [
      { href: "#", label: "حساب كميات المواد", icon: Calculator },
      { href: "#", label: "عرض تقارير الكميات", icon: BarChart3 },
      { href: "#", label: "تخصيص عرض التقارير", icon: Settings2 },
      { href: "#", label: "تصدير التقارير", icon: Download },
      { href: "#", label: "توليد بيانات التقرير", icon: FileText },
    ],
  },
  {
    value: "construction-progress",
    title: "تقدم البناء",
    icon: TrendingUp,
    color: "text-orange-500",
    links: [
      { href: "/engineer/update-progress", label: "تحديث التقدم", icon: TrendingUp },
      { href: "#", label: "ملاحظات التقدم", icon: PenSquare },
      { href: "#", label: "رفع صور/فيديوهات", icon: Camera },
      { href: "#", label: "تحديد مراحل المشروع", icon: GanttChartSquare },
    ],
  },
  {
    value: "owner-linking",
    title: "ربط المالكين",
    icon: Users,
    color: "text-red-500",
    links: [
      { href: "#", label: "ربط مالك بمشروع", icon: Users },
    ],
  },
];

export default function EngineerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [engineerName, setEngineerName] = useState("المهندس");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setEngineerName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
    router.push("/login");
  };

  return (
    <aside className="w-72 bg-card text-card-foreground flex flex-col h-screen sticky top-0 shadow-lg border-l">
      <div className="p-4 border-b text-center">
        <h2 className="text-xl font-bold text-app-red">لوحة تحكم المهندس</h2>
        <p className="text-sm text-muted-foreground">مرحباً، {engineerName}</p>
      </div>

      <nav className="flex-grow overflow-y-auto px-2 py-4">
        {mainLinks.map((link) => (
            <Link key={link.href} href={link.href}
                className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-2",
                    pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <link.icon className="h-5 w-5" />
                {link.label}
            </Link>
        ))}

        <Accordion type="multiple" className="w-full">
          {accordionItems.map((item) => (
            <AccordionItem value={item.value} key={item.value}>
              <AccordionTrigger className="hover:no-underline text-base font-semibold text-foreground px-3 py-2.5 rounded-md hover:bg-muted">
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", item.color)} />
                  {item.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pr-2 pb-1 pt-1">
                <ul className="space-y-1">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
}
