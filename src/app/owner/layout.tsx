// src/app/owner/layout.tsx
import type { ReactNode } from 'react';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: '2px solid orange', padding: '10px', margin: '10px', backgroundColor: '#fff5e6' }}>
      <h1 style={{ color: 'orange', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>Owner Layout (Ultra Simplified)</h1>
      {children}
    </div>
  );
}
