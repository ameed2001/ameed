"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Info, Phone, HelpCircle } from "lucide-react";

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  // Removed sticky classes to make navbar scroll with the page
  return (
    <nav className="bg-gray-800 shadow-lg"> 
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
