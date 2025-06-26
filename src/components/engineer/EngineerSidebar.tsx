
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
    Home,
    Coins,
    Menu as MenuIcon,
    ChevronLeft
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
      { href: "/engineer/cost-estimator", label: "حاسبة أسعار المواد", icon: Coins },
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
    const name = localStorage.getItem("userName");
    if (name) setEngineerName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem('engineerSidebarState');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
    router.push("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "bg-card text-card-foreground flex flex-col h-screen sticky top-0 shadow-lg border-l transition-all duration-300 ease-in-out",
        isOpen ? "w-72" : "w-20"
      )}>
        <div className="p-4 flex items-center border-b h-[70px] flex-shrink-0">
          {isOpen && (
            <div className="text-center flex-grow overflow-hidden">
                <h2 className="text-xl font-bold text-app-red truncate">لوحة تحكم المهندس</h2>
                <p className="text-sm text-muted-foreground truncate">مرحباً، {engineerName}</p>
            </div>
          )}
          <Button 
              variant="ghost"
              onClick={onToggle} 
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-app-gold"
              aria-label={isOpen ? "طي الشريط الجانبي" : "فتح الشريط الجانبي"}
          >
              {isOpen ? <ChevronLeft size={24} /> : <MenuIcon size={24} />}
          </Button>
        </div>

        <nav className="flex-grow overflow-y-auto px-2 py-4">
          {mainLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link href={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-2",
                        !isOpen && "justify-center",
                        pathname === link.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                    <link.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && <span>{link.label}</span>}
                </Link>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="left" align="center">
                  <p>{link.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          {isOpen ? (
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
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                              pathname === link.href
                                ? "bg-app-red text-white"
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
          ) : (
            <div className="space-y-2 mt-2 border-t pt-2">
              {accordionItems.map((item) => (
                <DropdownMenu key={item.value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-center h-12">
                          <item.icon className={cn("h-6 w-6", item.color)} />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent side="left" align="start" sideOffset={5}>
                    <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.links.map((link) => (
                      <DropdownMenuItem key={link.label} asChild>
                        <Link href={link.href} className="flex items-center gap-2 cursor-pointer w-full">
                          <link.icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                  "bg-red-700/10 text-red-600 hover:bg-red-700/20",
                  isOpen ? "justify-start text-left" : "justify-center"
                )}
              >
                <LogOut size={isOpen ? 20 : 24} className="flex-shrink-0"/>
                {isOpen && <span className="truncate">تسجيل الخروج</span>}
              </button>
            </TooltipTrigger>
            {!isOpen && (
                <TooltipContent side="left" align="center">
                    <p>تسجيل الخروج</p>
                </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
