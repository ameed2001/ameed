
import type { ReactNode } from 'react';
import OwnerAppLayout from '@/components/owner/OwnerAppLayout'; // Changed import

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return <OwnerAppLayout>{children}</OwnerAppLayout>;
}
