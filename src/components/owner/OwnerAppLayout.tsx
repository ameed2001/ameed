
"use client";

import OwnerSidebar from './OwnerSidebar';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))] overflow-hidden"> {/* Adjust height based on header/footer if they are fixed */}
        {/* Ensure OwnerSidebar is sticky or fixed if Header/Footer take space */}
        <OwnerSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      {/* Define CSS variables for header/footer height if needed for calc() */}
      <style jsx global>{`
        :root {
          --header-height: 98px; /* Approximate height of your Header, adjust as needed */
          --footer-height: 150px; /* Approximate height of your Footer, adjust as needed */
        }
      `}</style>
    </div>
  );
}
