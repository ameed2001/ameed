
"use client";

import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EngineerSidebar from '@/components/engineer/EngineerSidebar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function EngineerAppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('engineerSidebarState');
      setIsSidebarOpen(savedState ? savedState === 'open' : true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('engineerSidebarState', newState ? 'open' : 'closed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1" dir="rtl">
        <EngineerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main
          className={cn(
            "flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900/50 overflow-y-scroll transition-all duration-300 ease-in-out"
          )}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
