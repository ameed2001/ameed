"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-header-bg py-3 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-2 gap-y-2 md:gap-x-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "nav-link-animated flex items-center justify-center w-full md:w-32 px-3 py-3 text-center font-bold text-sm md:text-base rounded-md",
                  "text-nav-link hover:text-nav-link-hover hover:shadow-lg",
                  isActive ? "text-nav-link-hover bg-black/20" : ""
                )}
              >
                <item.icon size={18} className="ms-2" />
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
