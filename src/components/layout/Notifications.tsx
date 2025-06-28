"use client";

import { Bell, MessageSquare, UserCheck, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demonstration
const notifications = [
  {
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    title: "تعليق جديد على مشروع 'فيلا'",
    time: "قبل 5 دقائق",
  },
  {
    icon: <UserCheck className="h-4 w-4 text-green-500" />,
    title: "وافق المسؤول على مشروعك الجديد",
    time: "قبل ساعة",
  },
  {
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    title: "رسالة جديدة من المالك 'عميد سماره'",
    time: "أمس",
  },
];

export default function Notifications() {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-slate-700/80">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-app-red"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mt-2" align="end">
        <DropdownMenuLabel className="font-semibold">الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification, index) => (
            <DropdownMenuItem key={index} className="flex items-start gap-3 p-3">
              <div className="flex-shrink-0 mt-1">{notification.icon}</div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{notification.time}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
            <Button variant="ghost" className="w-full text-center text-sm justify-center">
                <Check className="h-4 w-4 ml-2" />
                وضع علامة "مقروء" على الكل
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
