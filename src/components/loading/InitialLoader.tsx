
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time to ensure user sees the loader.
    // In a real app, this might depend on data fetching.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white">
        <Image
          src="https://i.imgur.com/79bO3U2.png"
          alt="شعار الموقع"
          width={120}
          height={120}
          className="rounded-full border-4 border-app-gold shadow-lg mb-6 animate-pulse"
          data-ai-hint="logo construction"
        />
        <Loader2 className="h-10 w-10 animate-spin text-app-gold mb-4" />
        <h1 className="text-2xl font-bold text-app-red mb-2">جاري تحميل الموقع...</h1>
        <p className="text-gray-400">يرجى الانتظار قليلاً.</p>
    </div>
  );
};

export default InitialLoader;
