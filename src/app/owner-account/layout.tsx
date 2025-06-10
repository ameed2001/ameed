typescriptreact
import React from 'react';
import OwnerSidebar from '@/components/OwnerSidebar';

export default function OwnerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Owner Sidebar */}
      <OwnerSidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}