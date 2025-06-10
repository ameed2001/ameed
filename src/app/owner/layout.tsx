
import type { ReactNode } from 'react';
import OwnerAppLayout from '@/components/owner/OwnerAppLayout'; // Import the simplified OwnerAppLayout

export default function OwnerSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <OwnerAppLayout>
      {children}
    </OwnerAppLayout>
  );
}
