
"use client"; // This is crucial

import type { ReactNode } from 'react';
import Header from '@/components/layout/Header'; 
import Footer from '@/components/layout/Footer'; 
import OwnerSidebar from '@/components/owner/OwnerSidebar'; 
import { useState, useEffect } from 'react'; 
import { cn } from '@/lib/utils';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('ownerSidebarState');
      setIsSidebarOpen(savedState ? savedState === 'open' : true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ownerSidebarState', newState ? 'open' : 'closed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-grow">
        <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className={cn(
          "flex-grow container mx-auto py-6 px-4 overflow-y-auto w-full transition-all duration-300 ease-in-out"
        )}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
