"use client";

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    "جاري تهيئة النظام...",
    "تحميل المكتبات الهندسية...",
    "معايرة أدوات الحساب...",
    "بناء الواجهات التفاعلية...",
    "التحقق من معايير البناء...",
    "إعداد بيئة العمل...",
    "اللمسات النهائية...",
    "أوشكنا على الانتهاء!",
    "مرحباً بك!"
  ];

  // Effect to run the timers
  useEffect(() => {
    // Controls the progress bar percentage
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        // Adjusted speed to better match the number of steps
        return prev + 2; // Increased speed
      });
    }, 25); // Faster interval

    // Controls which loading text is shown
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 250); // Faster text change

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [loadingSteps.length]);

  // Effect to hide the loader once progress is 100%
  useEffect(() => {
    if (progress >= 100) {
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 300); // Shorter wait time
      return () => clearTimeout(hideTimer);
    }
  }, [progress]);

  if (!showLoader) {
    return <>{children}</>;
  }

  return (
    <div 
        className={cn(
            "flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white transition-all duration-1000 ease-in-out",
            showLoader ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
            backgroundImage: "radial-gradient(circle at center, #1e293b 0%, #0f172a 50%, #020617 100%)"
        }}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-app-gold/20 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-app-red/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-app-gold/15 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative flex justify-center items-center w-56 h-56 mb-8">
        {/* دوائر متحركة محسنة */}
        <div className="absolute w-full h-full border-2 border-app-gold/30 rounded-full animate-spin-slow" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-4/5 h-4/5 border-2 border-app-red/25 rounded-full animate-spin-reverse" style={{ animationDelay: '-0.5s' }}></div>
        <div className="absolute w-3/5 h-3/5 border-2 border-app-gold/40 rounded-full animate-spin-slow" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute w-2/5 h-2/5 border border-app-red/30 rounded-full animate-spin-reverse" style={{ animationDelay: '-1.5s' }}></div>
        
        {/* تأثير الوهج المحسن */}
        <div className="absolute w-40 h-40 bg-gradient-to-r from-app-gold/20 to-app-red/20 rounded-full blur-3xl animate-pulse-custom opacity-40"></div>
        <div className="absolute w-24 h-24 bg-app-gold/30 rounded-full blur-xl animate-pulse-custom opacity-50" style={{ animationDelay: '0.5s' }}></div>

        {/* الشعار مع تأثيرات محسنة */}
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-app-gold/50 to-app-red/50 rounded-full blur-md animate-pulse-custom"></div>
          <Image
            src="https://i.imgur.com/79bO3U2.jpg"
            alt="شعار الموقع"
            width={120}
            height={120}
            className="relative rounded-full border-4 border-gradient-to-r from-app-gold to-app-red shadow-2xl shadow-app-gold/30 transform hover:scale-105 transition-transform duration-300"
            data-ai-hint="logo construction"
            priority
          />
        </div>

        {/* دائرة التقدم */}
        <div className="absolute w-full h-full">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* الدائرة الخلفية */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-700/50"
            />
            {/* دائرة التقدم */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out drop-shadow-lg"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* معلومات التحميل */}
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        {/* العنوان */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-app-gold to-app-red bg-clip-text text-transparent title-glowing">
          المحترف لحساب الكميات
        </h1>
        
        {/* النسبة المئوية */}
        <div className="relative">
          <div className="text-6xl font-bold text-white mb-2 font-mono tracking-wider">
            <span className="bg-gradient-to-r from-app-gold to-app-red bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* شريط التقدم الإضافي */}
          <div className="w-64 mx-auto h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-app-gold to-app-red transition-all duration-300 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse-custom"></div>
            </div>
          </div>
        </div>

        {/* خطوة التحميل الحالية */}
        <p className="text-lg text-gray-300 font-medium min-h-[28px] transition-all duration-300">
          {loadingSteps[currentStep]}
        </p>

        {/* مؤشرات نقطية */}
        <div className="flex justify-center space-x-1 rtl:space-x-reverse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-app-gold/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* تأثيرات CSS مخصصة */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-custom {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes title-glow {
          0%, 100% { text-shadow: 0 0 8px hsla(var(--primary), 0.5), 0 0 16px hsla(var(--primary), 0.3); }
          50% { text-shadow: 0 0 16px hsla(var(--primary), 0.8), 0 0 32px hsla(var(--primary), 0.5); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        
        .animate-pulse-custom {
          animation: pulse-custom 2.5s ease-in-out infinite;
        }

        .title-glowing {
          animation: title-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default InitialLoader;
