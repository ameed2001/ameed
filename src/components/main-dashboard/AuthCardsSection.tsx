import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  HardHat,
  Home as HomeIcon,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

// Data for the authentication cards, ordered for RTL display (right-to-left)
const authCardsData = [
    {
        id: "signup",
        title: "إنشاء حساب جديد",
        description: "ليس لديك حساب؟ انضم إلينا الآن وابدأ في إدارة مشاريعك بكفاءة.",
        icon: <UserPlus className="h-10 w-10 text-blue-600" />,
        actionsTitle: "خيارات انشاء حساب",
        actions: [
            {
                label: "إنشاء حساب مهندس",
                href: "/signup",
                icon: <HardHat className="h-5 w-5" />,
                className: "border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800",
            },
            {
                label: "إنشاء حساب مالك",
                href: "/owner-signup",
                icon: <HomeIcon className="h-5 w-5" />,
                className: "border-purple-500 text-purple-700 hover:bg-purple-50 hover:text-purple-800",
            },
        ],
    },
    {
        id: "admin-login",
        title: "تسجيل دخول المسؤول",
        description: "هل أنت مسؤول النظام؟ قم بتسجيل الدخول للوصول إلى لوحة تحكم المسؤول.",
        icon: <ShieldCheck className="h-10 w-10 text-app-red" />,
        actionsTitle: "دخول المسؤول",
        actions: [
            {
                label: "دخول كمسؤول",
                href: "/admin-login",
                icon: <ShieldCheck className="h-5 w-5" />,
                className: "border-red-500 text-red-700 hover:bg-red-50 hover:text-red-800",
            },
        ],
    },
    {
        id: "user-login",
        title: "تسجيل الدخول",
        description: "لديك حساب مهندس أو مالك؟ قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.",
        icon: <LogIn className="h-10 w-10 text-app-gold" />,
        actionsTitle: "خيارات تسجيل الدخول",
        actions: [
            {
                label: "دخول كمهندس",
                href: "/login",
                icon: <HardHat className="h-5 w-5" />,
                className: "border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800",
            },
            {
                label: "دخول كمالك",
                href: "/owner-login",
                icon: <HomeIcon className="h-5 w-5" />,
                className: "border-purple-500 text-purple-700 hover:bg-purple-50 hover:text-purple-800",
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
            <Card key={card.id} className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Top Section */}
                <CardContent className="p-8 text-center flex-grow flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                        {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                </CardContent>

                {/* Bottom Section */}
                <div className="bg-gray-50 p-6 space-y-4 border-t">
                    <h4 className="text-lg font-semibold text-gray-400 text-center">{card.actionsTitle}</h4>
                    <div className="space-y-3">
                        {card.actions.map((action) => (
                            <Button
                                key={action.href}
                                asChild
                                variant="outline"
                                className={cn("w-full justify-between py-6 rounded-full font-semibold border-2", action.className)}
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}