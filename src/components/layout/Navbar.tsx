"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Phone, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-14">
          <ul className="flex space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md font-medium text-sm transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}