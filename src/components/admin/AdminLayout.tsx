
import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from '@/components/layout/Header'; // Re-using main header
import Footer from '@/components/layout/Footer'; // Re-using main footer
import { getUsers as dbGetUsers, getProjects as dbGetProjects, getLogs as dbGetLogs, type UserDocument, type LogEntry } from '@/lib/db'; // Import data fetching functions and types
import { Users, Briefcase, ScrollText, UserCheck, Shield, AlertTriangle, HardHat } from 'lucide-react'; // Import icons

interface AdminStat {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    dataAiHint: string;
    description?: string;
}

export default async function AdminLayout({ children }: { children: ReactNode }) { // Made the component async

  let adminStats: AdminStat[] = [];
  let isLoadingStats = true; // Assume loading initially

  try {
    // Fetch data from the backend
    const [usersResult, projectsResult, logsResult] = await Promise.all([
      dbGetUsers("admin-id"), // Pass a placeholder admin ID, replace with actual logic if needed
      dbGetProjects("admin-id"), // Pass a placeholder admin ID, replace with actual logic if needed
      dbGetLogs()
    ]);

    const users: UserDocument[] = usersResult.success && usersResult.users ? usersResult.users : [];
    const projects = projectsResult.success && projectsResult.projects ? projectsResult.projects : [];
    const logs: LogEntry[] = Array.isArray(logsResult) ? logsResult : [];


    // Construct the adminStats array with fetched data
    adminStats = [
        { label: "عدد المستخدمين الكلي للموقع", value: users.length, icon: Users, color: "text-blue-500", dataAiHint: "total users", description: "إحصائية شاملة لجميع أنواع الحسابات المسجلة في النظام." },
        { label: "عدد المشاريع المدرجة من قِبل المهندسين", value: projects.length, icon: Briefcase, color: "text-amber-500", dataAiHint: "total projects", description: "إجمالي عدد المشاريع المسجلة في حسابات المهندسين." },
        { label: "عدد حسابات المالكين", value: users.filter(u => u.role === 'OWNER').length, icon: UserCheck, color: "text-green-500", dataAiHint: "owner accounts", description: "يوضح عدد المستخدمين المسجلين كمالكين للمشاريع." },
        { label: "عدد حسابات المهندسين", value: users.filter(u => u.role === 'ENGINEER').length, icon: HardHat, color: "text-cyan-500", dataAiHint: "engineer accounts", description: "يوضح عدد المستخدمين المسجلين كمهندسين في النظام." },
        { label: "عدد حسابات المشرفين (الإداريين)", value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: "text-red-500", dataAiHint: "admin accounts", description: "عدد حسابات المشرفين (Admins) في النظام." },
        { label: "عدد التحذيرات والأخطاء في سجلات النظام", value: logs.filter(log => log.level === 'WARNING' || log.level === 'ERROR').length, icon: AlertTriangle, color: "text-orange-500", dataAiHint: "system warnings errors", description: "إحصائية توضح عدد الرسائل المُسجلة في سجل النظام من نوع تحذير أو خطأ، لمتابعة الأداء والصيانة." },
    ];

    isLoadingStats = false; // Data fetching complete

  } catch (error) {
    console.error("Error fetching admin stats in AdminLayout:", error);
    // In case of error, display placeholder values or empty stats
    adminStats = []; // Or set to initial placeholder values if desired
    isLoadingStats = false; // Stop loading indicator
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      {/* Not including main Navbar from AppLayout here, admin has its own sidebar */}
      <div className="flex flex-1 mt-0"> {/* Removed container mx-auto */}
        <AdminSidebar adminStats={adminStats} isLoadingStats={isLoadingStats} /> {/* Pass fetched stats and loading state */}
        <main className="flex-grow p-6 bg-background/80 shadow-inner rounded-l-lg"> {/* Changed to rounded-l-lg */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
