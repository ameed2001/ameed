
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Briefcase, Settings, ScrollText, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const adminNavItems = [
  { href: '/admin', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/admin/users', label: 'إدارة المستخدمين', icon: Users },
  { href: '/admin/projects', label: 'إدارة المشاريع', icon: Briefcase },
  { href: '/admin/settings', label: 'إعدادات النظام', icon: Settings },
  { href: '/admin/logs', label: 'سجلات النظام', icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك من لوحة تحكم المشرف بنجاح.",
      variant: "default",
    });
    // Clear admin-specific session/local storage
    localStorage.removeItem('adminToken'); // Example
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    router.push('/admin-login'); 
  };

  return (
    // Removed h-full, relying on parent flexbox behavior (align-items: stretch by default for flex row items)
    // Adjusted padding: p-4 to px-4 pt-4 pb-2 to reduce bottom padding slightly if needed, or keep p-4 if logout button container handles its spacing well.
    // The image shows the logout button as the final block.
    <aside className="w-64 bg-card text-foreground p-4 shadow-lg flex-shrink-0 flex flex-col border-r">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-app-red mb-6 pb-2 border-b border-app-gold/70 text-center">
          لوحة التحكم
        </h2>
        <nav>
          <ul className="space-y-1.5">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-foreground/80 hover:text-primary"
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
      {/* This container is pushed to the bottom by flex-grow on the div above */}
      {/* pt-4 and border-t create the separation as seen in the image */}
      <div className="mt-auto pt-4 border-t border-border/60"> 
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out w-full text-left",
            "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-red-100" 
          )}
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
    