
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowLoader(false), 500); 
          return 100;
        }
        return oldProgress + 1;
      });
    }, 25); 

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!showLoader) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white transition-opacity duration-500" style={{ opacity: showLoader ? 1 : 0 }}>
      <div className="text-center">
        <Image
          src="https://i.imgur.com/79bO3U2.jpg"
          alt="شعار الموقع"
          width={120}
          height={120}
          className="rounded-full border-4 border-app-gold shadow-lg mb-4 mx-auto animate-pulse"
          data-ai-hint="logo construction"
        />
        <h1 className="text-3xl font-bold text-app-red mb-2">المحترف لحساب الكميات</h1>
        <p className="text-gray-400 mb-6">تحميل المكونات الأساسية، يرجى الانتظار...</p>
        
        <div className="w-full max-w-sm mx-auto bg-slate-700 rounded-full h-3 border border-slate-600">
          <div
            className="bg-gradient-to-r from-app-gold to-yellow-400 h-full rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-app-gold text-2xl font-bold mt-3 tracking-widest">{progress}%</p>
      </div>
    </div>
  );
};

export default InitialLoader;
