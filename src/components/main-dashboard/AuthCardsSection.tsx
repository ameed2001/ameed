
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, UserPlus, HardHat, Home as HomeIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import InfoCard from '@/components/ui/InfoCard';
import React from 'react'; // Added React import

export default function AuthCardsSection() {
  const authCardActions = [
    {
      id: "user-login",
      title: "تسجيل الدخول",
      description: "لديك حساب مهندس أو مالك؟ قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.",
      icon: <LogIn className="h-10 w-10 text-app-gold mb-4" />,
      dataAiHint: "user login section",
      applyFlipEffect: true,
      cardHeightClass: "min-h-[320px] h-auto",
      backTitle: "خيارات تسجيل الدخول",
      backDescription: "اختر نوع الحساب الذي ترغب بتسجيل الدخول إليه.",
      actions: [
        { label: "دخول كمهندس", href: "/login", icon: <HardHat className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "bg-gray-100 text-green-700 border-2 border-green-500 hover:bg-green-100 hover:text-green-800"},
        { label: "دخول كمالك", href: "/owner-login", icon: <HomeIcon className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "bg-gray-100 text-purple-700 border-2 border-purple-500 hover:bg-purple-100 hover:text-purple-800"},
      ]
    },
    {
      id: "admin-login",
      title: "تسجيل دخول المسؤول",
      description: "هل أنت مسؤول النظام؟ قم بتسجيل الدخول للوصول إلى لوحة تحكم المسؤول.",
      icon: <ShieldCheck className="h-10 w-10 text-app-red mb-4" />,
      dataAiHint: "admin login section",
      applyFlipEffect: true,
      cardHeightClass: "min-h-[320px] h-auto",
      backTitle: "دخول المسؤول",
      backDescription: "تسجيل الدخول إلى لوحة تحكم إدارة النظام.",
      actions: [
        { label: "دخول كمسؤول", href: "/admin-login", icon: <ShieldCheck className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "bg-gray-100 text-red-700 border-2 border-red-500 hover:bg-red-100 hover:text-red-800" },
      ]
    },
    {
      id: "signup",
      title: "إنشاء حساب جديد",
      description: "ليس لديك حساب؟ انضم إلينا الآن وابدأ في إدارة مشاريعك بكفاءة.",
      icon: <UserPlus className="h-10 w-10 text-app-gold mb-4" />,
      dataAiHint: "signup section",
      applyFlipEffect: true,
      cardHeightClass: "min-h-[320px] h-auto",
      backTitle: "خيارات إنشاء حساب",
      backDescription: "اختر نوع الحساب الذي ترغب بإنشائه.",
      actions: [
        { label: "إنشاء حساب مهندس", href: "/signup", icon: <HardHat className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "bg-gray-100 text-green-700 border-2 border-green-500 hover:bg-green-100 hover:text-green-800" },
        { label: "إنشاء حساب مالك", href: "/owner-signup", icon: <HomeIcon className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "bg-gray-100 text-purple-700 border-2 border-purple-500 hover:bg-purple-100 hover:text-purple-800" },
      ]
    }
  ];

  return (
    <section id="auth-cards-section" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-app-red">
          ابدأ رحلتك معنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authCardActions.map((card) => (
            <InfoCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              dataAiHint={card.dataAiHint}
              applyFlipEffect={card.applyFlipEffect}
              cardHeightClass={card.cardHeightClass}
              iconWrapperClass="bg-transparent" 
              iconColorClass="" 
              backTitle={card.backTitle}
              backDescription={card.backDescription}
              backCustomContent={
                <div className="flex flex-col space-y-3 w-full p-4">
                  {card.actions.map(action => (
                    <Button asChild key={action.href} variant={action.variant} className={cn("w-full py-3 text-base font-semibold justify-between", action.className)}>
                      <Link href={action.href}>
                        <div className="flex items-center"> {/* Div for icon and text on the right */}
                          {React.cloneElement(action.icon, { className: cn(action.icon.props.className, "text-current") })} {/* Ensure icon inherits color */}
                          <span>{action.label}</span>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-current" /> {/* Ensure arrow inherits color and remove opacity */}
                      </Link>
                    </Button>
                  ))}
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
