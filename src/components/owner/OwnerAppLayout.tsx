"use client";
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import OwnerSidebar from './OwnerSidebar'; // Still temporarily removed
// import { useState, useEffect } from 'react'; // Logic for sidebar still temporarily removed

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Still temporarily removed

  // useEffect(() => { // Still temporarily removed
  //   if (typeof window !== 'undefined') {
  //     const savedState = localStorage.getItem('ownerSidebarState');
  //     if (savedState) {
  //       setIsSidebarOpen(savedState === 'open');
  //     }
  //   }
  // }, []);

  // const toggleSidebar = () => { // Still temporarily removed
  //   const newState = !isSidebarOpen;
  //   setIsSidebarOpen(newState);
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('ownerSidebarState', newState ? 'open' : 'closed');
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-background"> {/* Changed bg-transparent to bg-background for visibility */}
      <Header />
      {/* The main content area will be simpler for now, without the sidebar */}
      <div className="flex flex-1 container mx-auto py-6">
        {/* <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} /> */} {/* Still temporarily removed */}
        <main className="flex-grow p-6 bg-card shadow-lg rounded-lg"> {/* Main content area takes full width for now */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
