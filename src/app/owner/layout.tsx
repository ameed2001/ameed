
import type { ReactNode } from 'react';
import AppLayout from "@/components/AppLayout";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  // For now, owners can use the main AppLayout.
  // This can be customized further if specific owner layout elements are needed.
  return <AppLayout>{children}</AppLayout>;
}
