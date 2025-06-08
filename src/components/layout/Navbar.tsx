
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserPlus, LogIn, ListChecks, PlusSquare, Settings, Briefcase, FileText as LibraryIcon, Calculator } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/concrete-estimator', label: 'الحاسبات', icon: Calculator },
  { href: '/documents', label: 'المكتبة', icon: LibraryIcon },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
];

const authNavItems = [
  { href: '/login', label: 'تسجيل الدخول', icon: LogIn },
  { href: '/signup', label: 'إنشاء حساب', icon: UserPlus },
];

const adminNavItem = { href: '/admin', label: 'لوحة التحكم', icon: Settings };


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
                  // Default text color for all buttons
                  "text-white",
                  // Hover text color for all buttons
                  "hover:text-app-gold",
                  isActive
                    ? "bg-app-red hover:bg-app-red" // Active button: red background, stays red on hover. Hover text is yellow (from above)
                    : "bg-app-gold hover:bg-app-red" // Inactive button: yellow background, turns red on hover. Hover text is yellow (from above)
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
