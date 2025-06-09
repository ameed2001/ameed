
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from './OwnerSidebar';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* The main Navbar is intentionally omitted here for the owner layout */}
      <div className="flex flex-1 container mx-auto mt-0 rtl"> {/* Ensure RTL for layout */}
        <main className="flex-grow p-6 bg-background/90 shadow-inner rounded-r-lg"> {/* Main content area */}
          {children}
        </main>
        <OwnerSidebar /> {/* Sidebar on the right (visually left in RTL) */}
      </div>
      <Footer />
    </div>
  );
}
