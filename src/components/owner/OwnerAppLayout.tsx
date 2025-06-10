"use client"; // This is crucial

import type { ReactNode } from 'react';
// import Header from '@/components/layout/Header'; // Temporarily removed
// import Footer from '@/components/layout/Footer'; // Temporarily removed
// import OwnerSidebar from '@/components/owner/OwnerSidebar'; // Temporarily removed
// import { useState, useEffect } from 'react'; // Temporarily removed useState and useEffect
import { cn } from '@/lib/utils';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedState = localStorage.getItem('ownerSidebarState');
  //     setIsSidebarOpen(savedState ? savedState === 'open' : true);
  //   }
  // }, []);

  // const toggleSidebar = () => {
  //   const newState = !isSidebarOpen;
  //   setIsSidebarOpen(newState);
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('ownerSidebarState', newState ? 'open' : 'closed');
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', textAlign: 'center', backgroundColor: '#ffeeee' }}>
        OwnerAppLayout Shell (Simplified - Header Removed)
      </div>
      <div className="flex flex-grow">
        {/* <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} /> */}
        <div style={{ border: '2px dashed blue', padding: '10px', margin: '10px', textAlign: 'center', flexGrow: 1, backgroundColor: '#eeeeff' }}>
          OwnerSidebar Placeholder Area
        </div>
        <main className={cn(
          "flex-grow container mx-auto py-6 px-4 overflow-y-auto w-full transition-all duration-300 ease-in-out",
          "border-2 border-dashed green-500 bg-green-50 p-4" // Styling to see the main content area
        )}>
          {children}
        </main>
      </div>
      <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', textAlign: 'center', backgroundColor: '#ffeeee' }}>
        OwnerAppLayout Shell (Simplified - Footer Removed)
      </div>
    </div>
  );
}
