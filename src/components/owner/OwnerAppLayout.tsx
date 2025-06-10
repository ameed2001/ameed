// src/components/owner/OwnerAppLayout.tsx
import type { ReactNode } from 'react';

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen border-2 border-red-500">
      <header className="bg-gray-200 p-4 text-center text-red-700">
        OwnerAppLayout - Header (Simplified)
      </header>
      <main className="flex-grow p-4">
        <div className="border border-dashed border-blue-500 p-4">
          {children}
        </div>
      </main>
      <footer className="bg-gray-200 p-4 text-center text-red-700">
        OwnerAppLayout - Footer (Simplified)
      </footer>
    </div>
  );
}
