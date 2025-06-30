'use client';

import type { ReactNode } from 'react';

// This component has been temporarily simplified to resolve a critical rendering error.
// The original loading animation logic was causing an infinite loop.
// This simplified version ensures the application can load correctly.
export default function InitialLoader({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
