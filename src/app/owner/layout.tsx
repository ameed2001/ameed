
import type { ReactNode } from 'react';

// This is a Server Component by default

export default function OwnerSegmentMinimalLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: '2px dashed blue', padding: '20px', margin: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'navy', textAlign: 'center', marginBottom: '15px' }}>
        تخطيط قسم المالك (إعادة بناء بسيطة - خادم)
      </h1>
      {children}
    </div>
  );
}
