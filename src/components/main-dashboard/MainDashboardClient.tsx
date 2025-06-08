
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { LogIn, UserPlus } from 'lucide-react';

const MainDashboardClient = () => {
  // Modals and related state are removed as cards triggering them are removed.
  // If any of these modals were to be triggered by other means, their state management would remain.

  const authCards = [
    { title: "تسجيل الدخول", href: "/login", icon: <LogIn size={48} />, dataAiHint: "user login" },
    { title: "إنشاء حساب", href: "/signup", icon: <UserPlus size={48} />, dataAiHint: "new user" },
  ];

  return (
    <>
      {/* HeroSection is moved to page.tsx and MainDashboardClient is wrapped in a container there */}
      {/* The main container div with ID "calculators-section" might no longer be needed if Hero button action changes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 justify-items-center items-center pt-12 pb-12" style={{minHeight: 'calc(100vh - 400px - 150px)'}}> {/* Adjusted grid for 2 cards and ensure some height */}
        {authCards.map(card => (
          <InfoCard 
            key={card.title}
            title={card.title} 
            href={card.href} // Pass href to InfoCard
            icon={card.icon}
            dataAiHint={card.dataAiHint}
          />
        ))}
      </div>
      {/* Modals (Concrete, Steel, Guidelines, Price) are removed as their trigger cards are gone. */}
    </>
  );
};

export default MainDashboardClient;
