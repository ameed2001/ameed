"use client";

import { Clock, Check, Info, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// The structure for a real notification
interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  time: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const hasNotifications = notifications.length > 0;

  const handleMarkAllAsRead = () => {
    // In a real app, this would update the state of notifications.
    // For now, we just show a toast.
    toast({ title: "تم تحديد الكل كمقروء", description: "تم تحديث حالة جميع إشعاراتك." });
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast({ title: "تم حذف الإشعارات", description: "تم مسح جميع الإشعارات بنجاح." });
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button className="button">
          الإشعارات
          <svg className="bell" viewBox="0 0 448 512">
            <path
              d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
            ></path>
          </svg>
          <div className="arrow">›</div>
          {hasNotifications && <div className="dot"></div>}
        </button>
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
                <div className="p-1 space-y-1">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
                    <Button
                      onClick={handleMarkAllAsRead}
                      variant="ghost"
                      className="w-full justify-start h-auto px-2 py-1.5 text-sm font-normal"
                    >
                      <Check className="ml-2 h-4 w-4" />
                      وضع علامة "مقروء" على الكل
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
                    <Button
                      onClick={handleDeleteAll}
                      variant="ghost"
                      className="w-full justify-start h-auto px-2 py-1.5 text-sm font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف جميع الإشعارات
                    </Button>
                  </DropdownMenuItem>
                </div>
            </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
