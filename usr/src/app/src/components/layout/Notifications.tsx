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
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex cursor-pointer items-center gap-2.5 rounded-lg bg-slate-700/50 p-2 text-left text-purple-200 transition-all hover:bg-slate-700 active:scale-95">
          <div className="rounded-lg border-2 border-purple-400/50 bg-purple-300/20 p-1.5">
              <Bell className="size-6 text-purple-300" />
          </div>
          <div className="font-semibold text-gray-200 hidden sm:block">الإشعارات</div>
           {hasNotifications && (
            <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-slate-800"></div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mt-2 p-0" align="end">
        <DropdownMenuLabel className="p-4 font-bold text-lg text-foreground">الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {hasNotifications ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <li key={notification.id} className="p-3 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <button className="cursor-pointer text-right font-semibold text-sm text-foreground hover:text-blue-600">
                      {notification.title}
                    </button>
                    <div className="text-xs text-muted-foreground shrink-0 pl-2">{notification.time}</div>
                  </div>
                  {notification.subtitle && <div className="text-xs text-muted-foreground mt-0.5">{notification.subtitle}</div>}
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
