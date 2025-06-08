"use client";

import type { ReactNode } from 'react';

// This component can be used to wrap the application with client-side providers
// For now, it just returns children. It can be expanded later if needed.
export default function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
