'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const loadingSteps = [
    { text: "تحميل النواة", detail: "Loading system core...", icon: "⚙️" },
    { text: "تهيئة الأدوات", detail: "Initializing tools...", icon: "🛠️" },
    { text: "الاتصال بالخوادم", detail: "Connecting to servers...", icon: "🌐" },
    { text: "تحميل الواجهة", detail: "Rendering interface...", icon: "🎨" },
    { text: "اللمسات الأخيرة", detail: "Finalizing...", icon: "✨" },
    { text: "جاهز للانطلاق", detail: "Ready to go!", icon: "🚀" },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev < 40 ? 2.5 : prev < 80 ? 1.5 : 1.2;
        return Math.min(prev + increment + Math.random() * 0.5, 100);
      });
    }, 40);

    const timerInterval = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(((Date.now() - startTimeRef.current) / 1000).toFixed(1));
      }
    }, 250);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    const stepProgress = (progress / 100) * loadingSteps.length;
    const stepIndex = Math.floor(stepProgress);
    setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
  }, [progress, loadingSteps.length]);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 400);
      setTimeout(() => setShowLoader(false), 1000);
    }
  }, [progress]);

  const stepProgressFraction = (progress / 100) * loadingSteps.length;
  const stepInnerProgress = (stepProgressFraction % 1) * 100;

  if (!showLoader) return <>{children}</>;

  return (
    <div className={cn(
      "fixed inset-0 z-50 overflow-hidden transition-all duration-700 ease-out",
      fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
    )}>
      {/* الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-app-red/10 rounded-full blur-xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-app-gold/10 rounded-full blur-xl" />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* الشعار */}
        <div className="relative mb-10">
          <div className="absolute -inset-4 bg-gradient-to-r from-app-gold/10 via-app-red/10 to-app-gold/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm p-1 flex items-center justify-center">
              <Image
                src="https://i.imgur.com/79bO3U2.png"
                alt="Professional Logo"
                width={80}
                height={80}
                className="rounded-full border-2 border-app-gold"
              />
            </div>
          </div>
        </div>

        {/* العنوان */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            <span className="bg-gradient-to-r from-app-gold via-yellow-400 to-app-red bg-clip-text text-transparent">المحترف</span>
            <span className="text-white mx-2">لحساب</span>
            <span className="bg-gradient-to-r from-app-red via-red-400 to-app-gold bg-clip-text text-transparent">الكميات</span>
          </h1>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-app-gold to-transparent" />
          <p className="text-gray-400 text-xs font-medium uppercase">Professional Quantity Calculation System</p>
        </div>

        {/* نسبة التحميل */}
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="text-5xl font-mono font-bold mb-2">
              <span className="bg-gradient-to-r from-app-gold to-app-red bg-clip-text text-transparent">
                {String(Math.round(progress)).padStart(2, '0')}
              </span>
              <span className="text-gray-500 text-2xl">%</span>
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="relative">
            <div className="h-3 bg-gray-800/80 rounded-full border border-gray-700/50 overflow-hidden backdrop-blur-sm shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-app-gold via-yellow-400 to-app-red transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* المرحلة الحالية */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-2xl">{loadingSteps[currentStep]?.icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-right">{loadingSteps[currentStep]?.text}</p>
                <p className="text-gray-400 text-xs text-right">{loadingSteps[currentStep]?.detail}</p>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${stepInnerProgress}%` }}
              />
            </div>
          </div>

          {/* معلومات الأداء */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500 mt-6">
            <div className="space-y-1">
              <div className="text-app-gold font-mono">{Math.round(progress * 0.8)}MB</div>
              <div>الذاكرة</div>
            </div>
            <div className="space-y-1">
              <div className="text-app-gold font-mono">{Math.round(progress * 0.6)}%</div>
              <div>المعالج</div>
            </div>
            <div className="space-y-1">
              <div className="text-app-gold font-mono">{elapsedTime ? `${elapsedTime}s` : '--'}</div>
              <div>الزمن</div>
            </div>
          </div>
        </div>

        {/* التحميل النصي */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <div className="w-2 h-2 bg-app-gold rounded-full animate-pulse" />
            <span>جاري التحميل...</span>
            <div className="w-2 h-2 bg-app-gold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default InitialLoader;
