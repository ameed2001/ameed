
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from './OwnerSidebar';
import { useState, useEffect, type ReactNode } from 'react';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('ownerSidebarState');
    if (savedState) {
      setIsSidebarOpen(savedState === 'open');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('ownerSidebarState', newState ? 'open' : 'closed');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      <div className="flex flex-1 pt-0"> {/* flex-1 allows this div to grow and fill space between header and footer */}
        <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        {/* Content area takes remaining space and handles its own scrolling and background */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
