
import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from '@/components/layout/Header'; // Re-using main header
import Footer from '@/components/layout/Footer'; // Re-using main footer

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      {/* Not including main Navbar from AppLayout here, admin has its own sidebar */}
      <div className="flex flex-1 container mx-auto mt-0"> {/* Removed py from AppLayout */}
        <AdminSidebar />
        <main className="flex-grow p-6 bg-background/80 shadow-inner rounded-r-lg"> {/* Added rounded-r-lg for style */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
