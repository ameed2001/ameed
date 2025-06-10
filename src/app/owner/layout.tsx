
import type { ReactNode } from 'react';

// This is now a Server Component by default (no 'use client')

export default function OwnerSegmentLayout({ children }: { children: ReactNode }) {
  // console.log("Rendering OwnerSegmentLayout (Server Component - Highly Simplified)"); // Console log here would be on server
  return (
    <div style={{ border: '2px solid green', padding: '20px', margin: '20px', backgroundColor: 'lightgreen' }}>
      <h2 style={{ color: 'darkgreen', textAlign: 'center', marginBottom: '15px' }}>
        Owner Segment Layout (Server Component Test)
      </h2>
      {children}
    </div>
  );
}
