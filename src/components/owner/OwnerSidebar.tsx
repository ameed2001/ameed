
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    GanttChartSquare,
    Calculator,
    Settings,
    LogOut,
    Home,
    Coins,
    Menu as MenuIcon,
    ChevronLeft,
    HelpCircle,
    Phone,
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
    { href: '/owner/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
];

const accordionItems = [
  {
    value: "projects",
    title: "المشاريع والتقدم",
    icon: FolderKanban,
    color: "text-blue-500",
    links: [
      { href: "/owner/projects", label: "عرض كل المشاريع", icon: FolderKanban },
      { href: "/owner/project-timeline", label: "الجداول الزمنية", icon: GanttChartSquare },
    ],
  },
  {
    value: "tools",
    title: "الأدوات والتقارير",
    icon: Calculator,
    color: "text-green-500",
    links: [
      { href: "/owner/cost-estimator", label: "حاسبة أسعار المواد", icon: Coins },
    ],
  },
  {
    value: "support",
    title: "المساعدة والدعم",
    icon: HelpCircle,
    color: "text-amber-500",
    links: [
      { href: "/help", label: "مركز المساعدة", icon: HelpCircle },
      { href: "/contact", label: "تواصل معنا", icon: Phone, isExternal: true, externalHref: 'https://forms.gle/WaXPkD8BZMQ7pVev6' },
    ],
  },
];


interface OwnerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function OwnerSidebar({ isOpen, onToggle }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [ownerName, setOwnerName] = useState("المالك");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setOwnerName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem('ownerSidebarState');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
    router.push("/owner-login");
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
                <h2 className="text-xl font-bold text-app-red truncate">لوحة تحكم المالك</h2>
                <p className="text-sm text-muted-foreground truncate">مرحباً، {ownerName}</p>
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
                      {item.links.map((link) => {
                        const LinkComponent = link.isExternal ? 'a' : Link;
                        const linkProps = link.isExternal ? { href: link.externalHref, target: '_blank', rel: 'noopener noreferrer' } : { href: link.href };
                        return (
                          <li key={link.label}>
                            <LinkComponent
                              {...linkProps}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                pathname === link.href && !link.isExternal
                                  ? "bg-app-red text-white"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <link.icon className="h-4 w-4" />
                              {link.label}
                            </LinkComponent>
                          </li>
                        );
                      })}
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
                    {item.links.map((link) => {
                      const LinkComponent = link.isExternal ? 'a' : Link;
                      const linkProps = link.isExternal ? { href: link.externalHref, target: '_blank', rel: 'noopener noreferrer' } : { href: link.href };
                      return (
                        <DropdownMenuItem key={link.label} asChild>
                          <LinkComponent {...linkProps} className="flex items-center gap-2 cursor-pointer w-full">
                            <link.icon className="h-4 w-4" />
                            <span>{link.label}</span>
                          </LinkComponent>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                  "bg-muted/50 text-foreground/80 hover:bg-muted/100 hover:text-foreground",
                  isOpen ? "justify-start text-left" : "justify-center"
                )}
              >
                <Settings size={isOpen ? 20 : 24} className="flex-shrink-0"/>
                {isOpen && <span className="truncate">الملف الشخصي</span>}
              </Link>
            </TooltipTrigger>
            {!isOpen && (
                <TooltipContent side="left" align="center">
                    <p>الملف الشخصي</p>
                </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left",
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

