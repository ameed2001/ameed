
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Make the loader appear for a shorter, fixed duration
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1800); // Reduced duration for a faster feel

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!showLoader) {
    return <>{children}</>;
  }

  return (
    <div 
        className={cn(
            "flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white transition-opacity duration-700 ease-in-out",
            showLoader ? "opacity-100" : "opacity-0"
        )}
        style={{
            backgroundImage: "radial-gradient(circle, #1e293b, #0f172a 70%)"
        }}
    >
      <div className="relative flex justify-center items-center w-48 h-48">
        {/* Orbiting elements */}
        <div className="absolute w-full h-full border-2 border-app-gold/20 rounded-full animate-orbit" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-2/3 h-2/3 border-2 border-app-red/20 rounded-full animate-orbit" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute w-1/3 h-1/3 border-2 border-app-gold/30 rounded-full animate-orbit" style={{ animationDelay: '-2s' }}></div>
        
        {/* Pulsing Glow Effect */}
        <div className="absolute w-32 h-32 bg-app-gold rounded-full blur-2xl animate-pulse-glow opacity-30"></div>

        {/* Logo */}
        <Image
          src="https://i.imgur.com/79bO3U2.jpg"
          alt="شعار الموقع"
          width={100}
          height={100}
          className="rounded-full border-4 border-app-gold/80 shadow-2xl shadow-app-gold/20 z-10"
          data-ai-hint="logo construction"
          priority
        />
      </div>
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold text-app-red mb-2 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
          المحترف لحساب الكميات
        </h1>
        <p className="text-gray-400">جاري تحميل الأدوات الهندسية...</p>
      </div>
    </div>
  );
};

export default InitialLoader;
