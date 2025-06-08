import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 text-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
