
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import OwnerSidebar from './OwnerSidebar'; // Sidebar remains commented out for now
import type { ReactNode } from 'react';
// Removed useState and useEffect as they are no longer needed without the sidebar state management here

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Removed
  // useEffect(() => { // Removed
  //   const savedState = localStorage.getItem('ownerSidebarState');
  //   if (savedState) {
  //     setIsSidebarOpen(savedState === 'open');
  //   }
  // }, []);

  // const toggleSidebar = () => { // Removed
  //   const newState = !isSidebarOpen;
  //   setIsSidebarOpen(newState);
  //   localStorage.setItem('ownerSidebarState', newState ? 'open' : 'closed');
  // };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      <div className="flex flex-1 pt-0"> {/* flex-1 allows this div to grow */}
        {/* <OwnerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} /> */} {/* Sidebar call remains commented */}
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
