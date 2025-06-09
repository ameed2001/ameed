"use client";

import OwnerSidebar from './OwnerSidebar';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 overflow-y-auto"> {/* Changed from overflow-auto */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
