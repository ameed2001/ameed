
import type { Metadata } from 'next';
import './globals.css';
// import { Toaster } from "@/components/ui/toaster"; // Temporarily removed
// import AppProviders from '@/components/AppProviders'; // Temporarily removed
// import InitialLoader from '@/components/loading/InitialLoader'; // Temporarily removed

export const metadata: Metadata = {
  title: 'المحترف لحساب الكميات',
  description: 'تطبيق لحساب كميات مواد البناء وتتبع تقدم المشاريع الإنشائية',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {/* <AppProviders> */}
          {/* <InitialLoader>{children}</InitialLoader> */}
          {children} {/* Render children directly */}
          {/* <Toaster /> */} {/* Temporarily removed */}
        {/* </AppProviders> */}
      </body>
    </html>
  );
}
