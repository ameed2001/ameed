"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Info, Phone, HelpCircle, GanttChartSquare, FolderArchive, FilePenLine } from "lucide-react";

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/documents', label: 'إدارة المستندات', icon: FolderArchive },
  { href: '/timeline', label: 'الجداول الزمنية', icon: GanttChartSquare },
  { href: '/ai-report-generator', label: 'مولد التقارير الذكي', icon: FilePenLine },
  { href: '/help', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  // The header's height is 40px (top bar) + 80px (main header) = 120px
  // The navbar height is 56px.
  return (
    <nav className="bg-gray-800 shadow-lg sticky top-[120px] z-40"> 
        <div className="container mx-auto px-4">
            <ul className="flex justify-center items-center h-14">
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors", pathname === link.href && "text-app-gold bg-gray-700/80")}>
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
  );
}
