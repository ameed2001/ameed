
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, Settings, ScrollText, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/admin/users', label: 'إدارة المستخدمين', icon: Users },
  { href: '/admin/projects', label: 'إدارة المشاريع', icon: Briefcase },
  { href: '/admin/settings', label: 'إعدادات النظام', icon: Settings },
  { href: '/admin/logs', label: 'سجلات النظام', icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-2 h-full shadow-lg flex-shrink-0">
      <h2 className="text-xl font-semibold text-app-gold mb-6 pb-2 border-b border-app-gold/50">لوحة تحكم المشرف</h2>
      <nav>
        <ul className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-app-gold hover:text-gray-900",
                    isActive ? "bg-app-gold text-gray-900 shadow-md" : "text-gray-300 hover:text-gray-900"
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
    </aside>
  );
}
