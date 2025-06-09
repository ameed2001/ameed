
"use client";

import Link from 'next/link';
import { Home, Info, Phone, HelpCircle, UserCircle } from 'lucide-react'; // Added UserCircle
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast'; // Kept for potential future use
import { useEffect, useState } from 'react'; // Added useEffect and useState

const baseNavItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

const Navbar = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  // const router = useRouter(); // Kept for potential future use
  // const { toast } = useToast(); // Kept for potential future use

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('userRole');
      setUserRole(storedRole);
    }
  }, [pathname]); // Re-check on pathname change, e.g., after login/logout

  let allNavItems = [...baseNavItems];

  if (userRole === 'OWNER') {
    allNavItems.push({ href: '/owner/dashboard', label: 'حسابي', icon: UserCircle }); // Add "حسابي" to the end
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
