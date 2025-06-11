
import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from '@/components/layout/Header'; // Re-using main header
import Footer from '@/components/layout/Footer'; // Re-using main footer

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      {/* Not including main Navbar from AppLayout here, admin has its own sidebar */}
      <div className="flex flex-1 mt-0"> {/* Removed container mx-auto */}
        <AdminSidebar /> {/* This will be on the right due to dir="rtl" */}
        <main className="flex-grow p-6 bg-background/80 shadow-inner rounded-l-lg"> {/* Changed to rounded-l-lg */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
