"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserCircle, Briefcase, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react'; 

const baseNavItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },  
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('userRole');
      console.log('Navbar: localStorage userRole value:', localStorage.getItem('userRole'));
      console.log('Navbar useEffect triggered. User Role from localStorage:', storedRole);
      setUserRole(storedRole);
    }
  }, [pathname]);

  let navItemsToDisplay = [...baseNavItems];

  if (isClient) {
    if (userRole === 'OWNER') {
      navItemsToDisplay.push({ href: '/owner/dashboard', label: 'حسابي (مالك)', icon: UserCircle });
    } else if (userRole === 'ADMIN') {
      navItemsToDisplay.push({ href: '/admin', label: 'حساب المسؤول', icon: ShieldCheck });
    } else if (userRole === 'ENGINEER') {
      if (pathname === '/') {
        navItemsToDisplay.push({ href: '/engineer/dashboard', label: 'حساب المهندس', icon: Briefcase });
      }
    }
  }

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-2 md:gap-x-4 gap-y-2 items-center">
        {navItemsToDisplay.map((item) => {
          const isActive = pathname === item.href;
          const isSpecialButton =
            item.href === '/owner/dashboard' ||
            item.href === '/admin' ||
            (item.href === '/engineer/dashboard' && userRole === 'ENGINEER');

          if (isSpecialButton) {
            return (
              <li key={item.href}>
                <div className="p-0.5 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center min-w-[90px] md:min-w-[120px] px-3 py-2 text-center font-semibold text-sm md:text-base transition-colors",
                      "bg-slate-900 text-white rounded-[0.45rem] hover:bg-slate-800"
                    )}
                  >
                    <item.icon size={18} className="ml-1.5 md:ml-2" />
                    {item.label}
                  </Link>
                </div>
              </li>
            );
          }

          return (
            <li key={item.href}>
              {item.href === '/contact' ? (
                <a
                  href="https://forms.gle/WaXPkD8BZMQ7pVev6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center min-w-[90px] md:min-w-[110px] px-2 py-2 text-center font-medium text-sm md:text-base rounded-md transition-colors",
                    "bg-transparent text-white hover:bg-transparent hover:text-app-gold"
                  )}
                >
                  <item.icon size={18} className="ml-1.5 md:ml-2" />
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center min-w-[90px] md:min-w-[110px] px-2 py-2 text-center font-medium text-sm md:text-base rounded-md transition-colors",
                    isActive
                      ? "bg-app-red text-white hover:text-app-gold"
                      : "bg-transparent text-white hover:bg-transparent hover:text-app-gold"
                  )}
                >
                  <item.icon size={18} className="ml-1.5 md:ml-2" />
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
