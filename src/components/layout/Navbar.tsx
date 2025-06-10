
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserCircle, Briefcase, ShieldCheck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast'; // Kept for potential future use
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
  // const router = useRouter(); // Kept for potential future use
  // const { toast } = useToast(); // Kept for potential future use

  useEffect(() => {
    setIsClient(true); // Component has mounted
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('userRole');
      setUserRole(storedRole);
    }
  }, [pathname]); // Re-check on pathname change, e.g., after login/logout

  let navItemsToDisplay = [...baseNavItems];

  if (isClient) { // Only modify nav items on the client after localStorage has been checked
    if (userRole === 'OWNER') {
      navItemsToDisplay.push({ href: '/owner/dashboard', label: 'حسابي (مالك)', icon: UserCircle });
    } else if (userRole === 'ENGINEER') {
      navItemsToDisplay.push({ href: '/my-projects', label: 'مشاريعي (مهندس)', icon: Briefcase });
    } else if (userRole === 'ADMIN') {
      navItemsToDisplay.push({ href: '/admin', label: 'حساب المسؤول', icon: ShieldCheck });
    }
  }
  
  // const handleLogout = () => {
  //   if (typeof window !== 'undefined') {
  //       localStorage.removeItem('userName');
  //       localStorage.removeItem('userRole');
  //       localStorage.removeItem('userEmail');
  //       localStorage.removeItem('userId');
  //   }
  //   toast({
  //     title: "تم تسجيل الخروج",
  //     description: "تم تسجيل خروجك بنجاح.",
  //     variant: "default",
  //   });
  //   router.push('/login');
  // };

  return (
    <nav className="bg-header-bg py-2.5 shadow-nav">
      <ul className="container mx-auto flex justify-center flex-wrap gap-x-2 md:gap-x-4 gap-y-2 items-center">
        {navItemsToDisplay.map((item) => {
          const isActive = pathname === item.href;
          const isSpecialButton = item.href === '/owner/dashboard' || item.href === '/admin';

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
        {/* Logout Button - kept commented for now as per current structure
        {userRole && ( // Show logout only if a user is logged in
            <li>
            <button
                onClick={handleLogout}
                className={cn(
                "flex items-center justify-center min-w-[90px] md:min-w-[110px] px-2 py-2 text-center font-medium text-sm md:text-base rounded-md transition-colors",
                "bg-transparent text-white hover:bg-red-600/40 hover:text-red-100"
                )}
            >
                <LogOut size={18} className="ml-1.5 md:ml-2" />
                تسجيل الخروج
            </button>
            </li>
        )}
        */}
      </ul>
    </nav>
  );
};

export default Navbar;
