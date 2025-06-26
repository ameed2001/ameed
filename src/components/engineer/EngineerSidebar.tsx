
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  House,
  Wrench,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  Menu as MenuIcon,
  UserCircle,
  LayoutDashboard,
  AlertTriangle,
  Camera,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const engineerNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: House },
  { href: '/engineer/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/engineer/create-project', label: 'إنشاء مشروع جديد', icon: Plus },
  { href: '/engineer/projects', label: 'إدارة المشاريع', icon: Wrench },
  { href: '/profile', label: 'الملف الشخصي', icon: Settings },
];

const sidebarStats = [
  { label: "المشاريع النشطة", value: 5, icon: Wrench, color: "text-amber-400" },
  { label: "المهام المتأخرة", value: 3, icon: AlertTriangle, color: "text-red-400" },
  { label: "الوسائط الجديدة", value: 12, icon: Camera, color: "text-blue-400" },
  { label: "العناصر المعلقة", value: 7, icon: Layers, color: "text-purple-400" },
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

    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });

    router.push("/engineer-login");
  };

  return (
    <aside
      className={cn(
        "bg-card text-foreground shadow-xl flex flex-col sticky top-0 transition-all duration-300 border-l z-50",
        isOpen ? "w-72" : "w-20"
      )}
    >
      {/* الرأس */}
      <div className="p-4 flex justify-between items-center border-b border-border h-[70px] flex-shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-app-gold" />
            <h2 className="text-lg font-bold text-app-red truncate">لوحة المهندس</h2>
          </div>
        ) : (
          <UserCircle className="h-8 w-8 text-app-gold mx-auto" />
        )}

        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-app-gold"
          aria-label={isOpen ? "طي الشريط الجانبي" : "فتح الشريط الجانبي"}
        >
          {isOpen ? <ChevronLeft size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* المعلومات والإحصائيات */}
      {isOpen && (
        <>
          <div className="text-center p-3 border-b border-border">
            <h2 className="text-lg font-bold truncate">مرحباً، {engineerName}</h2>
            <p className="text-xs text-muted-foreground">لوحة تحكم المهندس</p>
          </div>

          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2 text-right">نظرة عامة سريعة</h3>
            <div className="grid grid-cols-2 gap-2">
              {sidebarStats.map((stat) => (
                <div key={stat.label} className="bg-muted/40 p-2 rounded-md text-center">
                  <stat.icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                  <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                  <div className="text-lg font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* التنقل */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          {engineerNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    !isOpen && "justify-center py-3",
                    isActive
                      ? "bg-app-gold text-gray-900 shadow-md"
                      : "text-foreground/80 hover:bg-app-gold hover:text-gray-900"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon size={isOpen ? 20 : 24} className="flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* تسجيل الخروج */}
      <div className="mt-auto p-3 border-t border-border flex-shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
            "bg-red-700/60 text-red-100 hover:bg-red-600/80 hover:text-white",
            !isOpen && "justify-center py-3"
          )}
          title={!isOpen ? "تسجيل الخروج" : undefined}
        >
          <LogOut size={isOpen ? 20 : 24} className="flex-shrink-0" />
          {isOpen && <span className="truncate">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
