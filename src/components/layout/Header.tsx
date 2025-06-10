
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Clock, Home as HomeIcon, HardHat, TrendingUp, FileText } from 'lucide-react';

// SVG for WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);

const Header = () => {
  const [formattedDisplayTime, setFormattedDisplayTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Get time in "HH:MM:SS AM/PM" format using en-US locale
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: "Asia/Jerusalem",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }); // Example output: "08:14:30 PM"

      // Split to reorder as "PM HH:MM:SS"
      const parts = timeString.split(' '); // Should be ["HH:MM:SS", "AM/PM"]
      if (parts.length === 2) {
        const timePart = parts[0];
        const periodPart = parts[1];
        setFormattedDisplayTime(`${periodPart} ${timePart}`); // Example: "PM 08:14:30"
      } else {
        setFormattedDisplayTime(timeString); // Fallback in case split fails
      }
    };

    updateTime(); // Initial call to set time immediately
    const timerId = setInterval(updateTime, 1000); // Update every second

    return () => {
      clearInterval(timerId); // Cleanup interval on component unmount
    }
  }, []);

  const constructionIndicators = [
    { label: "متوسط تكلفة البناء (م²)", value: "150 ألف شيكل", icon: HomeIcon, dataAiHint: "construction cost" },
    { label: "أسعار الأيدي العاملة (يومية)", value: "150 شيكل", icon: HardHat, dataAiHint: "labor cost" },
    { label: "مؤشر أسعار المعدات الإنشائية", value: null, icon: TrendingUp, dataAiHint: "equipment prices" },
    { label: "تكلفة التراخيص الإنشائية", value: "2000 شيكل", icon: FileText, dataAiHint: "license cost" },
  ];

  return (
    <header className="bg-header-bg text-header-fg py-3 px-4 md:px-6 shadow-header-footer">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-y-3">
        
        {/* Right Section: Logo & Titles (RTL) */}
        <div className="flex items-center">
          <Image 
            src="https://i.imgur.com/79bO3U2.jpg" 
            alt="شعار الموقع" 
            width={70} 
            height={70} 
            className="rounded-full border-2 border-app-gold"
            data-ai-hint="logo construction"
            priority
          />
          <div className="mr-3 text-right">
            <h1 className="text-app-red text-2xl md:text-3xl font-bold">
              المحترف لحساب الكميات
            </h1>
            <p className="text-sm text-gray-300">الحديد والباطون للأبنية الإنشائية</p>
          </div>
        </div>
        
        {/* Left Section: Info (Time, Construction Indicators, Social) (RTL) */}
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-3 text-right">
          {/* Time Display - styled to match screenshot */}
          <div 
            className="bg-header-info-bg text-white px-3 py-1.5 rounded-lg text-sm shadow-md flex items-center justify-start gap-2"
            dir="ltr" // Force LTR for this element to ensure icon stays on the right of the time
          >
            <span className="tabular-nums font-medium min-w-[10ch] text-left"> 
              {formattedDisplayTime || 'Loading...'}
            </span>
            <Clock size={16} className="flex-shrink-0" />
          </div>

          <div className="bg-header-info-bg text-white p-3 rounded-lg text-xs shadow-md min-w-[250px]">
            <h4 className="font-semibold block mb-2 text-gray-200 text-sm">مؤشرات إنشائية:</h4>
            <div className="space-y-1.5">
              {constructionIndicators.map((indicator, index) => {
                const IconComponent = indicator.icon;
                return (
                  <div key={index} className="flex items-center gap-2" data-ai-hint={indicator.dataAiHint}>
                    <IconComponent size={14} className="text-app-gold flex-shrink-0" />
                    <span className="text-gray-300 flex-grow">{indicator.label}:</span>
                    {indicator.value && <span className="text-white font-medium">{indicator.value}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Link href="https://wa.me/972595528080" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-social-whatsapp text-white hover:opacity-80 transition-opacity">
              <WhatsAppIcon className="h-5 w-5" />
            </Link>
            <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-social-instagram text-white hover:opacity-80 transition-opacity">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-social-facebook text-white hover:opacity-80 transition-opacity">
              <Facebook size={20} />
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
    
