
"use client";

import Link from 'next/link';
import { 
    Home, 
    UserCircle,
    Briefcase, 
    Settings, 
    HelpCircle, 
    Phone, 
    LogOut, 
    Menu as MenuIcon, 
    ChevronLeft,
    Mail,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getProjects } from '@/lib/db';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-muted/40 p-3 rounded-md text-center shadow-sm flex-1">
    <Icon className={cn("h-6 w-6 mx-auto mb-1.5", color)} />
    <div className="text-xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground truncate">{label}</div>
  </div>
);

const ownerNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: Home },
  { href: '/owner/dashboard', label: 'لوحة التحكم', icon: UserCircle },
  { href: '/owner/projects', label: 'مشاريعي', icon: Briefcase },
  { href: '/profile', label: 'الملف الشخصي', icon: Settings },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
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
  const [stats, setStats] = useState({ active: 0, completed: 0 });

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (name) setOwnerName(name);

    async function fetchStats() {
        if (!email) return;
        const result = await getProjects(email);
        if (result.success && result.projects) {
            const active = result.projects.filter(p => p.status === "قيد التنفيذ" || p.status === "مخطط له").length;
            const completed = result.projects.filter(p => p.status === "مكتمل").length;
            setStats({ active, completed });
        }
    }
    fetchStats();
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('ownerSidebarState');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
    });
    router.push('/owner-login');
  };

  const statCards: StatCardProps[] = [
    { label: "المشاريع النشطة", value: stats.active, icon: Briefcase, color: "text-amber-500" },
    { label: "الرسائل الجديدة", value: 0, icon: Mail, color: "text-blue-500" },
    { label: "المشاريع المكتملة", value: stats.completed, icon: CheckCircle2, color: "text-green-500" },
    { label: "المهام المتأخرة", value: 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <aside className={cn(
      "bg-card text-foreground shadow-xl flex flex-col sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0 border-l", 
      isOpen ? "w-72" : "w-20"
    )}>
      <div className="p-4 flex justify-between items-center border-b border-border h-[70px] flex-shrink-0">
        {isOpen && (
          <Link href="/owner/dashboard" className="flex items-center gap-2 overflow-hidden">
            <UserCircle className="h-8 w-8 text-app-gold flex-shrink-0" />
            <h2 className="text-lg font-bold text-app-red truncate">مرحباً، {ownerName}</h2>
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
        <div className="p-3 border-b border-border flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            {statCards.map(stat => <StatCard key={stat.label} {...stat} />)}
          </div>
        </div>
      )}

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          {ownerNavItems.map((item) => {
            const isActive = pathname === item.href;
            const isContact = item.href === '/contact';
            const LinkComponent = isContact ? 'a' : Link;
            const linkProps = isContact 
              ? { href: 'https://forms.gle/WaXPkD8BZMQ7pVev6', target: '_blank', rel: 'noopener noreferrer' } 
              : { href: item.href };
            return (
              <li key={item.label}>
                <LinkComponent
                  {...linkProps}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
                    !isOpen && "justify-center py-3",
                    isActive
                      ? "bg-app-gold text-primary-foreground shadow-md"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon size={isOpen ? 20 : 24} className="opacity-90 flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </LinkComponent>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-3 border-t border-border flex-shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left",
            "bg-red-700/10 text-red-600 hover:bg-red-700/20",
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
