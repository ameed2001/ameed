
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const Footer = () => {
  const siteName = "المحترف لحساب الكميات";
  const isLoadingSettings = false;
  const currentYear = new Date().getFullYear();

  const quickLinks = [
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
  
  const socialLinks = [
      { name: "whatsapp", href: "https://api.whatsapp.com/send?phone=+972594371424", svg: <svg xmlSpace="preserve" viewBox="0 0 24 24" className="bi bi-whatsapp" fill="currentColor" height="24" width="24" xmlns="http://www.w3.org/2000/svg" > <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" ></path> </svg>},
      { name: "facebook", href: "https://www.facebook.com/a.w.samarah4", svg: <svg xmlSpace="preserve" viewBox="0 0 24 24" className="bi bi-facbook" fill="currentColor" height="24" width="24" xmlns="http://www.w3.org/2000/svg" > <path fill="currentColor" d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z" ></path> </svg>},
      { name: "instagram", href: "https://www.instagram.com/a.w.samarah3/", svg: <svg xmlSpace="preserve" viewBox="0 0 16 16" className="bi bi-instagram" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" > <path fill="currentColor" d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" ></path> </svg>},
  ];

  return (
    <footer className="bg-slate-900 text-white mt-auto relative overflow-hidden" dir="rtl">
        <Image
            src="https://i.imgur.com/CqHksgC.jpg"
            alt="خلفية تذييل معمارية"
            fill
            quality={75}
            className="absolute inset-0 z-0 opacity-5 object-cover"
            data-ai-hint="architecture blueprint"
        />
        <div className="absolute inset-0 bg-slate-900/80 z-0" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-app-gold via-app-red to-app-gold"></div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start mb-3">
              <div className="relative">
                <Image
                  src="https://i.imgur.com/79bO3U2.jpg"
                  alt="شعار الموقع"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-app-gold shadow-md shadow-app-gold/30"
                  data-ai-hint="logo construction"
                />
              </div>
              <div className="mr-3">
                <h3 className="text-app-red text-lg font-bold leading-tight">{isLoadingSettings ? '...' : siteName}</h3>
                <p className="text-app-gold text-xs font-medium">دقة في الحساب • ثقة في النتائج</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              نقدم أدوات دقيقة وسهلة الاستخدام لحساب كميات مواد البناء لمشاريعكم الإنشائية.
            </p>
          </div>

          <div className="text-center lg:text-right">
            <h4 className="text-base font-semibold text-app-gold mb-3 relative pb-1">
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
                        <span className="mr-1">{link.label}</span>
                        {link.href && link.href.startsWith('http') && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="text-center lg:text-right">
            <h4 className="text-base font-semibold text-app-gold mb-3 relative pb-1">
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
                <WhatsAppIcon className="h-4 w-4 text-app-gold group-hover:text-app-red flex-shrink-0 transition-colors" />
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
             <h4 className="text-base font-semibold text-app-gold mb-3 relative pb-1">
              تابعنا
              <span className="block absolute bottom-0 right-0 w-10 h-0.5 bg-app-gold"></span>
            </h4>
            <ul className="example-2 flex justify-center lg:justify-start">
                {socialLinks.map((link) => (
                    <li key={link.name} className="icon-content">
                        <a
                        data-social={link.name}
                        aria-label={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                            <div className="filled"></div>
                            {link.svg}
                        </a>
                        <div className="tooltip">{link.name.charAt(0).toUpperCase() + link.name.slice(1)}</div>
                    </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="my-6">
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

