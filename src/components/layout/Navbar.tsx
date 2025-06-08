
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserPlus, LogIn, ListChecks, PlusSquare, Settings, Briefcase, FileText as LibraryIcon, Calculator } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  // { href: '/my-projects', label: 'مشاريعي', icon: ListChecks }, // Grouped under "الحاسبات" or similar if it's about calculations for projects
  // { href: '/engineer/create-project', label: 'إنشاء مشروع', icon: PlusSquare }, // Might be implicit or part of "مشاريعي"
  { href: '/concrete-estimator', label: 'الحاسبات', icon: Calculator }, // "الحاسبات" as per image (generic calc icon)
  { href: '/documents', label: 'المكتبة', icon: LibraryIcon }, // "المكتبة" as per image
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
  // { href: '/help', label: 'المساعدة', icon: HelpCircle }, // Not in the image
];

// Auth items might be separate or handled differently, image does not show them.
// For now, let's keep them but they won't match the image's simplicity.
const authNavItems = [
  { href: '/login', label: 'تسجيل الدخول', icon: LogIn },
  { href: '/signup', label: 'إنشاء حساب', icon: UserPlus },
];

// Admin item, similar to auth items, not directly in the image's nav items.
const adminNavItem = { href: '/admin', label: 'لوحة التحكم', icon: Settings };


const Navbar = () => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  // Combining all items for mapping, actual visibility logic would be more complex
  const allNavItems = [...navItems];
  // If you want to conditionally add auth/admin items back:
  // if (!isAdminPath) { // Example condition
  //   allNavItems.push(...authNavItems);
  //   allNavItems.push(adminNavItem);
  // }


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
                  isActive 
                    ? "bg-app-red text-white font-semibold" 
                    : "bg-app-gold text-primary-foreground hover:bg-app-red hover:text-white"
                )}
              >
                <item.icon size={18} className="ml-1.5 md:ml-2" /> {/* Icon on the left for RTL */}
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
