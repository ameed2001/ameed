
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import type { ReactNode } from 'react'; // Import ReactNode
import { useState, useEffect } from 'react';
// import { getSystemSettings } from '@/lib/db'; // Temporarily removed


// SVG for WhatsApp icon (consistent with Header.tsx)
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);

interface QuickLinkItem {
  key: string;
  label: ReactNode; // Allow ReactNode for custom labels
  href?: string;
  isCustom?: boolean; // Flag for custom rendering
}

const Footer = () => {
  const siteName = "المحترف لحساب الكميات"; // Static site name for now
  const isLoadingSettings = false; // Assume not loading for now

  const currentYear = new Date().getFullYear();

  const quickLinks: QuickLinkItem[] = [
    { key: 'home', href: '/', label: 'الرئيسية' },
    { key: 'about', href: '/about', label: 'عن الموقع' },
    { key: 'contact', href: 'https://forms.gle/WaXPkD8BZMQ7pVev6', label: 'تواصل معنا' },
    { key: 'help', href: '/help', label: 'مركز المساعدة' },
    {
      key: 'create-account',
      isCustom: true,
      label: (
        <>
          إنشاء حساب كـ{' '}
          <Link href="/signup" className="text-app-gold hover:text-app-red transition-colors duration-200 hover:underline mx-1">
            مهندس
          </Link>{' '}
          أو{' '}
          <Link href="/owner-signup" className="text-app-gold hover:text-app-red transition-colors duration-200 hover:underline mx-1">
            مالك
          </Link>
        </>
      )
    },
    {
      key: 'user-login',
      isCustom: true,
      label: (
        <>
          تسجيل الدخول كـ{' '}
          <Link href="/login" className="text-app-gold hover:text-app-red transition-colors duration-200 hover:underline mx-1">
            مهندس
          </Link>{' '}
          أو{' '}
          <Link href="/owner-login" className="text-app-gold hover:text-app-red transition-colors duration-200 hover:underline mx-1">
            مالك
          </Link>
        </>
      )
    },
    { key: 'admin-login', href: '/admin-login', label: 'تسجيل دخول المدير' },
  ];

  // useEffect(() => { // Temporarily disabled
  //   async function fetchSettings() {
  //     try {
  //       const settings = await getSystemSettings();
  //       setSiteName(settings?.siteName || 'المحترف لحساب الكميات');
  //     } catch (error) {
  //       console.error('Error fetching system settings for footer:', error);
  //       setSiteName('المحترف لحساب الكميات'); // Fallback
  //     } finally {
  //       setIsLoadingSettings(false);
  //     }
  //   }
  //   fetchSettings();
  // }, []);


  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-app-gold via-app-red to-app-gold"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="relative">
                <Image
                  src="https://i.imgur.com/79bO3U2.jpg"
                  alt="شعار الموقع"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-app-gold shadow-md shadow-app-gold/30"
                  data-ai-hint="logo construction"
                />
              </div>
              <div className="mr-3">
                <h3 className="text-app-red text-xl font-bold leading-tight">{isLoadingSettings ? '...' : siteName}</h3>
                <p className="text-app-gold text-xs font-medium">دقة في الحساب • ثقة في النتائج</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              نقدم أدوات دقيقة وسهلة الاستخدام لحساب كميات مواد البناء لمشاريعكم الإنشائية.
            </p>
          </div>

          <div className="text-center lg:text-right">
            <h4 className="text-lg font-semibold text-app-gold mb-4 relative pb-1">
              روابط سريعة
              <span className="block absolute bottom-0 right-0 w-10 h-0.5 bg-app-gold"></span>
            </h4>
            <nav>
              <ul className="space-y-1.5 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.key}>
                    {link.isCustom ? (
                      <div className="group flex items-center justify-center lg:justify-start gap-1.5 text-gray-300 py-0.5">
                        <span>{link.label}</span>
                      </div>
                    ) : (
                      <Link
                        href={link.href!}
                        target={link.href!.startsWith('/') ? '_self' : '_blank'}
                        rel={link.href!.startsWith('/') ? '' : 'noopener noreferrer'}
                        className="group flex items-center justify-center lg:justify-start gap-1.5 text-gray-300 hover:text-app-gold transition-colors duration-200 py-0.5"
                      >
                        <span>{typeof link.label === 'string' ? link.label : ''}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="text-center lg:text-right">
            <h4 className="text-lg font-semibold text-app-gold mb-4 relative pb-1">
              اتصل بنا
              <span className="block absolute bottom-0 right-0 w-10 h-0.5 bg-app-gold"></span>
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="group flex items-center justify-center lg:justify-start gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-app-gold group-hover:text-app-red flex-shrink-0 transition-colors" />
                <a
                  href="mailto:mediaplus64@gmail.com"
                  className="hover:text-app-gold transition-colors truncate"
                >
                  mediaplus64@gmail.com
                </a>
              </div>
              <div className="group flex items-center justify-center lg:justify-start gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-app-gold group-hover:text-app-red flex-shrink-0 transition-colors" />
                <a
                  href="tel:+972594371424"
                  className="hover:text-app-gold transition-colors"
                >
                  +972594371424
                </a>
              </div>
              <div className="group flex items-center justify-center lg:justify-start gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-app-gold group-hover:text-app-red flex-shrink-0 transition-colors" />
                <span>سلفيت، فلسطين</span>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right">
             <h4 className="text-lg font-semibold text-app-gold mb-4 relative pb-1">
              تابعنا
              <span className="block absolute bottom-0 right-0 w-10 h-0.5 bg-app-gold"></span>
            </h4>
            <div className="flex justify-center lg:justify-start gap-3">
              <Link
                href="https://wa.me/972595528080"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/70 hover:bg-green-600 p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                title="تواصل عبر واتساب"
              >
                <WhatsAppIcon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="https://www.instagram.com/a.w.samarah3/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                title="تابعنا على إنستغرام"
              >
                <Instagram className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="https://www.facebook.com/a.w.samarah4"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/70 hover:bg-blue-600 p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                title="تابعنا على فيسبوك"
              >
                <Facebook className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        <div className="my-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-400">
            <span>&copy; {currentYear} {isLoadingSettings ? '...' : siteName}. جميع الحقوق محفوظة.</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <span>صُنع بـ</span>
            <Heart className="h-3.5 w-3.5 text-red-500 animate-pulse" />
            <span>في فلسطين | تصميم وتطوير:</span>
            <Link
              href="https://www.facebook.com/a.w.samarah4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-app-gold hover:text-app-red transition-colors font-medium"
            >
              عميد سماره
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-app-gold via-app-red to-app-gold"></div>
    </footer>
  );
};

export default Footer;

    