
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  Menu as MenuIcon,
  UserCircle,
  LayoutDashboard,
  FolderKanban,
  PlusSquare,
  Archive,
  Layers,
  ClipboardCheck,
  Calculator,
  AreaChart,
  Settings2,
  FileUp,
  FileCog,
  BarChartHorizontal,
  Upload,
  ListTree,
  UserRoundCog,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sidebarSections = [
  {
    title: "المشاريع",
    icon: FolderKanban,
    colorClass: "text-blue-500",
    defaultOpen: true,
    links: [
      { href: "/engineer/create-project", label: "إنشاء مشروع جديد", icon: PlusSquare },
      { href: "/engineer/projects", label: "إدارة المشاريع", icon: FolderKanban },
      { href: "#", label: "المشاريع المؤرشفة", icon: Archive, isAction: true },
    ],
  },
  {
    title: "الكميات والمواد",
    icon: Calculator,
    colorClass: "text-green-500",
    links: [
      { href: "#", label: "إدخال العناصر الإنشائية", icon: Layers, isAction: true },
      { href: "/", label: "حساب الكميات", icon: Calculator },
      { href: "#", label: "عرض التقارير", icon: AreaChart, isAction: true },
      { href: "#", label: "تصدير التقارير", icon: FileUp, isAction: true },
    ],
  },
  {
    title: "سير العمل",
    icon: BarChartHorizontal,
    colorClass: "text-purple-500",
    links: [
      { href: "#", label: "تحديد مراحل الإنشاء", icon: ListTree, isAction: true },
      { href: "/engineer/update-progress", label: "تحديث التقدم", icon: BarChartHorizontal },
      { href: "#", label: "رفع صور/فيديوهات", icon: Upload, isAction: true },
    ],
  },
  {
    title: "الإعدادات",
    icon: Settings2,
    colorClass: "text-gray-500",
    links: [
      { href: "/profile", label: "الملف الشخصي", icon: UserCircle },
      { href: "#", label: "إعدادات الحساب", icon: Settings2, isAction: true },
    ],
  },
];


interface EngineerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function EngineerSidebar({ isOpen, onToggle }: EngineerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [engineerName, setEngineerName] = useState("المهندس");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setEngineerName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("engineerSidebarState");
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
    router.push("/login");
  };

  const handleActionClick = (label: string) => {
    toast({
      title: "ميزة قيد التطوير",
      description: `خيار "${label}" سيتم تفعيله داخل صفحات إدارة المشاريع قريباً.`,
    });
  };

  const defaultActiveItems = sidebarSections.filter(s => s.defaultOpen).map(s => s.title);

  return (
    <aside
      className={cn(
        "bg-card text-foreground shadow-xl flex flex-col sticky top-0 transition-all duration-300 border-l z-50 h-screen",
        isOpen ? "w-72" : "w-20"
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-border h-[70px] flex-shrink-0">
        {isOpen && (
          <Link href="/engineer/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Home className="h-8 w-8 text-app-gold flex-shrink-0" />
            <h2 className="text-lg font-bold text-app-red truncate">لوحة تحكم المهندس</h2>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-app-gold"
          aria-label={isOpen ? "طي الشريط الجانبي" : "فتح الشريط الجانبي"}
        >
          {isOpen ? <ChevronLeft size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="text-center p-3 border-b border-border">
          <UserCircle className="h-10 w-10 text-app-gold mx-auto mb-2" />
          <h2 className="text-base font-bold truncate">مرحباً، {engineerName}</h2>
        </div>
      )}

      <nav className="flex-grow overflow-y-auto">
        <Accordion type="multiple" className="w-full p-2" defaultValue={defaultActiveItems}>
          <Link href="/engineer/dashboard" className={cn(
             "flex items-center gap-3 w-full text-right py-2.5 px-2 hover:no-underline hover:bg-muted rounded-md font-semibold",
             !isOpen && "justify-center"
            )}>
             <LayoutDashboard className="h-5 w-5 text-app-gold" />
             {isOpen && <span>الرئيسية (Dashboard)</span>}
          </Link>
          {sidebarSections.map((section) => (
            <AccordionItem value={section.title} key={section.title} className="border-b-0">
              <AccordionTrigger className={cn(
                  "py-2.5 px-2 hover:no-underline hover:bg-muted rounded-md",
                  !isOpen && "justify-center"
              )}>
                <div className="flex items-center gap-3">
                  <section.icon className={cn("h-5 w-5", section.colorClass)} />
                  {isOpen && <span className="text-base font-semibold">{section.title}</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ul className={cn("space-y-1", isOpen ? "pr-4 border-r-2 border-app-gold/20" : "hidden")}>
                  {section.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.label}>
                        {link.isAction ? (
                          <button
                            onClick={() => handleActionClick(link.label)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-right",
                              "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <link.icon className="h-4 w-4" />
                            <span className="truncate">{link.label}</span>
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-right",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground/80 hover:bg-muted/80"
                            )}
                          >
                            <link.icon className="h-4 w-4" />
                            <span className="truncate">{link.label}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      <div className="mt-auto p-3 border-t border-border flex-shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-right",
            "bg-red-700/60 text-red-100 hover:bg-red-600/80 hover:text-white",
            !isOpen && "justify-center py-3"
          )}
          title={!isOpen ? "تسجيل الخروج" : undefined}
        >
          <LogOut size={isOpen ? 20 : 24} className="opacity-90 flex-shrink-0"/>
          {isOpen && <span className="truncate">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
