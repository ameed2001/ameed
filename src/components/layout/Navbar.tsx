
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserPlus, LogIn, ListChecks } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/my-projects', label: 'مشاريعي', icon: ListChecks }, // Added My Projects link
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
];

const authNavItems = [
  { href: '/login', label: 'تسجيل الدخول', icon: LogIn },
  { href: '/signup', label: 'إنشاء حساب', icon: UserPlus },
  // { href: '/profile', label: 'الملف الشخصي', icon: UserCircle }, // Future: show when logged in
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-1 md:gap-x-3 gap-y-2">
        {[...navItems, ...authNavItems].map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "nav-link-animated flex items-center justify-center w-full min-w-[100px] md:min-w-[120px] px-2 py-2.5 text-center font-bold text-xs sm:text-sm md:text-base rounded-md",
                  "text-nav-link hover:text-nav-link-hover",
                  isActive ? "text-nav-link-hover bg-black/30 shadow-lg" : "hover:shadow-lg"
                )}
              >
                <item.icon size={18} className="ms-1 md:ms-2" />
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

