
// src/app/owner/layout.tsx
import type { ReactNode } from 'react';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: '2px solid green', padding: '20px', margin: '10px', minHeight: '100vh', direction: 'rtl' }}>
      <h1 style={{color: 'green', fontSize: '24px', marginBottom: '10px' }}>تخطيط المالك - الأدنى</h1>
      {children}
    </div>
  );
}
