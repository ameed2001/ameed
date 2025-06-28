
"use client";

import { Bell, MessageSquare, UserCheck, Clock, Check, Info, Trash2 } from "lucide-react";
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

// Mock notifications for demonstration purposes.
// This can be replaced with a real data fetch later.
const initialNotifications: Notification[] = [
  {
    id: '1',
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    title: 'لديك رسالة جديدة من م. أحمد خالد',
    time: 'منذ 5 دقائق',
  },
  {
    id: '2',
    icon: <UserCheck className="h-4 w-4 text-green-500" />,
    title: 'تمت الموافقة على طلب انضمامك لمشروع "فيلا السعادة"',
    time: 'منذ 2 ساعة',
  },
  {
    id: '3',
    icon: <Clock className="h-4 w-4 text-orange-500" />,
    title: 'تذكير: موعد تسليم مرحلة الأساسات بعد 3 أيام',
    time: 'أمس',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
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
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-muted">
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
