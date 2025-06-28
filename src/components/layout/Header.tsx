
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home, Info, Phone, HelpCircle, UserCircle, LogOut, Menu, User, Settings, LayoutDashboard, Instagram, Facebook, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// SVG for WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);


const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },  
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

function UserNav() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setUserName(null);
    router.push('/login');
  };

  const getDashboardLink = () => {
    switch(userRole) {
      case 'ADMIN': return '/admin';
      case 'ENGINEER': return '/engineer/dashboard';
      case 'OWNER': return '/owner/dashboard';
      default: return '/';
    }
  };

  if (!userRole) {
    return (
      <Button asChild className="bg-app-gold hover:bg-yellow-500 text-gray-900 font-bold">
        <Link href="/login">تسجيل الدخول</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${userName?.charAt(0)}`} alt={userName || 'User'} data-ai-hint="user avatar" />
            <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 text-right">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getDashboardLink()}>
            <LayoutDashboard className="ml-2 h-4 w-4" />
            <span>لوحة التحكم</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserCircle className="ml-2 h-4 w-4" />
            <span>الملف الشخصي</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Header = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute:'2-digit' }));
    }, 60000); // Update every minute
    setCurrentTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute:'2-digit' })); // Initial set
    return () => clearInterval(timer);
  }, []);
  
  const todayDate = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Info Bar */}
      <div className="bg-slate-800 text-slate-300 py-1">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
             <a href="https://wa.me/972594371424" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><WhatsAppIcon className="h-4 w-4" /></a>
             <a href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="h-4 w-4" /></a>
             <a href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="h-4 w-4" /></a>
          </div>
           {isClient && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4"/>
              <span>{todayDate} | {currentTime}</span>
            </div>
           )}
        </div>
      </div>
      
      {/* Main Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="https://i.imgur.com/79bO3U2.jpg" 
                alt="شعار الموقع" 
                width={40} 
                height={40} 
                className="rounded-full border-2 border-primary"
                data-ai-hint="logo construction"
              />
              <span className="font-bold text-lg">المحترف لحساب الكميات</span>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md p-3 text-lg font-medium transition-colors",
                          pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6 text-sm font-medium mx-auto">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            {isClient && <UserNav />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
