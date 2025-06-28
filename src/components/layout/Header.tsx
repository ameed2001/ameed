"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      <div className="flex gap-2">
        <Button asChild variant="outline">
            <Link href="/login">تسجيل الدخول</Link>
        </Button>
         <Button asChild>
            <Link href="/signup">إنشاء حساب</Link>
        </Button>
      </div>
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


export default function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.imgur.com/79bO3U2.jpg"
              alt="شعار الموقع"
              width={48}
              height={48}
              className="rounded-full border-2 border-primary"
              data-ai-hint="logo construction"
            />
            <span className="font-bold text-xl">المحترف لحساب الكميات</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
           {isClient && <UserNav />}
        </div>
      </div>
    </header>
  );
}