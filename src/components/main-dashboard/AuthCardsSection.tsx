"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  HardHat,
  Home as HomeIcon,
  ShieldCheck,
  ArrowLeft,
  ChevronsLeft,
  LogIn as LogInIcon,
  UserPlus as UserPlusIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

const authCardsData = [
  {
    id: "signup",
    icon: <UserPlus className="h-6 w-6 text-blue-500" />,
    title: "إنشاء حساب جديد",
    description: "انضم إلينا الآن وابدأ في إدارة مشاريعك بكفاءة.",
    bgColor: "bg-blue-600",
    hoverBgColor: "hover:bg-blue-700",
    buttonBgColor: "bg-blue-500 hover:bg-blue-600",
    bottomTitle: "خيارات التسجيل",
    bottomDescription: "اختر نوع الحساب الذي يناسبك.",
    actions: [
      {
        label: "إنشاء حساب مهندس",
        href: "/signup",
        icon: <HardHat className="h-5 w-5" />,
      },
      {
        label: "إنشاء حساب مالك",
        href: "/owner-signup",
        icon: <HomeIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "user-login",
    icon: <LogInIcon className="h-6 w-6 text-yellow-500" />,
    title: "تسجيل الدخول",
    description: "لديك حساب مهندس أو مالك؟ قم بالدخول لمتابعة أعمالك.",
    bgColor: "bg-slate-800",
    hoverBgColor: "hover:bg-slate-900",
    buttonBgColor: "bg-slate-700 hover:bg-slate-600",
    bottomTitle: "خيارات الدخول",
    bottomDescription: "اختر بوابة الدخول المناسبة لحسابك.",
    actions: [
      {
        label: "دخول كمهندس",
        href: "/login",
        icon: <HardHat className="h-5 w-5" />,
      },
      {
        label: "دخول كمالك",
        href: "/owner-login",
        icon: <HomeIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "admin-login",
    icon: <ShieldCheck className="h-6 w-6 text-red-500" />,
    title: "دخول المسؤول",
    description: "هذا القسم مخصص لإدارة النظام والمستخدمين.",
    bgColor: "bg-app-red",
    hoverBgColor: "hover:bg-red-700",
    buttonBgColor: "bg-red-700 hover:bg-red-800",
    bottomTitle: "لوحة تحكم المسؤول",
    bottomDescription: "الوصول إلى أدوات الإدارة الشاملة.",
    actions: [
      {
        label: "دخول كمسؤول",
        href: "/admin-login",
        icon: <ShieldCheck className="h-5 w-5" />,
      },
    ],
  },
];

export default function AuthCardsSection() {
  return (
    <section id="auth-cards-section" className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-app-red">
          ابدأ رحلتك معنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authCardsData.map((card) => (
            <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2">
              {/* Top white part */}
              <div className="p-8 relative text-right">
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-inner">
                    {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 mt-8">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed h-12">{card.description}</p>
              </div>

              {/* Bottom colored part */}
              <div className={cn("p-8 text-white flex-grow flex flex-col text-right", card.bgColor)}>
                <h3 className="text-2xl font-bold mb-2">{card.bottomTitle}</h3>
                <p className="text-white/80 text-sm mb-6 flex-grow">{card.bottomDescription}</p>
                <div className="w-full space-y-3">
                  {card.actions.map((action) => (
                    <Button
                      key={action.href}
                      asChild
                      variant="ghost"
                      className={cn("w-full justify-between py-5 px-4 rounded-lg font-semibold border-white/20 border bg-white/10 text-white hover:bg-white/20 hover:text-white")}
                    >
                      <Link href={action.href}>
                        <span className="flex items-center gap-2">
                          {action.icon}
                          {action.label}
                        </span>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
