
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, FileText, GanttChartSquare, BotMessageSquare } from 'lucide-react'; // Added more icons
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/documents', label: 'المستندات', icon: FileText },
  { href: '/timeline', label: 'الجدول الزمني', icon: GanttChartSquare },
  { href: '/ai-report-generator', label: 'مولد التقارير AI', icon: BotMessageSquare },
  { href: '/contact', label: 'اتصل بنا', icon: Phone },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-1 md:gap-x-3 gap-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "nav-link-animated flex items-center justify-center w-full min-w-[100px] md:min-w-[120px] px-2 py-2.5 text-center font-bold text-xs sm:text-sm md:text-base rounded-md",
                  "text-nav-link hover:text-nav-link-hover", // Uses CSS variables for colors
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

    