
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

const authCardsData = [
    {
        id: "signup",
        title: "إنشاء حساب جديد",
        description: "انضم إلينا الآن وابدأ في إدارة مشاريعك بكفاءة.",
        icon: <UserPlus className="h-10 w-10 text-blue-500" />,
        backTitle: "خيارات التسجيل",
        backDescription: "اختر نوع الحساب الذي يناسبك.",
        backBg: "bg-gradient-to-br from-blue-700 to-blue-900",
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
        title: "تسجيل الدخول",
        description: "لديك حساب مهندس أو مالك؟ قم بالدخول لمتابعة أعمالك.",
        icon: <LogIn className="h-10 w-10 text-app-gold" />,
        backTitle: "خيارات الدخول",
        backDescription: "اختر بوابة الدخول المناسبة لحسابك.",
        backBg: "bg-gradient-to-br from-slate-700 to-slate-900",
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
        title: "دخول المسؤول",
        description: "هذا القسم مخصص لإدارة النظام والمستخدمين.",
        icon: <ShieldCheck className="h-10 w-10 text-app-red" />,
        backTitle: "لوحة تحكم المسؤول",
        backDescription: "الوصول إلى أدوات الإدارة الشاملة.",
        backBg: "bg-gradient-to-br from-red-700 to-red-900",
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
            <div key={card.id} className="card-container-3d h-80 transition-transform duration-500 hover:-translate-y-2">
              <div className="card-inner-3d">
                {/* Front Face */}
                <div className="card-face card-front-3d bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                </div>
                {/* Back Face */}
                <div className={cn("card-face card-back-3d text-white p-6 space-y-4", card.backBg)}>
                  <h3 className="text-2xl font-bold">{card.backTitle}</h3>
                  <p className="text-white/80 text-sm">{card.backDescription}</p>
                  <div className="w-full space-y-3 pt-2">
                    {card.actions.map((action) => (
                      <Button
                        key={action.href}
                        asChild
                        variant="outline"
                        className="w-full justify-between py-5 rounded-lg font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
