"use client";
import type { ReactNode } from 'react';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Header has been temporarily removed for testing */}
      <div className="flex flex-1 pt-0">
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      {/* Footer has been temporarily removed for testing */}
    </div>
  );
}
