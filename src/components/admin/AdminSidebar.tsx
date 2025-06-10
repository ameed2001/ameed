
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Users, Briefcase, Settings, ScrollText, LayoutDashboard, LogOut, Home, 
    UserCheck, Shield, AlertTriangle
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
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStat[]>([
    { label: "عدد المستخدمين الكلي", value: "...", icon: Users, color: "text-blue-500", dataAiHint: "total users", description: "إحصائية شاملة لجميع أنواع الحسابات المسجلة في النظام." },
    { label: "عدد المشاريع المدرجة", value: "...", icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects", description: "إجمالي عدد المشاريع المسجلة في حسابات المهندسين." },
    { label: "عدد حسابات المالكين", value: "...", icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts", description: "يوضح عدد المستخدمين المسجلين كمالكين للمشاريع." },
    { label: "عدد حسابات المشرفين", value: "...", icon: Shield, color: "text-red-500", dataAiHint: "admin accounts", description: "عدد حسابات المشرفين (Admins) في النظام." },
    { label: "تحذيرات وأخطاء السجل", value: "...", icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors", description: "عدد رسائل التحذير أو الخطأ في سجل النظام." },
  ]);

  useEffect(() => {
    async function fetchAdminStats() {
      setIsLoadingStats(true);
      try {
        const [usersResponse, projectsResponse, logsResponse] = await Promise.all([
          dbGetUsers("admin-id"), 
          dbGetProjects("admin-id"), 
          dbGetLogs()
        ]);

        let totalUsers = 0;
        let ownerAccounts = 0;
        let adminAccounts = 0;

        if (usersResponse.success && usersResponse.users) {
          totalUsers = usersResponse.users.length;
          ownerAccounts = usersResponse.users.filter(u => u.role === 'OWNER').length;
          adminAccounts = usersResponse.users.filter(u => u.role === 'ADMIN').length;
        }

        const totalProjects = (projectsResponse.success && projectsResponse.projects) ? projectsResponse.projects.length : 0;
        const warningsAndErrors = logsResponse.filter(log => log.level === 'WARNING' || log.level === 'ERROR').length;
        
        setAdminStats([
          { label: "عدد المستخدمين الكلي", value: totalUsers, icon: Users, color: "text-blue-500", dataAiHint: "total users", description: "إحصائية شاملة لجميع أنواع الحسابات المسجلة في النظام." },
          { label: "عدد المشاريع المدرجة", value: totalProjects, icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects", description: "إجمالي عدد المشاريع المسجلة في حسابات المهندسين." },
          { label: "عدد حسابات المالكين", value: ownerAccounts, icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts", description: "يوضح عدد المستخدمين المسجلين كمالكين للمشاريع." },
          { label: "عدد حسابات المشرفين", value: adminAccounts, icon: Shield, color: "text-red-500", dataAiHint: "admin accounts", description: "عدد حسابات المشرفين (Admins) في النظام." },
          { label: "تحذيرات وأخطاء السجل", value: warningsAndErrors, icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors", description: "عدد رسائل التحذير أو الخطأ في سجل النظام." },
        ]);

      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        toast({ title: "خطأ", description: "فشل تحميل إحصائيات لوحة المعلومات.", variant: "destructive" });
        setAdminStats(prev => prev.map(s => ({ ...s, value: 0 })));
      }
      setIsLoadingStats(false);
    }
    fetchAdminStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك من لوحة تحكم المسؤول بنجاح.",
      variant: "default",
    });
    localStorage.removeItem('adminToken'); 
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    router.push('/admin-login'); 
  };

  return (
    <aside className="w-72 bg-card text-foreground p-4 shadow-lg flex-shrink-0 flex flex-col border-r">
        <div className="text-center mb-6 pb-2 border-b border-app-gold/70">
            <h2 className="text-2xl font-bold text-app-red">
              لوحة التحكم
            </h2>
        </div>
        
        <div className="mb-6 p-3 border border-border rounded-lg bg-background/50 overflow-y-auto max-h-[calc(100vh-400px)]"> {/* Added max-height and scroll */}
            <h3 className="text-sm font-semibold text-foreground mb-3 text-right">لوحة المعلومات</h3>
            <div className="space-y-3"> {/* Changed to space-y for vertical stacking */}
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

      <div className="flex-grow">
        <nav>
          <ul className="space-y-1.5">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-foreground/80 hover:bg-primary hover:text-primary-foreground" 
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-border/60"> 
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left",
            "bg-red-700/60 text-red-100 hover:bg-red-600/80 hover:text-white"
          )}
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
    

    
