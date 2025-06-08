
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus } from 'lucide-react';

const MainDashboardClient = () => {

  const authCards = [
    { 
      title: "تسجيل الدخول", 
      description: "قم بالوصول إلى حسابك الموجود لإدارة مشاريعك وحساباتك.",
      href: "/login", 
      icon: <LogIn />, 
      iconWrapperClass: "bg-blue-100 dark:bg-blue-800",
      iconColorClass: "text-blue-600 dark:text-blue-300",
      dataAiHint: "user login" 
    },
    { 
      title: "إنشاء حساب", 
      description: "انضم إلينا للاستفادة من جميع ميزات الموقع وحفظ تقدمك.",
      href: "/signup", 
      icon: <UserPlus />, 
      iconWrapperClass: "bg-green-100 dark:bg-green-800",
      iconColorClass: "text-green-600 dark:text-green-300",
      dataAiHint: "new user" 
    },
  ];

  return (
    <>
      <div 
        id="auth-cards-section" 
        className="container mx-auto px-4 py-12 text-center"
      >
        <div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto"
            style={{minHeight: 'calc(100vh - 400px - 150px - 3rem)'}} // Adjusted minHeight to account for padding
        >
          {authCards.map(card => (
            <InfoCard 
              key={card.title}
              title={card.title} 
              description={card.description}
              href={card.href}
              icon={card.icon}
              iconWrapperClass={card.iconWrapperClass}
              iconColorClass={card.iconColorClass}
              dataAiHint={card.dataAiHint}
              className="min-h-[240px] sm:min-h-[260px]" // Ensure cards have a minimum height
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainDashboardClient;
