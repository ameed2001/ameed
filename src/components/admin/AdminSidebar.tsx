
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Users, Briefcase, Settings, ScrollText, LayoutDashboard, LogOut, Home, 
    UserCheck, User, Shield, AlertTriangle, HardHat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getUsers as dbGetUsers, getProjects as dbGetProjects, getLogs as dbGetLogs, type UserDocument, type Project, type LogEntry } from '@/lib/db'; // Ensure correct imports

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
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStat[]>([
    { label: "إجمالي المستخدمين", value: "...", icon: Users, color: "text-blue-500", dataAiHint: "total users" },
    { label: "إجمالي المشاريع", value: "...", icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects" },
    { label: "حسابات المالكين", value: "...", icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts" },
    { label: "حسابات المهندسين", value: "...", icon: HardHat, color: "text-purple-500", dataAiHint: "engineer accounts" },
    { label: "حسابات المسؤولين", value: "...", icon: Shield, color: "text-red-500", dataAiHint: "admin accounts" },
    { label: "تحذيرات وأخطاء", value: "...", icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors" },
  ]);

  useEffect(() => {
    async function fetchAdminStats() {
      setIsLoadingStats(true);
      try {
        const [usersResponse, projectsResponse, logsResponse] = await Promise.all([
          dbGetUsers("admin-id"), // Assuming admin-id fetches all users or this function is admin-aware
          dbGetProjects("admin-id"), // Assuming admin-id fetches all projects
          dbGetLogs()
        ]);

        let totalUsers = 0;
        let ownerAccounts = 0;
        let engineerAccounts = 0;
        let adminAccounts = 0;
        let generalUserAccounts = 0; // For future if needed

        if (usersResponse.success && usersResponse.users) {
          totalUsers = usersResponse.users.length;
          ownerAccounts = usersResponse.users.filter(u => u.role === 'OWNER').length;
          engineerAccounts = usersResponse.users.filter(u => u.role === 'ENGINEER').length;
          adminAccounts = usersResponse.users.filter(u => u.role === 'ADMIN').length;
          generalUserAccounts = usersResponse.users.filter(u => u.role === 'GENERAL_USER').length;
        }

        const totalProjects = (projectsResponse.success && projectsResponse.projects) ? projectsResponse.projects.length : 0;
        const warningsAndErrors = logsResponse.filter(log => log.level === 'WARNING' || log.level === 'ERROR').length;
        
        setAdminStats([
          { label: "إجمالي المستخدمين", value: totalUsers, icon: Users, color: "text-blue-500", dataAiHint: "total users" },
          { label: "إجمالي المشاريع", value: totalProjects, icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects" },
          { label: "حسابات المالكين", value: ownerAccounts, icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts" },
          { label: "حسابات المستخدمين", value: generalUserAccounts, icon: User, color: "text-indigo-500", dataAiHint: "general users" },
          { label: "حسابات المسؤولين", value: adminAccounts, icon: Shield, color: "text-red-500", dataAiHint: "admin accounts" },
          { label: "تحذيرات وأخطاء", value: warningsAndErrors, icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors" },
        ]);

      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        toast({ title: "خطأ", description: "فشل تحميل إحصائيات المشرف.", variant: "destructive" });
        // Keep "..." or set to 0 on error
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
      description: "تم تسجيل خروجك من لوحة تحكم المشرف بنجاح.",
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
    <aside className="w-64 bg-card text-foreground p-4 shadow-lg flex-shrink-0 flex flex-col border-r">
        <div className="text-center mb-6 pb-2 border-b border-app-gold/70">
            <h2 className="text-2xl font-bold text-app-red">
              لوحة التحكم
            </h2>
        </div>
        
        <div className="mb-6 p-3 border border-border rounded-lg bg-background/50">
            <h3 className="text-sm font-semibold text-foreground mb-3 text-right">نظرة عامة سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
            {adminStats.map(stat => {
                const IconComponent = stat.icon;
                return (
                <div key={stat.label} className="bg-muted/40 p-2.5 rounded-md text-center shadow-sm" data-ai-hint={stat.dataAiHint}>
                    <IconComponent className={cn("h-6 w-6 mx-auto mb-1.5", stat.color)} />
                    <div className="text-xs text-muted-foreground font-medium truncate">{stat.label}</div>
                    <div className="text-xl font-bold text-foreground">
                        {isLoadingStats ? "..." : stat.value}
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
    

    