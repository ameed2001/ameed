
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserPlus, LogIn, Settings, Briefcase, FileText as LibraryIcon, Calculator } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/concrete-estimator', label: 'الحاسبات', icon: Calculator },
  { href: '/documents', label: 'المكتبة', icon: LibraryIcon },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
];

// Auth items are not currently displayed as per user's direction to remove them from navbar.
// If they were to be added back, they would be merged into allNavItems.
/*
const authNavItems = [
  { href: '/login', label: 'تسجيل الدخول', icon: LogIn },
  { href: '/signup', label: 'إنشاء حساب', icon: UserPlus },
];
*/

// Admin nav item is also not currently displayed in the main navbar.
/*
const adminNavItem = { href: '/admin', label: 'لوحة التحكم', icon: Settings };
*/

const Navbar = () => {
  const pathname = usePathname();
  const allNavItems = [...navItems];

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-2 md:gap-x-4 gap-y-2">
        {allNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center min-w-[90px] md:min-w-[110px] px-2 py-2 text-center font-medium text-sm md:text-base rounded-md transition-colors",
                  // Default state for non-active buttons
                  !isActive && "bg-app-gold text-white",
                  // Default state for active buttons
                  isActive && "bg-app-red text-app-red",
                  // Hover state for ALL buttons (active or non-active)
                  "hover:bg-app-red hover:text-app-gold"
                )}
              >
                <item.icon size={18} className="ml-1.5 md:ml-2" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;

