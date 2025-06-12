
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
    Wrench, 
    PieChart, 
    Clock, 
    ListTree, 
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const ownerNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: Home },
  { href: '/owner/dashboard', label: 'لوحة التحكم', icon: DashboardIcon },
  { href: '/owner/projects', label: 'مشاريعي', icon: Briefcase }, 
  { href: '/owner-account/quantity-reports', label: 'تقارير الكميات', icon: PieChart }, 
  { href: '/owner-account/comments-inquiries', label: 'التعليقات والاستفسارات', icon: Mail }, 
  { href: '/owner-account/project-progress', label: 'تقدم المشروع', icon: Briefcase }, 
  { href: '/owner-account/project-timeline', label: 'الجدول الزمني للمشروع', icon: Clock }, 
  { href: '/owner-account/project-stages', label: 'مراحل المشروع', icon: ListTree }, 
  { href: '/profile', label: 'الملف الشخصي', icon: Settings },
  { href: '/owner/other-tools', label: 'أدوات أخرى', icon: Wrench }, 
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

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
  }, []);

  useEffect(() => {
    if (isClient) { 
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setOwnerName(storedUserName);
      }
    }
  }, [isClient]); 

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
    router.push('/owner-login'); // Redirect to owner login page
  };

  return (
    <aside className={cn(
      "bg-card text-foreground shadow-xl flex flex-col sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0 border-r", 
      isOpen ? "w-72" : "w-20"
    )}>
      <div className="p-4 flex justify-between items-center border-b border-border h-[70px] flex-shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <DashboardIcon className="h-8 w-8 text-app-gold flex-shrink-0" />
            <h2 className="text-lg font-bold text-app-red truncate">لوحة التحكم</h2>
          </div>
        ) : (
          <DashboardIcon className="h-8 w-8 text-app-gold mx-auto" />
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
        <div className={cn(
          "text-center mb-2 p-3 border-b border-border flex-shrink-0"
        )}>
          <h2 className="text-lg font-bold text-foreground truncate">مرحباً، {isClient ? ownerName : "المالك"}</h2>
          <p className="text-xs text-muted-foreground">لوحة تحكم المالك</p>
        </div>
      )}

      {isOpen && (
        <div className="p-3 border-b border-border flex-shrink-0">
          <h3 className="text-sm font-semibold text-foreground mb-2 px-1 text-right">نظرة عامة سريعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {sidebarStats.map(stat => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="bg-muted/40 p-2 rounded-md text-center">
                  <IconComponent className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                  <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
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
                      : "text-foreground/80 hover:bg-app-gold hover:text-gray-900" 
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
        <div className="mt-auto p-3 border-t border-border flex-shrink-0">
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
