
"use client";

import Link from 'next/link';
import { 
    Home, 
    UserCircle as DashboardIcon, 
    Briefcase, 
    Settings, 
    Info, 
    HelpCircle, 
    Phone, 
    LogOut, 
    Menu as MenuIcon, 
    ChevronLeft,
    Mail,
    AlertTriangle,
    CheckCircle2,
    Wrench // Added Wrench icon
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const ownerNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: Home },
  { href: '/owner/dashboard', label: 'لوحة التحكم', icon: DashboardIcon },
  { href: '/my-projects', label: 'مشاريعي', icon: Briefcase },
  { href: '/profile', label: 'الملف الشخصي', icon: Settings },
  { href: '/owner/other-tools', label: 'أدوات أخرى', icon: Wrench }, // Added new item
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

// Data for stats section in the sidebar
const sidebarStats = [
  { label: "المشاريع النشطة", value: 0, icon: Briefcase, color: "text-amber-400" },
  { label: "الرسائل الجديدة", value: 0, icon: Mail, color: "text-blue-400" },
  { label: "المهام المتأخرة", value: 0, icon: AlertTriangle, color: "text-red-400" },
  { label: "المشاريع المكتملة", value: 0, icon: CheckCircle2, color: "text-green-400" },
];

interface OwnerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function OwnerSidebar({ isOpen, onToggle }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [ownerName, setOwnerName] = useState("المالك");

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setOwnerName(storedUserName);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('ownerSidebarState');
    }
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
      variant: "default",
    });
    router.push('/login');
  };

  return (
    <aside className={cn(
      "bg-header-bg text-header-fg shadow-xl flex flex-col sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0", 
      isOpen ? "w-72" : "w-20"
    )}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700 h-[70px] flex-shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <DashboardIcon className="h-8 w-8 text-app-gold flex-shrink-0" />
            <h2 className="text-lg font-bold text-white truncate">لوحة التحكم</h2>
          </div>
        ) : (
          <DashboardIcon className="h-8 w-8 text-app-gold mx-auto" />
        )}
        <button 
          onClick={onToggle}
          className="text-gray-300 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-app-gold"
          aria-label={isOpen ? "طي الشريط الجانبي" : "فتح الشريط الجانبي"}
        >
          {isOpen ? <ChevronLeft size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className={cn(
          "text-center mb-2 p-3 border-b border-gray-700 flex-shrink-0"
        )}>
          <h2 className="text-lg font-bold text-white truncate">مرحباً، {isClient ? ownerName : "المالك"}</h2>
          <p className="text-xs text-gray-400">لوحة تحكم المالك</p>
        </div>
      )}

      {isOpen && (
        <div className="p-3 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-sm font-semibold text-white mb-2 px-1 text-right">نظرة عامة سريعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {sidebarStats.map(stat => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="bg-zinc-800 p-2 rounded-md text-center">
                  <IconComponent className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                  <div className="text-xs text-gray-300 truncate">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          {ownerNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
                    !isOpen && "justify-center py-3",
                    isActive
                      ? "bg-app-gold text-gray-900 shadow-md" 
                      : "text-gray-300 hover:bg-app-gold hover:text-gray-900" 
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon size={isOpen ? 20 : 24} className="opacity-90 flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isClient && (
        <div className="mt-auto p-3 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full",
              "bg-red-700/60 text-red-100 hover:bg-red-600/80 hover:text-white",
              !isOpen && "justify-center py-3"
            )}
            title={!isOpen ? "تسجيل الخروج" : undefined}
          >
            <LogOut size={isOpen ? 20 : 24} className="opacity-90 flex-shrink-0"/>
            {isOpen && <span className="truncate">تسجيل الخروج</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
