
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Info, Phone, HelpCircle, HardHat, User, GanttChartSquare, FolderArchive, FilePenLine } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/documents', label: 'إدارة المستندات', icon: FolderArchive },
  { href: '/timeline', label: 'الجداول الزمنية', icon: GanttChartSquare },
  { href: '/ai-report-generator', label: 'مولد التقارير الذكي', icon: FilePenLine },
  { href: '/help', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-700 text-white shadow-nav sticky top-0 z-30">
      <div className="container mx-auto flex justify-center items-center">
        <ul className="flex items-center space-x-2 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-slate-600",
                  pathname === link.href ? 'bg-app-red text-white' : 'text-gray-300'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
