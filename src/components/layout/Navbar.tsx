
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, LogOut } from 'lucide-react'; // Added LogOut
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Added useToast

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
      variant: "default",
    });
    router.push('/login');
  };

  const allNavItems = [...navItems];

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-2 md:gap-x-4 gap-y-2 items-center">
        {allNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
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
            </li>
          );
        })}
        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center justify-center min-w-[90px] md:min-w-[110px] px-2 py-2 text-center font-medium text-sm md:text-base rounded-md transition-colors",
              "bg-transparent text-white hover:bg-red-600/40 hover:text-red-100" // Distinct hover for logout
            )}
          >
            <LogOut size={18} className="ml-1.5 md:ml-2" />
            تسجيل الخروج
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
