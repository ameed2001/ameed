"use client";

import { Bell, MessageSquare, UserCheck, Clock, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// The structure for a real notification
interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  time: string;
}


export default function Notifications() {
  // Use state to hold notifications. For now, it's empty.
  // This can be populated via API call in a useEffect hook in the future.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-slate-700/80">
          <Bell className="h-6 w-6" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-app-red"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mt-2" align="end">
        <DropdownMenuLabel className="font-semibold">الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {hasNotifications ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{notification.time}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
             <div className="text-center text-gray-500 p-6">
                <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">لا توجد إشعارات جديدة.</p>
            </div>
          )}
        </div>
        {hasNotifications && (
            <>
                <DropdownMenuSeparator />
                <div className="p-1">
                    <Button variant="ghost" className="w-full text-center text-sm justify-center">
                        <Check className="h-4 w-4 ml-2" />
                        وضع علامة "مقروء" على الكل
                    </Button>
                </div>
            </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
