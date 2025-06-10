// src/components/owner/OwnerAppLayout.tsx
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header'; // Use the main Header
import Footer from '@/components/layout/Footer'; // Use the main Footer

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-6 px-4">
        {/* Optional: Add a wrapper for the main content area if needed */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}