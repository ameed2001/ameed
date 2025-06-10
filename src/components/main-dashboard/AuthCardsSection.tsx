
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, UserPlus, HardHat, Home as HomeIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import InfoCard from '@/components/ui/InfoCard'; // Import InfoCard

export default function AuthCardsSection() {
  const authCardActions = [
    {
      id: "login",
      title: "تسجيل الدخول",
      description: "لديك حساب بالفعل؟ قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.",
      icon: <LogIn className="h-10 w-10 text-app-gold mb-4" />,
      dataAiHint: "login section",
      backTitle: "خيارات تسجيل الدخول",
      backDescription: "اختر نوع الحساب الذي ترغب بتسجيل الدخول إليه.",
      actions: [
        { label: "دخول كمهندس", href: "/login", icon: <HardHat className="ms-2 h-5 w-5" />, variant: "default" as const, className: "bg-green-600 hover:bg-green-700 text-white"},
        { label: "دخول كمالك", href: "/owner-login", icon: <HomeIcon className="ms-2 h-5 w-5" />, variant: "default" as const, className: "bg-purple-600 hover:bg-purple-700 text-white"},
        { label: "دخول كمسؤول", href: "/admin-login", icon: <ShieldCheck className="ms-2 h-5 w-5" />, variant: "destructive" as const },
      ]
    },
    {
      id: "signup",
      title: "إنشاء حساب جديد",
      description: "ليس لديك حساب؟ انضم إلينا الآن وابدأ في إدارة مشاريعك بكفاءة.",
      icon: <UserPlus className="h-10 w-10 text-app-gold mb-4" />,
      dataAiHint: "signup section",
      backTitle: "خيارات إنشاء حساب",
      backDescription: "اختر نوع الحساب الذي ترغب بإنشائه.",
      actions: [
        { label: "إنشاء حساب مهندس", href: "/signup", icon: <HardHat className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "border-green-500 text-green-700 hover:bg-green-500 hover:text-white" },
        { label: "إنشاء حساب مالك", href: "/owner-signup", icon: <HomeIcon className="ms-2 h-5 w-5" />, variant: "outline" as const, className: "border-purple-500 text-purple-700 hover:bg-purple-500 hover:text-white" },
      ]
    }
  ];

  return (
    <section id="auth-cards-section" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-app-red">
          ابدأ رحلتك معنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {authCardActions.map((card) => (
            <InfoCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              dataAiHint={card.dataAiHint}
              applyFlipEffect={true}
              cardHeightClass="min-h-[320px] h-auto" // Adjust height as needed
              iconWrapperClass="bg-transparent" // Icon is already styled
              iconColorClass="" // Icon is already styled
              backTitle={card.backTitle}
              backDescription={card.backDescription}
              backCustomContent={
                <div className="flex flex-col space-y-3 w-full p-4">
                  {card.actions.map(action => (
                    <Button asChild key={action.href} variant={action.variant} className={cn("w-full py-3 text-base font-semibold justify-between", action.className)}>
                      <Link href={action.href}>
                        <div className="flex items-center">
                          {action.icon}
                          <span>{action.label}</span>
                        </div>
                        <ArrowLeft className="h-5 w-5 opacity-70" />
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
