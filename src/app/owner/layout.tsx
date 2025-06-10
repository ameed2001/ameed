'use client'; // For console logging and ensuring client-side behavior for this test
import type { ReactNode } from 'react';

// import OwnerAppLayout from '@/components/owner/OwnerAppLayout'; // Temporarily removed

export default function OwnerSegmentLayout({ children }: { children: ReactNode }) {
  console.log("Rendering OwnerSegmentLayout (Highly Simplified)");
  return (
    <div style={{ border: '5px dashed darkred', padding: '25px', margin: '25px', backgroundColor: 'lightyellow', minHeight: '80vh' }}>
      <h1 style={{color: 'black', fontSize: '24px', textAlign: 'center', marginBottom: '20px'}}>اختبار تخطيط قطاع المالك (مبسط جدا)</h1>
      <p style={{color: 'black', textAlign: 'center', marginBottom: '15px'}}>هذا هو التخطيط المباشر لقطاع /owner لأغراض الاختبار.</p>
      <div style={{ border: '3px solid navy', padding: '15px', margin: '15px', backgroundColor: 'white' }}>
        {children}
      </div>
    </div>
  );
}
