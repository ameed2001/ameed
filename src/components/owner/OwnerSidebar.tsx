
"use client";

import Link from 'next/link';
import { Home, UserCircle as DashboardIcon, Briefcase, Settings, Info, HelpCircle, Phone, LogOut } from 'lucide-react'; // Renamed UserCircle to DashboardIcon for clarity
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const ownerNavItems = [
  { href: '/', label: 'الرئيسية للموقع', icon: Home },
  { href: '/owner/dashboard', label: 'لوحة التحكم', icon: DashboardIcon },
  { href: '/my-projects', label: 'مشاريعي', icon: Briefcase },
  { href: '/profile', label: 'الملف الشخصي', icon: Settings },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

export default function OwnerSidebar() {
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
    }
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
      variant: "default",
    });
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-header-bg text-header-fg p-5 h-full shadow-xl flex-shrink-0 flex flex-col">
      <div className="text-center mb-8">
        <DashboardIcon className="h-20 w-20 text-app-gold mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">مرحباً، {isClient ? ownerName : "المالك"}</h2>
        <p className="text-sm text-gray-400">لوحة تحكم المالك</p>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {ownerNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
                    "hover:bg-app-gold hover:text-gray-900 transform hover:scale-105",
                    isActive ? "bg-app-gold text-gray-900 shadow-lg scale-105" : "text-gray-300 hover:text-gray-100"
                  )}
                >
                  <item.icon size={22} className="opacity-90" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {isClient && (
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left",
              "bg-red-700/50 text-red-100 hover:bg-red-600/70 hover:text-white transform hover:scale-105"
            )}
          >
            <LogOut size={22} className="opacity-90"/>
            تسجيل الخروج
          </button>
        </div>
      )}
    </aside>
  );
}
