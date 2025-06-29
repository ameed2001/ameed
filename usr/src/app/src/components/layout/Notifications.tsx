
"use client";

import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuFooter,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
}

// Example notifications to showcase the design
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'تمت الموافقة على مشروعك',
    subtitle: 'مشروع "فيلا الياسمين" جاهز للبدء.',
    time: 'قبل دقيقتين',
  },
  {
    id: '2',
    title: 'تعليق جديد من المالك',
    subtitle: 'بخصوص "تعديلات الواجهة الأمامية"',
    time: 'قبل 14 دقيقة',
  },
  {
    id: '3',
    title: 'تذكير: تسليم تقرير التكلفة',
    subtitle: 'لمشروع "برج المملكة"',
    time: 'قبل ساعة',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 p-0">
          <Bell className="h-6 w-6 text-white" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mt-2 p-0" align="end">
        <DropdownMenuLabel className="p-3 font-semibold text-right">الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {hasNotifications ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <li key={notification.id} className="p-3 hover:bg-muted/50 text-right">
                  <Link href="#" className="block">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-foreground truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0 pl-2">{notification.time}</p>
                    </div>
                    {notification.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{notification.subtitle}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <BellOff className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">لا توجد إشعارات جديدة.</p>
            </div>
          )}
        </div>
        {hasNotifications && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuFooter className="p-1">
              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="#">عرض كل الإشعارات</Link>
              </Button>
            </DropdownMenuFooter>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
