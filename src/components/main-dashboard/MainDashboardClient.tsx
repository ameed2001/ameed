
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus } from 'lucide-react';

const MainDashboardClient = () => {

  const authCards = [
    { title: "تسجيل الدخول", href: "/login", icon: <LogIn size={48} />, dataAiHint: "user login" },
    { title: "إنشاء حساب", href: "/signup", icon: <UserPlus size={48} />, dataAiHint: "new user" },
  ];

  return (
    <>
      {/* Add an ID here for the scroll target */}
      <div 
        id="auth-cards-section" 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 justify-items-center items-center pt-12 pb-12" 
        style={{minHeight: 'calc(100vh - 400px - 150px)'}}
      >
        {authCards.map(card => (
          <InfoCard 
            key={card.title}
            title={card.title} 
            href={card.href}
            icon={card.icon}
            dataAiHint={card.dataAiHint}
          />
        ))}
      </div>
    </>
  );
};

export default MainDashboardClient;
