
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Users, Briefcase, Settings, ScrollText, LayoutDashboard, LogOut, Home, 
    UserCheck, Shield, AlertTriangle, HardHat, ChevronLeft, Menu as MenuIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getUsers as dbGetUsers, getProjects as dbGetProjects, getLogs as dbGetLogs } from '@/lib/db';

const adminNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: Home },
  { href: '/admin', label: 'لوحة المسؤول', icon: LayoutDashboard },
  { href: '/admin/users', label: 'إدارة المستخدمين', icon: Users },
  { href: '/admin/projects', label: 'إدارة المشاريع', icon: Briefcase },
  { href: '/admin/settings', label: 'إعدادات النظام', icon: Settings },
  { href: '/admin/logs', label: 'سجلات النظام', icon: ScrollText },
];

interface AdminStat {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    dataAiHint: string;
    description?: string; 
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('adminSidebarState');
      if (savedState) {
        setIsSidebarOpen(savedState === 'open');
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSidebarState', newState ? 'open' : 'closed');
    }
  };

 // Removed the useEffect hook that fetches data
 // Removed the state that stores the fetched data
 // The adminStats will now need to be fetched and passed down from a parent component or fetched within the specific dashboard page.

  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك من لوحة تحكم المسؤول بنجاح.",
      variant: "default",
    });
    if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken'); 
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('adminSidebarState');
    }
    router.push('/admin-login'); 
  };

  return (
    <aside className={cn(
        "bg-card text-foreground p-4 shadow-lg flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out h-full",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className={cn(
            "flex items-center border-b border-app-gold/70 pb-2 mb-4",
            isSidebarOpen ? "justify-between" : "justify-center"
        )}>
            {isSidebarOpen && (
                 <Link href="/admin" className="flex items-center gap-2 text-app-red hover:text-red-700">
                    <LayoutDashboard size={28} />
                    <h2 className="text-2xl font-bold">
                    لوحة التحكم
                    </h2>
                 </Link>
            )}
            <button 
                onClick={toggleSidebar} 
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-app-gold"
                aria-label={isSidebarOpen ? "طي الشريط الجانبي" : "فتح الشريط الجانبي"}
            >
                {isSidebarOpen ? <ChevronLeft size={24} /> : <MenuIcon size={24} />}
            </button>
        </div>
        
        {isSidebarOpen && (
            <div className="mb-6 p-3 border border-border rounded-lg bg-background/50 overflow-y-auto">
                <h3 className="text-sm font-semibold text-foreground mb-3 text-right">لوحة المعلومات</h3>
                <div className="space-y-3">
                {adminStats.map(stat => {
                    const IconComponent = stat.icon;
                    return (
                    <div key={stat.label} className="bg-muted/40 p-3 rounded-md shadow-sm flex items-start gap-3" data-ai-hint={stat.dataAiHint}>
                        <IconComponent className={cn("h-8 w-8 mt-1 flex-shrink-0", stat.color)} />
                        <div className="flex-grow text-right">
                            <div className="text-base font-bold text-foreground">
                                {isLoadingStats ? "..." : stat.value} <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground/80 leading-tight mt-0.5">{stat.description}</p>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
        )}

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1.5">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
                    !isSidebarOpen && "justify-center py-3",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-foreground/80 hover:bg-primary hover:text-primary-foreground" 
                  )}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon size={isSidebarOpen ? 20 : 24} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-border/60"> 
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left",
            "bg-red-700/60 text-red-100 hover:bg-red-600/80 hover:text-white",
            !isSidebarOpen && "justify-center py-3"
          )}
          title={!isSidebarOpen ? "تسجيل الخروج" : undefined}
        >
          <LogOut size={isSidebarOpen ? 20 : 24}  className="flex-shrink-0"/>
          {isSidebarOpen && <span className="truncate">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}


// Define a default structure for adminStats if needed for initial render,
// though it's better to pass actual data as props from a parent component
// that fetches it. For now, commenting out the old state and useEffect.

// Restored the initial state structure but without the fetching logic
const initialAdminStats: AdminStat[] = [
    { label: "عدد المستخدمين الكلي للموقع", value: "...", icon: Users, color: "text-blue-500", dataAiHint: "total users", description: "إحصائية شاملة لجميع أنواع الحسابات المسجلة في النظام." },
    { label: "عدد المشاريع المدرجة من قِبل المهندسين", value: "...", icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects", description: "إجمالي عدد المشاريع المسجلة في حسابات المهندسين." },
    { label: "عدد حسابات المالكين", value: "...", icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts", description: "يوضح عدد المستخدمين المسجلين كمالكين للمشاريع." },
    { label: "عدد حسابات المهندسين", value: "...", icon: HardHat, color: "text-cyan-500", dataAiHint: "engineer accounts", description: "يوضح عدد المستخدمين المسجلين كمهندسين في النظام." },
    { label: "عدد حسابات المشرفين (الإداريين)", value: "...", icon: Shield, color: "text-red-500", dataAiHint: "admin accounts", description: "عدد حسابات المشرفين (Admins) في النظام." },
    { label: "عدد التحذيرات والأخطاء في سجلات النظام", value: "...", icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors", description: "إحصائية توضح عدد الرسائل المُسجلة في سجل النظام من نوع تحذير أو خطأ، لمتابعة الأداء والصيانة." },
];



// The component should now accept adminStats as props:
// export default function AdminSidebar({ adminStats, isLoadingStats }: { adminStats: AdminStat[], isLoadingStats: boolean }) {

