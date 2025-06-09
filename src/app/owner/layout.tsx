
import type { ReactNode } from 'react';
import OwnerAppLayout from '@/components/owner/OwnerAppLayout'; 

export default function OwnerDashboardLayout({ children }: { children: ReactNode }) { // Renamed from OwnerLayout to avoid confusion
  return <OwnerAppLayout>{children}</OwnerAppLayout>;
}
