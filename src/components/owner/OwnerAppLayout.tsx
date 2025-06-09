
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from './OwnerSidebar';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* The main Navbar is intentionally omitted here for the owner layout */}
      <div className="flex flex-1 mt-0 rtl overflow-hidden"> {/* Added overflow-hidden */}
        <OwnerSidebar /> {/* Sidebar on the right (visually right in RTL as it's first in flex order) */}
        <main className="flex-grow p-6 bg-background/90 shadow-inner rounded-l-lg overflow-y-auto"> {/* Added overflow-y-auto & Main content area */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
